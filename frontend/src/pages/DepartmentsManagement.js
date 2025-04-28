import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHospital, FaPlus, FaArrowLeft, FaUserMd } from 'react-icons/fa';

const DepartmentsManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [doctorCounts, setDoctorCounts] = useState({});
    const [newDepartment, setNewDepartment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch departments with doctor counts
                const response = await fetch('http://localhost:5000/api/departments/alldepartments', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                
                if (!response.ok) {
                    throw new Error('Failed to fetch departments');
                }
                
                const departmentsData = await response.json();
                
                // Create doctor counts map from the Doc_Count field
                const countsMap = {};
                departmentsData.forEach(dept => {
                    countsMap[dept.DeptID] = dept.Doc_Count || 0;
                });
                
                setDepartments(departmentsData);
                setDoctorCounts(countsMap);
                
            } catch (err) {
                setError(err.message);
                setTimeout(() => setError(''), 5000);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleAddDepartment = async () => {
        if (!newDepartment.trim()) {
            setError('Department name cannot be empty');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/departments/addDepartment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ DeptName: newDepartment })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add department');
            }

            const data = await response.json();
            setDepartments([...departments, data]);
            setNewDepartment('');
            setSuccess('Department added successfully');
            setTimeout(() => setSuccess(''), 3000);
            setError('');
        } catch (err) {
            setError(err.message);
            setTimeout(() => setError(''), 3000);
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
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
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
                            onClick={() => navigate('/Admin')}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#4e73df',
                                fontWeight: '600',
                                fontSize: '16px'
                            }}
                        >
                            <FaArrowLeft /> Back to Dashboard
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
                {/* Page Header */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '30px'
                }}>
                    <h1 style={{
                        margin: 0,
                        fontSize: '28px',
                        fontWeight: '700',
                        color: '#2d3748',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px'
                    }}>
                        <FaHospital style={{ color: '#4e73df' }} />
                        Manage Departments
                    </h1>
                </div>

                {/* Add Department Form */}
                <section style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '25px',
                    marginBottom: '30px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)'
                }}>
                    <h2 style={{
                        margin: '0 0 20px',
                        fontSize: '20px',
                        fontWeight: '600',
                        color: '#4a5568'
                    }}>Add New Department</h2>
                    
                    {error && (
                        <div style={{
                            backgroundColor: '#fff5f5',
                            color: '#e53e3e',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            border: '1px solid #fed7d7'
                        }}>
                            {error}
                        </div>
                    )}
                    
                    {success && (
                        <div style={{
                            backgroundColor: '#f0fff4',
                            color: '#38a169',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            border: '1px solid #c6f6d5'
                        }}>
                            {success}
                        </div>
                    )}

                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        flexWrap: 'wrap',
                        alignItems: 'flex-end'
                    }}>
                        <div style={{ flex: 1 }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                fontWeight: '500',
                                color: '#4a5568',
                                fontSize: '14px'
                            }}>
                                Department Name
                            </label>
                            <input
                                type="text"
                                value={newDepartment}
                                onChange={(e) => setNewDepartment(e.target.value)}
                                placeholder="Enter department name"
                                style={{
                                    width: '100%',
                                    padding: '12px 15px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '8px',
                                    fontSize: '15px',
                                    transition: 'all 0.3s'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#4e73df';
                                    e.target.style.outline = 'none';
                                    e.target.style.boxShadow = '0 0 0 3px rgba(78, 115, 223, 0.2)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#e2e8f0';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                        </div>
                        <button
                            onClick={handleAddDepartment}
                            style={{
                                backgroundColor: '#4e73df',
                                color: 'white',
                                border: 'none',
                                padding: '12px 24px',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.3s',
                                fontSize: '15px',
                                ':hover': {
                                    backgroundColor: '#3b5ab9'
                                }
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#3b5ab9';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = '#4e73df';
                            }}
                        >
                            <FaPlus /> Add Department
                        </button>
                    </div>
                </section>

                {/* Departments List */}
                <section style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    overflow: 'hidden',
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
                        }}>Existing Departments</h3>
                    </div>
                    <div style={{ padding: '20px' }}>
                        {departments.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '40px',
                                color: '#718096',
                                fontSize: '16px'
                            }}>
                                No departments found. Add your first department above.
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                                gap: '20px'
                            }}>
                                {departments.map((dept) => (
                                    <div key={dept._id} style={{
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '10px',
                                        padding: '20px',
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'transform 0.2s',
                                        ':hover': {
                                            transform: 'translateY(-2px)',
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
                                        }
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '15px'
                                        }}>
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                backgroundColor: '#ebf4ff',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: '#4e73df',
                                                flexShrink: 0
                                            }}>
                                                <FaHospital size={18} />
                                            </div>
                                            <span style={{
                                                fontWeight: '600',
                                                color: '#2d3748',
                                                fontSize: '16px'
                                            }}>
                                                {dept.DeptName}
                                            </span>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            backgroundColor: '#ebf8ff',
                                            padding: '8px 12px',
                                            borderRadius: '20px',
                                            color: '#3182ce',
                                            fontSize: '14px'
                                        }}>
                                            <FaUserMd size={14} />
                                            <span style={{ fontWeight: '600' }}>
                                                {doctorCounts[dept.DeptID] || 0} doctors
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                    © {new Date().getFullYear()} Hospital Management System. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default DepartmentsManagement;