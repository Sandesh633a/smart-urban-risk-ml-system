import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add environmental data and trigger retraining
export const addData = async (data) => {
    try {
        const response = await api.post('/add-data', data);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to add data');
    }
};

// Get predictions
export const getPredictions = async () => {
    try {
        const response = await api.get('/predict');
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.error || 'Failed to get predictions');
    }
};

export default api;
