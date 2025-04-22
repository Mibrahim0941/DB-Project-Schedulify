import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DoctorCard from '../components/DoctorCard';

function DoctorListPage() {
  const [doctors, setDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/doctors/doctorsByRating');
      if (response.ok) {
        const data = await response.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  return (
    <div style={{ padding: '40px' }}>
      <h2>Available Doctors</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.DocID} doctor={doctor} onClick={() => navigate(`/doctor/${doctor.DocID}`)} />
        ))}
      </div>
    </div>
  );
}

export default DoctorListPage;
