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
        console.log('data table established successfully');
        process.exit(0)
    } catch(err){
        console.log('Data table establishment failure', err)
        process.exit(1)
    }
}

setup()