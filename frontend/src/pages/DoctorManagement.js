import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserMd, FaSearch, FaFilter, FaStar } from 'react-icons/fa';
import { FiExternalLink } from 'react-icons/fi';

const ManageDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterDepartment, setFilterDepartment] = useState('all');
    const [sortOption, setSortOption] = useState('name');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch doctors
                const doctorsResponse = await fetch('http://localhost:5000/api/doctors/DocsByName', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                
                if (!doctorsResponse.ok) throw new Error('Failed to fetch doctors');
                const doctorsData = await doctorsResponse.json();
                
                // Fetch departments
                const deptResponse = await fetch('http://localhost:5000/api/departments/alldepartments', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                
                if (!deptResponse.ok) throw new Error('Failed to fetch departments');
                const deptData = await deptResponse.json();
                
                setDoctors(doctorsData);
                setDepartments(deptData);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const filteredDoctors = doctors.filter(doctor => {
        const matchesSearch = doctor.DocName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                             doctor.Specialization.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesDepartment = filterDepartment === 'all' || 
                                 doctor.DeptID == filterDepartment;
        return matchesSearch && matchesDepartment;
    });

    const sortedDoctors = [...filteredDoctors].sort((a, b) => {
        switch(sortOption) {
            case 'name':
                return a.DocName.localeCompare(b.DocName);
            case 'rating':
                return b.Rating - a.Rating;
            case 'fees':
                return a.Fees - b.Fees;
            case 'experience':
                return b.Experience - a.Experience;
            default:
                return 0;
        }
    });

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
                            <FaUserMd />
                        </div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '22px',
                            fontWeight: '700',
                            color: '#2d3748',
                            letterSpacing: '-0.5px'
                        }}>Manage Doctors</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '30px 40px'
            }}>
                {/* Controls Section */}
                <section style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '20px',
                    marginBottom: '30px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)'
                }}>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '15px',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '20px'
                    }}>
                        <div style={{
                            position: 'relative',
                            flex: '1 1 300px',
                            maxWidth: '500px'
                        }}>
                            <FaSearch style={{
                                position: 'absolute',
                                left: '15px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#a0aec0'
                            }} />
                            <input
                                type="text"
                                placeholder="Search doctors by name or specialization..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '12px 20px 12px 45px',
                                    borderRadius: '8px',
                                    border: '1px solid #e2e8f0',
                                    fontSize: '14px',
                                    transition: 'all 0.2s',
                                    ':focus': {
                                        outline: 'none',
                                        borderColor: '#4e73df',
                                        boxShadow: '0 0 0 3px rgba(78, 115, 223, 0.2)'
                                    }
                                }}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            flexWrap: 'wrap'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                backgroundColor: '#f8fafc',
                                padding: '10px 15px',
                                borderRadius: '8px'
                            }}>
                                <FaFilter style={{ color: '#4a5568' }} />
                                <select
                                    value={filterDepartment}
                                    onChange={(e) => setFilterDepartment(e.target.value)}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: 'white',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="all">All Departments</option>
                                    {departments.map(dept => (
                                        <option key={dept.DeptID} value={dept.DeptID}>
                                            {dept.DeptName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                backgroundColor: '#f8fafc',
                                padding: '10px 15px',
                                borderRadius: '8px'
                            }}>
                                <span style={{ color: '#4a5568', fontSize: '14px' }}>Sort by:</span>
                                <select
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    style={{
                                        padding: '8px 12px',
                                        borderRadius: '6px',
                                        border: '1px solid #e2e8f0',
                                        backgroundColor: 'white',
                                        fontSize: '14px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <option value="name">Name</option>
                                    <option value="rating">Rating</option>
                                    <option value="fees">Fees</option>
                                    <option value="experience">Experience</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <p style={{
                            margin: 0,
                            color: '#4a5568',
                            fontWeight: '600'
                        }}>
                            Showing {sortedDoctors.length} of {doctors.length} doctors
                        </p>
                    </div>
                </section>

                {/* Doctors Grid */}
                <section>
                    {sortedDoctors.length > 0 ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '25px'
                        }}>
                            {sortedDoctors.map(doctor => {
                                const department = departments.find(d => d.DeptID == doctor.DeptID);
                                return (
                                    <div key={doctor.DocID} style={{
                                        backgroundColor: 'white',
                                        borderRadius: '12px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                                        border: '1px solid #e2e8f0',
                                        transition: 'all 0.3s ease',
                                        ':hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
                                        }
                                    }}>
                                        {/* Doctor Header */}
                                        <div style={{
                                            backgroundColor: '#4e73df',
                                            padding: '20px',
                                            textAlign: 'center',
                                            color: 'white',
                                            position: 'relative'
                                        }}>
                                            <div style={{
                                                width: '100px',
                                                height: '100px',
                                                borderRadius: '50%',
                                                backgroundColor: 'white',
                                                margin: '0 auto 15px',
                                                overflow: 'hidden',
                                                border: '4px solid rgba(255,255,255,0.3)'
                                            }}>
                                                <img 
                                                    src={doctor.DocPFP || 'https://cdn-icons-png.flaticon.com/512/3304/3304567.png'} 
                                                    alt={doctor.DocName} 
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover'
                                                    }}
                                                />
                                            </div>
                                            <h3 style={{
                                                margin: '0 0 5px',
                                                fontSize: '20px',
                                                fontWeight: '600'
                                            }}>{doctor.DocName}</h3>
                                            <p style={{
                                                margin: 0,
                                                opacity: 0.9,
                                                fontSize: '14px'
                                            }}>{doctor.Specialization}</p>
                                        </div>

                                        {/* Doctor Details */}
                                        <div style={{ padding: '20px' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                marginBottom: '12px'
                                            }}>
                                                <FaUserMd style={{ color: '#4e73df', flexShrink: 0 }} />
                                                <div>
                                                    <p style={{
                                                        margin: 0,
                                                        color: '#718096',
                                                        fontSize: '13px'
                                                    }}>Department</p>
                                                    <p style={{
                                                        margin: 0,
                                                        color: '#2d3748',
                                                        fontWeight: '600'
                                                    }}>{department?.DeptName || 'N/A'}</p>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                marginBottom: '12px'
                                            }}>
                                                <FaStar style={{ color: '#4e73df', flexShrink: 0 }} />
                                                <div>
                                                    <p style={{
                                                        margin: 0,
                                                        color: '#718096',
                                                        fontSize: '13px'
                                                    }}>Rating</p>
                                                    <p style={{
                                                        margin: 0,
                                                        color: '#2d3748',
                                                        fontWeight: '600'
                                                    }}>{doctor.Rating || 'N/A'}</p>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                marginBottom: '12px'
                                            }}>
                                                <span style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#4e73df',
                                                    flexShrink: 0
                                                }}>₹</span>
                                                <div>
                                                    <p style={{
                                                        margin: 0,
                                                        color: '#718096',
                                                        fontSize: '13px'
                                                    }}>Fees</p>
                                                    <p style={{
                                                        margin: 0,
                                                        color: '#2d3748',
                                                        fontWeight: '600'
                                                    }}>{doctor.Fees || 'N/A'}</p>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                marginBottom: '12px'
                                            }}>
                                                <span style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    color: '#4e73df',
                                                    flexShrink: 0
                                                }}>🧑‍⚕️</span>
                                                <div>
                                                    <p style={{
                                                        margin: 0,
                                                        color: '#718096',
                                                        fontSize: '13px'
                                                    }}>Experience</p>
                                                    <p style={{
                                                        margin: 0,
                                                        color: '#2d3748',
                                                        fontWeight: '600'
                                                    }}>{doctor.Experience ? `${doctor.Experience} years` : 'N/A'}</p>
                                                </div>
                                            </div>

                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                marginTop: '20px'
                                            }}>
                                                <button 
                                                    onClick={() => navigate(`/admin/View?DocID=${doctor.DocID}`)}
                                                    style={{
                                                        backgroundColor: '#4e73df',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 15px',
                                                        borderRadius: '6px',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        fontSize: '14px',
                                                        transition: 'all 0.2s',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px'
                                                    }}
                                                >
                                                    <FiExternalLink /> View Details
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '40px',
                            textAlign: 'center',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)'
                        }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                backgroundColor: '#f8fafc',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 20px',
                                color: '#a0aec0'
                            }}>
                                <FaUserMd size={40} />
                            </div>
                            <h3 style={{
                                margin: '0 0 10px',
                                color: '#2d3748',
                                fontSize: '20px'
                            }}>No Doctors Found</h3>
                            <p style={{
                                margin: 0,
                                color: '#718096',
                                maxWidth: '500px',
                                margin: '0 auto'
                            }}>
                                {searchTerm 
                                    ? `No doctors match your search for "${searchTerm}"`
                                    : 'No doctors are currently available in this department'}
                            </p>
                        </div>
                    )}
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

export default ManageDoctors;