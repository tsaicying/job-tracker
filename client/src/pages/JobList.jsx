import { useEffect, useState } from 'react';
import { getJobs, deleteJob } from '../api/jobs';
import { useNavigate } from 'react-router-dom';
import { getEmails } from '../api/gmail';
import { analyzeEmails } from '../api/claude';

function JobList() {
    const [jobs, setJobs] = useState([]);
    const [scanning, setScanning] = useState(false);
    const [scanResults, setScanResults] = useState([]);
    const navigate = useNavigate();
    

    useEffect( () => {
        fetchJobs()
    }, [])

    const fetchJobs = async () => {
        const data = await getJobs()
        setJobs(data)
    }

    const handleDelete = async (id) => {
        await deleteJob(id)
        fetchJobs()
    }

    const handleScanGmail = async() => {
        setScanning(true);
        setScanResults([]);
        try {
            const emails = await getEmails();
            const results = await analyzeEmails(emails);
            setScanResults(results);
        } catch(err){
            console.error(err);
        }
        setScanning(false)
    }

    return (
        <div>
            <h1>Job hunting record</h1>
            <button onClick={handleScanGmail} disabled={scanning}>
            {scanning? 'Scanning...' : 'Scan Gmail'}
            </button>
            {scanResults.length > 0 && (
                <div>
                    <h2>Gmail Scanning Result</h2>
                    {scanResults.map((result, index) => (
                        <div key={index}>
                            <p> Company: {result.company}</p>
                            <p> Status: {result.status}</p>
                            <p> Brief Summary: {result.summary}</p>
                        </div>
                    ))}
                </div>
            )}

            {jobs.length === 0 && <p>No record yet</p>}
            {jobs.map(job => (
                <div key={job.id}>
                    <h3>{job.company} - {job.position}</h3>
                    <p>application date: {job.appliedDate}</p>
                    <button onClick={() => navigate(`/edit/${job.id}`)}>Edit</button>
                    <button onClick={()=> handleDelete(job.id)}> Delete</button>
                </div>
            ))}
        </div>
    )
}

export default JobList