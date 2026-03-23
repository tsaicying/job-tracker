const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../data/jobs.json');

function readJobs(){
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data)
}

function writeJobs(jobs) {
    fs.writeFileSync(dataPath, JSON.stringify(jobs, null, 2));
}

router.get('/', (req, res) => {
    const jobs = readJobs();
    res.json(jobs);
})

router.post('/', (req, res) => {
    const jobs = readJobs();
    const newJob = {
        id: Date.now(),
        company: req.body.company,
        position: req.body.position,
        status: req.body.status || 'applied',
        appliedDate: req.body.appliedDate,
        location: req.body.location || '',
        url: req.body.url || '',
        notes: req.body.notes || '',
        createdAt: new Date().toISOString()
    }
    jobs.push(newJob);
    writeJobs(jobs);
    res.status(201).json(newJob);
})

router.put('/:id', (req, res) => {
    const jobs = readJobs();
    const index = jobs.findIndex(job => String(job.id) === String(req.params.id))

    if (index === -1) {
        return res.status(404).json({ message: 'Job not found'});
    }

    jobs[index] = { ...jobs[index], ...req.body};
    writeJobs(jobs);
    res.json(jobs[index]);

})

router.delete('/:id', (req, res) => {
    const jobs = readJobs();
    const filtered = jobs.filter(job => job.id != Number(req.params.id));
    writeJobs(filtered);
    res.json({ message: 'Job deleted'});
})

module.exports = router