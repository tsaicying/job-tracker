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
            <h1>Edit job application record</h1>
            { suggestion && (
                <div>
                    <h3>Suggestion from Gmail Scan</h3>
                    <p>Status: {suggestion.status}</p>
                    <p>Notes: {suggestion.summary}</p>
                    <button type="button" onClick={handleApplySuggestion}>Apply Suggestion</button>
                </div>
            )

            }
            <div>
                <label>Company: </label>
                <input name="company" value={formData.company} onChange={handleChange} />
            </div>
            <div>
                <label>Position: </label>
                <input name="position" value={formData.position} onChange={handleChange} />
            </div>
            <div>
                <label>Status: </label>
                <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="applied">applied</option>
                    <option value="interviewing">interviewing</option>
                    <option value="offered">offered</option>
                    <option value="rejected">rejected</option>
                </select>
            </div>
            <div>
                <label>Applied Date:</label>
                <input name="appliedDate" value={formData.appliedDate} onChange={handleChange} />
            </div>
            <div>
                <label>Location</label>
                <input name="location" value={formData.location} onChange={handleChange} />
            </div>
            <div>
                <label>Url: </label>
                <input name="url" value={formData.url} onChange={handleChange} />
            </div>
            <div>
                <label>Notes: </label>
                <input name="notes" value={formData.notes} onChange={handleChange} />
            </div>
            <button type="button" onClick={handleSubmit}>Save</button>
            <button type="button" onClick={() => navigate("/")}>Cancel</button>
        </div>
    );

}

export default EditJob