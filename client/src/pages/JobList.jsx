import { useEffect, useState } from 'react';
import { getJobs, deleteJob, updateJob } from '../api/jobs';
import { useNavigate } from 'react-router-dom';

function JobList() {
    const [jobs, setJobs] = useState([]);
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

    const handleStatusChange = async (id, newStatus) => {
        await updateJob(id, { status: newStatus});
        fetchJobs();
    }

    return (
        <div>
            <h1>Job hunting record</h1>
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