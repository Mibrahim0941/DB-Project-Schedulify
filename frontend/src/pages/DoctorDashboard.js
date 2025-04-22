import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';

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

      // Refresh doctor info
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

    // Validate time slot format (HH:MM-HH:MM)
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

      // Refresh time slots
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

  const handleDeleteTimeSlot = async (slotId) => {
    try {
      const response = await fetch('http://localhost:5000/api/appointments/deleteTimeSlot', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          SlotID: slotId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to delete time slot');
      }

      // Refresh time slots
      const slotsRes = await fetch(`http://localhost:5000/api/appointments/availableSlots?DocID=${doctorId}`);
      const slotsData = await slotsRes.json();
      setTimeSlots(Array.isArray(slotsData) ? slotsData : []);

      setSuccessMessage('Time slot deleted successfully!');
      setTimeout(() => {
        setSuccessMessage('');
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
      console.log(localStorage.getItem('userId'));
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
    return <div className="loading">Loading doctor information...</div>;
  }

  if (!doctorInfo) {
    return <div className="error">{error || 'Failed to load doctor information'}</div>;
  }

  return (
    <div className="doctor-dashboard">
      <header className="header">
        <h1>Doctor Dashboard</h1>
        <div>
          <button className="edit-button" onClick={handleEditClick}>
            Edit Profile
          </button>
          <button 
            className="time-slot-button"
            onClick={() => setTimeSlotModalOpen(true)}
          >
            Add Time Slot
          </button>
          
          <button
            className="delete-account-button"
            onClick={handleDeleteAccount}
            //style={{ backgroundColor: '#e74c3c', color: 'white', marginLeft: '10px' }}
          >
            Delete Account
          </button>

          <button className="back-button" onClick={handleBackClick}>
            Back to Appointments
          </button>
        </div>
      </header>

      <main className="main-content">
        <div className="profile-section">
          <div className="profile-header">
            <div className="avatar">
              {doctorInfo.DocName.charAt(0).toUpperCase()}
            </div>
            <h2>Dr. {doctorInfo.DocName}</h2>
            <p className="specialization">{doctorInfo.Specialization}</p>
          </div>

          <div className="profile-details">
            <div className="detail-card">
              <h3>Professional Information</h3>
              <div className="detail-item">
                <span className="label">Degree:</span>
                <span>{doctorInfo.Degree}</span>
              </div>
              <div className="detail-item">
                <span className="label">Department:</span>
                <span>{doctorInfo.DeptName}</span>
              </div>
              <div className="detail-item">
                <span className="label">Experience:</span>
                <span>{doctorInfo.Experience} years</span>
              </div>
              <div className="detail-item">
                <span className="label">Rating:</span>
                <span>{doctorInfo.Rating}/5</span>
              </div>
            </div>

            <div className="detail-card">
              <h3>Contact Information</h3>
              <div className="detail-item">
                <span className="label">Email:</span>
                <span>{doctorInfo.DocEmail}</span>
              </div>
              <div className="detail-item">
                <span className="label">Location:</span>
                <span>{doctorInfo.City}, {doctorInfo.Country}</span>
              </div>
            </div>

            <div className="detail-card">
              <h3>Practice Information</h3>
              <div className="detail-item">
                <span className="label">Consultation Fee:</span>
                <span>${doctorInfo.Fees}</span>
              </div>
              <div className="detail-item">
                <span className="label">Availability:</span>
                <span>{doctorInfo.Presence ? 'Available' : 'Not Available'}</span>
              </div>
              {doctorInfo.Utilities && (
                <div className="detail-item">
                  <span className="label">Services:</span>
                  <span>{doctorInfo.Utilities}</span>
                </div>
              )}
            </div>
          </div>

          {/* Time Slots Section */}
          <div className="time-slots-section">
            <h3>Your Time Slots</h3>
            {timeSlots.length === 0 ? (
              <p className="no-slots">No time slots added yet</p>
            ) : (
              <div className="time-slots-grid">
                {timeSlots.map(slot => (
                  <div key={slot.TimeSlotID} className="time-slot-card">
                    <span className="slot-time">{slot.TimeSlot}</span>
                    <button 
                      className="delete-slot-button"
                      onClick={() => handleDeleteTimeSlot(slot.TimeSlotID)}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
            width: '500px',
            maxWidth: '90%',
            borderRadius: '8px',
            padding: '25px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
          },
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)'
          }
        }}
      >
        <h2 style={{ marginTop: 0 }}>Edit Doctor Information</h2>
        
        {error && <div className="error-message">{error}</div>}

        <div className="form-group">
          <label>Full Name:</label>
          <input
            type="text"
            value={editData.DocName || ''}
            onChange={(e) => setEditData({...editData, DocName: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Degree:</label>
          <input
            type="text"
            value={editData.Degree || ''}
            onChange={(e) => setEditData({...editData, Degree: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Specialization:</label>
          <input
            type="text"
            value={editData.Specialization || ''}
            onChange={(e) => setEditData({...editData, Specialization: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Department:</label>
          <select
            value={editData.DeptID || ''}
            onChange={(e) => setEditData({...editData, DeptID: parseInt(e.target.value)})}
          >
            <option value="">Select Department</option>
            {departments.map(dept => (
              <option key={dept.DeptID} value={dept.DeptID}>
                {dept.DeptName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Rating:</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={editData.Rating || ''}
            onChange={(e) => setEditData({...editData, Rating: parseFloat(e.target.value)})}
          />
        </div>

        <div className="form-group">
          <label>Consultation Fee ($):</label>
          <input
            type="number"
            min="0"
            value={editData.Fees || ''}
            onChange={(e) => setEditData({...editData, Fees: parseFloat(e.target.value)})}
          />
        </div>

        <div className="form-group">
          <label>Experience (years):</label>
          <input
            type="number"
            min="0"
            value={editData.Experience || ''}
            onChange={(e) => setEditData({...editData, Experience: parseInt(e.target.value)})}
          />
        </div>

        <div className="form-group">
          <label>Availability:</label>
          <select
            value={editData.Presence ? 'true' : 'false'}
            onChange={(e) => setEditData({...editData, Presence: e.target.value === 'true'})}
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
        </div>

        <div className="form-group">
          <label>City:</label>
          <input
            type="text"
            value={editData.DocCity || ''}
            onChange={(e) => setEditData({...editData, DocCity: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Country:</label>
          <input
            type="text"
            value={editData.DocCountry || ''}
            onChange={(e) => setEditData({...editData, DocCountry: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Services/Utilities:</label>
          <textarea
            value={editData.Utilities || ''}
            onChange={(e) => setEditData({...editData, Utilities: e.target.value})}
          />
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={() => setEditModalOpen(false)}>
            Cancel
          </button>
          <button className="save-button" onClick={handleUpdate}>
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
            borderRadius: '8px',
            padding: '25px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
          },
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)'
          }
        }}
      >
        <h2 style={{ marginTop: 0 }}>Add New Time Slot</h2>
        
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <div className="form-group">
          <label>Time Slot (e.g., 09:00-09:30):</label>
          <input
            type="text"
            placeholder="HH:MM-HH:MM"
            value={newTimeSlot}
            onChange={(e) => setNewTimeSlot(e.target.value)}
          />
          <p className="hint">Enter time in 24-hour format (e.g., 13:30-14:00)</p>
        </div>

        <div className="modal-actions">
          <button className="cancel-button" onClick={() => {
            setTimeSlotModalOpen(false);
            setError('');
            setSuccessMessage('');
            setNewTimeSlot('');
          }}>
            Cancel
          </button>
          <button className="save-button" onClick={handleAddTimeSlot}>
            Add Slot
          </button>
        </div>
      </Modal>

      <style jsx>{`
      .delete-account-button {
          background: #e74c3c;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-left: 10px;
      }
        .doctor-dashboard {
          font-family: Arial, sans-serif;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          padding-bottom: 15px;
          border-bottom: 1px solid #eee;
        }
        .header h1 {
          color: #2c3e50;
          margin: 0;
        }
        .back-button, .edit-button, .time-slot-button {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-left: 10px;
        }
        .back-button {
          background-color: #3498db;
          color: white;
        }
        .edit-button {
          background-color: #2ecc71;
          color: white;
        }
        .time-slot-button {
          background-color: #9b59b6;
          color: white;
        }
          .delete-slot-button {
          background: #e74c3c;
          color: white;
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
          margin-left: 10px;
        }
        .profile-section {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 30px;
        }
        .profile-header {
          text-align: center;
          margin-bottom: 30px;
        }
        .avatar {
          width: 80px;
          height: 80px;
          background-color: #3498db;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-weight: bold;
          margin: 0 auto 15px;
        }
        .profile-header h2 {
          color: #2c3e50;
          margin: 0;
        }
        .specialization {
          color: #7f8c8d;
          font-style: italic;
          margin: 5px 0 0;
        }
        .profile-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }
        .detail-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 20px;
        }
        .detail-card h3 {
          color: #2c3e50;
          margin-top: 0;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #ddd;
        }
        .detail-item {
          margin-bottom: 10px;
        }
        .label {
          font-weight: bold;
          color: #7f8c8d;
          margin-right: 5px;
        }
        .loading, .error {
          text-align: center;
          padding: 40px;
          color: #7f8c8d;
        }
        .error-message {
          color: #e74c3c;
          background: #fadbd8;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .success-message {
          color: #27ae60;
          background: #d5f5e3;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }
        .form-group {
          margin-bottom: 15px;
        }
        .form-group label {
          display: block;
          margin-bottom: 5px;
          font-weight: bold;
          color: #2c3e50;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
          box-sizing: border-box;
        }
        .form-group textarea {
          height: 80px;
          resize: vertical;
        }
        .form-group .hint {
          font-size: 12px;
          color: #7f8c8d;
          margin-top: 5px;
        }
        .modal-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 20px;
          gap: 10px;
        }
        .cancel-button {
          padding: 8px 16px;
          background: #e0e0e0;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .save-button {
          padding: 8px 16px;
          background: #2ecc71;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .time-slots-section {
          margin-top: 30px;
        }
        .time-slots-section h3 {
          color: #2c3e50;
          margin-bottom: 15px;
        }
        .no-slots {
          color: #7f8c8d;
          font-style: italic;
        }
        .time-slots-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 15px;
        }
        .time-slot-card {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 15px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .slot-time {
          font-weight: 500;
        }
        
      `}</style>
    </div>
  );
};

export default DoctorDashboard;