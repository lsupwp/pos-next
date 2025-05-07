import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
})

if(!db) {
    console.error("Database connection failed")
}
else {
    console.log("Database connected")
}

export default db;