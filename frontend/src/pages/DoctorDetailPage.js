import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DoctorDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingMessage, setBookingMessage] = useState('');
  const [isFetchingSlots, setIsFetchingSlots] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/doctors/doctorInfo?DocID=${id}`);
        if (!res.ok) throw new Error('Doctor not found');
        const data = await res.json();
        if (!data || data.length === 0) throw new Error('No doctor returned');
        setDoctor(data);
      } catch (err) {
        console.error(err.message);
        setDoctor(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const fetchTimeSlots = async () => {
    if (!selectedDate) {
      setDateError('Please select a date');
      return;
    }

    setIsFetchingSlots(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/appointments/availableSlots?DocID=${id}&selectedDate=${selectedDate}`
      );
      if (!res.ok) throw new Error('Failed to fetch time slots');
      const data = await res.json();
      
      // Filter out slots that don't belong to this doctor
      const doctorSlots = data.filter(slot => slot.DocID == id);
      
      setTimeSlots(doctorSlots);
      setDateError('');
    } catch (err) {
      console.error(err.message);
      setTimeSlots([]);
      setDateError('Failed to load time slots');
    } finally {
      setIsFetchingSlots(false);
    }
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
    if (dateError) setDateError('');
    setSelectedSlot(null); // clear slot when date changes
    setTimeSlots([]); // clear previous slots when date changes
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTimeSlots();
  };

  const handleSlotClick = (slot) => {
    // Only allow clicking if the slot is not booked
    if (slot.isBooked !== 1) {
      setSelectedSlot(slot);
    }
  };

  const handleBooking = async () => {
    const PtID = localStorage.getItem('userId');
    if (!PtID) {
      alert('Patient ID not found. Please login again.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/appointments/bookAppointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PtID,
          DocID: id,
          AptDate: selectedDate,
          TimeSlot: selectedSlot.TimeSlot
        })
      });

      const result = await res.json();
      if (res.ok) {
        setBookingMessage('Appointment booked successfully!');
        setSelectedSlot(null);
        // Refresh available slots after booking
        fetchTimeSlots();
      } else {
        setBookingMessage(result.message || 'Booking failed.');
      }
    } catch (err) {
      console.error(err);
      setBookingMessage('Something went wrong while booking.');
    }
  };

  if (loading) {
    return <div style={{ padding: '40px' }}>Loading doctor details...</div>;
  }

  if (!doctor) {
    return (
      <div style={{ padding: '40px' }}>
        <p>Doctor not found or something went wrong.</p>
        <button onClick={() => navigate('/')}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', gap: '30px', marginBottom: '40px' }}>
        <div>
          <img
            src={doctor.DocPFP}
            alt="Profile"
            style={{ 
              width: '150px', 
              height: '150px', 
              borderRadius: '50%',
              objectFit: 'cover',
              border: '3px solid #e0e0e0'
            }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://th.bing.com/th/id/OIP.INB8GTMpMEJQLcsx8sCeBAHaHa?w=196&h=196&c=7&r=0&o=5&dpr=1.3&pid=1.7';
            }}
          />
        </div>
        <div>
          <h2 style={{ marginTop: 0 }}>Dr. {doctor.DocName}</h2>
          <p><strong>Specialization:</strong> {doctor.Specialization}</p>
          <p><strong>Rating:</strong> ⭐ {doctor.Rating}</p>
          <p><strong>Fees:</strong> PKR {doctor.Fees}</p>
          <p><strong>Experience:</strong> {doctor.Experience} years</p>
          <p><strong>Availability:</strong> {doctor.Presence}</p>
        </div>
      </div>

      <div style={{ marginBottom: '40px' }}>
        <h3>Check Availability</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div>
            <label htmlFor="appointmentDate" style={{ display: 'block', marginBottom: '5px' }}>
              Select Date:
            </label>
            <input
              type="date"
              id="appointmentDate"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: dateError ? '1px solid red' : '1px solid #ddd'
              }}
            />
            {dateError && <p style={{ color: 'red', margin: '5px 0 0', fontSize: '14px' }}>{dateError}</p>}
          </div>
          <button 
            type="submit"
            disabled={isFetchingSlots}
            style={{
              padding: '8px 16px',
              backgroundColor: isFetchingSlots ? '#cccccc' : '#4e73df',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isFetchingSlots ? 'not-allowed' : 'pointer',
              marginTop: '22px'
            }}
          >
            {isFetchingSlots ? 'Loading...' : 'Check Slots'}
          </button>
        </form>
      </div>

      {isFetchingSlots ? (
        <p>Loading available time slots...</p>
      ) : timeSlots.length > 0 ? (
        <div>
          <h3>Available Time Slots</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', 
            gap: '15px',
            marginTop: '20px'
          }}>
            {timeSlots.map((slot) => (
              <div 
                key={slot.TimeSlotID}
                onClick={() => handleSlotClick(slot)}
                style={{
                  padding: '15px',
                  border: selectedSlot?.TimeSlotID === slot.TimeSlotID ? '2px solid #4e73df' : '1px solid #e0e0e0',
                  borderRadius: '8px',
                  backgroundColor: slot.isBooked === 1 ? '#f0f0f0' : 
                                  selectedSlot?.TimeSlotID === slot.TimeSlotID ? '#e2e6f7' : '#f8f9fa',
                  cursor: slot.isBooked === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: slot.isBooked === 1 ? 0.7 : 1,
                  position: 'relative'
                }}
              >
                {slot.isBooked === 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    borderRadius: '4px',
                    padding: '2px 5px',
                    fontSize: '12px'
                  }}>
                    Booked
                  </div>
                )}
                <p style={{ 
                  margin: 0, 
                  fontWeight: '500',
                  color: slot.isBooked === 1 ? '#777' : '#333'
                }}>
                  {slot.TimeSlot}
                </p>
                <p style={{ 
                  margin: '5px 0 0', 
                  color: slot.isBooked === 1 ? '#999' : '#666', 
                  fontSize: '14px'
                }}>
                  Status: {slot.Status || (slot.isBooked === 1 ? 'Booked' : 'Available')}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : selectedDate && !dateError ? (
        <p>No available time slots for this date.</p>
      ) : null}

      {selectedSlot && (
        <div style={{ marginTop: '30px' }}>
          <button 
            onClick={handleBooking}
            style={{
              padding: '10px 20px',
              backgroundColor: '#1cc88a',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Book Appointment
          </button>
          {bookingMessage && (
            <p style={{ marginTop: '10px', color: bookingMessage.includes('success') ? 'green' : 'red' }}>
              {bookingMessage}
            </p>
          )}
        </div>
      )}

      <button 
        onClick={() => navigate(-1)}
        style={{
          marginTop: '40px',
          padding: '10px 20px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #ddd',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        ← Back to Previous Page
      </button>
    </div>
  );
};

export default DoctorDetailPage;