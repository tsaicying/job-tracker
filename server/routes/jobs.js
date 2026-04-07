const express = require('express');
const router = express.Router();
const pool = require('../db/index')
const {isAuthenticated} = require('../middleware/auth')

router.get('/', isAuthenticated, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM jobs ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({message: 'Server Error1'});
    }
})

router.post('/', isAuthenticated, async(req, res) => {
    try {
        const { company, position, status, appliedDate, location, url, notes } = req.body;
        const result = await pool.query(
            `INSERT INTO jobs (company, position, status, applied_date, location, url, notes)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [company, position, status || 'applied', appliedDate, location, url, notes]
        )
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' })
    }
})

router.put('/:id', isAuthenticated, async(req, res) => {
    try {
        const { company, position, status, appliedDate, location, url, notes } = req.body;
        const result = await pool.query(
            `
            UPDATE jobs
            SET company=$1, position=$2, status=$3, applied_date=$4, location=$5, url=$6, notes=$7
            WHERE id=$8
            RETURNING *
            `, [company, position, status, appliedDate, location, url, notes, req.params.id]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Job not found' })}
        res.json(result.rows[0])

    } catch (err){
        console.error(err);
        res.status(500).json({message: 'Server Error'})
    }
}) 



router.delete('/:id', isAuthenticated, async(req, res) => {
        try {
        await pool.query('DELETE FROM jobs WHERE id=$1', [req.params.id]);
        res.json({ message: 'Job deleted' })
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' })
    }
})

module.exports = router