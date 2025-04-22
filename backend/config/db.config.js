const sql = require('mssql');

const config = {
    user: 'sa',
    password: '12345678',
    server: 'localhost',
    database: 'Schedulify',
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

const connectDB = async () => {
    try {
        await sql.connect(config);
        console.log('Connected to SQL Server');
    } catch (err) {
        console.error('Database connection failed:', err);
    }
};

module.exports = {
    sql,
    connectDB
}; 