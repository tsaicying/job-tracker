import { useState } from "react";
import { useNavigate, useLocation} from 'react-router-dom';
import { createJob } from "../api/jobs";

function AddJob(){
    const navigate = useNavigate();
    const location = useLocation();
    const prefill = location.state?.prefill

    const [formData, setFormData] = useState({
        company: prefill?.company || '',
        position: prefill?.position || '',
        status: prefill?.status || 'applied',
        appliedDate: new Date().toISOString().split('T')[0],
        location: '',
        url: '',
        notes: prefill?.summary || ''
    });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        
        try {
            e.preventDefault()
            await createJob(formData)
            navigate('/')
        } catch (err){
            console.error('新增失敗：', err)
        }

    }

    return (
        <div>
            <h1>Add new job application record</h1>
            {prefill && <p> obtained Gmail scanning data, please confirm and submit.</p>}
            <div>
                <div>
                    <label>Company Name</label>
                    <input name="company" value={formData.company} onChange={handleChange} required />
                </div>
                <div>
                    <label>Position</label>
                    <input name="position" value={formData.position} onChange={handleChange} required />
                </div>
                <div>
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                        <option value="applied">applied</option>
                        <option value="interviewing">interviewing</option>
                        <option value="offered">offered</option>
                        <option value="rejected">rejected</option>
                    </select>
                </div>
                <div>
                    <label>Application Date</label>
                    <input name="appliedDate" value={formData.appliedDate} type="date" onChange={handleChange} required />
                </div>
                <div>
                    <label>Location</label>
                    <input name="location" value={formData.location} onChange={handleChange} />
                </div>
                <div>
                    <label>Link to position</label>
                    <input name="url" placeholder={formData.url} onChange={handleChange} />
                </div>
                <div>
                    <label>Notes</label>
                    <textarea name="notes" value={formData.notes} onChange={handleChange} />
                </div>
                <button type="button" onClick={handleSubmit}>Add new record</button>
                <button type="button" onClick={() => navigate('/')}>Cancel</button>
            </div>

    
        </div>
    )
}

export default AddJob