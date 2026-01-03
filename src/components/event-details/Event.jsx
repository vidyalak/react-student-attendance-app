import React, { useState } from "react";
import axios from "axios";
import "../css/event.css";

function Event() {
  const [date, setDate] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [students, setStudents] = useState([]);
  const [message, setMessage] = useState("");

  const authConfig = {
    auth: { username: "admin", password: "admin123" },
  };

  // 📅 Filter by Date (MULTIPLE RESULTS APPEND)
const fetchByDate = async () => {
  if (!date) {
    setMessage("⚠️ Please select a date");
    return;
  }

  try {
    const res = await axios.get(
      `http://localhost:8080/events/by-date?date=${date}`,
      authConfig
    );

    // ✅ append + avoid duplicates
    setStudents((prev) => {
      const newOnes = res.data.filter(
        (s) => !prev.some((p) => p.rollno === s.rollno)
      );
      return [...prev, ...newOnes];
    });

    setMessage("");
    setDate(""); // reset date
  } catch {
    setMessage("❌ No students found");
    setDate("");
  }
};

// 🔍 Search by Roll No (APPEND SINGLE RESULT)
const fetchByRollNo = async () => {
  if (!rollNo) {
    setMessage("⚠️ Please enter Roll No");
    return;
  }

  try {
    const res = await axios.get(
      `http://localhost:8080/events/by-rollno?rollno=${rollNo}`,
      authConfig
    );

    setStudents((prev) => {
      // ✅ prevent duplicate rollno
      if (prev.some((p) => p.rollno === res.data.rollno)) {
        return prev;
      }
      return [...prev, res.data];
    });

    setMessage("");
    setRollNo(""); // reset roll no
  } catch {
    setMessage("❌ Student not found");
    setRollNo("");
  }
};
  
  return (
    <>
    <div className="event-page">
      {/* ✅ Center Heading */}
      <h2 className="page-title">📌 Students On Duty</h2>
 </div>
      {/* 🔍 Search Card */}
      <div className="card filter-card">
        <h3 className="card-title">🔍 Search Students</h3>

        <div className="search-row">
          {/* Filter by Date */}
          <div className="search-block">
            <label>Filter by Date</label>
            <div className="input-btn-row">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <button onClick={fetchByDate}>Filter</button>
            </div>
          </div>

          {/* Search by Roll No */}
          <div className="search-block">
            <label>Search by Roll No</label>
            <div className="input-btn-row">
              <input
                type="text"
                placeholder="Enter Roll No"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
              />
              <button onClick={fetchByRollNo}>Search</button>
            </div>
          </div>
        </div>

        {message && <p className="message">{message}</p>}
      </div>

      {/* 🎓 Student Cards – ONE BY ONE */}
      <div className="student-list">
        {students.map((s, i) => (
          <div className="student-card" key={i}>
            <h4>{s.name} ({s.rollno})</h4>
            <p><b>Department:</b> {s.deptname} ({s.deptcode})</p>
            <p><b>Academic Year:</b> {s.academicYear}</p>
            <p><b>Passed Out Year:</b> {s.passedoutYear}</p>
            <p><b>Date Of Record:</b> {s.dateOfRecord}</p>
            <span className="badge">📌 {s.attendanceStatus}</span>
          </div>
        ))}
      </div>
   
    </>
  );
}

export default Event;
