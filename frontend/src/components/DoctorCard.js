import React from 'react';

function DoctorCard({ doctor, onClick }) {
  console.log(doctor.DocPFP);
  return (
    <div onClick={onClick} style={{
      border: '1px solid #ddd',
      padding: '20px',
      borderRadius: '8px',
      cursor: 'pointer',
      textAlign: 'center',
      transition: 'transform 0.2s',
    }}>
      <img src={doctor.DocPFP} alt="Doctor" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
      <h3>{doctor.DocName}</h3>
      <p>{doctor.Specialization}</p>
      <p>Rating: {doctor.Rating}</p>
    </div>
  );
}

export default DoctorCard;
