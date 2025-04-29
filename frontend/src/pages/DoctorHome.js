import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorHome = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const doctorId = localStorage.getItem('userId');
  const doctorName = localStorage.getItem('userName') || 'Doctor';

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
      <div style={styles.headerContainer}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.greeting}>Hi, <span style={styles.doctorName}>{doctorName}</span></h1>
            <p style={styles.subHeader}>Your upcoming appointments and schedule</p>
          </div>
          <div style={styles.logoContainer}>
            <span style={styles.logo}>🩺</span>
            <span style={styles.logoText}>Schedulify</span>
          </div>
        </div>
      </div>
      
      <div style={styles.navBar}>
        <button 
          onClick={() => handleNavigate('/doctor-dashboard')} 
          style={styles.activeNavButton}
        >
          My Profile
        </button>
        <button 
          onClick={() => handleNavigate('/login')} 
          style={styles.navButton}
        >
          Logout
        </button>
      </div>

      <div style={styles.contentContainer}>
        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.spinner}></div>
            <p style={styles.loadingText}>Loading your appointments...</p>
          </div>
        ) : error ? (
          <div style={styles.errorContainer}>
            <p style={styles.errorText}>⚠️ Error: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={styles.retryButton}
            >
              Try Again
            </button>
          </div>
        ) : appointments.length > 0 ? (
          <>
            <div style={styles.statsBar}>
              <div style={styles.statCard}>
                <h3>Total Appointments</h3>
                <p style={styles.statNumber}>{appointments.length}</p>
              </div>
              <div style={styles.statCard}>
                <h3>Today's Appointments</h3>
                <p style={styles.statNumber}>
                  {appointments.filter(apt => 
                    new Date(apt.AptDate).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
            
            <h2 style={styles.sectionTitle}>Upcoming Appointments</h2>
            <div style={styles.appointmentsGrid}>
              {appointments.map((appointment) => (
                <div key={appointment.AppointmentID} style={styles.appointmentCard}>
                  <div style={styles.cardHeader}>
                    <h3 style={styles.patientName}>{appointment.PtName || 'Patient'}</h3>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: appointment.Status === 'Completed' ? '#2ecc71' : '#3498db'
                    }}>
                      {appointment.Status || 'Scheduled'}
                    </span>
                  </div>
                  <div style={styles.cardBody}>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Date:</span>
                      <span>{new Date(appointment.AptDate).toLocaleDateString()}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Time:</span>
                      <span>{appointment.TimeSlot}</span>
                    </div>
                    <div style={styles.infoRow}>
                      <span style={styles.infoLabel}>Notes:</span>
                      <span>{appointment.Notes || 'No notes available'}</span>
                    </div>
                  </div>
                  <button style={styles.viewButton}>
                    View Details
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={styles.emptyState}>
            <img 
              src="https://img.icons8.com/ios/100/3498db/calendar.png" 
              alt="No appointments" 
              style={styles.emptyIcon}
            />
            <h3 style={styles.emptyTitle}>No Appointments Scheduled</h3>
            <p style={styles.emptyText}>You don't have any upcoming appointments yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px 30px',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f5f7fa',
    minHeight: '100vh'
  },
  headerContainer: {
    textAlign: 'center',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e0e6ed'
  },
  header: {
    color: '#2c3e50',
    fontSize: '2.5rem',
    marginBottom: '10px',
    fontWeight: '600'
  },
  subHeader: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
    marginTop: '0'
  },
  navBar: {
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    marginBottom: '40px',
    flexWrap: 'wrap'
  },
  
  navButton: {
    padding: '12px 25px',
    backgroundColor: 'white',
    color: '#3498db',
    border: '1px solid #3498db',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
    fontWeight: '500',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    ':hover': {
      backgroundColor: '#f0f7ff',
      transform: 'translateY(-2px)'
    }
  },
  activeNavButton: {
    padding: '12px 25px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
    fontWeight: '500',
    boxShadow: '0 4px 8px rgba(52, 152, 219, 0.3)',
    ':hover': {
      backgroundColor: '#2980b9'
    }
  },
  contentContainer: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '30px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0'
  },
  spinner: {
    border: '5px solid #f3f3f3',
    borderTop: '5px solid #3498db',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px'
  },
  loadingText: {
    color: '#7f8c8d',
    fontSize: '1.2rem'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '40px 0'
  },
  errorText: {
    color: '#e74c3c',
    fontSize: '1.2rem',
    marginBottom: '20px'
  },
  retryButton: {
    padding: '10px 20px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
    ':hover': {
      backgroundColor: '#c0392b'
    }
  },
  statsBar: {
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
    flexWrap: 'wrap'
  },
  statCard: {
    flex: '1',
    minWidth: '200px',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
  },
  statNumber: {
    fontSize: '2.5rem',
    color: '#3498db',
    margin: '10px 0 0',
    fontWeight: 'bold'
  },
  sectionTitle: {
    color: '#2c3e50',
    fontSize: '1.8rem',
    marginBottom: '25px',
    paddingBottom: '15px',
    borderBottom: '1px solid #e0e6ed'
  },
  appointmentsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '25px'
  },
  appointmentCard: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
    transition: 'all 0.3s ease',
    border: '1px solid #e0e6ed',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
    }
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '15px',
    borderBottom: '1px solid #f0f2f5'
  },
  patientName: {
    color: '#2c3e50',
    margin: '0',
    fontSize: '1.4rem'
  },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    color: 'white',
    fontSize: '0.8rem',
    fontWeight: '500'
  },
  cardBody: {
    marginBottom: '20px'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
    paddingBottom: '12px',
    borderBottom: '1px dashed #f0f2f5',
    ':last-child': {
      borderBottom: 'none',
      marginBottom: '0'
    }
  },
  infoLabel: {
    fontWeight: '600',
    color: '#7f8c8d'
  },
  viewButton: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#f8f9fa',
    color: '#3498db',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s',
    fontWeight: '500',
    ':hover': {
      backgroundColor: '#e1f0ff'
    }
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px'
  },
  emptyIcon: {
    width: '80px',
    height: '80px',
    marginBottom: '20px',
    opacity: '0.7'
  },
  emptyTitle: {
    color: '#2c3e50',
    fontSize: '1.8rem',
    marginBottom: '15px'
  },
  headerContainer: {
    marginBottom: '40px',
    padding: '25px 30px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  greeting: {
    color: '#2c3e50',
    fontSize: '2rem',
    marginBottom: '8px',
    fontWeight: '500',
    display: 'flex',
    alignItems: 'center'
  },
  doctorName: {
    color: '#3498db',
    fontWeight: '600',
    marginLeft: '8px'
  },
  subHeader: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
    margin: '0'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  logo: {
    fontSize: '2.5rem'
  },
  logoText: {
    color: '#2c3e50',
    fontSize: '1.8rem',
    fontWeight: '600',
    letterSpacing: '-0.5px'
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: '1.1rem',
    maxWidth: '500px',
    margin: '0 auto'
  }
};

export default DoctorHome;