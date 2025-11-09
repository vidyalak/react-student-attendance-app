import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/staffList.css";

function StaffList() {
  const [staffList, setStaffList] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [dateInput, setDateInput] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [updatePrograms, setUpdatePrograms] = useState({});
  const [updatingStaff, setUpdatingStaff] = useState(null);
  const [toast, setToast] = useState(null);
  const [exporting, setExporting] = useState(false);
  const [updatingAttendance, setUpdatingAttendance] = useState({
    staffNo: null,
    type: null,
  });

  // ✅ Basic Auth credentials
  const userName = "admin";
  const passWord = "admin123";

  // ✅ Load all staff initially
  useEffect(() => {
    fetchStaffData(page);
  }, [page]);

  // ✅ Fetch all staff (Paginated)
  const fetchStaffData = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/staff/all?page=${pageNumber}&size=${size}`,
        { auth: { username: userName, password: passWord } }
      );
      setStaffList(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
      setError(null);
    } catch (err) {
      console.error("Error fetching staff data:", err);
      setError("❌ Failed to load staff data.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch staff by number
  const fetchStaffByNumber = async (staffNo) => {
    if (!staffNo.trim()) {
      fetchStaffData(page);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/staff/${staffNo.trim()}`,
        { auth: { username: userName, password: passWord } }
      );
      setStaffList([response.data]);
      setTotalPages(1);
      setError(null);
    } catch {
      setStaffList([]);
      setError("❌ Staff not found.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch staff by date
  const fetchStaffByDate = async () => {
    if (!dateInput) {
      fetchStaffData(page);
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/staff/date/${dateInput}`,
        { auth: { username: userName, password: passWord } }
      );
      setStaffList(response.data || []);
      setTotalPages(1);
      setError(null);
    } catch {
      setStaffList([]);
      setError("❌ No staff found for this date.");
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
      fetchStaffByNumber(value);
    }, 500);
    setTypingTimeout(timeout);
  };

  // ✅ Toast handler
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ✅ Update program
  const handleProgramChange = (staffNo, value) => {
    setUpdatePrograms((prev) => ({ ...prev, [staffNo]: value }));
  };

  const handleUpdateProgram = async (staffNo) => {
    const staffProgram = updatePrograms[staffNo];
    if (!staffProgram || staffProgram.trim() === "") {
      showToast("⚠️ Please enter a program name", "error");
      return;
    }

    setUpdatingStaff(staffNo);
    try {
      const response = await axios.put(
        `http://localhost:8080/staff/updateProgram/${staffNo}?staffProgram=${encodeURIComponent(
          staffProgram
        )}`,
        {},
        { auth: { username: userName, password: passWord } }
      );

      const updatedStaff = response.data;
      setStaffList((prev) =>
        prev.map((s) => (s.staffNo === staffNo ? updatedStaff : s))
      );
      setUpdatePrograms((prev) => ({ ...prev, [staffNo]: "" }));
      showToast(`✅ ${updatedStaff.staffName}'s program updated!`, "success");
    } catch (err) {
      console.error("Error updating program:", err);
      showToast("❌ Error updating staff program", "error");
    } finally {
      setUpdatingStaff(null);
    }
  };

  // ✅ Update attendance
  const handleAttendanceUpdate = async (staffNo, type) => {
    setUpdatingAttendance({ staffNo, type });
    try {
      await axios.put(
        `http://localhost:8080/staff/updateAttendance/${staffNo}/${type}`,
        {},
        { auth: { username: userName, password: passWord } }
      );

      setStaffList((prev) =>
        prev.map((staff) =>
          staff.staffNo === staffNo
            ? {
                ...staff,
                staffAttendance: type,
                dateOfRecord: new Date().toISOString().split("T")[0],
              }
            : staff
        )
      );
      showToast(`✅ ${staffNo} marked as ${type}`, "info");
    } catch (err) {
      console.error("Error updating attendance:", err);
      showToast("❌ Failed to update attendance", "error");
    } finally {
      setUpdatingAttendance({ staffNo: null, type: null });
    }
  };

  // ✅ Pagination controls
  const handlePrev = () => page > 0 && setPage(page - 1);
  const handleNext = () => page < totalPages - 1 && setPage(page + 1);

  // ✅ Export Excel (Fixed)
  const handleExport = async () => {
    setExporting(true);
    try {
      showToast("📦 Preparing Excel file...", "info");

      const response = await axios.get("http://localhost:8080/export", {
        auth: { username: userName, password: passWord },
        responseType: "blob", // ✅ this line fixes your export issue
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = "staff_list.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      showToast("✅ Excel downloaded successfully!", "success");
    } catch (error) {
      console.error("Export failed:", error);
      showToast("❌ Failed to export Excel", "error");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="stafflist-page">
      <div className="stafflist-card">
        <h2 className="stafflist-title">👨‍🏫 Staff List</h2>

        {/* ✅ Filters Section */}
        <div className="stafflist-filters">
          <div className="filter-group">
            <input
              type="text"
              className="filter-input"
              placeholder="Search by Staff No..."
              value={searchInput}
              onChange={handleSearchInput}
            />
            <button
              className="action-btn search-btn"
              onClick={() => fetchStaffByNumber(searchInput)}
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
            <button className="action-btn filter-btn" onClick={fetchStaffByDate}>
              📅 Filter
            </button>
          </div>
        </div>

        {/* ✅ Table Section */}
        <div className="table-responsive">
          {loading ? (
            <p>Loading staff data...</p>
          ) : error ? (
            <p className="error">{error}</p>
          ) : (
            <table className="stafflist-table">
              <thead>
                <tr>
                  <th>Staff No</th>
                  <th>Name</th>
                  <th>Dept</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Attendance</th>
                  <th>Actions</th>
                  <th>Update Program</th>
                  <th>Program Name</th>
                </tr>
              </thead>
              <tbody>
                {staffList.length > 0 ? (
                  staffList.map((staff) => (
                    <tr key={staff.staffNo}>
                      <td>{staff.staffNo}</td>
                      <td>{staff.staffName}</td>
                      <td>{staff.staffDeptName}</td>
                      <td>{staff.staffPhNo}</td>
                      <td>{staff.dateOfRecord}</td>
                      <td>{staff.staffAttendance}</td>
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
                            onClick={() =>
                              handleAttendanceUpdate(staff.staffNo, type)
                            }
                            disabled={
                              updatingAttendance.staffNo === staff.staffNo &&
                              updatingAttendance.type === type
                            }
                          >
                            {updatingAttendance.staffNo === staff.staffNo &&
                            updatingAttendance.type === type ? (
                              <span className="spinner"></span>
                            ) : (
                              type
                            )}
                          </button>
                        ))}
                      </td>
                      <td>
                        <div className="update-form">
                          <input
                            type="text"
                            placeholder="Enter Program"
                            value={updatePrograms[staff.staffNo] || ""}
                            onChange={(e) =>
                              handleProgramChange(staff.staffNo, e.target.value)
                            }
                            disabled={updatingStaff === staff.staffNo}
                          />
                          <button
                            className="submit-btn"
                            onClick={() => handleUpdateProgram(staff.staffNo)}
                            disabled={updatingStaff === staff.staffNo}
                          >
                            {updatingStaff === staff.staffNo ? (
                              <span className="spinner"></span>
                            ) : (
                              "Submit"
                            )}
                          </button>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`program-status ${
                            staff.staffProgram ? "updated" : ""
                          }`}
                        >
                          {staff.staffProgram || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No staff records found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* ✅ Pagination */}
        {staffList.length > 0 && (
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

        {/* ✅ Export */}
        <div className="export-section">
          <button
            className="export-btn"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? <span className="spinner"></span> : "📥 Export to Excel"}
          </button>
        </div>

        {/* ✅ Toast Notification */}
        {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      </div>
    </div>
  );
}

export default StaffList;
