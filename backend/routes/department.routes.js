const express = require('express');
const router = express.Router();
const { sql } = require('../config/db.config');

// Get department statistics
router.get('/departmentStats', async (req, res) => {
    try {
        const request = new sql.Request();
        const result = await request.query(`
            SELECT 
                D.DeptID,
                D.DeptName,
                COUNT(Distinct Doc.DocID) as DoctorCount,
                AVG(Distinct Doc.Rating) as AverageRating,
                COUNT(Distinct A.AptID) as TotalAppointments
            FROM Departments D
            LEFT JOIN Doctors Doc ON D.DeptID = Doc.DeptID
            LEFT JOIN TimeSlots T ON Doc.DocID = T.DocID
            LEFT JOIN Appointments A ON T.SlotID = A.SlotID
            GROUP BY D.DeptID, D.DeptName
        `);
        
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//all doctors in a department
router.get('/doctorsByDepartment', async (req, res) => {
    try {
        const { DeptID } = req.query;
        
        if (!DeptID) return res.status(400).json({ error: 'Department ID is required' });

        const request = new sql.Request();
        const result = await request.query(`
            SELECT DocID, DocName, Specialization, Rating, Fees, Experience, Presence 
            FROM Doctors 
            WHERE DeptID = ${DeptID}
        `);

        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//sort docs in dept by fee
router.get('/doctorsInDeptByFee', async (req, res) => {
    try {
        const { DeptID, type } = req.body;
        
        const request = new sql.Request();
        let query = `SELECT DocID, DocName, Specialization, Rating, Fees FROM Doctors`;
        
        if (DeptID) query += ` WHERE DeptID = ${DeptID}`;
        if(type) query += ` ORDER BY Fees ${type}`;
        else query+=  ` ORDER BY Fees`
        
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//sort docs in dept by rating
router.get('/doctorsInDeptByRating', async (req, res) => {
    try {
        const { DeptID } = req.body;
        
        const request = new sql.Request();
        let query = `SELECT DocID, DocName, Specialization, Rating, Fees FROM Doctors`;
        
        if (DeptID) query += ` WHERE DeptID = ${DeptID}`;
        
        query += ` ORDER BY Rating DESC`;
        
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/alldepartments', async (req, res) => {
    try {
        const request = new sql.Request();
        let query = `SELECT * FROM Departments`;
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/addDepartment', async (req, res) => {
    try {
        const { DeptName } = req.body;
        
        if (!DeptName) return res.status(400).json({ error: 'Department name is required' });

        const request = new sql.Request();
        const result = await request.query(`
            INSERT INTO Departments (DeptName, Doc_Count) 
            VALUES ('${DeptName}', 0)
        `);

        res.json({ message: 'Department added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router; 