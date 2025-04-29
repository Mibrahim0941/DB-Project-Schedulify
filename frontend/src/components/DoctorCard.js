import React from 'react';

function DoctorCard({ doctor, onClick }) {
  console.log(doctor.DocPFP);
  return (
    <div 
      onClick={onClick} 
      style={{
        border: '1px solid #eaeaea',
        borderRadius: '8px',
        padding: '20px',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'transform 0.3s ease',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        backgroundColor: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '10px',
        overflow: 'hidden'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid #3498db',
        marginBottom: '15px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e6f7ff'
      }}>
        <img 
          src={doctor.DocPFP} 
          alt="Doctor" 
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2380CBC4'><path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z'/></svg>";
          }}
        />
      </div>

      <h3 style={{
        margin: '0 0 5px 0',
        color: '#2c3e50',
        fontWeight: '600',
        fontSize: '18px'
      }}>
        {doctor.DocName}
      </h3>
      
      <p style={{
        margin: '0 0 15px 0',
        color: '#7f8c8d',
        fontSize: '14px'
      }}>
        {doctor.Specialization}
      </p>

      <div style={{
        width: '100%',
        borderTop: '1px solid #f0f0f0',
        paddingTop: '15px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '5px 0'
        }}>
          <span style={{ color: '#7f8c8d' }}>Rating</span>
          <span style={{ 
            fontWeight: '500', 
            color: '#2c3e50', 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            {doctor.Rating}
            {doctor.Rating >= 0 && (
              <span style={{ color: 'gold', marginLeft: '5px' }}>★</span>
            )}
          </span>
        </div>
      </div>


      <div style={{
        width: '100%',
        borderTop: '1px solid #f0f0f0',
        paddingTop: '15px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '5px 0'
        }}>
          <span style={{ color: '#7f8c8d' }}>Fees</span>
          <span style={{ 
            fontWeight: '500', 
            color: '#2c3e50', 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            {doctor.Fees}
            {doctor.Fees > 0 && (
              <span style={{ color: 'black', marginLeft: '5px' }}> PKR</span>
            )}
          </span>
        </div>
      </div>

      <div style={{
        width: '100%',
        borderTop: '1px solid #f0f0f0',
        paddingTop: '15px'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          margin: '5px 0'
        }}>
          <span style={{ color: '#7f8c8d' }}>Experience</span>
          <span style={{ 
            fontWeight: '500', 
            color: '#2c3e50', 
            display: 'flex', 
            alignItems: 'center' 
          }}>
            {doctor.Experience}
            {doctor.Experience > 0 && (
              <span style={{ color: 'black', marginLeft: '5px' }}> Years</span>
            )}
          </span>
        </div>
      </div>

      <button style={{
        width: '100%',
        padding: '10px',
        backgroundColor: '#3498db',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        marginTop: '15px',
        cursor: 'pointer',
        fontWeight: '500',
        transition: 'background-color 0.3s ease'
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2980b9'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3498db'}
      >
        View Details
      </button>
    </div>
  );
}

export default DoctorCard;