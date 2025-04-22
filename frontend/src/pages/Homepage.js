import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDeptDoctors, setSelectedDeptDoctors] = useState([]);

  // Fetch departments on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/departments/allDepartments')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error('Failed to load departments:', err));
  }, []);

  // Handle search for doctors by name or department
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    try {
      const res = await fetch(`http://localhost:5000/api/doctors/searchDoctors?searchTerm=${search}`);
      const data = await res.json();
      setResults(data);
      setSelectedDeptDoctors([]);
    } catch (err) {
      console.error('Search error:', err);
    }
  };

  // Handle department click to fetch doctors in the selected department
  const handleDeptClick = async (DeptID, DeptName) => {
    console.log(DeptName);
    if (DeptName === 'Laboratory') {
      navigate('/labtest');
      return;
    }
    try {
      const res = await fetch(`http://localhost:5000/api/departments/doctorsByDepartment?DeptID=${DeptID}`);
      const data = await res.json();
      setSelectedDeptDoctors(data);
      setResults([]);
    } catch (err) {
      console.error('Error fetching doctors by department:', err);
    }
  };

  // Navigation handlers
  const navigateToAbout = () => navigate('/about');
  const navigateToHome = () => navigate('/home');
  const navigateToDashboard = () => navigate('/dashboard');
  const navigateToDoctor = (doctor) => navigate(`/doctor/${doctor.DocID}`, { state: { doctor } });

  // Medical-themed styles
  const styles = {
    container: {
      padding: '0 40px 40px',
      background: 'linear-gradient(rgba(245, 248, 252, 0.9), rgba(245, 248, 252, 0.9)), url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
      backgroundSize: 'cover',
      minHeight: '100vh'
    },
    header: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      color: '#005b96',
      padding: '20px 40px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 4px 15px rgba(0, 91, 150, 0.1)',
      borderRadius: '10px',
      marginBottom: '30px',
      borderBottom: '4px solid #005b96'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      cursor: 'pointer',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    buttonBase: {
      marginLeft: '15px',
      padding: '12px 24px',
      backgroundColor: 'white',
      color: '#005b96',
      border: '2px solid #005b96',
      borderRadius: '30px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '14px',
      transition: 'all 0.3s ease',
      ':hover': {
        backgroundColor: '#005b96',
        color: 'white'
      }
    },
    searchContainer: {
      margin: '40px auto',
      maxWidth: '700px',
      display: 'flex',
      gap: '15px',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 5px 20px rgba(0, 91, 150, 0.1)',
      borderTop: '3px solid #005b96'
    },
    input: {
      width: '100%',
      padding: '15px 25px',
      borderRadius: '30px',
      border: '2px solid #ddd',
      fontSize: '16px',
      outline: 'none',
      transition: 'all 0.3s',
      ':focus': {
        borderColor: '#005b96',
        boxShadow: '0 0 0 3px rgba(0, 91, 150, 0.2)'
      }
    },
    searchButton: {
      padding: '15px 40px',
      backgroundColor: '#005b96',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '16px',
      transition: 'all 0.3s',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      ':hover': {
        backgroundColor: '#003d66',
        transform: 'translateY(-2px)'
      }
    },
    sectionTitle: {
      textAlign: 'center',
      margin: '40px 0 30px',
      fontSize: '28px',
      color: '#005b96',
      fontWeight: '700',
      position: 'relative',
      ':after': {
        content: '""',
        display: 'block',
        width: '80px',
        height: '3px',
        backgroundColor: '#005b96',
        margin: '15px auto 0'
      }
    },
    departmentsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '20px',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '10px',
      boxShadow: '0 5px 15px rgba(0, 91, 150, 0.1)'
    },
    departmentTile: {
      background: 'white',
      padding: '25px 15px',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '0 3px 10px rgba(0, 91, 150, 0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s',
      border: '1px solid rgba(0, 91, 150, 0.1)',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 20px rgba(0, 91, 150, 0.15)',
        borderColor: '#005b96'
      }
    },
    doctorsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '25px',
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '10px',
      marginTop: '20px'
    }
  };

  return (
    <div style={styles.container}>
      {/* Header with navigation */}
      <header style={styles.header}>
        <div style={styles.title} onClick={navigateToHome}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#005b96">
            <path d="M12 16C15.3137 16 18 13.3137 18 10V6H16V10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10V6H6V10C6 13.3137 8.68629 16 12 16Z"/>
            <path d="M12 18C14.2091 18 16 16.2091 16 14C16 11.7909 14.2091 10 12 10C9.79086 10 8 11.7909 8 14C8 16.2091 9.79086 18 12 18Z"/>
            <path d="M10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14Z" fill="white"/>
            <path d="M16 6H18V4H16V6Z"/>
          </svg>
          SCHEDULIFY
        </div>
        <div>
          <button style={styles.buttonBase} onClick={navigateToAbout}>
            About Us
          </button>
          <button style={styles.buttonBase} onClick={navigateToDashboard}>
            Dashboard
          </button>
        </div>
      </header>

      {/* Search form */}
      <form onSubmit={handleSearch} style={styles.searchContainer}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search doctors by name or department..."
          style={styles.input}
        />
        <button type="submit" style={styles.searchButton}>
          Search Doctors
        </button>
      </form>

      {/* Departments section */}
      <h2 style={styles.sectionTitle}>
        Medical Departments
      </h2>
      <div style={styles.departmentsGrid}>
        {departments.map((dept) => (
          <div 
            key={dept.DeptID} 
            style={styles.departmentTile}
            onClick={() => handleDeptClick(dept.DeptID, dept.DeptName)}
          >
            <h3 style={{ color: '#005b96', margin: '0 0 5px' }}>{dept.DeptName}</h3>
            <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>Specialized Care</p>
          </div>
        ))}
      </div>

      {/* Doctors by department */}
      {selectedDeptDoctors.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={styles.sectionTitle}>
            Department Specialists
          </h3>
          <div style={styles.doctorsGrid}>
            {selectedDeptDoctors.map(doctor => (
              <DoctorCard 
                key={doctor.DocID} 
                doctor={doctor} 
                onClick={() => navigateToDoctor(doctor)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search results */}
      {results.length > 0 && (
        <div style={{ marginTop: '40px' }}>
          <h3 style={styles.sectionTitle}>
            Search Results
          </h3>
          <div style={styles.doctorsGrid}>
            {results.map(doctor => (
              <DoctorCard 
                key={doctor.DocID} 
                doctor={doctor} 
                onClick={() => navigateToDoctor(doctor)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;