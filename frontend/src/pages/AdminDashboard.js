import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserShield, FaUserMd, FaFlask, FaMoneyBillWave, FaUserCog, FaHospital, FaSignOutAlt, FaChartLine } from 'react-icons/fa';

const AdminDashboard = () => {
    const [adminData, setAdminData] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAdminProfile = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/admin/adminprofile', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });

                if (!response.ok) throw new Error('Failed to fetch profile');
                
                const data = await response.json();
                setAdminData(data);
            } catch (error) {
                console.error('Error:', error);
                navigate('/admin');
            } finally {
                setLoading(false);
            }
        };

        fetchAdminProfile();
    }, [navigate]);

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
                            <FaUserShield />
                        </div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '22px',
                            fontWeight: '700',
                            color: '#2d3748',
                            letterSpacing: '-0.5px'
                        }}>Schedulify Admin Portal</h1>
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            backgroundColor: '#edf2f7',
                            padding: '8px 15px',
                            borderRadius: '50px',
                            cursor: 'pointer'
                        }}>
                            <img 
                                src={adminData.AdminPFP || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
                                alt="Admin" 
                                style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '2px solid white'
                                }}
                            />
                            <span style={{
                                fontWeight: '600',
                                color: '#2d3748',
                                fontSize: '14px'
                            }}>{adminData.AdminName}</span>
                        </div>
                        <button
                            onClick={() => {
                                localStorage.removeItem('adminToken');
                                navigate('/admin');
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                backgroundColor: '#fff5f5',
                                color: '#e53e3e',
                                border: 'none',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                        >
                            <FaSignOutAlt /> Logout
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
                    <h2 style={{
                        margin: '0 0 10px',
                        fontSize: '24px',
                        fontWeight: '700',
                        color: '#2d3748'
                    }}>Welcome back, {adminData.AdminName}!</h2>
                    <p style={{
                        margin: 0,
                        color: '#718096',
                        fontSize: '15px'
                    }}>You have full administrative control over the Schedulify platform.</p>
                </section>

                {/* Profile Section */}
                <section style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    marginBottom: '30px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)'
                }}>
                    <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '15px 25px',
                        borderBottom: '1px solid #edf2f7'
                    }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#4a5568'
                        }}>Admin Profile</h3>
                    </div>
                    <div style={{
                        padding: '25px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '25px'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '25px',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{ position: 'relative' }}>
                                <img 
                                    src={adminData.AdminPFP || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'} 
                                    alt="Admin" 
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        borderRadius: '50%',
                                        objectFit: 'cover',
                                        border: '4px solid #edf2f7',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
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
                                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                                gap: '20px',
                                flex: 1
                            }}>
                                <ProfileInfoItem label="Full Name" value={adminData.AdminName} icon={<FaUserShield />} />
                                <ProfileInfoItem label="Email" value={adminData.AdminEmail} icon={<FaUserCog />} />
                                <ProfileInfoItem label="Role" value={adminData.IsSuperAdmin ? 'Super Administrator' : 'Administrator'} icon={<FaUserShield />} />
                                <ProfileInfoItem label="Last Login" value={new Date().toLocaleString()} icon={<FaChartLine />} />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Action Buttons */}
                <section>
                    <div style={{
                        backgroundColor: '#f8fafc',
                        padding: '15px 25px',
                        marginBottom: '20px',
                        borderRadius: '12px 12px 0 0',
                        borderBottom: '1px solid #edf2f7'
                    }}>
                        <h3 style={{
                            margin: 0,
                            fontSize: '18px',
                            fontWeight: '600',
                            color: '#4a5568'
                        }}>Administrative Actions</h3>
                    </div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '20px'
                    }}>
                        {/* Manage Departments */}
                        <ActionCard 
                            icon={<FaHospital />} 
                            title="Manage Departments" 
                            desc="Add, edit, and organize medical departments" 
                            color="#4e73df" 
                            onClick={() => navigate('/admin/departments')}
                        />
                        {/* Manage Laboratory */}
                        <ActionCard 
                            icon={<FaFlask />} 
                            title="Manage Laboratory" 
                            desc="Configure lab tests and equipment" 
                            color="#38a169" 
                            onClick={() => navigate('/admin/laboratory')}
                        />
                        {/* Manage Doctors */}
                        <ActionCard 
                            icon={<FaUserMd />} 
                            title="Manage Doctors" 
                            desc="View and manage all doctors" 
                            color="#9f7aea" 
                            onClick={() => navigate('/admin/Doctor')}
                        />
                        {/* Manage Revenue */}
                        <ActionCard 
                            icon={<FaMoneyBillWave />} 
                            title="Manage Revenue" 
                            desc="View financial reports and analytics" 
                            color="#805ad5" 
                            onClick={() => navigate('/admin/Revenue')}
                        />
                        {/* New: Manage Patients */}
                        <ActionCard 
                            icon={<FaUserShield />} 
                            title="Manage Patients" 
                            desc="View and manage all patient records" 
                            color="#4299e1" 
                            onClick={() => navigate('/admin/Patient')}
                        />
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer style={{
                backgroundColor: 'white',
                borderTop: '1px solid #e2e8f0',
                padding: '20px 40px',
                marginTop: '40px'
            }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    textAlign: 'center',
                    color: '#718096',
                    fontSize: '14px'
                }}>
                    © {new Date().getFullYear()} Schedulify Admin Portal. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

const ProfileInfoItem = ({ label, value, icon }) => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
    }}>
        <div style={{
            width: '40px',
            height: '40px',
            backgroundColor: '#ebf4ff',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#4e73df'
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
                color: '#2d3748',
                fontSize: '16px',
                fontWeight: '600'
            }}>{value}</p>
        </div>
    </div>
);

const ActionCard = ({ icon, title, desc, color, onClick }) => (
    <div onClick={onClick} style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '25px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        textAlign: 'center'
    }}>
        <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: `${color}20`,
            borderRadius: '15px',
            margin: '0 auto 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color
        }}>
            {icon}
        </div>
        <h3 style={{
            margin: '0 0 8px',
            fontSize: '18px',
            fontWeight: '700',
            color: '#2d3748'
        }}>{title}</h3>
        <p style={{
            margin: 0,
            color: '#718096',
            fontSize: '14px',
            lineHeight: '1.5'
        }}>{desc}</p>
    </div>
);

export default AdminDashboard;