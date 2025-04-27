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
module.exports = router ;
