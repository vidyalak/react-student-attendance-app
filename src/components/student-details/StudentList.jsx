import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/staffList.css"; // ✅ reuse same styling
import StudentAddress from "./StudentAddress"; // ✅ modal component

function StudentList() {
  const [studentList, setStudentList] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
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

  // ✅ Modal state
  const [openAddressModal, setOpenAddressModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [addressLoading, setAddressLoading] = useState(false);

  // ✅ Basic Auth credentials
  const userName = "admin";
  const passWord = "admin123";

  useEffect(() => {
    fetchStudentData(page);
  }, [page]);

  // ✅ Fetch all students
  const fetchStudentData = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:8080/student/`, {
        auth: { username: userName, password: passWord },
      });
      setStudentList(response.data || []);
      setTotalPages(1);
      setError(null);
    } catch (err) {
      console.error("Error fetching student data:", err);
      setError("❌ Failed to load student data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch by Name
  const fetchStudentByName = async (name) => {
    if (!name.trim()) {
      fetchStudentData(page);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/student/searchStudent?name=${name.trim()}`,
        { auth: { username: userName, password: passWord } }
      );
      setStudentList(response.data || []);
      setTotalPages(1);
      setError(null);
    } catch {
      setStudentList([]);
      setError("❌ No matching students found.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch by Date
  const fetchStudentByDate = async () => {
    if (!dateInput) {
      fetchStudentData(page);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/events/by-date?date=${dateInput}`,
        { auth: { username: userName, password: passWord } }
      );
      setStudentList(response.data || []);
      setTotalPages(1);
      setError(null);
    } catch {
      setStudentList([]);
      setError("❌ No students found for this date.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Debounced search
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    if (typingTimeout) clearTimeout(typingTimeout);
    const timeout = setTimeout(() => {
      fetchStudentByName(value);
    }, 500);
    setTypingTimeout(timeout);
  };

  // ✅ Toast handler
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ✅ Update Attendance
  const handleAttendanceUpdate = async (rollno, type) => {
    setUpdatingAttendance({ rollno, type });
    try {
      const date = new Date().toISOString().split("T")[0];
      await axios.patch(
        `http://localhost:8080/${rollno}/attendance`,
        {},
        {
          params: { attendanceStatus: type, dateOfRecord: date },
          auth: { username: userName, password: passWord },
        }
      );
      setStudentList((prev) =>
        prev.map((student) =>
          student.rollno === rollno
            ? { ...student, attendanceStatus: type, dateOfRecord: date }
            : student
        )
      );
      showToast(`✅ ${rollno} marked as ${type}`, "info");
    } catch {
      showToast("❌ Failed to update attendance", "error");
    } finally {
      setUpdatingAttendance({ rollno: null, type: null });
    }
  };

  // ✅ Pagination
  const handlePrev = () => page > 0 && setPage(page - 1);
  const handleNext = () => page < totalPages - 1 && setPage(page + 1);

  const handleViewAddress = async (rollno) => {
  setAddressLoading(true);
  try {
    const response = await axios.get(
      `http://localhost:8080/student/address?rollno=${rollno}`,
      { auth: { username: userName, password: passWord } }
    );
    const addressData = response.data[0];
    if (addressData) {
      setSelectedAddress(addressData);
    } else {
      setSelectedAddress(null);
    }
  } catch (err) {
    console.error("Error fetching address:", err);
    setSelectedAddress(null);
  } finally {
    setAddressLoading(false);
    setOpenAddressModal(true);
  }
};

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
              placeholder="Search by Name..."
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
        <div className="table-responsive">
          {loading ? (
            <p>Loading student data...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <table className="stafflist-table">
              <thead>
                <tr>
                  <th>Roll No</th>
                  <th>Registration No</th>
                  <th>Name</th>
                  <th>Dept No</th>
                  <th>Dept Name</th>
                  <th>Age</th>
                  <th>Academic Year</th>
                  <th>Passed Out</th>
                  <th>Address</th>
                  <th>Attendance</th>
                  <th>Date of Record</th>
                  <th>Move to Alumni</th>
                </tr>
              </thead>

              <tbody>
                {studentList.length > 0 ? (
                  studentList.map((student) => (
                    <tr key={student.rollno}>
                      <td>{student.rollno}</td>
                      <td>{student.regno}</td>
                      <td>{student.name}</td>
                      <td>{student.deptcode}</td>
                      <td>{student.deptname}</td>
                      <td>{student.age ?? "-"}</td>
                      <td>{student.academicYear}</td>
                      <td>{student.passedoutYear}</td>

                      {/* Address Button */}
                      <td>
                        <button
                          className="action-btn view"
                          onClick={() => handleViewAddress(student.rollno)}
                        >
                          View
                        </button>
                      </td>

                      {/* Attendance Buttons */}
                      <td className="actions">
                        {["Present", "Absent", "Onduty"].map((type) => (
                          <button
                            key={type}
                            className={`action-btn ${
                              type === "Present"
                                ? "approve"
                                : type === "Absent"
                                ? "delete"
                                : "onduty"
                            }`}
                            onClick={() =>
                              handleAttendanceUpdate(student.rollno, type)
                            }
                            disabled={
                              updatingAttendance.rollno === student.rollno &&
                              updatingAttendance.type === type
                            }
                          >
                            {updatingAttendance.rollno === student.rollno &&
                            updatingAttendance.type === type ? (
                              <span className="spinner"></span>
                            ) : (
                              type
                            )}
                          </button>
                        ))}
                      </td>

                      <td>{student.dateOfRecord ?? "-"}</td>

                      {/* Move to Alumni */}
                      <td>
                        <label className="alumni-checkbox">
                          <input type="checkbox" />
                          <span className="grad-icon">🎓</span>
                        </label>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="12" className="no-data">
                      No student records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {studentList.length > 0 && (
          <div className="pagination">
            <button onClick={handlePrev} disabled={page === 0}>
              Prev
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button onClick={handleNext} disabled={page >= totalPages - 1}>
              Next
            </button>
          </div>
        )}

        {/* Toast */}
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}

        {/* Address Modal */}
       <StudentAddress
  isOpen={openAddressModal}
  onClose={() => setOpenAddressModal(false)}
  title="Student Address"
>
  {addressLoading ? (
    <p>Loading address...</p>
  ) : selectedAddress ? (
    <div className="address-details">
      <p><strong>Line 1:</strong> {selectedAddress.line1 || "-"}</p>
      <p><strong>Line 2:</strong> {selectedAddress.line2 || "-"}</p>
      <p><strong>Line 3:</strong> {selectedAddress.line3 || "-"}</p>
      <p><strong>District:</strong> {selectedAddress.district || "-"}</p>
      <p><strong>State:</strong> {selectedAddress.state || "-"}</p>
      <p><strong>Country:</strong> {selectedAddress.country || "-"}</p>
      <p><strong>Pincode:</strong> {selectedAddress.pincode || "-"}</p>
    </div>
  ) : (
    <p>No address found</p>
  )}
</StudentAddress>

      </div>
    </div>
  );
}

export default StudentList;
