const express = require('express');
const cors = require('cors');
const { app, port } = require('./config/server.config');
const { connectDB } = require('./config/db.config');

// Import routes
const authRoutes = require('./routes/auth.routes');
const appointmentRoutes = require('./routes/appointment.routes');
const doctorRoutes = require('./routes/doctor.routes');
const patientRoutes = require('./routes/patient.routes');
const labTestRoutes = require('./routes/labtest.routes');
const departmentRoutes = require('./routes/department.routes');
const adminroutes = require('./routes/admin.routes');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/labtests', labTestRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/Admin', adminroutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}`);
});