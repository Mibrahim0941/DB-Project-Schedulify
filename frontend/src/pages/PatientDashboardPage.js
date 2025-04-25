import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function PatientDashboardPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editField, setEditField] = useState('PtName');
  const [editValue, setEditValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserDashboard();
  }, []);

  const fetchUserDashboard = async () => {
    setIsLoading(true);
    const userId = localStorage.getItem('userId');
    try {
      const [userRes, historyRes] = await Promise.all([
        fetch(`http://localhost:5000/api/patients/PatientDetails?PtID=${userId}`),
        fetch(`http://localhost:5000/api/patients/patientHistory?PtID=${userId}`)
      ]);
      if (!userRes.ok || !historyRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      const userData = await userRes.json();
      const historyData = await historyRes.json();
      
      console.log('Medical History Data:', historyData);
      setUserInfo(userData[0]);
      setMedicalHistory(Array.isArray(historyData) ? historyData : 
                      Array.isArray(historyData.data) ? historyData.data : []);
      setError(null);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAppointment = async (aptId) => {
    console.log('[DEBUG] Cancellation initiated with ID:', aptId);
    setCancellingId(aptId);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/api/appointments/cancelAppointment`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ appointmentID: aptId })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to cancel appointment');

      await fetchUserDashboard();
      setStatusMessage({ type: 'success', message: 'Appointment cancelled successfully' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      setStatusMessage({ type: 'error', message: error.message });
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsLoading(false);
      setCancellingId(null);
    }
  };

  const handleCancelLabTest = async (record) => {
    console.log('[DEBUG] Lab test cancellation started');
    console.log('[DEBUG] Full record:', record);
  
    const testId = record.TestAptID || record.id || record.AptID;
    
    if (!testId) {
      console.error('[DEBUG] No valid test ID found in record:', record);
      setStatusMessage({ type: 'error', message: 'Invalid test ID' });
      setTimeout(() => setStatusMessage(null), 3000);
      return;
    }
  
    console.log('[DEBUG] Using TestAptID:', testId);
    setCancellingId(testId);
    setIsLoading(true);
    setError(null);
  
    try {
      const response = await fetch(`http://localhost:5000/api/labtests/cancelLabTest`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ TestAptID: testId })
      });
  
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to cancel lab test');
  
      await fetchUserDashboard();
      setStatusMessage({ type: 'success', message: 'Lab test cancelled successfully' });
      setTimeout(() => setStatusMessage(null), 3000);
    } catch (error) {
      console.error('[DEBUG] Lab test cancellation error:', error);
      setStatusMessage({ type: 'error', message: error.message });
      setTimeout(() => setStatusMessage(null), 3000);
    } finally {
      setIsLoading(false);
      setCancellingId(null);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
    setEditValue(userInfo[editField] || '');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your patient account? This action cannot be undone.')) return;
    try {
      const response = await fetch('http://localhost:5000/api/auth/deleteUser', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userType: 'patient',
          userID: localStorage.getItem('userId')
        })
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to delete account');

      alert('Account deleted successfully');
      localStorage.clear();
      navigate('/login');
    } catch (error) {
      alert('Error deleting account: ' + error.message);
    }
  };

  const handleUpdateDetails = async () => {
    setIsLoading(true);
    try {
      const updateData = {
        PtID: localStorage.getItem('userId'),
        [editField]: editField === 'PHeight' || editField === 'PWeight' 
          ? parseFloat(editValue) 
          : editValue
      };

      const response = await fetch(`http://localhost:5000/api/patients/updatePatientInfo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      await fetchUserDashboard();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating details:', error);
      setError('Failed to update details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !userInfo) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !isLoading && !statusMessage) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#e53e3e', marginBottom: '20px' }}>Error Loading Dashboard</h2>
        <p style={{ marginBottom: '20px' }}>
          {typeof error === 'object' ? error.message : error}
        </p>
        <button
          onClick={fetchUserDashboard}
          style={{
            backgroundColor: '#4e73df',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '0 40px 40px'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 0',
        marginBottom: '30px',
        borderBottom: '1px solid #e0e0e0'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#4e73df',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            {userInfo?.PtName?.charAt(0) || 'P'}
          </div>
          <h1 style={{
            margin: 0,
            fontSize: '24px',
            fontWeight: '700',
            color: '#2d3748',
            letterSpacing: '-0.5px'
          }}>Patient Dashboard</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Link to="/home" style={{
            textDecoration: 'none',
            color: '#4e73df',
            fontWeight: '600',
            padding: '8px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s',
            ':hover': {
              backgroundColor: '#e9ecef'
            }
          }}>
            ← Back to Home
          </Link>
          <button
            onClick={() => navigate('/payment')}
            style={{
              backgroundColor: '#9f7aea',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              ':hover': {
                backgroundColor: '#805ad5'
              }
            }}
          >
            Payment
          </button>
          <button
            onClick={handleDeleteAccount}
            style={{
              backgroundColor: '#e53e3e',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s',
              ':hover': {
                backgroundColor: '#c53030'
              }
            }}
          >
            Delete Account
          </button>
        </div>
      </header>

      {/* Status Message Notification */}
      {statusMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px 20px',
          borderRadius: '8px',
          backgroundColor: statusMessage.type === 'success' ? '#48bb78' : '#e53e3e',
          color: 'white',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          animation: 'fadeIn 0.3s ease'
        }}>
          {statusMessage.message}
        </div>
      )}

      <main>
        <h2 style={{
          marginBottom: '30px',
          color: '#2d3748',
          fontSize: '28px',
          fontWeight: '700'
        }}>Welcome, {userInfo?.PtName || 'Patient'}</h2>
        
        <section style={{ marginBottom: '40px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              color: '#4a5568',
              fontSize: '20px',
              fontWeight: '600',
              margin: 0
            }}>Profile Information</h3>
            <button 
              onClick={handleEditClick}
              style={{
                backgroundColor: '#4e73df',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                ':hover': {
                  backgroundColor: '#3b5ab9'
                }
              }}
            >
              Edit Profile
            </button>
          </div>
          
          <div style={{
            display: 'flex',
            gap: '30px',
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.3s',
            ':hover': {
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <div style={{
              position: 'relative',
              flexShrink: 0
            }}>
              <img 
                src={userInfo?.PtPFP} 
                alt="Profile" 
                style={{ 
                  width: '150px', 
                  height: '150px', 
                  borderRadius: '50%', 
                  objectFit: 'cover',
                  border: '5px solid #f0f2f5'
                }} 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://th.bing.com/th/id/OIP.INB8GTMpMEJQLcsx8sCeBAHaHa?w=196&h=196&c=7&r=0&o=5&dpr=1.3&pid=1.7';
                }}
              />
              <div style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '20px',
                height: '20px',
                backgroundColor: '#48bb78',
                borderRadius: '50%',
                border: '2px solid white'
              }}></div>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px',
              width: '100%'
            }}>
              <ProfileInfoItem label="Name" value={userInfo?.PtName} />
              <ProfileInfoItem label="Email" value={userInfo?.PtEmail} />
              <ProfileInfoItem label="Phone" value={userInfo?.PhoneNum?.trim()} />
              <ProfileInfoItem label="Height" value={`${userInfo?.PHeight} ft`} />
              <ProfileInfoItem label="Weight" value={`${userInfo?.PWeight} kg`} />
              <ProfileInfoItem label="Date of Birth" value={userInfo?.DOB ? new Date(userInfo.DOB).toLocaleDateString() : 'N/A'} />
              <ProfileInfoItem label="City" value={userInfo?.PtCity} />
              <ProfileInfoItem label="Country" value={userInfo?.PtCountry} />
              <ProfileInfoItem 
                label="Total Records" 
                value={medicalHistory.length} 
                highlight 
              />
            </div>
          </div>
        </section>

        <section>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h3 style={{
              color: '#4a5568',
              fontSize: '20px',
              fontWeight: '600',
              margin: 0
            }}>Your Medical History</h3>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => navigate('/doctors')}
                style={{
                  backgroundColor: '#4e73df',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  ':hover': {
                    backgroundColor: '#3b5ab9'
                  }
                }}
              >
                Book Appointment
              </button>
              <button 
                onClick={() => navigate('/labtest')}
                style={{
                  backgroundColor: '#48bb78',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  ':hover': {
                    backgroundColor: '#38a169'
                  }
                }}
              >
                Book Lab Test
              </button>
            </div>
          </div>
          {medicalHistory.length === 0 ? (
            <div style={{
              backgroundColor: 'white',
              padding: '40px',
              borderRadius: '16px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
            }}>
              <p style={{
                color: '#718096',
                fontSize: '16px',
                marginBottom: '20px'
              }}>No medical history records found.</p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              gap: '20px'
            }}>
              {medicalHistory.map((record, index) => (
                <div key={index} style={{
                  backgroundColor: 'white',
                  padding: '20px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                  transition: 'all 0.3s',
                  ':hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
                  },
                  borderLeft: `5px solid ${record.Type === 'Lab Test' ? '#48bb78' : '#4e73df'}`
                }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px'
                  }}>
                    <h4 style={{
                      margin: 0,
                      color: '#2d3748',
                      fontWeight: '600',
                      fontSize: '18px'
                    }}>
                      {record['Doctor/Test']}
                    </h4>
                    <span style={{
                      backgroundColor: record.Type === 'Lab Test' ? '#e6ffed' : '#ebf4ff',
                      color: record.Type === 'Lab Test' ? '#48bb78' : '#4e73df',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      {record.Type}
                    </span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    marginBottom: '15px'
                  }}>
                    <InfoRow icon="📅" label="Date" value={new Date(record.Date).toLocaleDateString()} />
                    <InfoRow icon="⏱️" label="Time" value={record.Time} />
                    <InfoRow 
                      icon="🔄" 
                      label="Status" 
                      value={record.Status} 
                      style={{
                        color: record.Status === 'Confirmed' ? '#48bb78' : 
                              record.Status === 'Pending' ? '#ed8936' : 
                              record.Status === 'Cancelled' ? '#e53e3e' : '#718096',
                        fontWeight: '500'
                      }} 
                    />
                  </div>
                  
                  {(record.Status === 'Scheduled' || record.Status === 'Confirmed') && (
                    record.Type === 'Lab Test' ? (
                      <button
                        onClick={() => handleCancelLabTest(record)}
                        disabled={isLoading && cancellingId === record.TestAptID}
                        style={{
                          width: '100%',
                          padding: '8px',
                          backgroundColor: '#e53e3e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          opacity: isLoading && cancellingId === record.TestAptID ? 0.7 : 1,
                          ':hover': {
                            backgroundColor: '#c53030'
                          }
                        }}
                      >
                        {isLoading && cancellingId === record.TestAptID 
                          ? 'Cancelling...' 
                          : 'Cancel Lab Test'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCancelAppointment(record.AptID)}
                        disabled={isLoading && cancellingId === record.AptID}
                        style={{
                          width: '100%',
                          padding: '8px',
                          backgroundColor: '#e53e3e',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          opacity: isLoading && cancellingId === record.AptID ? 0.7 : 1,
                          ':hover': {
                            backgroundColor: '#c53030'
                          }
                        }}
                      >
                        {isLoading && cancellingId === record.AptID 
                          ? 'Cancelling...' 
                          : 'Cancel Appointment'}
                      </button>
                    )
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Modal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '400px',
            maxWidth: '90%',
            borderRadius: '12px',
            padding: '25px',
            boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }
        }}
      >
        <h2 style={{ marginTop: 0, color: '#2d3748' }}>Edit Profile Information</h2>
        
        {error && (
          <div style={{
            backgroundColor: '#fff5f5',
            color: '#e53e3e',
            padding: '10px',
            borderRadius: '6px',
            marginBottom: '15px',
            border: '1px solid #fed7d7'
          }}>
            {error}
          </div>
        )}
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#4a5568' }}>
            Field to Edit:
          </label>
          <select
            value={editField}
            onChange={(e) => {
              setEditField(e.target.value);
              setEditValue(userInfo[e.target.value] || '');
            }}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              marginBottom: '15px',
              backgroundColor: 'white'
            }}
          >
            <option value="PtName">Full Name</option>
            <option value="PtEmail">Email</option>
            <option value="PhoneNum">Phone Number</option>
            <option value="PHeight">Height (ft)</option>
            <option value="PWeight">Weight (kg)</option>
            <option value="DOB">Date of Birth</option>
            <option value="PtCity">City</option>
            <option value="PtCountry">Country</option>
            <option value="PtPFP">Profile Picture URL</option>
          </select>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#4a5568' }}>
            New Value:
          </label>
          {editField === 'DOB' ? (
            <input
              type="date"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                backgroundColor: 'white'
              }}
            />
          ) : (
            <input
              type={['PHeight', 'PWeight'].includes(editField) ? 'number' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                backgroundColor: 'white'
              }}
            />
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={() => setIsEditModalOpen(false)}
            disabled={isLoading}
            style={{
              padding: '10px 15px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              backgroundColor: 'white',
              cursor: 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdateDetails}
            disabled={isLoading}
            style={{
              padding: '10px 15px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#4e73df',
              color: 'white',
              cursor: 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </Modal>
    </div>
  );
}

const ProfileInfoItem = ({ label, value, highlight = false }) => (
  <div>
    <p style={{
      margin: 0,
      color: '#718096',
      fontSize: '14px',
      fontWeight: '500'
    }}>{label}</p>
    <p style={{
      margin: '4px 0 0',
      color: highlight ? '#4e73df' : '#2d3748',
      fontSize: '16px',
      fontWeight: highlight ? '600' : '500'
    }}>{value || '-'}</p>
  </div>
);

const InfoRow = ({ icon, label, value, style = {} }) => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  }}>
    <span style={{ width: '20px' }}>{icon}</span>
    <div>
      <span style={{
        color: '#718096',
        fontSize: '14px',
        marginRight: '8px'
      }}>{label}:</span>
      <span style={{
        color: '#2d3748',
        fontWeight: '500',
        ...style
      }}>{value}</span>
    </div>
  </div>
);

export default PatientDashboardPage;