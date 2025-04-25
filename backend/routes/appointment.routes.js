const express = require('express');
const router = express.Router();
const { sql } = require('../config/db.config');

// Get booked doctor appointments
router.get("/BookedDocApts", async (req, res) => {
    try {
        const { DocID } = req.query;
        const request = new sql.Request();
        const result = await request.query(`SELECT * FROM AppointmentDetails
                                            Where DocID = ${DocID};`); // Replace 'Users' with your table name

        res.json(result.recordset);
    } catch (err) {
        res.status(500).send('Error fetching data from database');
    }
});

// Book appointment
router.post('/bookAppointment', async (req, res) => {
    try {
        const { PtID, DocID, TimeSlot, AptDate } = req.body;

        if (!PtID || !DocID || !TimeSlot || !AptDate) {
            return res.status(400).json({ error: 'Missing required fields (PtID, DocID, TimeSlot, AptDate)' });
        }

        // Connect to DB
        const request = new sql.Request();

        // Calculate day of week from date
        const dayResult = await request.query(`SELECT DATENAME(weekday, '${AptDate}') as DayOfWeek`);
        const AptDay = dayResult.recordset[0].DayOfWeek;

        // Set up parameters for stored procedure
        request.input('PtID', sql.Int, PtID);
        request.input('DocID', sql.Int, DocID);
        request.input('TimeSlot', sql.VarChar(100), TimeSlot);
        request.input('AptDate', sql.Date, AptDate);
        request.input('AptDay', sql.VarChar(10), AptDay);

        // Execute the stored procedure
        await request.execute('BookAppointment');

        res.status(200).json({ message: 'Appointment booked successfully!' });
    } catch (error) {
        console.error('Database error:', error);
        
        // Handle specific error messages from the stored procedure
        if (error.message.includes('No such time slot exists')) {
            res.status(400).json({ error: 'Invalid time slot for this doctor' });
        } else if (error.message.includes('already booked')) {
            res.status(400).json({ error: 'This time slot is already booked for the selected date' });
        } else {
            res.status(500).json({ 
                error: 'Failed to book appointment',
                details: error.message 
            });
        }
    }
});

// Update appointment status
router.put('/updateAppointmentStatus', async (req, res) => {
    try {
        const { AptID, Status } = req.body;
        
        if (!AptID || !Status) {
            return res.status(400).json({ error: 'Appointment ID and Status are required' });
        }

        if (!['pending', 'completed', 'cancelled'].includes(Status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const request = new sql.Request();
        const transaction = new sql.Transaction();

        try {
            // Get appointment details
            const appointmentResult = await request.query(`
                SELECT PtID, SlotID 
                FROM Appointments 
                WHERE AptID = ${AptID}
            `);

            if (appointmentResult.recordset.length === 0) {
                return res.status(404).json({ error: 'Appointment not found' });
            }

            const { PtID, SlotID } = appointmentResult.recordset[0];

            // Update appointment status
            await request.query(`
                UPDATE Appointments 
                SET Status = '${Status}'
                WHERE AptID = ${AptID}
            `);

            // If cancelled, update related records
            if (Status === 'cancelled') {
                // Update patient's booked appointments count
                await request.query(`
                    UPDATE Patients 
                    SET BookedApts = BookedApts - 1 
                    WHERE PtID = ${PtID} AND BookedApts > 0
                `);

                // Update time slot status
                await request.query(`
                    UPDATE TimeSlots 
                    SET isBooked = 0 
                    WHERE SlotID = ${SlotID}
                `);
            }

            await transaction.commit();
            res.status(200).json({ message: 'Appointment status updated successfully' });
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    } catch (error) {
        console.error('Error updating appointment status:', error);
        res.status(500).json({ error: 'Failed to update appointment status' });
    }
});

// Get available slots for a doctor
router.get('/availableSlots', async (req, res) => {
    try {
        const { DocID, selectedDate } = req.query;
        
        if (!DocID) return res.status(400).json({ error: 'Doctor ID is required' });

        const request = new sql.Request();
        const result = await request.query(`
            			SELECT 
                        ts.SlotID,
                        ts.DocID,
                        ts.TimeSlot,
                        CASE 
                            WHEN a.AptID IS NOT NULL THEN 1 
                            ELSE 0 
                        END AS isBooked
                    FROM TimeSlots ts
                    LEFT JOIN Appointments a ON ts.SlotID = a.SlotID AND a.AptDate = '${selectedDate}'
                    where DocID = ${DocID}
        `);
        
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/allSlots', async (req, res) => {
    try {
        const { DocID} = req.query;
        
        if (!DocID) return res.status(400).json({ error: 'Doctor ID is required' });

        const request = new sql.Request();
        const result = await request.query(`
            			SELECT 
                        ts.SlotID,
                        ts.DocID,
                        ts.TimeSlot,
                        CASE 
                            WHEN a.AptID IS NOT NULL THEN 1 
                            ELSE 0 
                        END AS isBooked
                    FROM TimeSlots ts
                    LEFT JOIN Appointments a ON ts.SlotID = a.SlotID 
                    where DocID = ${DocID}
        `);
        
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// cancel an appointment
router.put("/cancelAppointment", async (req, res) => {
    try {
        const { appointmentID } = req.body;
        
        if (!appointmentID) {
            return res.status(400).json({ error: "Appointment ID is required" });
        }

        const request = new sql.Request();
        request.input("AppointmentID", sql.Int, appointmentID);

        // Get the patient ID from the appointment
        const getPatientQuery = `
            SELECT PtID 
            FROM Appointments
            WHERE AptID = @AppointmentID
        `;
        const patientResult = await request.query(getPatientQuery);

        if (patientResult.recordset.length === 0) {
            return res.status(404).json({ error: "Appointment not found" });
        }

        const patientID = patientResult.recordset[0].PtID;
        request.input("PatientID", sql.Int, patientID);

        // Begin transaction
        const transaction = new sql.Transaction();
        await transaction.begin();

        try {
            // Update the appointment status to 'Cancelled'
            const updateAppointmentQuery = `
                UPDATE Appointments 
                SET Status = 'Cancelled'
                WHERE AptID = @AppointmentID
            `;

            // Decrease the BookedApt count for the patient
            const updatePatientQuery = `
                UPDATE Patients
                SET BookedApts = BookedApts - 1
                WHERE PtID = @PatientID AND BookedApts > 0
            `;

            // Update the TimeSlots table to mark the slot as available
            const updateTimeSlotQuery = `
                UPDATE TimeSlots
                SET isBooked = 0
                FROM TimeSlots ts
                INNER JOIN Appointments a ON ts.SlotID = a.SlotID
                WHERE a.AptID = @AppointmentID
            `;
            //await request.query(updateTimeSlotQuery);
            await request.query(updateAppointmentQuery);
            await request.query(updatePatientQuery);

            await transaction.commit();
            res.status(200).json({ message: "Appointment cancelled successfully" });

        } catch (error) {
            await transaction.rollback();
            throw error;
        }

    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post('/addTimeSlot', async (req, res) => {
    try {
        const { DocID, TimeSlot } = req.body;

        if (!DocID || !TimeSlot) {
            return res.status(400).json({ error: 'Missing required fields (DocID, TimeSlot)' });
        }

        const request = new sql.Request();
        request.input('DocID', sql.Int, DocID);
        request.input('TimeSlot', sql.VarChar(100), TimeSlot);

        await request.query(`INSERT INTO TimeSlots(DocID,TimeSlot)
                             VALUES (@DocID,@TimeSlot)`);

        res.status(200).json({ message: 'Time slot added successfully!' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to add time slot' });
    }
});

router.delete('/deleteTimeSlot', async (req, res) => {
    try {
        const { DocID, SlotID } = req.body;

        if (!DocID || !SlotID) {
            return res.status(400).json({ error: 'Missing required fields (DocID, SlotID)' });
        }

        const request = new sql.Request();
        request.input('DocID', sql.Int, DocID);
        request.input('SlotID', sql.Int, SlotID);

        const checkResult = await request.query(`
            SELECT 1 FROM TimeSlots 
            WHERE SlotID = @SlotID AND DocID = @DocID
        `);

        if (checkResult.recordset.length === 0) {
            return res.status(404).json({ error: 'Time slot not found or does not belong to the specified doctor' });
        }

        // Delete the time slot
        await request.query(`
            DELETE FROM TimeSlots 
            WHERE SlotID = @SlotID AND DocID = @DocID
        `);

        res.status(200).json({ message: 'Time slot deleted successfully!' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to delete time slot' });
    }
});

router.get('/calculatePayment', async (req, res) => {
    try {
        const { PtID } = req.query;
        if (!PtID) return res.status(400).json({ error: 'Patient ID is required' });

        const request = new sql.Request();
        request.input('PtID', sql.Int, PtID);

        // Get doctor fees
        const doctorFeeQuery = `
            SELECT ISNULL(SUM(D.Fees), 0) AS TotalDoctorFees
            FROM Appointments A
            JOIN Doctors D ON A.DoctorID = D.DocID
            WHERE A.PtID = @PtID AND A.Status IN ('Scheduled', 'Confirmed')
        `;
        const doctorFeesResult = await request.query(doctorFeeQuery);
        const totalDoctorFees = doctorFeesResult.recordset[0].TotalDoctorFees || 0;

        // Get lab test fees
        const labTestQuery = `
            SELECT ISNULL(SUM(LTR.ActualPrice), 0) AS TotalLabTestFees
            FROM LabTestRevenue LTR
            JOIN TestAppointments TA ON TA.TestID = LTR.TestID AND TA.PtID = LTR.PatientID
            WHERE LTR.PatientID = @PtID AND TA.Status IN ('Scheduled', 'Confirmed')
        `;
        const labTestResult = await request.query(labTestQuery);
        const totalLabTestFees = labTestResult.recordset[0].TotalLabTestFees || 0;

        const totalAmount = totalDoctorFees + totalLabTestFees;

        // Insert into Payments table
        const insertRequest = new sql.Request();
        insertRequest.input('PatientID', sql.Int, PtID);
        insertRequest.input('Amount', sql.Int, totalAmount);
        insertRequest.input('Status', sql.VarChar, 'Completed');

        await insertRequest.query(`
            INSERT INTO Payments (PatientID, Amount, Status)
            VALUES (@PatientID, @Amount, @Status)
        `);

        res.json({
            TotalDoctorFees: totalDoctorFees,
            TotalLabTestFees: totalLabTestFees,
            TotalAmount: totalAmount
        });

    } catch (error) {
        console.error('Payment calculation error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/paymentshistory', async (req, res) => {
    try {
      const { PtID } = req.query;
      if (!PtID) return res.status(400).json({ error: 'Patient ID is required' });
  
      const request = new sql.Request();
      request.input('PtID', sql.Int, PtID);
  
      const result = await request.query(`
        SELECT PaymentID, Amount, Status
        FROM Payments
        WHERE PatientID = @PtID
        ORDER BY PaymentID DESC
      `);
  
      res.json(result.recordset);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
module.exports = router; 