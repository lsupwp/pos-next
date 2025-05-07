import mysql from 'mysql2/promise';

async function connectWithRetry(retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            const db = await mysql.createConnection({
                host: process.env.DATABASE_HOST,
                user: process.env.DATABASE_USER,
                password: process.env.DATABASE_PASSWORD,
                database: process.env.DATABASE_NAME
            });
            console.log("Database connected");
            return db;
        } catch (err) {
            console.error(`DB connection failed (attempt ${i + 1}): ${err.message}`);
            if (i < retries - 1) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise(res => setTimeout(res, delay));
            } else {
                console.error('All connection attempts failed.');
                process.exit(1);  // จบ process ถ้าต่อไม่ได้จริง ๆ
            }
        }
    }
}

const db = await connectWithRetry();
export default db;
