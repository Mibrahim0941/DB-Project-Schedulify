const express = require('express');
const router = express.Router();
const { sql,connectDB } = require('../config/db.config');
const crypto = require('crypto');

let currentUser = null;

//login for patients/doctors
router.post("/login", async (req, res) => {
    const { userType, email, password } = req.body;

    if (!userType || !email || !password) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        const request = new sql.Request();
        
        request.input("Email", sql.VarChar(255), email);

        let userQuery, passwordTable;
        if (userType === "patient") {
            userQuery = "SELECT PtID AS UserID FROM Patients WHERE PtEmail = @Email";
            passwordTable = "PtPasswords";
        } else if (userType === "doctor") {
            userQuery = "SELECT DocID AS UserID FROM Doctors WHERE DocEmail = @Email";
            passwordTable = "DocPasswords";
        } else {
            return res.status(400).json({ error: "Invalid user type" });
        }

        let userResult = await request.query(userQuery);
        if (userResult.recordset.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        let userID = userResult.recordset[0].UserID;

        let passwordQuery = `SELECT Pass FROM ${passwordTable} WHERE UserID = @UserID`;
        request.input("UserID", sql.Int, userID);
        let passwordResult = await request.query(passwordQuery);

        if (passwordResult.recordset.length === 0) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        let storedHash = passwordResult.recordset[0].Pass;
        let hashedPassword = crypto.createHash("sha256").update(password).digest();

        if (Buffer.compare(storedHash, hashedPassword) === 0) {
            res.status(200).json({ message: "Login successful", userID });
            currentUser = userID;
            console.log(currentUser);
        } else {
            res.status(401).json({ error: "Invalid credentials" });
        }

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// Delete user
router.delete('/deleteUser', async (req, res) => {
    try {
        const { userType, userID } = req.body;
        
        if (!userType || !userID) {
            return res.status(400).json({ error: 'User type and ID are required' });
        }

        const table = userType === 'patient' ? 'Patients' : 'Doctors';
        const idField = userType === 'patient' ? 'PtID' : 'DocID';
        
        const request = new sql.Request();
        await request.query(`DELETE FROM ${table} WHERE ${idField} = ${userID}`);
        
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router; 