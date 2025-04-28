import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DoctorListPage from './pages/DoctorListPage';
import DoctorDetailPage from './pages/DoctorDetailPage';
import PatientDashboardPage from './pages/PatientDashboardPage';
import PatientRegister from './pages/PatientRegister';
import DoctorRegister from './pages/DoctorRegister'; // Import the new DoctorRegister component
import HomePage from './pages/Homepage';
import AboutPage from './pages/About';
import DoctorHome from './pages/DoctorHome'; // Import the new DoctorHome component
import DoctorDashboard from './pages/DoctorDashboard'; 
import LabTest from './pages/LabTests';
import Payment from './pages/payment';
import AdminDashboard from './pages/AdminDashboard';
import DepartmentsManagement from './pages/DepartmentsManagement';
import LaboratoryManagement from './pages/LaboratoryManagement';
import DoctorManagement from './pages/DoctorManagement';
import Viewdetails from './pages/Viewdetails';

function App() {
  const isLoggedIn = localStorage.getItem('userId') !== null;
  const isDoctorLoggedIn = localStorage.getItem('userType') === 'doctor';

  return (
    <Routes>
      {/* Root route redirects based on login status */}
      <Route path="/" element={<Navigate to={"/login"} />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/labtest" element={<LabTest />} />
      <Route path="/home" element={isLoggedIn ? <HomePage /> : <Navigate to="/login" />} />
      <Route path="/doctors" element={isLoggedIn ? <DoctorListPage /> : <Navigate to="/login" />} />
      <Route path="/doctor/:id" element={isLoggedIn ? <DoctorDetailPage /> : <Navigate to="/login" />} />
      <Route path="/dashboard" element={isLoggedIn ? <PatientDashboardPage /> : <Navigate to="/login" />} />
      <Route path="/register" element={<PatientRegister />} />
      <Route path="/doctor-register" element={<DoctorRegister />} /> {/* New doctor registration route */}
      <Route path="/about" element={<AboutPage />} />
      <Route path="/doctorhome" element={<DoctorHome /> } />
      <Route path="/doctor-dashboard" element={<DoctorDashboard /> } />
      <Route path="/payment" element={<Payment /> } />
      <Route path="admin" element ={<AdminDashboard />} />
      <Route path="admin/departments" element={<DepartmentsManagement />} />
      <Route path="admin/Laboratory" element={<LaboratoryManagement />} />
      <Route path="admin/Doctor" element ={<DoctorManagement />} />
      <Route path="admin/View" element ={<Viewdetails />} />

      {/* Redirect to login if not logged in */}
    </Routes>
  );
}

export default App;