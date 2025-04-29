import React, { useEffect, useState } from 'react';

const LabTestsPage = () => {
  const [labTests, setLabTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);
  const [aptDate, setAptDate] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookingStatus, setBookingStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch all lab tests on component mount
  useEffect(() => {
    fetch('http://localhost:5000/api/labtests/allLabTests')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setLabTests(data);
        } else if (Array.isArray(data.data)) {
          setLabTests(data.data);
        } else {
          console.error('Unexpected API response format:', data);
          setLabTests([]);
        }
      })
      .catch(err => {
        console.error('Error fetching lab tests:', err);
        setLabTests([]);
      });
  }, []);

  // Fetch time slots when a test is selected
  useEffect(() => {
    if (selectedTest) {
      fetch(`http://localhost:5000/api/labtests/TestSlots?TestID=${selectedTest.TestID}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setTimeSlots(data);
          } else if (Array.isArray(data.data)) {
            setTimeSlots(data.data);
          } else {
            console.error('Unexpected timeslots response format:', data);
            setTimeSlots([]);
          }
        })
        .catch(err => {
          console.error('Error fetching time slots:', err);
          setTimeSlots([]);
        });
    }
  }, [selectedTest]);

  const handleTestClick = (test) => {
    setSelectedTest(test);
    setBookingStatus(null);
    setSelectedTimeSlot('');
    setAptDate('');
  };

  const handleBookTest = () => {
    if (!selectedTest || !aptDate || !selectedTimeSlot) {
      setBookingStatus({ success: false, message: 'Please select a test, date, and time slot' });
      return;
    }

    setIsLoading(true);
    const PtID = localStorage.getItem('userId');
    
    const selectedSlot = timeSlots.find(slot => slot.TimeSlot === selectedTimeSlot);

    fetch('http://localhost:5000/api/labtests/bookLabTest', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        PtID,
        TestID: selectedTest.TestID,
        TimeSlot: selectedTimeSlot,
        AptDate: aptDate
      }),
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        setBookingStatus({ success: false, message: data.error });
      } else {
        setBookingStatus({ 
          success: true, 
          message: `Booking successful! ${data.message}`,
          priceDetails: data.priceDetails
        });
        // Reset form
        setSelectedTest(null);
        setAptDate('');
        setSelectedTimeSlot('');
      }
    })
    .catch(err => {
      setBookingStatus({ success: false, message: 'Failed to book test. Please try again.' });
    })
    .finally(() => {
      setIsLoading(false);
    });
  };

  const styles = {
    container: {
      padding: '40px',
      backgroundColor: '#f5f8fc',
      minHeight: '100vh',
      fontFamily: 'sans-serif'
    },
    title: {
      fontSize: '28px',
      color: '#005b96',
      marginBottom: '30px',
      textAlign: 'center',
      fontWeight: '700'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    card: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      borderLeft: '5px solid #005b96',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
      }
    },
    selectedCard: {
      backgroundColor: '#e6f2ff',
      borderLeft: '5px solid #003366'
    },
    testName: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#005b96',
      marginBottom: '10px'
    },
    description: {
      fontSize: '14px',
      color: '#555',
      marginBottom: '10px'
    },
    price: {
      fontSize: '16px',
      color: '#333',
      fontWeight: 'bold'
    },
    bookingForm: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      maxWidth: '500px',
      margin: '0 auto'
    },
    formTitle: {
      fontSize: '22px',
      color: '#005b96',
      marginBottom: '20px',
      textAlign: 'center'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#333'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px'
    },
    select: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      backgroundColor: 'white'
    },
    button: {
      backgroundColor: '#005b96',
      color: 'white',
      border: 'none',
      padding: '12px 20px',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      width: '100%',
      ':hover': {
        backgroundColor: '#004080'
      },
      ':disabled': {
        backgroundColor: '#cccccc',
        cursor: 'not-allowed'
      }
    },
    statusMessage: {
      marginTop: '20px',
      padding: '10px',
      borderRadius: '4px',
      textAlign: 'center'
    },
    success: {
      backgroundColor: '#d4edda',
      color: '#155724'
    },
    error: {
      backgroundColor: '#f8d7da',
      color: '#721c24'
    },
    priceDetails: {
      marginTop: '15px',
      padding: '10px',
      backgroundColor: '#f8f9fa',
      borderRadius: '4px'
    }
  };

  return React.createElement(
    'div',
    { style: styles.container },
    React.createElement('h2', { style: styles.title }, 'Available Lab Tests'),
    
    Array.isArray(labTests) && labTests.length > 0
      ? React.createElement(
          'div',
          { style: styles.grid },
          labTests.map(test =>
            React.createElement(
              'div',
              { 
                key: test.TestID, 
                style: {
                  ...styles.card,
                  ...(selectedTest && selectedTest.TestID === test.TestID ? styles.selectedCard : {})
                },
                onClick: () => handleTestClick(test)
              },
              React.createElement('div', { style: styles.testName }, test.TestName),
              React.createElement('div', { style: styles.description }, test.TestCategory),
              React.createElement('div', { style: styles.price }, `Rs. ${test.BasePrice}`)
            )
          )
        )
      : React.createElement(
          'p',
          { style: { textAlign: 'center', color: '#999' } },
          'No lab tests available or failed to load.'
        ),
    
    selectedTest && React.createElement(
      'div',
      { style: styles.bookingForm },
      React.createElement('h3', { style: styles.formTitle }, `Book ${selectedTest.TestName}`),
      
      React.createElement(
        'div',
        { style: styles.formGroup },
        React.createElement('label', { style: styles.label, htmlFor: 'aptDate' }, 'Appointment Date'),
        React.createElement('input', {
          type: 'date',
          id: 'aptDate',
          style: styles.input,
          value: aptDate,
          onChange: (e) => setAptDate(e.target.value),
          min: new Date().toISOString().split('T')[0] // Set min date to today
        })
      ),
      
      timeSlots.length > 0 && React.createElement(
        'div',
        { style: styles.formGroup },
        React.createElement('label', { style: styles.label, htmlFor: 'timeSlot' }, 'Available Time Slots'),
        React.createElement(
          'select',
          {
            id: 'timeSlot',
            style: styles.select,
            value: selectedTimeSlot,
            onChange: (e) => setSelectedTimeSlot(e.target.value)
          },
          React.createElement('option', { value: '' }, 'Select a time slot'),
          timeSlots.map(slot =>
            React.createElement('option', { 
              key: slot.TimeSlotID, 
              value: slot.TimeSlot 
            }, slot.TimeSlot)
          )
        )
      ),
      
      React.createElement(
        'button',
        {
          style: styles.button,
          onClick: handleBookTest,
          disabled: isLoading || !aptDate || !selectedTimeSlot
        },
        isLoading ? 'Booking...' : 'Book Test'
      ),
      
      bookingStatus && React.createElement(
        'div',
        { 
          style: {
            ...styles.statusMessage,
            ...(bookingStatus.success ? styles.success : styles.error)
          }
        },
        bookingStatus.message,
        bookingStatus.success && bookingStatus.priceDetails && React.createElement(
          'div',
          { style: styles.priceDetails },
          React.createElement('p', null, `Base Price: Rs. ${bookingStatus.priceDetails.basePrice}`),
          React.createElement('p', null, `Location Surcharge: Rs. ${bookingStatus.priceDetails.locationSurcharge}`),
          React.createElement('p', null, `Total Price: Rs. ${bookingStatus.priceDetails.actualPrice}`)
        )
      )
    )
  );
};

export default LabTestsPage;