import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [selectedDeptDoctors, setSelectedDeptDoctors] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/departments/allDepartments')
      .then(res => res.json())
      .then(data => setDepartments(data))
      .catch(err => console.error('Failed to load departments:', err));
  }, []);

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

  const handleDeptClick = async (DeptID, DeptName) => {
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

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="home-container">
      <header className="app-header">
        <div className="app-title" onClick={() => navigate('/home')}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="#005b96">
            <path d="M12 16C15.3137 16 18 13.3137 18 10V6H16V10C16 12.2091 14.2091 14 12 14C9.79086 14 8 12.2091 8 10V6H6V10C6 13.3137 8.68629 16 12 16Z"/>
            <path d="M12 18C14.2091 18 16 16.2091 16 14C16 11.7909 14.2091 10 12 10C9.79086 10 8 11.7909 8 14C8 16.2091 9.79086 18 12 18Z"/>
            <path d="M10 14C10 12.8954 10.8954 12 12 12C13.1046 12 14 12.8954 14 14C14 15.1046 13.1046 16 12 16C10.8954 16 10 15.1046 10 14Z" fill="white"/>
            <path d="M16 6H18V4H16V6Z"/>
          </svg>
          SCHEDULIFY
        </div>
        <div className="nav-buttons">
          <button className="nav-btn" onClick={() => navigate('/about')}>
            About Us
          </button>
          <button className="nav-btn" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search doctors by name or department..."
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search Doctors
        </button>
      </form>

      <h2 className="section-title">
        Medical Departments
      </h2>
      <div className="departments-grid">
        {departments.map((dept) => (
          <div 
            key={dept.DeptID} 
            className="department-card"
            onClick={() => handleDeptClick(dept.DeptID, dept.DeptName)}
          >
            <h3>{dept.DeptName}</h3>
            <p>Specialized Care</p>
          </div>
        ))}
      </div>

      {selectedDeptDoctors.length > 0 && (
        <div className="results-section">
          <h3 className="section-title">
            Department Specialists
          </h3>
          <div className="doctors-grid">
            {selectedDeptDoctors.map(doctor => (
              <DoctorCard 
                key={doctor.DocID} 
                doctor={doctor} 
                onClick={() => navigate(`/doctor/${doctor.DocID}`, { state: { doctor } })}
              />
            ))}
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="results-section">
          <h3 className="section-title">
            Search Results
          </h3>
          <div className="doctors-grid">
            {results.map(doctor => (
              <DoctorCard 
                key={doctor.DocID} 
                doctor={doctor} 
                onClick={() => navigate(`/doctor/${doctor.DocID}`, { state: { doctor } })}
              />
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .home-container {
          padding: 0 40px 40px;
          background: linear-gradient(rgba(245, 248, 252, 0.9), rgba(245, 248, 252, 0.9)), 
                      url("https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80");
          background-size: cover;
          min-height: 100vh;
        }
        
        .app-header {
          background-color: rgba(255, 255, 255, 0.95);
          color: #005b96;
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 4px 15px rgba(0, 91, 150, 0.1);
          border-radius: 10px;
          margin-bottom: 30px;
          border-bottom: 4px solid #005b96;
        }
        
        .app-title {
          font-size: 32px;
          font-weight: 700;
          cursor: pointer;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .nav-buttons {
          display: flex;
          gap: 15px;
        }
        
        .nav-btn {
          padding: 12px 24px;
          background-color: white;
          color: #005b96;
          border: 2px solid #005b96;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .nav-btn:hover {
          background-color: #005b96;
          color: white;
        }
        
        .logout-btn {
          padding: 12px 24px;
          background-color: white;
          color: #e74c3c;
          border: 2px solid #e74c3c;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
        }
        
        .logout-btn:hover {
          background-color: #e74c3c;
          color: white;
        }
        
        .search-form {
          margin: 40px auto;
          max-width: 700px;
          display: flex;
          gap: 15px;
          flex-direction: column;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.95);
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 5px 20px rgba(0, 91, 150, 0.1);
          border-top: 3px solid #005b96;
        }
        
        .search-input {
          width: 100%;
          padding: 15px 25px;
          border-radius: 30px;
          border: 2px solid #ddd;
          font-size: 16px;
          outline: none;
          transition: all 0.3s;
        }
        
        .search-input:focus {
          border-color: #005b96;
          box-shadow: 0 0 0 3px rgba(0, 91, 150, 0.2);
        }
        
        .search-btn {
          padding: 15px 40px;
          background-color: #005b96;
          color: white;
          border: none;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 600;
          font-size: 16px;
          transition: all 0.3s;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .search-btn:hover {
          background-color: #003d66;
          transform: translateY(-2px);
        }
        
        .section-title {
          text-align: center;
          margin: 40px 0 30px;
          font-size: 28px;
          color: #005b96;
          font-weight: 700;
          position: relative;
        }
        
        .section-title:after {
          content: "";
          display: block;
          width: 80px;
          height: 3px;
          background-color: #005b96;
          margin: 15px auto 0;
        }
        
        .departments-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          padding: 20px;
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          box-shadow: 0 5px 15px rgba(0, 91, 150, 0.1);
        }
        
        .department-card {
          background: white;
          padding: 25px 15px;
          border-radius: 10px;
          text-align: center;
          box-shadow: 0 3px 10px rgba(0, 91, 150, 0.1);
          cursor: pointer;
          transition: all 0.3s;
          border: 1px solid rgba(0, 91, 150, 0.1);
        }
        
        .department-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 91, 150, 0.15);
          border-color: #005b96;
        }
        
        .department-card h3 {
          color: #005b96;
          margin: 0 0 5px;
        }
        
        .department-card p {
          color: #666;
          font-size: 14px;
          margin: 0;
        }
        
        .results-section {
          background-color: rgba(255, 255, 255, 0.95);
          border-radius: 10px;
          padding: 20px;
          margin-top: 30px;
          box-shadow: 0 5px 15px rgba(0, 91, 150, 0.1);
        }
        
        .doctors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 25px;
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

export default HomePage;