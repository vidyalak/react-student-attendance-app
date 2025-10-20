import React, { useState } from "react";
import "../css/staffList.css";

function StaffList() {
  const [staffList] = useState([
    {
      staffNo: "ST0908",
      name: "Vidyalakshmi",
      dept: "Information Technology",
      phone: "8902345678",
      date: "2025-10-18",
      attendance: "On Duty",
      staffEvent: "Sports Day",
    },
    {
      staffNo: "ST0909",
      name: "PrasannaVenkatesh",
      dept: "Information Technology",
      phone: "8902345678",
      date: "2025-10-18",
      attendance: "Present",
      staffEvent: "Cricket Ground",
    },
  ]);

  return (
    <div className="stafflist-page">
      <div className="stafflist-card">
        <h2 className="stafflist-title">👨‍🏫 Staff List</h2>

        {/* Filters */}
        <div className="stafflist-filters">
          <input type="text" placeholder="Search by Staff No..." />
          <input type="date" />
          <div className="filter-buttons">
            <button className="search-btn">🔍 Search</button>
            <button className="filter-btn">📅 Filter</button>
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
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
              {staffList.map((staff, index) => (
                <tr key={index}>
                  <td>{staff.staffNo}</td>
                  <td>{staff.name}</td>
                  <td>{staff.dept}</td>
                  <td>{staff.phone}</td>
                  <td>{staff.date}</td>
                  <td>
                    <span
                      className={`status ${
                        staff.attendance === "Present" ? "present" : "onduty"
                      }`}
                    >
                      {staff.attendance}
                    </span>
                  </td>
                  <td className="actions">
                    <button className="action-btn approve" title="Approve">✔</button>
                    <button className="action-btn delete" title="Delete">✖</button>
                    <button className="action-btn star" title="Mark Important">★</button>
                  </td>
                  <td>
                    <div className="update-form">
                      <input type="text" placeholder="Enter Program" />
                      <button className="submit-btn">Submit</button>
                    </div>
                  </td>
                  <td>{staff.staffEvent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="pagination">
          <button disabled>Prev</button>
          <span>Page 1 of 1</span>
          <button disabled>Next</button>
        </div>

        {/* Export */}
        <div className="export-section">
          <button className="export-btn">📥 Export to Excel</button>
        </div>
      </div>
    </div>
  );
}

export default StaffList;
