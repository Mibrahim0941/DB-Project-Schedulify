import React from 'react';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '40px'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '700',
          color: '#2d3748',
          margin: 0
        }}>About Schedulify</h1>
        <button 
          onClick={() => navigate('/')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4e73df',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.3s',
            ':hover': {
              backgroundColor: '#3b5ab9'
            }
          }}
        >
          Back to Home
        </button>
      </header>

      <main>
        <section style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: '#2d3748',
            marginTop: 0
          }}>Our Mission</h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#4a5568'
          }}>
            At Schedulify, we're revolutionizing healthcare accessibility through technology. 
            Our platform bridges the gap between patients and healthcare providers, 
            offering a seamless appointment booking experience that saves time, 
            reduces stress, and improves healthcare outcomes for everyone.
          </p>
        </section>

        <section style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          marginBottom: '40px'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: '#2d3748',
            marginTop: 0
          }}>The Team Behind Schedulify</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
            marginTop: '30px'
          }}>
            <div style={{
              textAlign: 'center',
              padding: '20px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#ebf4ff',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                color: '#4e73df',
                fontWeight: 'bold'
              }}>
                MI
              </div>
              <h3 style={{ margin: '10px 0 5px' }}>M. Ibrahim</h3>
              <p style={{ color: '#718096', margin: 0 }}>Lead Developer</p>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '20px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#ebf4ff',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                color: '#4e73df',
                fontWeight: 'bold'
              }}>
                AM
              </div>
              <h3 style={{ margin: '10px 0 5px' }}>Ali Murtaza</h3>
              <p style={{ color: '#718096', margin: 0 }}>UX Designer</p>
            </div>

            <div style={{
              textAlign: 'center',
              padding: '20px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#ebf4ff',
                margin: '0 auto 20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '40px',
                color: '#4e73df',
                fontWeight: 'bold'
              }}>
                AN
              </div>
              <h3 style={{ margin: '10px 0 5px' }}>Areeba Naeem</h3>
              <p style={{ color: '#718096', margin: 0 }}>Project Manager</p>
            </div>
          </div>
        </section>

        <section style={{
          backgroundColor: 'white',
          padding: '40px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: '#2d3748',
            marginTop: 0
          }}>Our Vision</h2>
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#4a5568'
          }}>
            We envision a world where healthcare scheduling is no longer a barrier to treatment. 
            Schedulify aims to become the most trusted platform connecting patients with healthcare 
            providers through intuitive technology, transparent processes, and exceptional user 
            experiences. By eliminating scheduling frustrations, we're helping create a healthcare 
            system that prioritizes what really matters - patient care.
          </p>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;