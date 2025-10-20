import React, { useEffect, useState } from "react";
import "../css/staffList.css";

function StaffList() {
  const [staffList, setStaffList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  // ✅ Fetch all staff (default)
  useEffect(() => {
    fetchStaffData();
  }, [page, size]);

  const fetchStaffData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/staff/all?page=${page}&size=${size}`
      );
      if (!response.ok) throw new Error("Failed to fetch staff data");
      const data = await response.json();
      setStaffList(data.content);
      setTotalPages(data.totalPages);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch staff by staff number
  const handleSearch = async () => {
    if (!searchInput.trim()) {
      fetchStaffData(); // reload all if input is empty
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/staff/${searchInput.trim()}`
      );
      if (!response.ok) throw new Error("Staff not found!");
      const data = await response.json();
      setStaffList([data]); // show only the searched staff
      setTotalPages(1);
      setError(null);
    } catch (err) {
      setStaffList([]);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => page > 0 && setPage(page - 1);
  const handleNext = () => page < totalPages - 1 && setPage(page + 1);

  return (
    <div className="stafflist-page">
      <div className="stafflist-card">
        <h2 className="stafflist-title">👨‍🏫 Staff List</h2>

        {/* Filters Section */}
        <div className="stafflist-filters">
          <div className="filter-group">
            <input
              type="text"
              className="filter-input"
              placeholder="Search by Staff..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button className="action-btn search-btn" onClick={handleSearch}>
              🔍 Search
            </button>
          </div>

          <div className="filter-group">
            <input type="date" className="filter-input" />
            <button className="action-btn filter-btn">📅 Filter</button>
          </div>
        </div>

        {/* Table Section */}
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
                  <th>Update Event</th>
                  <th>Staff Event</th>
                </tr>
              </thead>
              <tbody>
                {staffList.length > 0 ? (
                  staffList.map((staff, index) => (
                    <tr key={index}>
                      <td>{staff.staffNo}</td>
                      <td>{staff.staffName}</td>
                      <td>{staff.staffDeptName}</td>
                      <td>{staff.staffPhNo}</td>
                      <td>{staff.dateOfRecord || "-"}</td>
                      <td>
                        <span
                          className={`status ${
                            staff.staffAttendance === "Present"
                              ? "present"
                              : "onduty"
                          }`}
                        >
                          {staff.staffAttendance}
                        </span>
                      </td>
                      <td className="actions">
                        <button className="action-btn approve" title="Approve">
                          ✔
                        </button>
                        <button className="action-btn delete" title="Delete">
                          ✖
                        </button>
                        <button
                          className="action-btn star"
                          title="Mark Important"
                        >
                          ★
                        </button>
                      </td>
                      <td>
                        <div className="update-form">
                          <input type="text" placeholder="Enter Program" />
                          <button className="submit-btn">Submit</button>
                        </div>
                      </td>
                      <td>{staff.staffProgram || "-"}</td>
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
        {staffList.length > 1 && (
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

        {/* Export */}
        <div className="export-section">
          <button className="export-btn">📥 Export to Excel</button>
        </div>
      </div>
    </div>
  );
}

export default StaffList;
