import { useState } from "react";
import { useNavigate} from 'react-router-dom';
import { createJob } from "../api/jobs";

function AddJob(){
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        company: '',
        position: '',
        status: 'applied',
        appliedDate: '',
        location: '',
        url: '',
        notes: ''
    });
    
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        await createJob(formData)
        navigate('/')
    }

    return (
        <div>
            <h1>Add new job application record</h1>
            <form onSubmit={handleSubmit}>
                <input name="company" placeholder="company name" onChange={handleChange} required />
                <input name="position" placeholder="position" onChange={handleChange} required />
                <select name="status" onChange={handleChange}>
                    <option value="applied">applied</option>
                    <option value="interviewing">interviewing</option>
                    <option value="offered">offered</option>
                    <option value="rejected">rejected</option>
                </select>
                <input name="appliedDate" type="date" onChange={handleChange} required />
                <input name="location" placeholder="location" onChange={handleChange} />
                <input name="url" placeholder="position url" onChange={handleChange} />
                <textarea name="notes" placeholder="notes" onChange={handleChange} />
                <button type="submit">Add new record</button>
            </form>
        </div>
    )
}

export default AddJob