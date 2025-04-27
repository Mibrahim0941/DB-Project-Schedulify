import React, { useEffect, useState } from 'react';

function PaymentPage() {
  const [history, setHistory] = useState([]);
  const [totals, setTotals] = useState({ TotalDoctorFees: 0, TotalLabTestFees: 0, TotalAmount: 0 });
  const [selectedMethod, setSelectedMethod] = useState('JazzCash');
  const [accountNumber, setAccountNumber] = useState('');
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [showPaymentHistory, setShowPaymentHistory] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState([]);

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchHistory();
    fetchTotals();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/patients/patientHistory?PtID=${userId}`);
      const data = await res.json();
      const filtered = data.filter(item => item.Status !== 'Cancelled');
      setHistory(filtered);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    }
  };

  const fetchTotals = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/calculatePayment?PtID=${userId}`);
      const data = await res.json();
      setTotals(data);
    } catch (err) {
      console.error('Failed to fetch totals:', err);
    }
  };

  const handlePayNow = async () => {
    if (!accountNumber.trim()) {
      alert('Please enter your account number to proceed with payment.');
      return;
    }

    try {
      // Process the payment
      const response = await fetch('http://localhost:5000/api/appointments/processPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          PatientID: userId,
          Amount: totals.TotalAmount
        })
      });

      const result = await response.json();

      if (response.ok) {
        setReceiptVisible(true);
        setAlreadyPaid(true);
        setTotals({ TotalDoctorFees: 0, TotalLabTestFees: 0, TotalAmount: 0 });
      } else {
        alert(`Payment failed: ${result.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      alert('Failed to process payment. Please try again.');
    }
  };

  const fetchPaymentHistory = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/appointments/paymentshistory?PtID=${userId}`);
      const data = await res.json();
      setPaymentHistory(data);
      setShowPaymentHistory(true);
    } catch (err) {
      console.error('Failed to fetch payment history:', err);
    }
  };

  return (
    <div style={{ background: 'linear-gradient(to right, #e0f7ff, #ffffff)', minHeight: '100vh', padding: '40px', fontFamily: 'Segoe UI, sans-serif' }}>
      <h1 style={{ color: '#2b6cb0', textAlign: 'center', marginBottom: '30px' }}>Your Booked Services & Payment</h1>

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={fetchPaymentHistory} style={{ padding: '10px 20px', backgroundColor: '#2b6cb0', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>
          View Payment History
        </button>
      </div>

      {showPaymentHistory && (
        <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '30px', margin: '20px auto', maxWidth: '850px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
          <h2 style={{ color: '#2c5282', marginBottom: '20px' }}>Payment History</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#ebf8ff' }}>
                <th style={{ padding: '10px', borderBottom: '1px solid #cbd5e0' }}>Payment ID</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #cbd5e0' }}>Amount</th>
                <th style={{ padding: '10px', borderBottom: '1px solid #cbd5e0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {paymentHistory.map((p, index) => (
                <tr key={index}>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>{p.PaymentID}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>Rs. {p.Amount}</td>
                  <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0' }}>{p.Status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!alreadyPaid && (
        <>
          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '30px', margin: '20px auto', maxWidth: '850px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#2c5282', borderBottom: '2px solid #bee3f8', paddingBottom: '10px', marginBottom: '20px' }}>Booked Appointments & Lab Tests</h2>
            {history.length === 0 ? (
              <p style={{ color: '#4a5568' }}>No history found.</p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0 }}>
                {history.map((item, index) => (
                  <li key={index} style={{ marginBottom: '20px', padding: '15px 20px', borderLeft: `6px solid ${item.Type === 'Lab Test' ? '#38b2ac' : '#4299e1'}`, backgroundColor: '#f0faff', borderRadius: '10px', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                    <div style={{ fontSize: '16px', color: '#2d3748' }}>
                      <strong>{item.Type}:</strong> {item['Doctor/Test']}<br />
                      <strong>Date:</strong> {new Date(item.Date).toLocaleDateString()}<br />
                      <strong>Time:</strong> {item.Time}<br />
                      <strong>Status:</strong> {item.Status}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '30px', margin: '20px auto', maxWidth: '850px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#2c5282', marginBottom: '20px' }}>Payment Breakdown</h2>
            <div style={{ fontSize: '18px', color: '#2c5282', lineHeight: '1.8' }}>
              <p><strong>Doctor Appointment Fees:</strong> Rs. {totals.TotalDoctorFees}</p>
              <p><strong>Lab Test Charges:</strong> Rs. {totals.TotalLabTestFees}</p>
              <p style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a365d' }}>Total Amount: Rs. {totals.TotalAmount}</p>
            </div>
          </div>

          <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '30px', margin: '20px auto', maxWidth: '850px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
            <h2 style={{ color: '#2c5282', marginBottom: '20px' }}>Choose Payment Method</h2>
            <label htmlFor="method" style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block', color: '#2c5282' }}>Select Method:</label>
            <select id="method" value={selectedMethod} onChange={e => setSelectedMethod(e.target.value)}
              style={{ padding: '12px', width: '100%', borderRadius: '10px', border: '1px solid #cbd5e0', marginBottom: '20px', backgroundColor: '#edf2f7', fontSize: '16px' }}>
              <option value="JazzCash">JazzCash</option>
              <option value="CreditCard">Credit/Debit Card</option>
              <option value="BankTransfer">Bank Transfer</option>
            </select>

            <label htmlFor="accountNumber" style={{ fontWeight: 'bold', marginBottom: '10px', display: 'block', color: '#2c5282' }}>Account Number:</label>
            <input
              id="accountNumber"
              type="text"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              placeholder="Enter your account number"
              style={{ padding: '12px', width: '100%', borderRadius: '10px', border: '1px solid #cbd5e0', marginBottom: '20px', fontSize: '16px', backgroundColor: '#ffffff' }}
            />

            <button
              onClick={handlePayNow}
              style={{ backgroundColor: '#4299e1', color: 'white', padding: '14px 28px', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', width: '100%', transition: 'background 0.3s' }}
              onMouseOver={e => e.target.style.backgroundColor = '#2b6cb0'}
              onMouseOut={e => e.target.style.backgroundColor = '#4299e1'}>
              Pay Now
            </button>
          </div>
        </>
      )}

      {receiptVisible && (
        <div style={{ backgroundColor: '#e6f7ff', padding: '30px', margin: '30px auto', maxWidth: '600px', borderRadius: '16px', textAlign: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', animation: 'fadeIn 0.5s ease-in-out' }}>
          <h2 style={{ color: '#2c5282' }}>🎉 Payment Successful!</h2>
          <p style={{ color: '#2c5282' }}>Thank you for using our platform. Here's your receipt:</p>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', marginTop: '20px', color: '#2d3748', fontSize: '16px' }}>
            <p><strong>Patient ID:</strong> {userId}</p>
            <p><strong>Method:</strong> {selectedMethod}</p>
            <p><strong>Account Number:</strong> {accountNumber}</p>
            <p><strong>Total Paid:</strong> Rs. {totals.TotalAmount}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
            <p style={{ marginTop: '20px', fontWeight: 'bold', color: '#2b6cb0' }}>Schedulify</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentPage;