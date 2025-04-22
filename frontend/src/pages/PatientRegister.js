import React, { useState } from 'react';

const PatientRegister = () => {
  const DEFAULT_PFP = 'https://th.bing.com/th/id/OIP.INB8GTMpMEJQLcsx8sCeBAHaHa?w=196&h=196&c=7&r=0&o=5&dpr=1.3&pid=1.7';

  const [formData, setFormData] = useState({
    PtName: '',
    PHeight: '',
    PWeight: '',
    DOB: '',
    PtEmail: '',
    PhoneNum: '',
    Password: '',
    PtPFP: '',
    City: '',
    Country: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
  
    const payload = { ...formData };
  
    // 🔧 If PtPFP is empty or just spaces, assign the default image link
    if (!payload.PtPFP.trim()) {
      payload.PtPFP = DEFAULT_PFP;
    }
  
    try {
      const res = await fetch('http://localhost:5000/api/patients/registerPatient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
  
      setMessage('Patient registered successfully!');
      setFormData({
        PtName: '', PHeight: '', PWeight: '', DOB: '', PtEmail: '',
        PhoneNum: '', Password: '', PtPFP: '', City: '', Country: ''
      });
    } catch (err) {
      setError(err.message);
    }
  };
  

  const styledInput = {
    display: 'block',
    marginBottom: '15px',
    padding: '10px',
    width: '100%',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxSizing: 'border-box'
  };

  const formFields = Object.keys(formData).map((field) => {
    const type = field === 'Password' ? 'password' :
                 field === 'DOB' ? 'date' : 'text';

    return React.createElement('input', {
      key: field,
      name: field,
      type: type,
      placeholder: field,
      value: formData[field],
      onChange: handleChange,
      required: field !== 'PtPFP',
      style: styledInput
    });
  });

  return React.createElement(
    'div',
    {
      style: {
        padding: '40px',
        maxWidth: '500px',
        margin: 'auto',
        background: '#f9f9f9',
        borderRadius: '12px',
        boxShadow: '0 0 15px rgba(0,0,0,0.1)'
      }
    },
    React.createElement('h2', { style: { textAlign: 'center', marginBottom: '20px' } }, 'Patient Registration'),
    React.createElement(
      'form',
      { onSubmit: handleSubmit },
      ...formFields,
      React.createElement(
        'button',
        {
          type: 'submit',
          style: {
            width: '100%',
            padding: '12px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer'
          }
        },
        'Register'
      )
    ),
    message ? React.createElement('p', { style: { color: 'green', marginTop: '15px' } }, message) : null,
    error ? React.createElement('p', { style: { color: 'red', marginTop: '15px' } }, error) : null
  );
};

export default PatientRegister;
