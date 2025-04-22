const express = require('express');
const router = express.Router();
const { sql } = require('../config/db.config');

// Register doctor
router.post('/registerDoctor', async (req, res) => {
    try {
        const { DocName, DocEmail, Degree, Specialization, Rating, Fees, Utilities, Experience, Presence, Password, DocPFP, DeptID, City, Country } = req.body;
        
        if (!DocName || !DocEmail || !Degree || !Specialization || !Presence || !Password || !DeptID || !City || !Country) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Connect to DB
        const request = new sql.Request();

        request.input('DocName', sql.VarChar(255), DocName);
        request.input('DocEmail', sql.VarChar(255), DocEmail);
        request.input('Degree', sql.VarChar(255), Degree);
        request.input('Specialization', sql.VarChar(255), Specialization);
        request.input('Rating', sql.Float, Rating || 0); // Default rating to 0 if not provided
        request.input('Fees', sql.Int, Fees);
        request.input('Utilities', sql.VarChar(255), Utilities || null);
        request.input('Experience', sql.Float, Experience);
        request.input('Presence', sql.Bit, Presence);
        request.input('Password', sql.VarChar(255), Password);
        request.input('DocPFP', sql.VarChar(255), DocPFP || null);
        request.input('DeptID', sql.Int, DeptID);
        request.input('City', sql.VarChar(100), City);
        request.input('Country', sql.VarChar(100), Country);

        // Execute stored procedure
        await request.execute('RegisterDoctor');

        res.status(201).json({ message: 'Doctor registered successfully' });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//sort doctors by rating
router.get('/doctorsByRating', async (req, res) => {
    try {
        const request = new sql.Request();
        let query = `SELECT * FROM Doctors`;
        query += ` ORDER BY Rating DESC`;
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//Doctors by fee
router.get('/doctorsByFee', async (req, res) => {
    try {
        const {type} = req.body
        const request = new sql.Request();
        let query = `SELECT DocID, DocName, Specialization, Rating, Fees FROM Doctors`;
        if(type) query += ` ORDER BY Fees ${type}`;
        else query+=  ` ORDER BY Fees`
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//sort Doctors by name to ease search
router.get('/DocsByName', async (req, res) => {
    try {
        const table = 'Doctors';
        const nameField = 'DocName';
        
        const request = new sql.Request();
        const result = await request.query(
            `SELECT * FROM ${table} ORDER BY ${nameField}`
        );
        
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//top rated docs in depts
router.get('/topRatedDoctors', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query(`
            SELECT DocID, DocName, Specialization, Rating, DeptID, DeptName
            FROM RankedDoctors
            WHERE Rank = 1
        `);
        
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//most popolar doc 
router.get('/mostPopularDoctor', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query(`
            SELECT * FROM mostPopularDoctor
        `);
        
        res.json(result.recordset[0] || {});
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//search for doctors
router.get('/searchDoctors', async (req, res) => {
    try {
        const { searchTerm } = req.query;
        
        if (!searchTerm) return res.status(400).json({ error: 'Search term is required' });

        const request = new sql.Request();
        const result = await request.query(`
            SELECT 
                D.DocID,
                D.DocName,
                D.Specialization,
                D.Rating,
                Dept.DeptName
            FROM Doctors D
            JOIN Departments Dept ON D.DeptID = Dept.DeptID
            WHERE D.DocName LIKE '%${searchTerm}%'
            OR Dept.DeptName LIKE '%${searchTerm}%'
        `);
        
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get doctor info
router.get('/doctorInfo', async (req, res) => {
    try {
        const { DocID } = req.query;
        
        if (!DocID) {
            return res.status(400).json({ error: 'Doctor ID is required' });
        }

        const request = new sql.Request();
        const result = await request.query(`
            SELECT 
                D.*,
                Dept.DeptName
            FROM Doctors D
            JOIN Departments Dept ON D.DeptID = Dept.DeptID
            WHERE D.DocID = ${DocID}
        `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Doctor not found' });
        }

        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching doctor info:', error);
        res.status(500).json({ error: 'Failed to fetch doctor information' });
    }
});

// Update doctor info
router.put('/updateDoctorInfo', async (req, res) => {
    try {
        const { 
            DocID, 
            DocName, 
            Degree, 
            Specialization, 
            Rating, 
            Fees, 
            Utilities, 
            Experience, 
            Presence, 
            DocPFP, 
            DeptID,
            DocCity,
            DocCountry 
        } = req.body;
        
        if (!DocID) return res.status(400).json({ error: 'Doctor ID is required' });

        const request = new sql.Request();
        let updateQuery = `UPDATE Doctors SET `;
        const updates = [];
        
        if (DocName) updates.push(`DocName = @DocName`);
        if (Degree) updates.push(`Degree = @Degree`);
        if (Specialization) updates.push(`Specialization = @Specialization`);
        if (Rating) updates.push(`Rating = @Rating`);
        if (Fees) updates.push(`Fees = @Fees`);
        if (Utilities) updates.push(`Utilities = @Utilities`);
        if (Experience) updates.push(`Experience = @Experience`);
        if (Presence !== undefined) updates.push(`Presence = @Presence`);
        if (DocPFP) updates.push(`DocPFP = @DocPFP`);
        if (DeptID) updates.push(`DeptID = @DeptID`);
        if (DocCity) updates.push(`DocCity = @DocCity`);
        if (DocCountry) updates.push(`DocCountry = @DocCountry`);
        
        if (updates.length === 0) return res.status(400).json({ error: 'No fields to update' });
        
        updateQuery += updates.join(', ') + ` WHERE DocID = @DocID`;
        
        // Add parameters
        request.input('DocID', sql.Int, DocID);
        if (DocName) request.input('DocName', sql.NVarChar(100), DocName);
        if (Degree) request.input('Degree', sql.NVarChar(100), Degree);
        if (Specialization) request.input('Specialization', sql.NVarChar(100), Specialization);
        if (Rating) request.input('Rating', sql.Decimal(3,1), Rating);
        if (Fees) request.input('Fees', sql.Decimal(10,2), Fees);
        if (Utilities) request.input('Utilities', sql.NVarChar(sql.MAX), Utilities);
        if (Experience) request.input('Experience', sql.Int, Experience);
        if (Presence !== undefined) request.input('Presence', sql.Bit, Presence);
        if (DocPFP) request.input('DocPFP', sql.NVarChar(255), DocPFP);
        if (DeptID) request.input('DeptID', sql.Int, DeptID);
        if (DocCity) request.input('DocCity', sql.NVarChar(50), DocCity);
        if (DocCountry) request.input('DocCountry', sql.NVarChar(50), DocCountry);
        
        await request.query(updateQuery);
        res.status(200).json({ message: 'Doctor info updated successfully' });
    } catch (error) {
        console.error('Error updating doctor info:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router; 