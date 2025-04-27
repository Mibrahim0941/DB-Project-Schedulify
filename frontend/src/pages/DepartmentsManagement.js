import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHospital, FaPlus, FaEdit, FaTrash, FaArrowLeft } from 'react-icons/fa';

const DepartmentsManagement = () => {
    const [departments, setDepartments] = useState([]);
    const [newDepartment, setNewDepartment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/departments/alldepartments', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                    
                });

                if (!response.ok) throw new Error('Failed to fetch departments');
                
                const data = await response.json();
                setDepartments(data);
                console.log(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDepartments();
    }, []);

    const handleAddDepartment = async () => {
        if (!newDepartment.trim()) {
            setError('Department name cannot be empty');
            return;
        }
        console.log(newDepartment);
        try {
            const response = await fetch('http://localhost:5000/api/departments/addDepartment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ DeptName: newDepartment })
            });

            if (!response.ok) throw new Error('Failed to add department');
            console.log(newDepartment);
            const data = await response.json();
            setDepartments([...departments, data]);
            setNewDepartment('');
            setSuccess('Department added successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.message);
            setTimeout(() => setError(''), 3000);
        }
    };

    const handleDeleteDepartment = async (id) => {
        if (!window.confirm('Are you sure you want to delete this department?')) return;

        try {
            const response = await fetch(`http://localhost:5000/api/admin/departments/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            });

            if (!response.ok) throw new Error('Failed to delete department');
            
            setDepartments(departments.filter(dept => dept._id !== id));
            setSuccess('Department deleted successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.message);
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
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            fontFamily: "'Inter', sans-serif"
        }}>
            {/* Header (same as AdminDashboard) */}
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
                            onClick={() => navigate('/admin/dashboard')}
                            style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                color: '#4e73df',
                                fontWeight: '600'
                            }}
                        >
                            <FaArrowLeft /> Back to Dashboard
                        </button>
                    </div>
                    {/* Keep the same user profile and logout button as AdminDashboard */}
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
                                    transition: 'all 0.3s',
                                    ':focus': {
                                        borderColor: '#4e73df',
                                        outline: 'none',
                                        boxShadow: '0 0 0 3px rgba(78, 115, 223, 0.2)'
                                    }
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
                                ':hover': {
                                    backgroundColor: '#3b5ab9'
                                }
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
                                color: '#718096'
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
                                    <div key={dept.DeptID} style={{
                                        backgroundColor: '#f8fafc',
                                        borderRadius: '10px',
                                        padding: '20px',
                                        border: '1px solid #e2e8f0',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
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
                                                color: '#4e73df'
                                            }}>
                                                <FaHospital />
                                            </div>
                                            <span style={{
                                                fontWeight: '600',
                                                color: '#2d3748'
                                            }}>{dept.DeptName}</span>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '10px'
                                        }}>
                                            <button
                                                onClick={() => {
                                                    // You can implement edit functionality here
                                                    const newName = prompt('Edit department name:', dept.name);
                                                    if (newName && newName !== dept.name) {
                                                        // Call API to update department
                                                    }
                                                }}
                                                style={{
                                                    backgroundColor: '#edf2f7',
                                                    border: 'none',
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    color: '#4a5568',
                                                    transition: 'all 0.3s',
                                                    ':hover': {
                                                        backgroundColor: '#e2e8f0',
                                                        color: '#2d3748'
                                                    }
                                                }}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteDepartment(dept._id)}
                                                style={{
                                                    backgroundColor: '#fff5f5',
                                                    border: 'none',
                                                    width: '36px',
                                                    height: '36px',
                                                    borderRadius: '8px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    color: '#e53e3e',
                                                    transition: 'all 0.3s',
                                                    ':hover': {
                                                        backgroundColor: '#fed7d7'
                                                    }
                                                }}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer (same as AdminDashboard) */}
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

export default DepartmentsManagement;