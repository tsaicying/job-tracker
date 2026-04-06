import { useEffect, useState } from 'react';
import { getJobs, deleteJob } from '../api/jobs';
import { useNavigate } from 'react-router-dom';
import { getEmails } from '../api/gmail';
import { analyzeEmails } from '../api/claude';

const statusConfig = {
    applied: {label: 'Applied', color: 'bg-blue-100 text-blue-700'},
    interviewing: {label:'Interviewing', color: 'bg-yellow-100 text-yellow-700'},
    offered: {label: 'Offered', color: 'bg-green-100 text-green-700'},
    rejected: {label: 'Rejected', color: 'bg-red-100 text-red-700'}
}


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
                <div className='mt-3 pt-3 border-t border-gray-100'>
                    <p className='text-green-600 mb-2'>✅ Have record: {result.exactMatch.company} - {result.exactMatch.position}</p>
                    <div className='flex gap-2'>
                        <button className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100" onClick={() => navigate(`/edit/${result.exactMatch.id}`, { state: {suggestion: result} })}>Update</button>
                        <button className="text-sm bg-gray-50 text-gray-600 px-3 py-1 rounded hover:bg-gray-100" onClick={() => nevigate('/add', {state: {prefill: result}})}>Add as new record</button>
                        <button className="text-sm text-gray-400 px-3 py-1 rounded hover:bg-gray-100" onClick={() => dismissResult(index)}>Dismiss</button>
                    </div>
                </div>
            )
        }
        if (result.sameCompany.length > 0) {
            return (
                <div className='mt-3 pt-3 border-t border-gray-100'>
                    <p className='text-yellow-600 mb-2'>⚠️ Same company but different position</p>
                    {result.sameCompany.map(job => (
                        <div className="flex items-center gap-2 mb-1" key={job.id}>
                            <span className="text-sm text-gray-600">{job.company} - {job.position}</span>
                            <button className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100" onClick={() => navigate(`/edit/${job.id}`, {state: {suggestion: result}})}>Update</button>
                        </div>
                    ))}
                    <div className='flex gap-2 mt-2'>
                        <button onClick={() => navigate('/add', {state:{prefill: result}})}>Add as new record</button>
                        <button onClick={() => dismissResult(index)}>Dismiss</button>
                    </div>
                </div>
            )
        }

        return (
            <div className='mt-3 pt-3 border-t border-gray-100'>
                <p className='text-blue-600 mb-2'>🆕 New company</p>
                <div className='flex gap-2'>
                    <button className="text-sm bg-indigo-50 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-100" onClick={() => navigate('/add', { state: {prefill: result}})}>Add</button>
                    <button className="text-sm text-gray-400 px-3 py-1 rounded hover:bg-gray-100" onClick={() => dismissResult(index)}>Dismiss</button>
                </div>
               </div>
        )
    }

    return (
        <div>
            <div className='flex items-center justify-between mb-6'>
                <h1 className='text-2xl font-bold text-gray-800'>Job Applications</h1>
                <button className='bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 diabled:opacity-50' onClick={handleScanGmail} disabled={scanning}>
                {scanning? 'Scanning...' : 'Scan Gmail'}
                </button>
            </div>

            {scanResults.length > 0 && (
                <div className='mb-8'>
                    <h2 className='text-lg font-semibold text-gray-700 mb-3'> Gmail Scanning Result</h2>
                    {scanResults.map((result, index) => (
                        <div className='bg-white border border-gray-200 rounded-xl p-4 mb-4' key={index}>
                            <div className='flex items-start justify-between'>
                                <p> Company: {result.company}</p>
                                <p> Status: {result.status}</p>
                                
                            </div>
                            <p className='font-bold'> Brief Summary: </p>
                            <p className=''>{result.summary}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${statusConfig[result.status]?.color || 'bg-gray-100 text-gray-600'}`}>
                            {statusConfig[result.status]?.label || result.status}
                            </span>
                            {renderMatchStatus(result, index)}
                        </div>
                    ))}
                </div>
            )}

            {jobs.length === 0 && (
                <div className='text-center py-16 text-gray-400'>
                    <p className='text-lg'>No record yet</p>
                </div>
                    )}
            <div className='grid gap-4'>
                {jobs.map(job => (
                    <div className='bg-white border border-gray-200 rounded-xl p-5 hover:shadow-sm transition' key={job.id}>
                        <div className='flex items-start justify-between'>
                            <div>
                                <h3>{job.company}</h3>
                                {job.location && <p className='text-gray-400 mt-1'>{job.location}</p>}
                                <p className="text-gray-500">{job.position}</p>
                                <p className='text-gray-400 mt-1'>📅 {job.appliedDate}</p>
                                {job.notes && <p className='text-gray-500 mt-2'>{job.notes}</p>}
                            </div>
                            <div className='flex flex-col items-end gap-3'>
                                <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusConfig[job.status]?.color || 'bg-gray-100 text-gray-600'}`}>{statusConfig[job.status]?.label || job.status}</span>
                                <button className='bg-white rounded hover:underline' onClick={() => navigate(`/edit/${job.id}`)}>Edit</button>
                                <button className='bg-white rounded hover:underline' onClick={()=> handleDelete(job.id)}> Delete</button>
                            </div>
                        </div>
                    </div>

                ))}
            </div>

        </div>
    )
}

export default JobList