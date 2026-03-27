import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api/gmail';

export const getEmails = async () => {
    const res = await axios.get(`${BASE_URL}/emails`);
    return res.data;
}