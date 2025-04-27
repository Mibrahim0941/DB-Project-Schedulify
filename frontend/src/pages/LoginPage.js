import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('patient');
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const endpoint = userType === 'admin' 
        ? 'http://localhost:5000/api/auth/adminlogin' 
        : 'http://localhost:5000/api/auth/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userType: userType === 'admin' ? undefined : userType, // Don't send userType for admin
          email: username, 
          password 
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('userId', data.userID || data.adminId);
        localStorage.setItem('userType', userType);
        
        if (userType === 'patient') {
          navigate('/home');
        } else if (userType === 'doctor') {
          navigate('/doctorhome');
        } else if (userType === 'admin') {
          navigate('/Admin'); 
        }
      } else {
        alert(data.error || 'Access denied');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  // Stethoscope logo component
  const StethoscopeLogo = () => (
    <img 
      src="https://ts1.mm.bing.net/th?id=OIP.IZM9l8Li0calZUm99l8RdQHaHa&pid=15.1" 
      alt="Schedulify Logo"
      style={{ 
        width: '60px',
        height: '60px',
        marginBottom: '15px',
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    />
  );

  return (
    <div style={{
      background: 'linear-gradient(rgba(0, 0, 0, 0.7), url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
      backgroundSize: 'cover',
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
      fontFamily: "'Montserrat', sans-serif"
    }}>
      {/* Doctor Registration Link - Top Right */}
      <div style={{
        position: 'absolute',
        top: '30px',
        right: '30px',
      }}>
        <button 
          onClick={() => navigate('/doctor-register')}
          style={{
            color: '#005b96',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '2px solid #005b96',
            padding: '10px 20px',
            borderRadius: '30px',
            fontWeight: 'bold',
            cursor: 'pointer',
            transition: 'all 0.3s',
            fontSize: '14px',
            ':hover': {
              backgroundColor: '#005b96',
              color: 'white'
            }
          }}
        >
          🩺 JOIN OUR MEDICAL TEAM
        </button>
      </div>

      {/* Main Login Form */}
      <form onSubmit={handleLogin} style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        padding: '40px',
        borderRadius: '10px',
        boxShadow: '0 10px 30px rgba(0, 91, 150, 0.3)',
        width: '380px',
        borderTop: '5px solid #005b96',
        textAlign: 'center'
      }}>
        <StethoscopeLogo />
        <h1 style={{ 
          color: '#005b96',
          fontSize: '32px',
          fontWeight: '700',
          margin: '0 0 5px',
          letterSpacing: '1px'
        }}>
          SCHEDULIFY
        </h1>
        <p style={{ 
          color: '#555', 
          fontSize: '14px',
          marginBottom: '30px'
        }}>
          Precision Healthcare Scheduling
        </p>

        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#005b96',
            fontWeight: '600'
          }}>ACCESS TYPE</label>
          <select 
            value={userType} 
            onChange={(e) => setUserType(e.target.value)} 
            style={{ 
              width: '100%',
              padding: '12px 15px',
              borderRadius: '6px',
              border: '2px solid #ddd',
              backgroundColor: '#f8f9fa',
              fontSize: '15px',
              color: '#333',
              cursor: 'pointer'
            }}
          >
            <option value="patient">Patient Access</option>
            <option value="doctor">Medical Professional</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'left' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#005b96',
            fontWeight: '600'
          }}>USERNAME</label>
          <input 
            type="text" 
            placeholder="Enter your credentials" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            style={{ 
              width: '91%',
              padding: '12px 15px',
              borderRadius: '6px',
              border: '2px solid #ddd',
              backgroundColor: '#f8f9fa',
              fontSize: '15px'
            }} 
          />
        </div>

        <div style={{ marginBottom: '30px', textAlign: 'left' }}>
          <label style={{
            display: 'block',
            marginBottom: '8px',
            color: '#005b96',
            fontWeight: '600'
          }}>PASSWORD</label>
          <input 
            type="password" 
            placeholder="••••••••" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            style={{ 
              width: '91%',
              padding: '12px 15px',
              borderRadius: '6px',
              border: '2px solid #ddd',
              backgroundColor: '#f8f9fa',
              fontSize: '15px'
            }} 
          />
        </div>

        <button 
          type="submit"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: isHovering ? '#003d66' : '#005b96',
            color: 'white',
            fontWeight: 'bold',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px',
            transition: 'all 0.3s',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '20px',
            boxShadow: isHovering ? '0 5px 15px rgba(0, 91, 150, 0.4)' : '0 3px 10px rgba(0, 91, 150, 0.2)'
          }}
        >
          {isHovering ? 'SECURE LOGIN →' : 'LOGIN'}
        </button>

        <div style={{ textAlign: 'center' }}>
          <a 
            href="/register"
            onClick={(e) => {
              e.preventDefault();
              navigate('/register');
            }}
            style={{
              color: '#005b96',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: '500',
              ':hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Need an account? Register here
          </a>
        </div>
      </form>

      {/* Medical Icons Decoration */}
      <div style={{
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        display: 'flex',
        gap: '15px'
      }}>
        <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.7)' }}>🩺</span>
        <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.7)' }}>💊</span>
        <span style={{ fontSize: '24px', color: 'rgba(255,255,255,0.7)' }}>⏱️</span>
      </div>
    </div>
  );
}

export default LoginPage;