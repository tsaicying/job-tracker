import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/jobs`
  : 'http://localhost:5000/api/jobs'

export const getJobs = async () => {
    const res = await axios.get(BASE_URL);
    return res.data
}

export const createJob = async (jobData) => {
    const res = await axios.post(BASE_URL, jobData);
    return res.data
}

export const updateJob = async(id, jobData) => {
    const res = await axios.put(`${BASE_URL}/${id}`, jobData)
    return res.data
}

export const deleteJob = async(id) => {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data
}