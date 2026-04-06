import { useState } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
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
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Add new job application record</h1>
            {prefill && 
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-indigo-700"> obtained Gmail scanning data, please confirm and submit.</p>
            </div>
            }
            <div className="bg-white border border-grey-200 rounded-xl p-6 flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">Company Name</label>
                    <input className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2  focus:ring-indigo-300" name="company" value={formData.company} onChange={handleChange} required />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">Position</label>
                    <input className="border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2  focus:ring-indigo-300" name="position" value={formData.position} onChange={handleChange} required />
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">Status</label>
                    <select className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" name="status" value={formData.status} onChange={handleChange}>
                        <option value="applied">Applied</option>
                        <option value="interviewing">Interviewing</option>
                        <option value="offered">Offered</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
                <div className="flex flex-col gap-1">
                    <label className="font-medium text-gray-700">Application Date</label>
                    <input className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" name="appliedDate" value={formData.appliedDate} type="date" onChange={handleChange} required />
                </div>
                <div className="flex flex-col gap-1">
                    <label>Location</label>
                    <input className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" name="location" value={formData.location} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-1">
                    <label>Link to position</label>
                    <input className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" name="url" placeholder={formData.url} onChange={handleChange} />
                </div>
                <div className="flex flex-col gap-1">
                    <label>Notes</label>
                    <textarea className="border border-gray-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" name="notes" value={formData.notes} onChange={handleChange} />
                </div>
                <button className="bg-indigo-600 text-white rounded-lg px-6 py-2 hover:bg-indigo-700" type="button" onClick={handleSubmit}>Add new record</button>
                <button className="border border-grey px-6 py-2 rounded-lg hover:bg-gray-700 hover:text-white" type="button" onClick={() => navigate('/')}>Cancel</button>
            </div>

    
        </div>
    )
}

export default AddJob