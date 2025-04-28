import React, { useState, useEffect } from 'react';
import { FaFlask, FaTrashAlt, FaPlusCircle } from 'react-icons/fa';

const ManageLaboratory = () => {
  const [labTests, setLabTests] = useState([]);
  const [newTest, setNewTest] = useState({
    TestName: '',
    TestCategory: '',
    BasePrice: '',
    City: 'Lahore'
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllLabTests();
  }, []);

  const fetchAllLabTests = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/labtests/allLabTests');
      const data = await response.json();
      setLabTests(data.labTests || []);
      setLabTests(data || []);
    } catch (error) {
      console.error('Error fetching lab tests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTest = async () => {
    if (!newTest.TestName || !newTest.TestCategory || !newTest.BasePrice) {
      alert('Please fill all fields!');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/admin/addtest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTest)
      });

      const result = await response.json();
      if (result.success) {
        alert('Lab Test Added Successfully!');
        setNewTest({ TestName: '', TestCategory: '', BasePrice: '', City: 'Lahore' });
        fetchAllLabTests();
      } else {
        alert(result.message || 'Error adding lab test.');
      }
    } catch (error) {
      console.error('Error adding test:', error);
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to delete this lab test?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/admin/removetest?${testId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        alert('Lab Test Deleted Successfully!');
        fetchAllLabTests();
      } else {
        alert(result.message || 'Error deleting lab test.');
      }
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  return (
    <div style={{
      background: 'linear-gradient(to right, #e0f7ff, #ffffff)',
      minHeight: '100vh',
      padding: '40px',
      fontFamily: 'Segoe UI, sans-serif'
    }}>
      <h1 style={{
        color: '#2b6cb0',
        textAlign: 'center',
        marginBottom: '30px',
        fontSize: '32px',
        fontWeight: 'bold'
      }}>
        <FaFlask style={{ marginRight: '10px' }} />
        Manage Laboratory
      </h1>

      {/* Add New Lab Test Section */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '800px',
        margin: '20px auto',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#2c5282', marginBottom: '20px', textAlign: 'center' }}>Add New Lab Test</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input
            type="text"
            placeholder="Test Name"
            value={newTest.TestName}
            onChange={e => setNewTest({ ...newTest, TestName: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="Test Category"
            value={newTest.TestCategory}
            onChange={e => setNewTest({ ...newTest, TestCategory: e.target.value })}
            style={inputStyle}
          />
          <input
            type="number"
            placeholder="Base Price"
            value={newTest.BasePrice}
            onChange={e => setNewTest({ ...newTest, BasePrice: e.target.value })}
            style={inputStyle}
          />
          <input
            type="text"
            placeholder="City (default Lahore)"
            value={newTest.City}
            onChange={e => setNewTest({ ...newTest, City: e.target.value })}
            style={inputStyle}
          />

          <button
            onClick={handleAddTest}
            style={{
              backgroundColor: '#4299e1',
              color: 'white',
              fontWeight: 'bold',
              padding: '12px',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              transition: '0.3s',
              fontSize: '16px'
            }}
            onMouseOver={e => e.target.style.backgroundColor = '#2b6cb0'}
            onMouseOut={e => e.target.style.backgroundColor = '#4299e1'}
          >
            <FaPlusCircle style={{ marginRight: '10px' }} />
            Add Lab Test
          </button>
        </div>
      </div>

      {/* All Lab Tests */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '30px',
        maxWidth: '1000px',
        margin: '40px auto',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ color: '#2c5282', marginBottom: '20px', textAlign: 'center' }}>Existing Lab Tests</h2>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#4a5568' }}>Loading...</p>
        ) : labTests.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#4a5568' }}>No lab tests available.</p>
        ) : (
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '16px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#ebf8ff' }}>
                <th style={thStyle}>Test ID</th>
                <th style={thStyle}>Test Name</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Price</th>
                <th style={thStyle}>City</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {labTests.map(test => (
                <tr key={test.TestID}>
                  <td style={tdStyle}>{test.TestID}</td>
                  <td style={tdStyle}>{test.TestName}</td>
                  <td style={tdStyle}>{test.TestCategory}</td>
                  <td style={tdStyle}>Rs. {test.BasePrice}</td>
                  <td style={tdStyle}>{test.City}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDeleteTest(test.TestID)}
                      style={{
                        backgroundColor: '#e53e3e',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const inputStyle = {
  padding: '12px',
  width: '100%',
  borderRadius: '10px',
  border: '1px solid #cbd5e0',
  fontSize: '16px',
  backgroundColor: '#edf2f7'
};

const thStyle = {
  padding: '12px',
  borderBottom: '1px solid #cbd5e0',
  color: '#2c5282'
};

const tdStyle = {
  padding: '10px',
  borderBottom: '1px solid #e2e8f0',
  color: '#2d3748'
};

export default ManageLaboratory;
