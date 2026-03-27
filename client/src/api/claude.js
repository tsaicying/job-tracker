import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/claude';

export const analyzeEmails = async (emails) => {
    const res = await axios.post(`${BASE_URL}/analyze`, {emails});
    return res.data
}