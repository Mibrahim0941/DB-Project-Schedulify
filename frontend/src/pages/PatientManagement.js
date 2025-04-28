import React, { useState, useEffect } from 'react';
import { FaUser, FaCalendarAlt, FaMoneyBillWave, FaEnvelope, FaSpinner } from 'react-icons/fa';

const PatientSummary = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatientSummary = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/patients/patientsummary');
        if (!response.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await response.json();
        setPatients(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientSummary();
  }, []);

  // Calculate summary statistics
  const totalPatients = patients.length;
  const totalAppointments = patients.reduce((sum, patient) => sum + patient.appointmentsCount, 0);
  const totalRevenue = patients.reduce((sum, patient) => sum + patient.totalPayments, 0);

  // Styles
  const styles = {
    container: {
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    pageTitle: {
      color: '#2c3e50',
      textAlign: 'center',
      marginBottom: '2rem',
      fontSize: '2rem',
      fontWeight: '600'
    },
    statsContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    statCard: {
      background: '#f8f9fa',
      borderRadius: '10px',
      padding: '1.5rem',
      textAlign: 'center',
      minWidth: '200px',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      flex: '1'
    },
    statTitle: {
      color: '#6c757d',
      marginBottom: '0.5rem',
      fontSize: '1rem',
      fontWeight: '500'
    },
    statValue: {
      color: '#2c3e50',
      fontSize: '1.5rem',
      fontWeight: '600'
    },
    cardsContainer: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      marginTop: '1rem'
    },
    patientCard: {
      background: 'white',
      borderRadius: '10px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      transition: 'transform 0.2s',
      ':hover': {
        transform: 'translateY(-5px)'
      }
    },
    patientHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '1rem',
      gap: '1rem'
    },
    patientAvatar: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      backgroundColor: '#e3f2fd',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#1976d2'
    },
    patientName: {
      margin: '0',
      color: '#2c3e50',
      fontSize: '1.2rem',
      fontWeight: '600'
    },
    detailRow: {
      display: 'flex',
      alignItems: 'center',
      margin: '0.8rem 0',
      gap: '0.8rem'
    },
    detailIcon: {
      color: '#6c757d',
      width: '20px'
    },
    detailValue: {
      color: '#495057',
      fontSize: '0.95rem'
    },
    loadingContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px',
      color: '#6c757d'
    },
    errorContainer: {
      padding: '2rem',
      backgroundColor: '#fff5f5',
      color: '#dc3545',
      borderRadius: '8px',
      textAlign: 'center',
      margin: '2rem'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <FaSpinner className="spin" size={32} />
        <p>Loading patient data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.errorContainer}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Patient Summaries</h1>
      
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Patients</h3>
          <p style={styles.statValue}>{totalPatients}</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Appointments</h3>
          <p style={styles.statValue}>{totalAppointments}</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statTitle}>Total Revenue</h3>
          <p style={styles.statValue}>${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div style={styles.cardsContainer}>
        {patients.map((patient) => (
          <div key={patient.email} style={styles.patientCard}>
            <div style={styles.patientHeader}>
              <div style={styles.patientAvatar}>
                <FaUser size={20} />
              </div>
              <h2 style={styles.patientName}>{patient.patientName}</h2>
            </div>
            
            <div>
              <div style={styles.detailRow}>
                <FaEnvelope style={styles.detailIcon} />
                <span style={styles.detailValue}>{patient.email}</span>
              </div>
              
              <div style={styles.detailRow}>
                <FaCalendarAlt style={styles.detailIcon} />
                <span style={styles.detailValue}>
                  {patient.appointmentsCount} appointment{patient.appointmentsCount !== 1 ? 's' : ''}
                </span>
              </div>
              
              <div style={styles.detailRow}>
                <FaMoneyBillWave style={styles.detailIcon} />
                <span style={styles.detailValue}>
                  ${patient.totalPayments.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientSummary;