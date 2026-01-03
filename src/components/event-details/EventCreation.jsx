import React, { useState } from "react";
import axios from "axios";
import "../css/eventCreation.css"; // optional CSS

function EventCreation() {
  const [eventData, setEventData] = useState({
    rollNo: "",
    eventName: "",
    eventPlace: "",
    eventLocation: "",
    eventDuration: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setEventData({
      ...eventData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8080/event/create",
        {
          ...eventData,
          eventDuration: Number(eventData.eventDuration),
        },
        {
          auth: {
            username: "admin",
            password: "admin123",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setMessage("✅ Event created successfully");
      console.log("Response:", response.data);

      // Clear form
      setEventData({
        rollNo: "",
        eventName: "",
        eventPlace: "",
        eventLocation: "",
        eventDuration: "",
      });
    } catch (error) {
      console.error(error);
      setMessage("❌ Failed to create event");
    }
  };

  return (
    <div className="create-event-container">
      <div className="event-title">
        🎉 <span>Create Event</span>
      </div>

      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <label>Roll No</label>
        <input
          type="text"
          name="rollNo"
          value={eventData.rollNo}
          onChange={handleChange}
          required
        />

        <label>Event Name</label>
        <input
          type="text"
          name="eventName"
          value={eventData.eventName}
          onChange={handleChange}
          required
        />

        <label>Event Place</label>
        <input
          type="text"
          name="eventPlace"
          value={eventData.eventPlace}
          onChange={handleChange}
          required
        />

        <label>Event Location</label>
        <input
          type="text"
          name="eventLocation"
          value={eventData.eventLocation}
          onChange={handleChange}
          required
        />

        <label>Event Duration (Days)</label>
        <input
          type="number"
          name="eventDuration"
          value={eventData.eventDuration}
          onChange={handleChange}
          required
        />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default EventCreation;
