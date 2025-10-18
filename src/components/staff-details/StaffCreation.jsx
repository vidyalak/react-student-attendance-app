import React, { useState } from "react";
import "../css/staffCreation.css";

function StaffCreation() {
  const [staffData, setStaffData] = useState({
    staffNo: "",
    staffName: "",
    staffDeptNo: "",
    staffDeptName: "",
    staffAttendance: "",
    staffPhNo: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData({ ...staffData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/staff/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Staff Saved:", result);

        // Show popup for 2 seconds
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);

        // Clear form
        setStaffData({
          staffNo: "",
          staffName: "",
          staffDeptNo: "",
          staffDeptName: "",
          staffAttendance: "",
          staffPhNo: "",
        });
      } else {
        alert("❌ Failed to save staff details.");
      }
    } catch (error) {
      console.error("Error while saving staff:", error);
      alert("⚠️ Error occurred while saving staff.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-form-wrapper">
      <div className="staff-form-container">
        <h2 className="staff-form-title">👨‍🏫 Staff Creation</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Staff Number</label>
            <input
              type="text"
              name="staffNo"
              value={staffData.staffNo}
              onChange={handleChange}
              placeholder="Enter staff number"
              required
            />
          </div>

          <div className="form-group">
            <label>Staff Name</label>
            <input
              type="text"
              name="staffName"
              value={staffData.staffName}
              onChange={handleChange}
              placeholder="Enter staff name"
              required
            />
          </div>

          <div className="form-group">
            <label>Department Number</label>
            <input
              type="text"
              name="staffDeptNo"
              value={staffData.staffDeptNo}
              onChange={handleChange}
              placeholder="Enter department number"
              required
            />
          </div>

          <div className="form-group">
            <label>Department Name</label>
            <input
              type="text"
              name="staffDeptName"
              value={staffData.staffDeptName}
              onChange={handleChange}
              placeholder="Enter department name"
              required
            />
          </div>

          <div className="form-group">
            <label>Attendance</label>
            <input
              type="text"
              name="staffAttendance"
              value={staffData.staffAttendance}
              onChange={handleChange}
              placeholder="Enter attendance"
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="text"
              name="staffPhNo"
              value={staffData.staffPhNo}
              onChange={handleChange}
              placeholder="Enter phone number"
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Saving..." : "💾 Save"}
          </button>
        </form>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <div className="tick-mark">✔</div>
            <p>Staff Created Successfully!</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffCreation;
