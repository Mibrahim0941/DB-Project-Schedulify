import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { 
  FaUserShield, FaUserMd, FaHospital, FaFlask, 
  FaCalendarAlt, FaCog, FaPlus, FaTrash, FaEdit 
} from 'react-icons/fa';

// Set app element for accessibility
Modal.setAppElement('#root');

const AdminDashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const [stats, setStats] = useState({
    doctors: 0,
    departments: 0,
    labTests: 0,
    appointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [showLabTestModal, setShowLabTestModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [newLabTest, setNewLabTest] = useState({
    testName: '',
    price: '',
    description: ''
  });
  const [newDepartment, setNewDepartment] = useState({
    deptName: '',
    description: ''
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch admin profile
        const profileResponse = await fetch('http://localhost:5000/api/admin/adminprofile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        if (!profileResponse.ok) throw new Error('Failed to fetch profile');
        
        const profileData = await profileResponse.json();
        setAdminData(profileData);

        // Fetch statistics
        const [doctorsRes, deptRes, labRes, appointmentsRes] = await Promise.all([
          fetch('http://localhost:5000/api/doctors/countdoctors'),
          fetch('http://localhost:5000/api/departments/countdepartments'),
          fetch('http://localhost:5000/api/labtests/countlabtests'),
          fetch('http://localhost:5000/api/appointments/count')
        ]);

        const [doctors, departments, labTests, appointments] = await Promise.all([
          doctorsRes.json(),
          deptRes.json(),
          labRes.json(),
          appointmentsRes.json()
        ]);

        setStats({
          doctors: doctors.count,
          departments: departments.count,
          labTests: labTests.count,
          appointments: appointments.count
        });

      } catch (error) {
        console.error('Error:', error);
        setError('Failed to load data. Please try again.');
        navigate('/admin');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleAddLabTest = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/labtests/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(newLabTest)
      });
      
      if (!response.ok) throw new Error('Failed to add lab test');
      
      const data = await response.json();
      setSuccessMessage('Lab test added successfully!');
      setShowLabTestModal(false);
      setStats(prev => ({...prev, labTests: prev.labTests + 1}));
      setNewLabTest({ testName: '', price: '', description: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add lab test');
    }
  };

  const handleAddDepartment = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/departments/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(newDepartment)
      });
      
      if (!response.ok) throw new Error('Failed to add department');
      
      const data = await response.json();
      setSuccessMessage('Department added successfully!');
      setShowDeptModal(false);
      setStats(prev => ({...prev, departments: prev.departments + 1}));
      setNewDepartment({ deptName: '', description: '' });
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to add department');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800 flex items-center">
            <FaUserShield className="mr-2" /> Admin Dashboard
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {adminData.AdminName.charAt(0).toUpperCase()}
              </div>
              <span className="ml-2 font-medium">{adminData.AdminName}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden sticky top-20">
              <div className="p-6 text-center border-b">
                <div className="mx-auto h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600 mb-4">
                  {adminData.AdminName.charAt(0).toUpperCase()}
                </div>
                <h2 className="text-lg font-bold text-gray-800">{adminData.AdminName}</h2>
                <p className="text-sm text-gray-500">{adminData.AdminEmail}</p>
                <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {adminData.IsSuperAdmin ? 'Super Admin' : 'Admin'}
                </span>
              </div>
              
              <nav className="p-4 space-y-2">
                <button className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600">
                  <FaUserShield className="mr-2" /> Dashboard
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                  <FaUserMd className="mr-2" /> Doctors
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                  <FaHospital className="mr-2" /> Departments
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                  <FaFlask className="mr-2" /> Lab Tests
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                  <FaCalendarAlt className="mr-2" /> Appointments
                </button>
                <button className="w-full flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
                  <FaCog className="mr-2" /> Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Dashboard Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Total Doctors</h4>
                    <p className="mt-1 text-3xl font-semibold text-blue-600">{stats.doctors}</p>
                  </div>
                  <FaUserMd className="text-blue-400 text-2xl" />
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-green-800">Departments</h4>
                    <p className="mt-1 text-3xl font-semibold text-green-600">{stats.departments}</p>
                  </div>
                  <FaHospital className="text-green-400 text-2xl" />
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-purple-800">Lab Tests</h4>
                    <p className="mt-1 text-3xl font-semibold text-purple-600">{stats.labTests}</p>
                  </div>
                  <FaFlask className="text-purple-400 text-2xl" />
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 shadow hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-medium text-yellow-800">Appointments</h4>
                    <p className="mt-1 text-3xl font-semibold text-yellow-600">{stats.appointments}</p>
                  </div>
                  <FaCalendarAlt className="text-yellow-400 text-2xl" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => setShowLabTestModal(true)}
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <FaPlus className="mr-2" /> Add Lab Test
                </button>
                <button 
                  onClick={() => setShowDeptModal(true)}
                  className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <FaPlus className="mr-2" /> Add Department
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {[
                    { id: 1, action: 'Added new department "Neurology"', time: '2 hours ago' },
                    { id: 2, action: 'Updated lab test pricing', time: '1 day ago' },
                    { id: 3, action: 'Approved new doctor registration', time: '2 days ago' }
                  ].map(activity => (
                    <div key={activity.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                      <p className="text-sm text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Lab Test Modal */}
      <Modal
        isOpen={showLabTestModal}
        onRequestClose={() => setShowLabTestModal(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Add New Lab Test</h3>
            <button 
              onClick={() => setShowLabTestModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleAddLabTest} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Test Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newLabTest.testName}
                onChange={(e) => setNewLabTest({...newLabTest, testName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={newLabTest.price}
                onChange={(e) => setNewLabTest({...newLabTest, price: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
                value={newLabTest.description}
                onChange={(e) => setNewLabTest({...newLabTest, description: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowLabTestModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Test
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Add Department Modal */}
      <Modal
        isOpen={showDeptModal}
        onRequestClose={() => setShowDeptModal(false)}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">Add New Department</h3>
            <button 
              onClick={() => setShowDeptModal(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
          </div>
          
          <form onSubmit={handleAddDepartment} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department Name</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                value={newDepartment.deptName}
                onChange={(e) => setNewDepartment({...newDepartment, deptName: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                rows="3"
                value={newDepartment.description}
                onChange={(e) => setNewDepartment({...newDepartment, description: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setShowDeptModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Department
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Global Styles */}
      <style jsx global>{`
        .modal {
          position: fixed;
          top: 50%;
          left: 50%;
          right: auto;
          bottom: auto;
          transform: translate(-50%, -50%);
          background: transparent;
          border: none;
          padding: 0;
          overflow: visible;
          max-height: 90vh;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          z-index: 1000;
        }
        
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;