const express =  require('express');
const router =  express.Router();
const { sql } = require ('../config/db.config');
// Admin Profile Endpoint
router.get('/adminprofile', async (req, res) => {
    try {
        const request = new sql.Request();
        const query = `
            SELECT 
                AdminID,
                AdminName,
                AdminEmail,
                PhoneNum,
                AdminPFP,
                IsSuperAdmin,
                IsActive
            FROM Admins
            WHERE AdminID = 1
        `;
        
        const result = await request.query(query);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: "Admin not found" });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ 
            error: "Internal server error",
            details: error.message 
        });
    }
});
// Add a new Lab Test
router.post('/addtest', async (req, res) => {
    const { TestName, TestCategory, BasePrice, City = 'Lahore' } = req.body;

    if (!TestName || !TestCategory || !BasePrice) {
        return res.status(400).json({ success: false, message: 'Please provide TestName, TestCategory, and BasePrice.' });
    }

    try {
        const request = new sql.Request();
        request.input('TestName', sql.VarChar(255), TestName);
        request.input('TestCategory', sql.VarChar(255), TestCategory);
        request.input('BasePrice', sql.Int, BasePrice);
        request.input('City', sql.VarChar(100), City);

        const result = await request.execute('AddLabTest');

        res.status(200).json({ success: true, message: result.recordset[0].Message });
    } catch (error) {
        console.error('Error adding lab test:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Remove a Lab Test
router.delete('/removetest', async (req, res) => {
    const { TestID } = req.query;

    if (!TestID) {
        return res.status(400).json({ success: false, message: 'TestID is required.' });
    }

    try {
        const request = new sql.Request();
        request.input('TestID', sql.Int, TestID);

        const result = await request.execute('RemoveLabTest');

        res.status(200).json({ success: true, message: result.recordset[0].Message });
    } catch (error) {
        console.error('Error removing lab test:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router ;
