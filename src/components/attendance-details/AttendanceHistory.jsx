import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/attendanceHistory.css";

function AttendanceHistory() {
  const [attendanceList, setAttendanceList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/attendancestatus",
        {
          auth: {
            username: "admin",
            password: "admin123"
          }
        }
      );
      setAttendanceList(response.data);
      setFilteredList(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching attendance", error);
      setLoading(false);
    }
  };

  /* ================= SEARCH + DATE FILTER ================= */
  useEffect(() => {
    let filtered = attendanceList;

    // 🔍 Search by Name OR Roll No
    if (searchText.trim() !== "") {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          item.rollno.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // 📅 Filter by Date
    if (selectedDate) {
      filtered = filtered.filter(
        (item) => item.dateOfRecord === selectedDate
      );
    }

    setFilteredList(filtered);
  }, [searchText, selectedDate, attendanceList]);

  if (loading) {
    return <div className="loading">Loading attendance history...</div>;
  }

  return (
    <div className="attendance-page">
      <h2 className="page-title">Attendance History</h2>

      {/* ================= FILTER BAR ================= */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name or roll no"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Reg No</th>
              <th>Name</th>
              <th>Dept Code</th>
              <th>Dept Name</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No records found
                </td>
              </tr>
            ) : (
              filteredList.map((item, index) => (
                <tr key={index}>
                  <td>{item.rollno}</td>
                  <td>{item.regno}</td>
                  <td>{item.name}</td>
                  <td>{item.deptcode}</td>
                  <td>{item.deptname}</td>
                  <td>
                    <span
                      className={`status ${
                        item.attendanceStatus === "Present"
                          ? "present"
                          : "onduty"
                      }`}
                    >
                      {item.attendanceStatus}
                    </span>
                  </td>
                  <td>{item.dateOfRecord}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceHistory;
