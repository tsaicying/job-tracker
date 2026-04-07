require('dotenv').config()

const pool = require('./index');

async function setup() {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                company VARCHAR(255) NOT NULL,
                position VARCHAR(255),
                status VARCHAR(50) DEFAULT 'applied',
                applied_date DATE,
                location VARCHAR(255),
                url TEXT,
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`)
        await pool.query(`
                CREATE TABLE IF NOT EXISTS session (
                sid VARCHAR NOT NULL COLLATE "default",
                sess JSON NOT NULL,
                expire TIMESTAMP(6) NOT NULL,
                CONSTRAINT session_pkey PRIMARY KEY (sid)
            )
            `)
        console.log('data table established successfully');
        console.log('✅ Session 資料表建立成功')
        process.exit(0)
    } catch(err){
        console.log('Data table establishment failure', err)
        process.exit(1)
    }
}

setup()