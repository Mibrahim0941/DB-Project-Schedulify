const express = require('express');
const router = express.Router();
const { sql } = require('../config/db.config');

// Register patient
router.post('/registerPatient', async (req, res) => {
    try {
        const { PtName, PHeight, PWeight, DOB, PtEmail, PhoneNum, Password, PtPFP, City, Country } = req.body;
        
        if (!PtName || !PHeight || !PWeight || !DOB || !PtEmail || !PhoneNum || !Password || !City || !Country) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        
        // Connect to DB
        const request = new sql.Request();
        
        request.input('PtName', sql.VarChar(255), PtName);
        request.input('PHeight', sql.Float, PHeight);
        request.input('PWeight', sql.Float, PWeight);
        request.input('DOB', sql.VarChar(50), DOB);
        request.input('PtEmail', sql.VarChar(255), PtEmail);
        request.input('PhoneNum', sql.Char(20), PhoneNum);
        request.input('Password', sql.VarChar(255), Password);
        request.input('PtPFP', sql.VarChar(255), PtPFP || null);
        request.input('City', sql.VarChar(100), City);
        request.input('Country', sql.VarChar(100), Country);
        
        // Execute stored procedure
        await request.execute('RegisterPatient');
        
        res.status(201).json({ message: 'Patient registered successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//view patient appointments
router.get("/PatientAppointments", async (req, res) => {
    try {
        const { PtID } = req.query
        const request = new sql.Request();
        const result = await request.query(`SELECT * FROM AppointmentDetails Where PtID = ${PtID}`); // Replace 'Users' with your table name

        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching data from database');
    }
});

router.get("/PatientDetails", async (req, res) => {
    try {
        const { PtID } = req.query
        const request = new sql.Request();
        const result = await request.query(`SELECT * FROM Patients Where PtID = ${PtID}`); // Replace 'Users' with your table name

        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching data from database');
    }
});

// Update Patient Info
router.put('/updatePatientInfo', async (req, res) => {
    try {
        const { PtID, PtName, PHeight, PWeight, DOB, PhoneNum, PtPFP,PtCity,PtCountry } = req.body;
        
        if (!PtID) return res.status(400).json({ error: 'Patient ID is required' });

        const request = new sql.Request();
        let updateQuery = `UPDATE Patients SET `;
        const updates = [];
        
        if (PtName) updates.push(`PtName = '${PtName}'`);
        if (PHeight) updates.push(`PHeight = ${PHeight}`);
        if (PWeight) updates.push(`PWeight = ${PWeight}`);
        if (DOB) updates.push(`DOB = '${DOB}'`);
        if (PhoneNum) updates.push(`PhoneNum = '${PhoneNum}'`);
        if (PtPFP) updates.push(`PtPFP = '${PtPFP}'`);
        if (PtCity) updates.push(`PtCity = '${PtCity}'`);
        if (PtCountry) updates.push(`PtCountry = '${PtCountry}'`);

        if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
        
        updateQuery += updates.join(', ') + ` WHERE PtID = ${PtID}`;
        
        await request.query(updateQuery);
        res.status(200).json({ message: 'Patient info updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//view patient history
router.get('/patientHistory', async (req, res) => {
    try {
        const { PtID } = req.query;
        
        if (!PtID) return res.status(400).json({ error: 'Patient ID is required' });

        const request = new sql.Request();
        const result = await request.query(`
            -- Medical Appointments
            SELECT 
                'Appointment' as Type,
                A.AptDate as Date,
                A.aptID as AptID,
                D.DocName as 'Doctor/Test',
                S.TimeSlot as Time,
                A.Status
            FROM Appointments A
            JOIN Doctors D ON A.DoctorID = D.DocID
            JOIN TimeSlots S ON A.SlotID = S.SlotID
            WHERE A.PtID = ${PtID}
            
            UNION ALL
            
            -- Lab Tests
            SELECT 
                'Lab Test' as Type,
                TA.AptDate as Date,
                TA.TestAptID as testID,
                LT.TestName as 'Doctor/Test',
                TTS.TimeSlot as Time,
                TA.status as Status -- Assuming lab tests are always completed
            FROM TestAppointments TA
            JOIN LabTests LT ON TA.TestID = LT.TestID
            JOIN TestTimeSlots TTS ON TA.SlotID = TTS.SlotID
            WHERE TA.PtID = ${PtID}
            
            ORDER BY Date DESC
        `);
        
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// sort patients appointment by date and time 
router.get('/patientAppointmentsByDate', async (req, res) => {
    try {
        const { PtID } = req.query;
        
        // Validate required parameter
        if (!PtID) {
            return res.status(400).json({ 
                error: 'Patient ID (PtID) is required as a query parameter' 
            });
        }

        // Validate PtID is a number
        if (isNaN(PtID)) {
            return res.status(400).json({ 
                error: 'Patient ID must be a number' 
            });
        }

        const request = new sql.Request();
        const result = await request.query(`
            SELECT 
                P.PtName, 
                A.AptDate, 
                S.TimeSlot,
                D.DocName,
                A.Status
            FROM Appointments A
            JOIN Patients P ON A.PtID = P.PtID
            JOIN TimeSlots S ON A.SlotID = S.SlotID
            JOIN Doctors D ON A.DoctorID = D.DocID
            WHERE A.PtID = ${PtID}
            ORDER BY A.AptDate, S.TimeSlot
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ 
                message: 'No appointments found for this patient' 
            });
        }

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error('Error fetching patient appointments:', error);
        res.status(500).json({ 
            error: 'Internal server error while fetching appointments',
            details: error.message 
        });
    }
});

//lab test appointments for a specific patient
router.get('/patientLabTests', async (req, res) => {
    try {
        const { PtID } = req.query;
        
        if (!PtID) return res.status(400).json({ error: 'Patient ID is required' });

        const request = new sql.Request();
        const result = await request.query(`
            SELECT 
                TA.TestAptID, TA.AptDate,
                LT.TestName, LT.TestCategory,
                TTS.TimeSlot,
                Tech.TechName
            FROM TestAppointments TA
            JOIN LabTests LT ON TA.TestID = LT.TestID
            JOIN TestTimeSlots TTS ON TA.SlotID = TTS.SlotID
            LEFT JOIN LabTechnicians Tech ON TA.TechID = Tech.TechID
            WHERE TA.PtID = ${PtID}
            ORDER BY TA.AptDate DESC
        `);
        
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET patient summary (name, email, appointments count, total payments)
router.get('/patientsummary', async (req, res) => {
    try {
      // 1. Connect to the database
      const pool = await sql.connect();   // ADD THIS LINE
      
      const query = `
        SELECT 
          P.PtName AS patientName,
          P.PtEmail AS email,
          COUNT(A.AptID) AS appointmentsCount,
          ISNULL(SUM(PAY.Amount), 0) AS totalPayments
        FROM 
          Patients P
        LEFT JOIN 
          Appointments A ON P.PtID = A.PtID AND A.Status != 'Cancelled'
        LEFT JOIN 
          Payments PAY ON P.PtID = PAY.PatientID AND PAY.Status = 'Completed'
        GROUP BY 
          P.PtID, P.PtName, P.PtEmail
        ORDER BY 
          P.PtName
      `;

      const result = await pool.request().query(query);
      res.json(result.recordset);

    } catch (err) {
      console.error('Error fetching patient summary:', err);
      res.status(500).json({ error: 'Failed to fetch patient summary' });
    }
});

module.exports = router; 