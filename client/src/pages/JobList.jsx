import { useEffect, useState } from 'react';
import { getJobs, deleteJob, createJob, updateJob } from '../api/jobs';
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
            
            // compare each result with job in database
            const resultsWithMatch = results.map(result => {
                const exactMatch = jobs.find(job => 
                    job.company.toLowerCase() === result.company.toLowerCase() &&
                    job.position?.toLowerCase() === result.position?.toLowerCase()    
                );
                const sameCompany = jobs.filter(job => 
                    job.company.toLowerCase() === result.company.toLowerCase()
                );

                return { ...result, exactMatch, sameCompany}
            })
            setScanResults(resultsWithMatch);
        } catch(err){
            console.error(err);
        }
        setScanning(false)
    }

    const dismissResult = (index) => {
        setScanResults(prev => prev.filter((_, i) => i != index));
    }

    const renderMatchStatus = (result, index) => {
        if (result.exactMatch) {
            return (
                <div>
                    <p>✅ Have record: {result.exactMatch.company} - {result.exactMatch.position}</p>
                    <button onClick={() => navigate(`/edit/${result.exactMatch.id}`, { state: {suggestion: result} })}>Update</button>
                    <button onClick={() => nevigate('/add', {state: {prefill: result}})}>Add as new record</button>
                    <button onClick={() => dismissResult(index)}>Dismiss</button>
                </div>
            )
        }
        if (result.sameCompany.length > 0) {
            return (
                <div>
                    <p>⚠️ Same company but different position:</p>
                    {result.sameCompany.map(job => (
                        <div key={job.id}>
                            <span>{job.company} - {job.position}</span>
                            <button onClick={() => navigate(`/edit/${job.id}`, {state: {suggestion: result}})}>Update</button>
                        </div>
                    ))}
                    <button onClick={() => navigate('/add', {state:{prefill: result}})}>Add as new record</button>
                    <button onClick={() => dismissResult(index)}>Dismiss</button>
                </div>
            )
        }

        return (
            <div>
                <p>🆕 New company</p>
                <button onClick={() => navigate('/add', { state: {prefill: result}})}>Add</button>
                <button onClick={() => dismissResult(index)}>Dismiss</button>
            </div>
        )
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
                            {renderMatchStatus(result, index)}
                            <hr />
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