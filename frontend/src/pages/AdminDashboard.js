import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaChartLine, FaUserMd, FaCalendarAlt, FaFlask, FaCog } from 'react-icons/fa';
const AdminDashboard = () => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/Admin/adminprofile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                
                if (!response.ok) throw new Error('Failed to fetch profile');
                
                const data = await response.json();
                setAdminData(data);
            } catch (error) {
                console.error('Error:', error);
                navigate('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminProfile();
    }, [navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-blue-800 flex items-center">
                        <FaUserShield className="mr-2" /> Schedulify Admin
                    </h1>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                            <img 
                                src={adminData.AdminPFP || '/default-admin.png'} 
                                alt="Admin" 
                                className="h-8 w-8 rounded-full"
                            />
                            <span className="ml-2 text-gray-700">{adminData.AdminName}</span>
                        </div>
                        <button 
                            onClick={() => {
                                localStorage.removeItem('adminToken');
                                navigate('/admin/login');
                            }}
                            className="text-sm text-red-600 hover:text-red-800"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow p-4">
                            <div className="text-center mb-6">
                                <img 
                                    src={adminData.AdminPFP || '/default-admin.png'} 
                                    alt="Admin" 
                                    className="h-24 w-24 rounded-full mx-auto mb-3"
                                />
                                <h2 className="text-lg font-semibold text-gray-800">{adminData.AdminName}</h2>
                                <p className="text-sm text-gray-500">{adminData.AdminEmail}</p>
                                <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                    {adminData.IsSuperAdmin ? 'Super Admin' : 'Admin'}
                                </span>
                            </div>

                            <nav className="space-y-1">
                                <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-white bg-blue-600">
                                    <FaChartLine className="mr-2" /> Dashboard
                                </button>
                                <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                                    <FaUserMd className="mr-2" /> Doctors
                                </button>
                                <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                                    <FaCalendarAlt className="mr-2" /> Appointments
                                </button>
                                <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                                    <FaFlask className="mr-2" /> Lab Tests
                                </button>
                                <button className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-100">
                                    <FaCog className="mr-2" /> Settings
                                </button>
                            </nav>
                        </div>
                    </div>

                    {/* Dashboard Content */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-200">
                                <h3 className="text-lg font-medium text-gray-900">Admin Dashboard</h3>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    {/* Stats Cards */}
                                    <div className="bg-blue-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-blue-800">Total Doctors</h4>
                                        <p className="mt-1 text-3xl font-semibold text-blue-600">42</p>
                                    </div>
                                    <div className="bg-green-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-green-800">Today's Appointments</h4>
                                        <p className="mt-1 text-3xl font-semibold text-green-600">127</p>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-purple-800">Pending Approvals</h4>
                                        <p className="mt-1 text-3xl font-semibold text-purple-600">8</p>
                                    </div>
                                </div>

                                {/* Recent Activity */}
                                <div>
                                    <h4 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h4>
                                    <div className="space-y-4">
                                        {[1, 2, 3].map((item) => (
                                            <div key={item} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                                                <p className="text-sm text-gray-600">New doctor registration approved</p>
                                                <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 mt-8">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} Schedulify Admin Portal. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default AdminDashboard;