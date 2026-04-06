import { useState, useEffect} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getJobs, updateJob } from '../api/jobs';

function EditJob(){
    const {id} = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const suggestion = location.state?.suggestion;

    const [formData, setFormData] = useState({
        company: '',
        position: '',
        status: 'applied',
        appliedDate: '',
        location: '',
        url: '',
        notes: ''
    });

    useEffect(() => {
        fetchJob()
    }, []);

    const fetchJob = async () => {
        const jobs = await getJobs();
        const job = jobs.find(j => String(j.id) === String(id));
        if (job) setFormData(job);
    };

    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async() => {
        await updateJob(id, formData);
        navigate('/')
    };

    const handleApplySuggestion = () => {
        setFormData(prev => ({
            ...prev, status: suggestion.status, notes: suggestion.summery
        }))
    }

    return (
        <div>
            <h1 className='font-bold text-xl text-gray-800 mb-6'>Edit job application record</h1>
            { suggestion && (
                <div className='bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6'>
                    <p className='font-medium text-indigo-700 mb-2'>Suggestion from Gmail Scan</p>
                    <p className='text-indigo-600'>Status: {suggestion.status}</p>
                    <p className='text-indigo-600'>Notes: {suggestion.summary}</p>
                    <button className='mt-3 bg-indigo-600 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-700' type="button" onClick={handleApplySuggestion}>Apply Suggestion</button>
                </div>
            )

            }
            <div className='bg-white border border-gray-200 rounded-xl p-4 mn-6 flex flex-col gap-5'>
                <div className='flex flex-col gap-1'>
                    <label className='font-medium text-gray-700'>Company: </label>
                    <input className='border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300' name="company" value={formData.company} onChange={handleChange} />
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='font-medium text-gray-700'>Position: </label>
                    <input className='border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300' name="position" value={formData.position} onChange={handleChange} />
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='font-medium text-gray-700'>Status: </label>
                    <select className='border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300' name="status" value={formData.status} onChange={handleChange}>
                        <option value="applied">applied</option>
                        <option value="interviewing">interviewing</option>
                        <option value="offered">offered</option>
                        <option value="rejected">rejected</option>
                    </select>
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='font-medium text-gray-700'>Applied Date:</label>
                    <input className='border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300' type='date' name="appliedDate" value={formData.appliedDate} onChange={handleChange} />
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='font-medium text-gray-700'>Location</label>
                    <input className='border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300' name="location" value={formData.location} onChange={handleChange} />
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='font-medium text-gray-700'>Url: </label>
                    <input className='border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300' type='url' name="url" value={formData.url} onChange={handleChange} />
                </div>
                <div className='flex flex-col gap-1'>
                    <label className='font-medium text-gray-700'>Notes: </label>
                    <textarea className='border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300' name="notes" value={formData.notes} onChange={handleChange} />
                </div>
                <div className='flex gap-4'>
                    <button className='bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition' type="button" onClick={handleSubmit}>Save</button>
                    <button className='bg-gray-100 text-gray-600 px-4 py-2 rounded-lg font-medium text-blue-700 hover:bg-gray-200 transition' type="button" onClick={() => navigate("/")}>Cancel</button>
                </div>

                
            </div>

        </div>
    );

}

export default EditJob