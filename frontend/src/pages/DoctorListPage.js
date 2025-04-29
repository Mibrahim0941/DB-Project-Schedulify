import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('http://localhost:5000/api/doctors/doctorsByRating');
      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }
      const data = await response.json();
      const doctorsWithImages = data.map(doctor => ({
        ...doctor,
        DocPFP: doctor.DocPFP || getRandomDoctorImage()
      }));
      setDoctors(doctorsWithImages);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getRandomDoctorImage = () => {
    const images = [
      'https://th.bing.com/th/id/OIP.INB8GTMpMEJQLcsx8sCeBAHaHa?w=196&h=196&c=7&r=0&o=5&dpr=1.3&pid=1.7'
    ];
    return images[Math.floor(Math.random() * images.length)];
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Available Doctors</h2>
        <p style={styles.subtitle}>Browse and select from our top-rated medical professionals</p>
      </div>

      {isLoading ? (
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p>Loading doctors...</p>
        </div>
      ) : error ? (
        <div style={styles.errorContainer}>
          <p style={styles.errorText}>Error: {error}</p>
          <button 
            style={styles.retryButton}
            onClick={fetchDoctors}
          >
            Retry
          </button>
        </div>
      ) : doctors.length === 0 ? (
        <p style={styles.noDoctorsText}>No doctors available at the moment.</p>
      ) : (
        <div style={styles.grid}>
          {doctors.map((doctor) => (
            <div 
              key={doctor.DocID} 
              style={styles.card}
              onClick={() => navigate(`/doctor/${doctor.DocID}`)}
            >
              <div style={styles.profileImageContainer}>
                <div style={styles.profileImageWrapper}>
                  <img 
                    src={doctor.DocPFP} 
                    alt={doctor.Name} 
                    style={styles.profileImage}
                    onError={(e) => {
                      e.target.src = 'https://img.freepik.com/free-photo/doctor-with-his-arms-crossed-white-background_1368-5790.jpg';
                    }}
                  />
                </div>
              </div>
              <div style={styles.cardContent}>
                <div style={styles.doctorInfo}>
                  <h3 style={styles.doctorName}>{doctor.DocName}</h3>
                  <p style={styles.doctorSpecialty}>{doctor.Specialization}</p>
                </div>
                
                <div style={styles.detailRow}>
                  <span style={styles.detailValue}>{doctor.Department || doctor.Specialty}</span>
                </div>
                
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Rating</span>
                  <span style={styles.detailValue}>
                    {doctor.Rating && <span style={styles.star}>&#9733;</span>}
                  </span>
                </div>
                
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Fees</span>
                  <span style={styles.detailValue}>{doctor.Fees || '0'} PKR</span>
                </div>
                
                <div style={styles.detailRow}>
                  <span style={styles.detailLabel}>Experience</span>
                  <span style={styles.detailValue}>{doctor.Experience || '0'} years</span>
                </div>
                
                <button style={styles.viewButton}>View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: '30px 20px',
    maxWidth: '1200px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  header: {
    marginBottom: '30px',
    textAlign: 'center',
  },
  title: {
    fontSize: '28px',
    color: '#333',
    marginBottom: '8px',
    fontWeight: '600',
  },
  subtitle: {
    fontSize: '16px',
    color: '#666',
    margin: '0',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '25px',
    padding: '10px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    cursor: 'pointer',
    border: '1px solid #e0e0e0',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '15px',
  },
  profileImageContainer: {
    marginBottom: '15px',
  },
  profileImageWrapper: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    overflow: 'hidden',
    border: '3px solid #3498db',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  cardContent: {
    width: '100%',
    padding: '0 10px',
  },
  doctorInfo: {
    marginBottom: '15px',
    textAlign: 'center',
  },
  doctorName: {
    fontSize: '20px',
    color: '#2c3e50',
    margin: '0 0 5px 0',
    fontWeight: '600',
  },
  doctorSpecialty: {
    fontSize: '16px',
    color: '#7f8c8d',
    margin: '0',
    fontWeight: '500',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '10px',
  },
  detailLabel: {
    fontSize: '14px',
    color: '#7f8c8d',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: '14px',
    color: '#2c3e50',
    fontWeight: '600',
  },
  star: {
    color: '#FFD700',
    marginLeft: '5px',
  },
  viewButton: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '15px',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#2980b9',
    },
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
  },
  spinner: {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    borderLeftColor: '#3498db',
    animation: 'spin 1s linear infinite',
    marginBottom: '20px',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '8px',
    maxWidth: '500px',
    margin: '0 auto',
  },
  errorText: {
    marginBottom: '15px',
    textAlign: 'center',
  },
  retryButton: {
    padding: '8px 16px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    ':hover': {
      backgroundColor: '#c82333',
    },
  },
  noDoctorsText: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#7f8c8d',
    padding: '40px',
  },
};

export default DoctorListPage;