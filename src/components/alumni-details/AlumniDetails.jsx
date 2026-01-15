import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/alumniDetails.css";

function AlumniDetails() {
  const [alumniList, setAlumniList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAlumni();
  }, []);

  const fetchAlumni = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/alumni/all",
        {
          auth: {
            username: "admin",
            password: "admin123"
          }
        }
      );
      setAlumniList(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch alumni details");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading alumni details...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="alumni-page">
      <h2 className="page-title">Alumni Details</h2>

      <div className="table-container">
        <table className="alumni-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Reg No</th>
              <th>Name</th>
              <th>Age</th>
              <th>Dept No</th>
              <th>Dept Name</th>
              <th>Passed Out Year</th>
            </tr>
          </thead>
          <tbody>
            {alumniList.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">
                  No alumni records found
                </td>
              </tr>
            ) : (
              alumniList.map((alumni, index) => (
                <tr key={index}>
                  <td>{alumni.rollno}</td>
                  <td>{alumni.regno}</td>
                  <td>{alumni.name}</td>
                  <td>{alumni.age}</td>
                  <td>{alumni.deptno}</td>
                  <td>{alumni.deptname}</td>
                  <td>{alumni.passedoutyear}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AlumniDetails;
