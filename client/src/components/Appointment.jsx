import React, { useState } from "react";

export default function Appointment({ listingId }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    message: "",
  });
  const [booked, setBooked] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Appointment booked for listing:", listingId, formData);
    setBooked(true);
  };

  return (
    <div className="mt-6 p-4 bg-white shadow-md rounded-lg">
      <h3 className="text-xl font-semibold mb-4">Book Appointment</h3>
      {booked ? (
        <p className="text-green-600 text-lg font-medium">
          Appointment booked successfully!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Message"
            className="w-full p-2 border border-gray-300 rounded"
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Book Appointment
          </button>
        </form>
      )}
    </div>
  );
}
