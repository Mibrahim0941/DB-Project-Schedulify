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

  const mainContainerStyle = {
    padding: '40px',
    maxWidth: '1000px',
    margin: '0 auto',
    fontFamily: '"Segoe UI", Arial, sans-serif',
    color: '#2c3e50',
    backgroundColor: '#f9fafb',
    borderRadius: '12px',
    boxShadow: '0 0 20px rgba(0,0,0,0.05)'
  };

  const cardStyle = {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    marginBottom: '30px',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
  };

  const profileSectionStyle = {
    display: 'flex',
    gap: '30px',
    flexWrap: 'wrap',
    marginBottom: '20px'
  };

  const profileImageStyle = {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #3498db',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
  };

  const doctorInfoStyle = {
    flex: '1',
    minWidth: '250px'
  };

  const sectionTitleStyle = {
    color: '#3498db',
    borderBottom: '2px solid #e0e0e0',
    paddingBottom: '10px',
    marginTop: '0'
  };

  const dateSelectorStyle = {
    padding: '12px',
    borderRadius: '6px',
    border: dateError ? '2px solid #e74c3c' : '1px solid #cbd5e0',
    width: '100%',
    maxWidth: '250px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border 0.3s ease'
  };

  const checkButtonStyle = {
    padding: '12px 24px',
    backgroundColor: isFetchingSlots ? '#a0aec0' : '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: isFetchingSlots ? 'not-allowed' : 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    marginTop: '22px',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const timeSlotsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px',
    marginTop: '20px'
  };

  const bookButtonStyle = {
    padding: '12px 28px',
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  };

  const backButtonStyle = {
    marginTop: '30px',
    padding: '10px 20px',
    backgroundColor: '#f8f9fc',
    border: '1px solid #d1d9e6',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: '500',
    color: '#4a5568',
    transition: 'all 0.2s ease'
  };

  const infoItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '10px',
    fontSize: '16px'
  };

  const infoLabelStyle = {
    fontWeight: '600',
    minWidth: '110px',
    color: '#64748b'
  };

  const infoValueStyle = {
    color: '#2c3e50'
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '70vh',
        fontSize: '18px',
        color: '#64748b'
      }}>
        <div style={{
          display: 'inline-block',
          width: '30px',
          height: '30px',
          border: '3px solid rgba(0,0,0,0.1)',
          borderTopColor: '#3498db',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginRight: '15px'
        }}></div>
        Loading doctor details...
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!doctor) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        maxWidth: '500px',
        margin: '50px auto',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          fontSize: '60px',
          color: '#e74c3c',
          marginBottom: '20px'
        }}>⚠️</div>
        <h2 style={{ color: '#e74c3c', marginBottom: '20px' }}>Doctor Not Found</h2>
        <p style={{ marginBottom: '30px', color: '#64748b' }}>
          We couldn't find the doctor you're looking for or something went wrong.
        </p>
        <button 
          onClick={() => navigate(-1)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div style={mainContainerStyle}>
      <div style={cardStyle}>
        <div style={profileSectionStyle}>
          <div>
            <img
              src={doctor.DocPFP}
              alt={`Dr. ${doctor.DocName}`}
              style={profileImageStyle}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%2380CBC4"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>';
              }}
            />
          </div>
          <div style={doctorInfoStyle}>
            <h2 style={{ 
              fontSize: '28px', 
              marginTop: 0, 
              marginBottom: '20px',
              color: '#2c3e50' 
            }}>
              Dr. {doctor.DocName}
            </h2>
            
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Specialization:</span>
              <span style={infoValueStyle}>{doctor.Specialization}</span>
            </div>
            
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Rating:</span>
              <span style={{...infoValueStyle, display: 'flex', alignItems: 'center'}}>
                <span style={{color: '#f1c40f', marginRight: '4px'}}>★</span> 
                {doctor.Rating}
              </span>
            </div>
            
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Fees:</span>
              <span style={infoValueStyle}><strong>PKR {doctor.Fees}</strong></span>
            </div>
            
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Experience:</span>
              <span style={infoValueStyle}>{doctor.Experience} years</span>
            </div>
            
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Availability: </span>
              <span style={{
                ...infoValueStyle,
                backgroundColor: doctor.Presence ? '#e3fcef' : '#fff5f5',
                color: doctor.Presence? '#1e824c' : '#e53e3e',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '14px'
              }}>
                {doctor.Presence? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div style={cardStyle}>
        <h3 style={sectionTitleStyle}>Schedule Appointment</h3>
        
        <form onSubmit={handleSubmit} style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          gap: '20px', 
          alignItems: 'flex-end',
          marginTop: '20px'
        }}>
          <div style={{ flex: '1', minWidth: '250px' }}>
            <label htmlFor="appointmentDate" style={{ 
              display: 'block', 
              marginBottom: '8px',
              fontWeight: '500',
              color: '#4a5568'
            }}>
              Select Date:
            </label>
            <input
              type="date"
              id="appointmentDate"
              value={selectedDate}
              onChange={handleDateChange}
              min={new Date().toISOString().split('T')[0]}
              style={dateSelectorStyle}
            />
            {dateError && (
              <p style={{ 
                color: '#e74c3c', 
                margin: '8px 0 0', 
                fontSize: '14px' 
              }}>
                {dateError}
              </p>
            )}
          </div>
          
          <button 
            type="submit"
            disabled={isFetchingSlots}
            style={checkButtonStyle}
            onMouseOver={(e) => {
              if (!isFetchingSlots) e.currentTarget.style.backgroundColor = '#2980b9';
            }}
            onMouseOut={(e) => {
              if (!isFetchingSlots) e.currentTarget.style.backgroundColor = '#3498db';
            }}
          >
            {isFetchingSlots ? 'Loading...' : 'Check Available Slots'}
          </button>
        </form>
      </div>

      {isFetchingSlots ? (
        <div style={{
          textAlign: 'center',
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          marginBottom: '30px'
        }}>
          <div style={{
            display: 'inline-block',
            width: '20px',
            height: '20px',
            border: '3px solid rgba(0,0,0,0.1)',
            borderTopColor: '#3498db',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '10px'
          }}></div>
          Loading available time slots...
        </div>
      ) : timeSlots.length > 0 ? (
        <div style={cardStyle}>
          <h3 style={sectionTitleStyle}>Available Time Slots</h3>
          <p style={{ color: '#64748b', marginBottom: '20px' }}>
            Select a time slot for your appointment with Dr. {doctor.DocName} on {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          
          <div style={timeSlotsGridStyle}>
            {timeSlots.map((slot) => (
              <div 
                key={slot.TimeSlotID}
                onClick={() => handleSlotClick(slot)}
                style={{
                  padding: '15px',
                  border: selectedSlot?.TimeSlotID === slot.TimeSlotID ? '2px solid #3498db' : '1px solid #e2e8f0',
                  borderRadius: '8px',
                  backgroundColor: slot.isBooked === 1 ? '#f8fafc' : 
                                  selectedSlot?.TimeSlotID === slot.TimeSlotID ? '#e3f2fd' : 'white',
                  cursor: slot.isBooked === 1 ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  opacity: slot.isBooked === 1 ? 0.7 : 1,
                  position: 'relative',
                  boxShadow: selectedSlot?.TimeSlotID === slot.TimeSlotID ? '0 0 0 2px rgba(52, 152, 219, 0.3)' : 'none'
                }}
                onMouseOver={(e) => {
                  if (slot.isBooked !== 1) {
                    e.currentTarget.style.backgroundColor = selectedSlot?.TimeSlotID === slot.TimeSlotID ? '#e3f2fd' : '#f8fafc';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                  }
                }}
                onMouseOut={(e) => {
                  if (slot.isBooked !== 1) {
                    e.currentTarget.style.backgroundColor = selectedSlot?.TimeSlotID === slot.TimeSlotID ? '#e3f2fd' : 'white';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = selectedSlot?.TimeSlotID === slot.TimeSlotID ? '0 0 0 2px rgba(52, 152, 219, 0.3)' : 'none';
                  }
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
                    padding: '2px 8px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    Booked
                  </div>
                )}
                <p style={{ 
                  margin: 0, 
                  fontWeight: '600',
                  color: slot.isBooked === 1 ? '#a0aec0' : '#2d3748',
                  fontSize: '16px',
                  textAlign: 'center'
                }}>
                  {slot.TimeSlot}
                </p>
                <p style={{ 
                  margin: '8px 0 0', 
                  color: slot.isBooked === 1 ? '#cbd5e0' : '#718096', 
                  fontSize: '13px',
                  textAlign: 'center'
                }}>
                  {slot.isBooked === 1 ? 'Already Booked' : 'Available'}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : selectedDate && !dateError ? (
        <div style={{
          padding: '30px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          marginBottom: '30px',
          textAlign: 'center',
          color: '#64748b'
        }}>
          <div style={{ fontSize: '40px', marginBottom: '15px' }}>📅</div>
          <p style={{ fontSize: '16px' }}>No available time slots for this date.</p>
          <p style={{ fontSize: '14px' }}>Please try selecting a different date.</p>
        </div>
      ) : null}

      {selectedSlot && (
        <div style={{
          textAlign: 'center',
          marginTop: '30px',
          padding: '25px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
          marginBottom: '30px'
        }}>
          <p style={{ 
            fontSize: '16px', 
            marginBottom: '20px',
            color: '#4a5568'
          }}>
            You've selected the {selectedSlot.TimeSlot} slot on {new Date(selectedDate).toLocaleDateString()}
          </p>
          
          <button 
            onClick={handleBooking}
            style={bookButtonStyle}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#27ae60';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#2ecc71';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Confirm Booking
          </button>
          
          {bookingMessage && (
            <p style={{ 
              marginTop: '15px', 
              padding: '10px 15px',
              borderRadius: '6px',
              backgroundColor: bookingMessage.includes('success') ? '#e3fcef' : '#fff5f5',
              color: bookingMessage.includes('success') ? '#1e824c' : '#e53e3e',
              display: 'inline-block'
            }}>
              {bookingMessage}
            </p>
          )}
        </div>
      )}

      <button 
        onClick={() => navigate(-1)}
        style={backButtonStyle}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = '#edf2f7';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = '#f8f9fc';
        }}
      >
        <span style={{ fontSize: '18px' }}>←</span> Back to Previous Page
      </button>
    </div>
  );
};

export default DoctorDetailPage;