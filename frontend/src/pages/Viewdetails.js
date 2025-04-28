import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaUserMd, FaCalendarAlt, FaClock, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const ViewDoctor = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const queryParams = new URLSearchParams(location.search);
    const DocID = queryParams.get('DocID');

    useEffect(() => {
        if (!DocID) {
            setError('Doctor ID is required');
            setLoading(false);
            return;
        }

        const fetchDoctorData = async () => {
            try {
                setLoading(true);
                
                const doctorResponse = await fetch(`http://localhost:5000/api/doctors/doctorInfo?DocID=${DocID}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                
                if (!doctorResponse.ok) throw new Error('Failed to fetch doctor info');
                const doctorData = await doctorResponse.json();
                
                const slotsResponse = await fetch(`http://localhost:5000/api/appointments/allSlots?DocID=${DocID}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });
                
                if (!slotsResponse.ok) throw new Error('Failed to fetch doctor slots');
                const slotsData = await slotsResponse.json();
                
                setDoctor(doctorData);
                setSlots(slotsData);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctorData();
    }, [DocID]);

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

    if (error) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                flexDirection: 'column',
                padding: '20px'
            }}>
                <div style={{
                    backgroundColor: '#fff5f5',
                    color: '#e53e3e',
                    padding: '20px',
                    borderRadius: '8px',
                    maxWidth: '500px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ marginTop: 0 }}>Error</h3>
                    <p>{error}</p>
                    <button
                        onClick={() => navigate('/admin/Doctor')}
                        style={{
                            backgroundColor: '#4e73df',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            marginTop: '15px',
                            cursor: 'pointer'
                        }}
                    >
                        Back to Doctors
                    </button>
                </div>
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
                        }}>Doctor Details</h1>
                    </div>
                    <button
                        onClick={() => navigate('/admin/doctors')}
                        style={{
                            backgroundColor: '#edf2f7',
                            color: '#4a5568',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        Back to Doctors
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '30px 40px'
            }}>
                {doctor && (
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '30px'
                    }}>
                        {/* Doctor Profile Section - Updated alignment */}
                        <section style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '25px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)'
                        }}>
                            <div style={{
                                display: 'flex',
                                gap: '30px',
                                alignItems: 'flex-start'
                            }}>
                                <div style={{
                                    width: '150px',
                                    height: '150px',
                                    borderRadius: '50%',
                                    backgroundColor: '#f8fafc',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    border: '4px solid #edf2f7'
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
                                <div style={{ 
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '15px'
                                }}>
                                    <div>
                                        <h2 style={{
                                            margin: '0 0 5px',
                                            fontSize: '24px',
                                            color: '#2d3748'
                                        }}>{doctor.DocName}</h2>
                                        <p style={{
                                            margin: 0,
                                            color: '#4e73df',
                                            fontWeight: '600'
                                        }}>{doctor.Specialization}</p>
                                    </div>
                                    
                                    <div style={{
                                        display: 'grid',
                                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                        gap: '15px'
                                    }}>
                                        <div>
                                            <p style={{
                                                margin: '0 0 5px',
                                                color: '#718096',
                                                fontSize: '14px'
                                            }}>Department</p>
                                            <p style={{
                                                margin: 0,
                                                color: '#2d3748',
                                                fontWeight: '600'
                                            }}>{doctor.DeptName}</p>
                                        </div>
                                        <div>
                                            <p style={{
                                                margin: '0 0 5px',
                                                color: '#718096',
                                                fontSize: '14px'
                                            }}>Rating</p>
                                            <p style={{
                                                margin: 0,
                                                color: '#2d3748',
                                                fontWeight: '600'
                                            }}>{doctor.Rating || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p style={{
                                                margin: '0 0 5px',
                                                color: '#718096',
                                                fontSize: '14px'
                                            }}>Fees</p>
                                            <p style={{
                                                margin: 0,
                                                color: '#2d3748',
                                                fontWeight: '600'
                                            }}>₹{doctor.Fees || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p style={{
                                                margin: '0 0 5px',
                                                color: '#718096',
                                                fontSize: '14px'
                                            }}>Experience</p>
                                            <p style={{
                                                margin: 0,
                                                color: '#2d3748',
                                                fontWeight: '600'
                                            }}>{doctor.Experience ? `${doctor.Experience} years` : 'N/A'}</p>
                                        </div>
                                        <div>
                                            <p style={{
                                                margin: '0 0 5px',
                                                color: '#718096',
                                                fontSize: '14px'
                                            }}>Email</p>
                                            <p style={{
                                                margin: 0,
                                                color: '#2d3748',
                                                fontWeight: '600'
                                            }}>{doctor.DocEmail}</p>
                                        </div>
                                        <div>
                                            <p style={{
                                                margin: '0 0 5px',
                                                color: '#718096',
                                                fontSize: '14px'
                                            }}>Location</p>
                                            <p style={{
                                                margin: 0,
                                                color: '#2d3748',
                                                fontWeight: '600'
                                            }}>{doctor.DocCity}, {doctor.DocCountry}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Time Slots Section */}
                        <section style={{
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            padding: '25px',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.03)'
                        }}>
                            <h3 style={{
                                margin: '0 0 20px',
                                fontSize: '20px',
                                color: '#2d3748',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <FaCalendarAlt color="#4e73df" /> Available Time Slots
                            </h3>
                            
                            {slots.length > 0 ? (
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                                    gap: '15px'
                                }}>
                                    {slots.map(slot => (
                                        <div key={slot.SlotID} style={{
                                            backgroundColor: slot.isBooked ? '#fff5f5' : '#f0f7ff',
                                            border: `1px solid ${slot.isBooked ? '#fed7d7' : '#bee3f8'}`,
                                            borderRadius: '8px',
                                            padding: '15px',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            gap: '5px'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px'
                                            }}>
                                                <FaClock color={slot.isBooked ? '#e53e3e' : '#4e73df'} />
                                                <span style={{
                                                    fontWeight: '600',
                                                    color: slot.isBooked ? '#e53e3e' : '#2d3748'
                                                }}>{slot.TimeSlot}</span>
                                            </div>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                fontSize: '14px',
                                                color: slot.isBooked ? '#e53e3e' : '#38a169'
                                            }}>
                                                {slot.isBooked ? (
                                                    <>
                                                        <FaTimesCircle /> Booked
                                                    </>
                                                ) : (
                                                    <>
                                                        <FaCheckCircle /> Available
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{
                                    backgroundColor: '#f8fafc',
                                    borderRadius: '8px',
                                    padding: '20px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ margin: 0, color: '#718096' }}>
                                        No time slots available for this doctor
                                    </p>
                                </div>
                            )}
                        </section>
                    </div>
                )}
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

export default ViewDoctor;