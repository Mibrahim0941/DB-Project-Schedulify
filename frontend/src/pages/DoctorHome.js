import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const doctorId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/appointments/BookedDocApts?DocID=${doctorId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        
        const data = await response.json();
        setAppointments(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorId]);

  const handleNavigate = (route) => {
    navigate(route);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>👨‍⚕️ Your Appointments</h1>
      
      <div style={styles.buttonContainer}>
        <button 
          onClick={() => handleNavigate('/about')} 
          style={styles.navButton}
        >
          About Us
        </button>
        <button 
          onClick={() => handleNavigate('/doctor-dashboard')} 
          style={styles.navButton}
        >
          Dashboard
        </button>
      </div>

      {loading ? (
        <div style={styles.statusMessage}>
          <p>Loading your appointments...</p>
        </div>
      ) : error ? (
        <div style={styles.statusMessage}>
          <p style={{ color: '#e74c3c' }}>Error: {error}</p>
        </div>
      ) : appointments.length > 0 ? (
        <div style={styles.appointmentsGrid}>
          {appointments.map((appointment) => (
            <div key={appointment.AppointmentID} style={styles.appointmentCard}>
              <h3>{appointment.PtName || 'Patient'}</h3>
              <p><strong>Date:</strong> {new Date(appointment.AptDate).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {appointment.TimeSlot}</p>
              <p><strong>Status:</strong> {appointment.Status || 'Scheduled'}</p>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.statusMessage}>
          <p>No appointments scheduled yet!</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  },
  header: {
    color: '#2c3e50',
    textAlign: 'center',
    margin: '20px 0 40px'
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '40px'
  },
  navButton: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#2980b9'
    }
  },
  statusMessage: {
    textAlign: 'center',
    padding: '40px 0',
    fontSize: '1.1rem',
    color: '#7f8c8d'
  },
  appointmentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  appointmentCard: {
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
    transition: 'all 0.3s',
    ':hover': {
      transform: 'translateY(-3px)',
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
    }
  }
};

export default DoctorHome;