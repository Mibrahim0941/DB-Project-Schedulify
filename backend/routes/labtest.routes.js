const express = require('express');
const router = express.Router();
const { sql } = require('../config/db.config');

// Book lab test
router.post('/bookLabTest', async (req, res) => {
    try {
        const { PtID, TestID,  TimeSlot, AptDate } = req.body;

        if (!PtID || !TestID  || !TimeSlot || !AptDate) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const request = new sql.Request();
        // Then book the test
        request.input('PtID', sql.Int, PtID);
        request.input('TestID', sql.Int, TestID);
        request.input('TimeSlot', sql.VarChar(100), TimeSlot);
        request.input('AptDate', sql.Date, AptDate);

        await request.execute('BookLabTest');

        const Revenuerequest = new sql.Request();
        // First calculate the revenue
        Revenuerequest.input('TestID', sql.Int, TestID);
        Revenuerequest.input('PatientID', sql.Int, PtID);
        Revenuerequest.input('TestDate', sql.Date, AptDate);
        
        const revenueResult = await Revenuerequest.execute('CalculateLabTestRevenue');
        const priceDetails = revenueResult.recordset[0];
        res.status(200).json({ 
            message: 'Lab test booked successfully!',
            priceDetails: {
                basePrice: priceDetails.BasePrice,
                locationSurcharge: priceDetails.LocationSurcharge,
                actualPrice: priceDetails.ActualPrice
            }
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//lab test revenue analysis
router.get('/labTestRevenueAnalysis', async (req, res) => {
    try {
        const request = new sql.Request();
        
        const result = await request.query('SELECT * FROM LabTestRevenueAnalysis');
        res.json(result.recordset);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//lab test revenue by location
router.get('/labTestRevenueByLocation', async (req, res) => {
    try {
        const { city, startDate, endDate } = req.query;
        
        const request = new sql.Request();
        
        request.input('City', sql.VarChar(100), city || null);
        request.input('StartDate', sql.Date, startDate || null);
        request.input('EndDate', sql.Date, endDate || null);
        
        const result = await request.execute('GetLabTestRevenueByLocation');
        res.json(result.recordset);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//revenue made by one lab test
router.get('/labTestRevenue', async (req, res) => {
    try {
        const { TestID } = req.query;
        
        if (!TestID) return res.status(400).json({ error: 'Test ID is required' });

        const request = new sql.Request();
        const result = await request.query(`
            SELECT 
                LT.TestID, LT.TestName,
                COUNT(TA.TestAptID) as TestCount,
                SUM(LT.Price) as TotalRevenue
            FROM LabTests LT
            LEFT JOIN TestAppointments TA ON LT.TestID = TA.TestID
            WHERE LT.TestID = ${TestID}
            GROUP BY LT.TestID, LT.TestName
        `);
        
        res.json(result.recordset[0] || {});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//cancel lab test   
router.put('/cancelLabTest', async (req, res) => {
    try {
        const { TestAptID } = req.body;

        if (!TestAptID) {
            return res.status(400).json({ error: 'Test appointment ID is required' });
        }

        const request = new sql.Request();
        request.input('TestAppointmentID', sql.Int, TestAptID);

        await request.execute('CancelLabTest');

        res.status(200).json({ 
            message: 'Lab test appointment cancelled successfully',
            cancelledID: TestAptID
        });
    } catch (error) {
        console.error('Lab cancellation error:', error);
        
        if (error.message.includes('not found')) {
            res.status(404).json({ error: 'Test appointment not found' });
        } else if (error.message.includes('already cancelled')) {
            res.status(400).json({ error: 'Test already cancelled' });
        } else {
            res.status(500).json({ 
                error: 'Failed to cancel lab test',
                details: error.message 
            });
        }
    }
});

router.get('/allLabTests', async (req, res) => {
    try {
        const request = new sql.Request();
        
        const result = await request.query('SELECT * FROM LabTests');
        res.json(result.recordset);
    } catch (error) 
    {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/TestSlots', async (req, res) => {
    try {
        const { TestID } = req.query;
        
        if (!TestID) return res.status(400).json({ error: 'Test ID is required' });

        const request = new sql.Request();
        const result = await request.query(`
            SELECT 
                TTS.SlotID,
                TTS.TimeSlot,
                TTS.TestID
            FROM TestTimeSlots TTS
            WHERE TTS.TestID = ${TestID}
        `);
        
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router; 