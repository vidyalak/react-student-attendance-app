import React, { useState } from "react";
import axios from "axios";
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

  // ✅ Example: You can later replace this with login context or localStorage
  const userName = "admin";
  const passWord = "admin123";

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!/^\d+$/.test(staffData.staffPhNo)) {
      alert("⚠️ Please enter a valid numeric phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/staff/create",
        staffData,
        {
          auth: { username: userName, password: passWord },
        }
      );

      if (response.status === 200 || response.status === 201) {
        console.log("✅ Staff Saved:", response.data);

        // ✅ Show success popup
        setShowPopup(true);
        setTimeout(() => setShowPopup(false), 2000);

        // ✅ Reset form after saving
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
      alert(
        error.response?.data?.message ||
          "⚠️ Error occurred while saving staff details."
      );
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
            <label htmlFor="staffAttendance">Attendance</label>
            <select
              id="staffAttendance"
              name="staffAttendance"
              value={staffData.staffAttendance}
              onChange={handleChange}
              required
              className="form-input select-input"
            >
              <option value="">Select Attendance</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="On Duty">On Duty</option>
            </select>
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

      {/* ✅ Success Popup */}
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
