import React, { useState } from "react";
import axios from "axios";
import "../css/profile.css";

function Profile() {
  const [activeTab, setActiveTab] = useState("STUDENT");
  const [popupMsg, setPopupMsg] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  /* ================= STUDENT STATE ================= */
  const [student, setStudent] = useState({
    rollno: "",
    regno: "",
    name: "",
    deptcode: "",
    deptname: "",
    academicYear: "",
    passedoutYear: "",
    age: ""
  });

  /* ================= ADDRESS STATE ================= */
  const [address, setAddress] = useState({
    rollno: "",
    line1: "",
    line2: "",
    line3: "",
    pincode: "",
    district: "",
    state: "",
    country: ""
  });

  const axiosConfig = {
    auth: { username: "admin", password: "admin123" },
    headers: { "Content-Type": "application/json" }
  };

  /* ================= DYNAMIC YEARS ================= */
  const startYear = 1997;
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = startYear; y <= currentYear + 5; y++) years.push(y);

  /* ================= HANDLERS ================= */
  const handleStudentChange = (e) => {
    const { name, value } = e.target;
    setStudent({ ...student, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  /* ================= SUBMIT STUDENT ================= */
  const submitStudent = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/profiles", student, axiosConfig);

      // ❌ DO NOT RESET STUDENT HERE
      setPopupMsg("🎉 Student profile created successfully!");
      setShowPopup(true);
    } catch {
      setPopupMsg("❌ Failed to create student profile");
      setShowPopup(true);
    }
  };

  /* ================= SUBMIT ADDRESS ================= */
  const submitAddress = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/addresses", address, axiosConfig);

      // ✅ RESET ADDRESS FORM
      setAddress({
        rollno: "",
        line1: "",
        line2: "",
        line3: "",
        pincode: "",
        district: "",
        state: "",
        country: ""
      });

      // ✅ RESET STUDENT FORM ONLY AFTER ADDRESS SUCCESS
      setStudent({
        rollno: "",
        regno: "",
        name: "",
        deptcode: "",
        deptname: "",
        academicYear: "",
        passedoutYear: "",
        age: ""
      });

      setPopupMsg("🏠 Address added successfully!");
      setShowPopup(true);
    } catch {
      setPopupMsg("❌ Failed to add address");
      setShowPopup(true);
    }
  };

  /* ================= POPUP CLOSE + AUTO TOGGLE ================= */
  const closePopup = () => {
    setShowPopup(false);
    setActiveTab(activeTab === "STUDENT" ? "ADDRESS" : "STUDENT");
  };

  return (
    <div className="profile-page">
      <h2 className="page-title">Profile Creation</h2>

      <div className="toggle-container">
        <button
          className={activeTab === "STUDENT" ? "active" : ""}
          onClick={() => setActiveTab("STUDENT")}
        >
          Create Student Profile
        </button>
        <button
          className={activeTab === "ADDRESS" ? "active" : ""}
          onClick={() => setActiveTab("ADDRESS")}
        >
          Add Address
        </button>
      </div>

      <div className="form-card">
        {/* ================= STUDENT FORM ================= */}
        {activeTab === "STUDENT" && (
          <form onSubmit={submitStudent}>
            <label>Roll No</label>
            <input name="rollno" value={student.rollno} onChange={handleStudentChange} />

            <label>Registration No</label>
            <input name="regno" value={student.regno} onChange={handleStudentChange} />

            <label>Name</label>
            <input name="name" value={student.name} onChange={handleStudentChange} />

            <label>Dept Code</label>
            <input name="deptcode" value={student.deptcode} onChange={handleStudentChange} />

            <label>Dept Name</label>
            <input name="deptname" value={student.deptname} onChange={handleStudentChange} />

            <div className="inline-row">
              <div>
                <label>Academic Year</label>
                <select
                  name="academicYear"
                  value={student.academicYear}
                  onChange={handleStudentChange}
                >
                  <option value="">Select Academic Year</option>
                  {years.map((y) => (
                    <option key={y} value={`${y}-${y + 4}`}>
                      {y}-{y + 4}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label>Passed Out Year</label>
                <select
                  name="passedoutYear"
                  value={student.passedoutYear}
                  onChange={handleStudentChange}
                >
                  <option value="">Select Year</option>
                  {years.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>

              <div>
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={student.age}
                  onChange={handleStudentChange}
                />
              </div>
            </div>

            <button type="submit" className="primary-btn">
              Create Student
            </button>
          </form>
        )}

        {/* ================= ADDRESS FORM ================= */}
        {activeTab === "ADDRESS" && (
          <form onSubmit={submitAddress}>
            <label>Roll No</label>
            <input name="rollno" value={address.rollno} onChange={handleAddressChange} />

            <label>Address Line 1</label>
            <input name="line1" value={address.line1} onChange={handleAddressChange} />

            <label>Address Line 2</label>
            <input name="line2" value={address.line2} onChange={handleAddressChange} />

            <label>Address Line 3</label>
            <input name="line3" value={address.line3} onChange={handleAddressChange} />

            <label>Pincode</label>
            <input
              type="number"
              name="pincode"
              value={address.pincode}
              onChange={handleAddressChange}
            />

            <label>District</label>
            <input name="district" value={address.district} onChange={handleAddressChange} />

            <label>State</label>
            <input name="state" value={address.state} onChange={handleAddressChange} />

            <label>Country</label>
            <input name="country" value={address.country} onChange={handleAddressChange} />

            <button type="submit" className="primary-btn">
              Add Address
            </button>
          </form>
        )}
      </div>

      {/* ================= POPUP ================= */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-box">
            <p>{popupMsg}</p>
            <button onClick={closePopup} className="primary-btn">
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
