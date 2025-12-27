import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/studentList.css";
import StudentAddress from "./StudentAddress";

function StudentList() {
  const [studentList, setStudentList] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);

  const [updatingAttendance, setUpdatingAttendance] = useState({
    rollno: null,
    type: null,
  });

  const [toast, setToast] = useState(null);

  // Address Modal
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);

  // Basic Auth
  const userName = "admin";
  const passWord = "admin123";

  /* ================= INITIAL LOAD ================= */
  useEffect(() => {
    if (!searchInput) {
      fetchStudentData(page);
    }
  }, [page]);

  /* ================= FETCH STUDENTS (PAGINATED) ================= */
  const fetchStudentData = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/student", {
        params: {
          page: pageNumber,
          size: size,
          sortBy: "name",
        },
        auth: { username: userName, password: passWord },
      });

      setStudentList(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("❌ Failed to load student data");
      setStudentList([]);
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH BY NAME (FIXED) ================= */
  const fetchStudentByName = async (name) => {
    if (!name.trim()) {
      setPage(0);
      fetchStudentData(0);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/student/searchStudent",
        {
          params: { name: name.trim() },
          auth: { username: userName, password: passWord },
        }
      );

      // ✅ backend returns List<Student>
      setStudentList(response.data || []);
      setTotalPages(1); // not paginated
      setPage(0);
      setError(null);
    } catch (err) {
      console.error(err);
      setStudentList([]);
      setError("❌ No students found");
    } finally {
      setLoading(false);
    }
  };

  /* ================= SEARCH BY DATE ================= */
  const fetchStudentByDate = async () => {
    if (!dateInput) {
      fetchStudentData(0);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/events/by-date", {
        params: { date: dateInput },
        auth: { username: userName, password: passWord },
      });

      setStudentList(response.data || []);
      setTotalPages(1);
      setPage(0);
      setError(null);
    } catch {
      setStudentList([]);
      setError("❌ No students found for selected date");
    } finally {
      setLoading(false);
    }
  };

  /* ================= DEBOUNCED SEARCH ================= */
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (typingTimeout) clearTimeout(typingTimeout);

    const timeout = setTimeout(() => {
      fetchStudentByName(value);
    }, 500);

    setTypingTimeout(timeout);
  };

  /* ================= ATTENDANCE UPDATE ================= */
  const handleAttendanceUpdate = async (student, type) => {
    setUpdatingAttendance({ rollno: student.rollno, type });

    try {
      const response = await axios.patch(
        `http://localhost:8080/${student.rollno}/attendance`,
        student,
        {
          params: { attendanceStatus: type },
          auth: { username: userName, password: passWord },
        }
      );

      const updatedStudent = response.data;

      setStudentList((prev) =>
        prev.map((s) =>
          s.rollno === updatedStudent.rollno
            ? { ...s, attendanceStatus: updatedStudent.attendanceStatus }
            : s
        )
      );

      showToast(`✅ ${student.rollno} marked as ${type}`, "success");
    } catch {
      showToast("❌ Attendance update failed", "error");
    } finally {
      setUpdatingAttendance({ rollno: null, type: null });
    }
  };

  /* ================= ADDRESS MODAL ================= */
  const handleViewAddress = async (rollno) => {
    setAddressLoading(true);
    try {
      const response = await axios.get(
        "http://localhost:8080/student/address",
        {
          params: { rollno },
          auth: { username: userName, password: passWord },
        }
      );
      setSelectedAddress(response.data[0] || null);
    } catch {
      setSelectedAddress(null);
    } finally {
      setAddressLoading(false);
      setOpenAddressModal(true);
    }
  };

  /* ================= EXPORT EXCEL ================= */
  const handleExport = async () => {
    try {
      showToast("📦 Preparing Excel file...", "info");

      const response = await axios.get("http://localhost:8080/student/export", {
        auth: { username: userName, password: passWord },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "student_list.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast("✅ Excel downloaded successfully!", "success");
    } catch {
      showToast("❌ Failed to export Excel", "error");
    }
  };

  /* ================= TOAST ================= */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  /* ================= PAGINATION ================= */
  const handlePrev = () => page > 0 && setPage(page - 1);
  const handleNext = () => page < totalPages - 1 && setPage(page + 1);

  /* ================= UI ================= */
  return (
    <div className="stafflist-page">
      <div className="stafflist-card">
        <h2 className="stafflist-title">🎓 Student List</h2>

        {/* Filters */}
        <div className="stafflist-filters">
          <div className="filter-group">
            <input
              type="text"
              className="filter-input"
              placeholder="Search by name..."
              value={searchInput}
              onChange={handleSearchInput}
            />
            <button
              className="action-btn search-btn"
              onClick={() => fetchStudentByName(searchInput)}
            >
              🔍 Search
            </button>
          </div>

          <div className="filter-group">
            <input
              type="date"
              className="filter-input"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
            />
            <button
              className="action-btn filter-btn"
              onClick={fetchStudentByDate}
            >
              📅 Filter
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <table className="stafflist-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Reg No</th>
                <th>Name</th>
                <th>Dept</th>
                <th>Age</th>
                <th>Academic</th>
                <th>Passed Out</th>
                <th>Address</th>
                <th>Attendance</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {studentList.length > 0 ? (
                studentList.map((s) => (
                  <tr key={s.rollno}>
                    <td>{s.rollno}</td>
                    <td>{s.regno}</td>
                    <td>{s.name}</td>
                    <td>{s.deptname}</td>
                    <td>{s.age ?? "-"}</td>
                    <td>{s.academicYear}</td>
                    <td>{s.passedoutYear}</td>
                    <td>
                      <button
                        className="action-btn view"
                        onClick={() => handleViewAddress(s.rollno)}
                      >
                        View
                      </button>
                    </td>
                    <td className="actions">
                      {["Present", "Absent", "On Duty"].map((type) => (
                        <button
                          key={type}
                          className={`action-btn ${
                            type === "Present"
                              ? "approve"
                              : type === "Absent"
                              ? "delete"
                              : "star"
                          }`}
                          disabled={
                            updatingAttendance.rollno === s.rollno &&
                            updatingAttendance.type === type
                          }
                          onClick={() => handleAttendanceUpdate(s, type)}
                        >
                          {type}
                        </button>
                      ))}
                    </td>
                    <td>
                      {s.dateOfRecord
                        ? new Date(s.dateOfRecord).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="no-data">
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="pagination">
          <button onClick={handlePrev} disabled={page === 0 || searchInput}>
            Prev
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page >= totalPages - 1 || searchInput}
          >
            Next
          </button>
        </div>

        {/* Export */}
        <div className="export-section">
          <button className="export-btn" onClick={handleExport}>
            📥 Export to Excel
          </button>
        </div>

        {/* Toast */}
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        {/* Address Modal */}
        <StudentAddress
          isOpen={openAddressModal}
          onClose={() => setOpenAddressModal(false)}
          title="Student Address"
        >
          {addressLoading ? (
            <p>Loading...</p>
          ) : selectedAddress ? (
            <>
              <p>{selectedAddress.line1}</p>
              <p>{selectedAddress.line2}</p>
              <p>{selectedAddress.district}</p>
              <p>{selectedAddress.state}</p>
              <p>{selectedAddress.pincode}</p>
            </>
          ) : (
            <p>No address found</p>
          )}
        </StudentAddress>
      </div>
    </div>
  );
}

export default StudentList;
