import { useEffect, useState } from 'react';
import { getJobs, deleteJob } from '../api/jobs';

function JobList() {
    const [jobs, setJobs] = useState([]);

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

    return (
        <div>
            <h1>Job hunting record</h1>
            {jobs.length === 0 && <p>No record yet</p>}
            {jobs.map(job => (
                <div key={job.id}>
                    <h3>{job.company} - {job.position}</h3>
                    <p>status: {job.status}</p>
                    <p>application date: {job.appliedDate}</p>
                    <button onClick={()=> handleDelete(job.id)}> Delete</button>
                </div>
            ))}
        </div>
    )
}

export default JobList