import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/api/gamil`
  : 'http://localhost:5000/gmail'

export const getEmails = async () => {
    const res = await axios.get(`${BASE_URL}/emails`);
    return res.data;
}