import React, { useEffect, useState } from "react";
import "../css/staffList.css";

function StaffList() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatePrograms, setUpdatePrograms] = useState({});
  const [updatingStaff, setUpdatingStaff] = useState(null); // Program submit spinner
  const [updatingAttendance, setUpdatingAttendance] = useState({
    staffNo: null,
    type: null,
  }); // Attendance spinner
  const [toast, setToast] = useState(null);

  // Pagination
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchStaffData(page);
  }, [page]);

  const fetchStaffData = async (pageNumber = 0) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/staff/all?page=${pageNumber}&size=10`
      );
      const data = await response.json();
      setStaffList(data.content || []);
      setTotalPages(data.totalPages || 1);
      setError(null);
    } catch (err) {
      setError("Failed to load staff data");
    } finally {
      setLoading(false);
    }
  };

  const handleProgramChange = (staffNo, value) => {
    setUpdatePrograms((prev) => ({ ...prev, [staffNo]: value }));
  };

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleUpdateProgram = async (staffNo) => {
    const staffProgram = updatePrograms[staffNo];
    if (!staffProgram || staffProgram.trim() === "") {
      showToast("⚠️ Please enter a program!", "error");
      return;
    }

    setUpdatingStaff(staffNo);
    try {
      const response = await fetch(
        `http://localhost:8080/staff/updateProgram/${staffNo}?staffProgram=${encodeURIComponent(
          staffProgram
        )}`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to update");

      const updatedStaff = await response.json();
      setStaffList((prev) =>
        prev.map((s) => (s.staffNo === staffNo ? updatedStaff : s))
      );
      setUpdatePrograms((prev) => ({ ...prev, [staffNo]: "" }));
      showToast(`✅ ${updatedStaff.staffName}'s program updated!`, "success");
    } catch {
      showToast("❌ Error updating staff program", "error");
    } finally {
      setUpdatingStaff(null);
    }
  };

  // Attendance update with per-button spinner
  const handleAttendanceUpdate = async (staffNo, type) => {
    setUpdatingAttendance({ staffNo, type });
    try {
      const response = await fetch(
        `http://localhost:8080/staff/updateAttendance/${staffNo}/${type}`,
        { method: "PUT" }
      );
      if (!response.ok) throw new Error("Failed to update attendance");

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

      showToast(`✅ Attendance for ${staffNo} marked as ${type}`, "info");
    } catch {
      showToast("❌ Error updating attendance", "error");
    } finally {
      setUpdatingAttendance({ staffNo: null, type: null });
    }
  };

  const handlePrev = () => {
    if (page > 0) setPage(page - 1);
  };
  const handleNext = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };
  const handleExport = () =>
    showToast("📥 Export to Excel coming soon!", "info");

  return (
    <div className="stafflist-page">
      <div className="stafflist-card">
        <h2 className="stafflist-title">👨‍🏫 Staff List</h2>

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
                <th>Update Event</th>
                <th>Staff Event</th>
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

                    {/* Attendance buttons with per-button spinner */}
                    <td className="actions">
                      <button
                        className="action-btn approve"
                        onClick={() =>
                          handleAttendanceUpdate(staff.staffNo, "Present")
                        }
                        disabled={
                          updatingAttendance.staffNo === staff.staffNo &&
                          updatingAttendance.type === "Present"
                        }
                      >
                        {updatingAttendance.staffNo === staff.staffNo &&
                        updatingAttendance.type === "Present" ? (
                          <span className="spinner"></span>
                        ) : (
                          "✔"
                        )}
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() =>
                          handleAttendanceUpdate(staff.staffNo, "Absent")
                        }
                        disabled={
                          updatingAttendance.staffNo === staff.staffNo &&
                          updatingAttendance.type === "Absent"
                        }
                      >
                        {updatingAttendance.staffNo === staff.staffNo &&
                        updatingAttendance.type === "Absent" ? (
                          <span className="spinner"></span>
                        ) : (
                          "✖"
                        )}
                      </button>
                      <button
                        className="action-btn star"
                        onClick={() =>
                          handleAttendanceUpdate(staff.staffNo, "On Duty")
                        }
                        disabled={
                          updatingAttendance.staffNo === staff.staffNo &&
                          updatingAttendance.type === "On Duty"
                        }
                      >
                        {updatingAttendance.staffNo === staff.staffNo &&
                        updatingAttendance.type === "On Duty" ? (
                          <span className="spinner"></span>
                        ) : (
                          "★"
                        )}
                      </button>
                    </td>

                    {/* Program Input */}
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

                    {/* Display Updated Program */}
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

      {/* Pagination */}
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

      {/* Export Section */}
      <div className="export-section">
        <button className="export-btn" onClick={handleExport}>
          📥 Export to Excel
        </button>
      </div>

      {/* Toast Notification */}
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
    </div>
  );
}

export default StaffList;
