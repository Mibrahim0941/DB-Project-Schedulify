import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { FaUserMd, FaCalendarAlt, FaEdit, FaTrash, FaArrowLeft, FaStar, FaMoneyBillWave, FaBriefcaseMedical, FaMapMarkerAlt, FaEnvelope, FaUniversity } from 'react-icons/fa';

// Set app element for accessibility
Modal.setAppElement('#root');

const DoctorDashboard = () => {
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [timeSlotModalOpen, setTimeSlotModalOpen] = useState(false);
  const [editData, setEditData] = useState({});
  const [newTimeSlot, setNewTimeSlot] = useState('');
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const doctorId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorRes, deptRes, slotsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/doctors/doctorInfo?DocID=${doctorId}`),
          fetch(`http://localhost:5000/api/departments/allDepartments`),
          fetch(`http://localhost:5000/api/appointments/allSlots?DocID=${doctorId}`)
        ]);

        if (!doctorRes.ok || !deptRes.ok || !slotsRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const doctorData = await doctorRes.json();
        const deptData = await deptRes.json();
        const slotsData = await slotsRes.json();

        setDoctorInfo(doctorData);
        setDepartments(deptData);
        setTimeSlots(Array.isArray(slotsData) ? slotsData : []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [doctorId]);

  const handleEditClick = () => {
    setEditData({
      DocName: doctorInfo.DocName,
      Degree: doctorInfo.Degree,
      Specialization: doctorInfo.Specialization,
      Rating: doctorInfo.Rating,
      Fees: doctorInfo.Fees,
      Utilities: doctorInfo.Utilities,
      Experience: doctorInfo.Experience,
      Presence: doctorInfo.Presence,
      DocPFP: doctorInfo.DocPFP,
      DeptID: doctorInfo.DeptID,
      DocCity: doctorInfo.City,
      DocCountry: doctorInfo.Country
    });
    setEditModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctors/updateDoctorInfo', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          DocID: doctorId,
          ...editData
        })
      });

      if (!response.ok) {
        throw new Error('Update failed');
      }

      const updatedResponse = await fetch(
        `http://localhost:5000/api/doctors/doctorInfo?DocID=${doctorId}`
      );
      const updatedData = await updatedResponse.json();
      setDoctorInfo(updatedData);
      setEditModalOpen(false);
    } catch (error) {
      console.error('Error updating doctor info:', error);
      setError('Failed to update information. Please try again.');
    }
  };

  const handleAddTimeSlot = async () => {
    if (!newTimeSlot) {
      setError('Please enter a time slot');
      return;
    }

    if (!/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]-([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newTimeSlot)) {
      setError('Please enter time slot in HH:MM-HH:MM format (e.g., 09:00-09:30)');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/appointments/addTimeSlot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          DocID: doctorId,
          TimeSlot: newTimeSlot
        })
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add time slot');
      }

      const slotsRes = await fetch(`http://localhost:5000/api/appointments/availableSlots?DocID=${doctorId}`);
      const slotsData = await slotsRes.json();
      setTimeSlots(Array.isArray(slotsData) ? slotsData : []);

      setSuccessMessage('Time slot added successfully!');
      setNewTimeSlot('');
      setTimeout(() => {
        setSuccessMessage('');
      }, 2000);
    } catch (error) {
      console.error('Error adding time slot:', error);
      setError(error.message);
    }
  };

  const handleDeleteTimeSlot = async (slotId, DoctorID) => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/deleteTimeSlot', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SlotID: slotId,
          DocID: DoctorID
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete time slot');
      }

      const slotsRes = await fetch(`http://localhost:5000/api/appointments/availableSlots?DocID=${doctorId}`);
      const slotsData = await slotsRes.json();
      setTimeSlots(Array.isArray(slotsData) ? slotsData : []);

      setSuccessMessage('Time slot deleted successfully!');
      setTimeout(() => {
        setSuccessMessage('');
        navigate('/doctor-dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error deleting time slot:', error);
      setError(error.message);
    }
  };

  const handleBackClick = () => {
    navigate('/doctorhome');
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure you want to delete your account? This action is irreversible.')) return;
    try {
      const response = await fetch('http://localhost:5000/api/auth/deleteUser', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userType: 'doctor',
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

  if (loading) {
    return (
      <div style={{ 
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '5px solid #4e73df',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
      </div>
    );
  }

  if (!doctorInfo) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        color: '#e53e3e',
        backgroundColor: '#fff5f5',
        borderRadius: '8px',
        maxWidth: '800px',
        margin: '40px auto'
      }}>
        {error || 'Failed to load doctor information'}
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      fontFamily: "'Inter', sans-serif"
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '20px 40px'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <button
              onClick={handleBackClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#ebf8ff',
                color: '#3182ce',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '14px'
              }}
            >
              <FaArrowLeft /> Back
            </button>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#4e73df',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              <FaUserMd />
            </div>
            <h1 style={{
              margin: 0,
              fontSize: '22px',
              fontWeight: '700',
              color: '#2d3748',
              letterSpacing: '-0.5px'
            }}>Doctor Dashboard</h1>
          </div>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px'
          }}>
            <button
              onClick={() => setTimeSlotModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#9f7aea',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '14px'
              }}
            >
              <FaCalendarAlt /> Add Time Slot
            </button>
            <button
              onClick={handleEditClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#38a169',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '14px'
              }}
            >
              <FaEdit /> Edit Profile
            </button>
            <button
              onClick={handleDeleteAccount}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#e53e3e',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '14px'
              }}
            >
              <FaTrash /> Delete Account
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '30px 40px'
      }}>
        {/* Welcome Section */}
        <section style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px 30px',
          marginBottom: '30px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
          borderLeft: '4px solid #4e73df'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{ position: 'relative' }}>
              <div style={{
                width: '80px',
                height: '80px',
                backgroundColor: '#4e73df',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '32px',
                fontWeight: 'bold'
              }}>
                {doctorInfo.DocName.charAt(0).toUpperCase()}
              </div>
              <div style={{
                position: 'absolute',
                bottom: '5px',
                right: '5px',
                width: '20px',
                height: '20px',
                backgroundColor: doctorInfo.Presence ? '#48bb78' : '#e53e3e',
                borderRadius: '50%',
                border: '2px solid white'
              }}></div>
            </div>
            <div>
              <h2 style={{
                margin: '0 0 5px',
                fontSize: '24px',
                fontWeight: '700',
                color: '#2d3748'
              }}>Dr. {doctorInfo.DocName}</h2>
              <p style={{
                margin: '0 0 10px',
                color: '#718096',
                fontSize: '16px',
                fontStyle: 'italic'
              }}>{doctorInfo.Specialization}</p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#d69e2e'
                }}>
                  <FaStar />
                  <span>{doctorInfo.Rating}/5</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#38a169'
                }}>
                  <FaMoneyBillWave />
                  <span>${doctorInfo.Fees} consultation</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#4a5568'
                }}>
                  <FaBriefcaseMedical />
                  <span>{doctorInfo.Experience} years experience</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Profile Details Section */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Professional Information */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)'
          }}>
            <h3 style={{
              margin: '0 0 20px',
              fontSize: '18px',
              fontWeight: '600',
              color: '#4a5568',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FaUserMd /> Professional Information
            </h3>
            <DetailItem icon={<FaUniversity />} label="Degree" value={doctorInfo.Degree} />
            <DetailItem icon={<FaBriefcaseMedical />} label="Department" value={doctorInfo.DeptName} />
            <DetailItem icon={<FaStar />} label="Experience" value={`${doctorInfo.Experience} years`} />
            {doctorInfo.Utilities && (
              <DetailItem icon={<FaBriefcaseMedical />} label="Services" value={doctorInfo.Utilities} />
            )}
          </div>

          {/* Contact Information */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)'
          }}>
            <h3 style={{
              margin: '0 0 20px',
              fontSize: '18px',
              fontWeight: '600',
              color: '#4a5568',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FaEnvelope /> Contact Information
            </h3>
            <DetailItem icon={<FaEnvelope />} label="Email" value={doctorInfo.DocEmail} />
            <DetailItem icon={<FaMapMarkerAlt />} label="Location" value={`${doctorInfo.City}, ${doctorInfo.Country}`} />
          </div>

          {/* Availability Information */}
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)'
          }}>
            <h3 style={{
              margin: '0 0 20px',
              fontSize: '18px',
              fontWeight: '600',
              color: '#4a5568',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <FaCalendarAlt /> Availability
            </h3>
            <DetailItem 
              icon={<FaCalendarAlt />} 
              label="Status" 
              value={doctorInfo.Presence ? 'Available' : 'Not Available'} 
              color={doctorInfo.Presence ? '#38a169' : '#e53e3e'}
            />
            <DetailItem icon={<FaMoneyBillWave />} label="Consultation Fee" value={`$${doctorInfo.Fees}`} />
          </div>
        </section>

        {/* Time Slots Section */}
        <section style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '25px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
          marginBottom: '30px'
        }}>
          <h3 style={{
            margin: '0 0 20px',
            fontSize: '20px',
            fontWeight: '600',
            color: '#2d3748',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <FaCalendarAlt /> Your Time Slots
          </h3>
          
          {timeSlots.length === 0 ? (
            <p style={{
              color: '#718096',
              fontStyle: 'italic',
              textAlign: 'center',
              padding: '20px'
            }}>No time slots added yet</p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              {timeSlots.map(slot => (
                <div key={slot.TimeSlotID} style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  padding: '15px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  border: '1px solid #e2e8f0'
                }}>
                  <span style={{
                    fontWeight: '500',
                    color: '#2d3748'
                  }}>{slot.TimeSlot}</span>
                  <button 
                    onClick={() => handleDeleteTimeSlot(slot.SlotID, doctorId)}
                    style={{
                      backgroundColor: '#fff5f5',
                      color: '#e53e3e',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '14px'
                    }}
                  >
                    <FaTrash size={12} /> Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        style={{
          content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            maxWidth: '90%',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: 'none'
          },
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)'
          }
        }}
      >
        <h2 style={{ 
          margin: '0 0 20px',
          fontSize: '22px',
          fontWeight: '700',
          color: '#2d3748',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FaEdit /> Edit Doctor Information
        </h2>
        
        {error && (
          <div style={{
            backgroundColor: '#fff5f5',
            color: '#e53e3e',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            borderLeft: '4px solid #e53e3e'
          }}>
            {error}
          </div>
        )}

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}>
          <FormGroup 
            label="Full Name" 
            value={editData.DocName || ''} 
            onChange={(e) => setEditData({...editData, DocName: e.target.value})}
          />
          <FormGroup 
            label="Degree" 
            value={editData.Degree || ''} 
            onChange={(e) => setEditData({...editData, Degree: e.target.value})}
          />
          <FormGroup 
            label="Specialization" 
            value={editData.Specialization || ''} 
            onChange={(e) => setEditData({...editData, Specialization: e.target.value})}
          />
          <FormGroup 
            label="City" 
            value={editData.DocCity || ''} 
            onChange={(e) => setEditData({...editData, DocCity: e.target.value})}
          />
          <FormGroup 
            label="Country" 
            value={editData.DocCountry || ''} 
            onChange={(e) => setEditData({...editData, DocCountry: e.target.value})}
          />
          <FormGroup 
            label="Rating" 
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={editData.Rating || ''} 
            onChange={(e) => setEditData({...editData, Rating: parseFloat(e.target.value)})}
          />
          <FormGroup 
            label="Consultation Fee ($)" 
            type="number"
            min="0"
            value={editData.Fees || ''} 
            onChange={(e) => setEditData({...editData, Fees: parseFloat(e.target.value)})}
          />
          <FormGroup 
            label="Experience (years)" 
            type="number"
            min="0"
            value={editData.Experience || ''} 
            onChange={(e) => setEditData({...editData, Experience: parseInt(e.target.value)})}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#4a5568'
          }}>Department</label>
          <select
            value={editData.DeptID || ''}
            onChange={(e) => setEditData({...editData, DeptID: parseInt(e.target.value)})}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: 'white',
              fontSize: '14px'
            }}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.DeptID} value={dept.DeptID}>
                {dept.DeptName}
              </option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#4a5568'
          }}>Availability</label>
          <select
            value={editData.Presence ? 'true' : 'false'}
            onChange={(e) => setEditData({...editData, Presence: e.target.value === 'true'})}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: 'white',
              fontSize: '14px'
            }}
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            fontWeight: '600',
            color: '#4a5568'
          }}>Services/Utilities</label>
          <textarea
            value={editData.Utilities || ''}
            onChange={(e) => setEditData({...editData, Utilities: e.target.value})}
            style={{
              width: '100%',
              padding: '10px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              minHeight: '100px',
              resize: 'vertical',
              fontSize: '14px'
            }}
          />
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '15px'
        }}>
          <button
            onClick={() => setEditModalOpen(false)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e2e8f0',
              color: '#4a5568',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            style={{
              padding: '10px 20px',
              backgroundColor: '#4e73df',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Save Changes
          </button>
        </div>
      </Modal>

      {/* Add Time Slot Modal */}
      <Modal
        isOpen={timeSlotModalOpen}
        onRequestClose={() => {
          setTimeSlotModalOpen(false);
          setError('');
          setSuccessMessage('');
        }}
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
            padding: '30px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: 'none'
          },
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)'
          }
        }}
      >
        <h2 style={{ 
          margin: '0 0 20px',
          fontSize: '22px',
          fontWeight: '700',
          color: '#2d3748',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <FaCalendarAlt /> Add New Time Slot
        </h2>
        
        {error && (
          <div style={{
            backgroundColor: '#fff5f5',
            color: '#e53e3e',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            borderLeft: '4px solid #e53e3e'
          }}>
            {error}
          </div>
        )}

        {successMessage && (
          <div style={{
            backgroundColor: '#f0fff4',
            color: '#38a169',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            borderLeft: '4px solid #38a169'
          }}>
            {successMessage}
          </div>
        )}

        <FormGroup 
          label="Time Slot (e.g., 09:00-09:30)" 
          placeholder="HH:MM-HH:MM"
          value={newTimeSlot}
          onChange={(e) => setNewTimeSlot(e.target.value)}
        />
        <p style={{
          color: '#718096',
          fontSize: '13px',
          margin: '-10px 0 20px'
        }}>Enter time in 24-hour format (e.g., 13:30-14:00)</p>

        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '15px'
        }}>
          <button
            onClick={() => {
              setTimeSlotModalOpen(false);
              setError('');
              setSuccessMessage('');
              setNewTimeSlot('');
            }}
            style={{
              padding: '10px 20px',
              backgroundColor: '#e2e8f0',
              color: '#4a5568',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAddTimeSlot}
            style={{
              padding: '10px 20px',
              backgroundColor: '#9f7aea',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            Add Slot
          </button>
        </div>
      </Modal>
    </div>
  );
};

// Reusable DetailItem component
const DetailItem = ({ icon, label, value, color = '#2d3748' }) => (
  <div style={{
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '15px'
  }}>
    <div style={{
      width: '32px',
      height: '32px',
      backgroundColor: '#ebf4ff',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#4e73df',
      flexShrink: 0
    }}>
      {icon}
    </div>
    <div>
      <p style={{
        margin: '0 0 4px',
        color: '#718096',
        fontSize: '14px',
        fontWeight: '500'
      }}>{label}</p>
      <p style={{
        margin: 0,
        color: color,
        fontSize: '16px',
        fontWeight: '600'
      }}>{value}</p>
    </div>
  </div>
);

// Reusable FormGroup component
const FormGroup = ({ label, type = 'text', value, onChange, placeholder, ...props }) => (
  <div style={{ marginBottom: '20px' }}>
    <label style={{
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#4a5568'
    }}>{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        backgroundColor: 'white',
        fontSize: '14px'
      }}
      {...props}
    />
  </div>
);

export default DoctorDashboard;