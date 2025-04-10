import React, { useState } from "react";

export default function AppointmentModal({ isOpen, onClose, listingName }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/appointment/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, listing: listingName })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to book');

      alert('Appointment booked successfully!');
      onClose();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black" onClick={onClose}>✖</button>
        <h2 className="text-xl font-bold mb-4">Book Appointment for {listingName}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" name="name" placeholder="Your Name" required onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="email" name="email" placeholder="Your Email" required onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange} className="w-full border p-2 rounded" />
          <input type="date" name="date" required onChange={handleChange} className="w-full border p-2 rounded" />
          <textarea name="message" placeholder="Message" rows="3" onChange={handleChange} className="w-full border p-2 rounded"></textarea>
          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Confirm Booking</button>
        </form>
      </div>
    </div>
  );
}
