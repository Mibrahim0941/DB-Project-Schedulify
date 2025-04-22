import React, { useState, useEffect } from 'react';

const DoctorRegister = () => {
  const DEFAULT_PFP = 'https://th.bing.com/th/id/OIP.INB8GTMpMEJQLcsx8sCeBAHaHa?w=196&h=196&c=7&r=0&o=5&dpr=1.3&pid=1.7';

  const [formData, setFormData] = useState({
    DocName: '',
    DocEmail: '',
    Degree: '',
    Specialization: '',
    Rating: 0,
    Fees: '',
    Utilities: '',
    Experience: '',
    Presence: true,
    Password: '',
    DocPFP: '',
    DeptID: '',
    City: '',
    Country: ''
  });

  const [departments, setDepartments] = useState([]);
  const [loadingDepts, setLoadingDepts] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/departments/alldepartments');
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch departments');
        setDepartments(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingDepts(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
  
    const payload = { ...formData };
  
    if (!payload.DocPFP.trim()) {
      payload.DocPFP = DEFAULT_PFP;
    }
  
    try {
      const res = await fetch('http://localhost:5000/api/doctors/registerDoctor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
  
      setMessage('Doctor registered successfully!');
      setFormData({
        DocName: '', DocEmail: '', Degree: '', Specialization: '', Rating: 0,
        Fees: '', Utilities: '', Experience: '', Presence: true, Password: '',
        DocPFP: '', DeptID: '', City: '', Country: ''
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

  const formFields = [
    { name: 'DocName', type: 'text', required: true },
    { name: 'DocEmail', type: 'email', required: true },
    { name: 'Degree', type: 'text', required: true },
    { name: 'Specialization', type: 'text', required: true },
    { name: 'Password', type: 'password', required: true },
    { name: 'City', type: 'text', required: true },
    { name: 'Country', type: 'text', required: true },
    { name: 'Fees', type: 'number', required: false },
    { name: 'Experience', type: 'number', required: false },
    { name: 'Utilities', type: 'text', required: false },
    { name: 'DocPFP', type: 'text', required: false }
  ];

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
    React.createElement('h2', { style: { textAlign: 'center', marginBottom: '20px' } }, 'Doctor Registration'),
    React.createElement(
      'form',
      { onSubmit: handleSubmit },
      ...formFields.map(field => 
        React.createElement('input', {
          key: field.name,
          name: field.name,
          type: field.type,
          placeholder: field.name,
          value: formData[field.name],
          onChange: handleChange,
          required: field.required,
          style: styledInput
        })
      ),
      React.createElement(
        'div',
        { style: { marginBottom: '15px' } },
        React.createElement('label', { style: { display: 'block', marginBottom: '5px' } }, 'Department*'),
        loadingDepts 
          ? React.createElement('p', null, 'Loading departments...')
          : React.createElement(
              'select',
              {
                name: 'DeptID',
                value: formData.DeptID,
                onChange: handleChange,
                required: true,
                style: styledInput
              },
              React.createElement('option', { value: '' }, 'Select a department'),
              departments.map(dept => 
                React.createElement('option', { 
                  key: dept.DeptID, 
                  value: dept.DeptID 
                }, dept.DeptName)
              )
            )
      ),
      React.createElement(
        'div',
        { style: { marginBottom: '15px', display: 'flex', alignItems: 'center' } },
        React.createElement('input', {
          type: 'checkbox',
          name: 'Presence',
          checked: formData.Presence,
          onChange: handleChange,
          style: { marginRight: '10px' }
        }),
        React.createElement('label', null, 'Currently Available')
      ),
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

export default DoctorRegister;