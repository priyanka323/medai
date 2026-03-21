import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const api = {
  // Medicine search - now works with MongoDB
  searchMedicines: async (query) => {
    try {
      const response = await axiosInstance.get(`/medicines/search?q=${encodeURIComponent(query)}`);
      console.log('Search results:', response.data);
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      throw error;
    }
  },
  
  // Get all medicines
  getAllMedicines: async () => {
    try {
      const response = await axiosInstance.get('/medicines');
      return response.data;
    } catch (error) {
      console.error('Get all medicines error:', error);
      throw error;
    }
  },
  
  // Get medicine by ID
  getMedicineById: async (id) => {
    try {
      const response = await axiosInstance.get(`/medicines/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get medicine error:', error);
      throw error;
    }
  },
  
  // Get medicine stats
  getMedicineStats: async () => {
    try {
      const response = await axiosInstance.get('/medicines/stats/count');
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  },
  
  // Dose calculation
  calculateDose: async (data) => {
    try {
      const response = await axiosInstance.post('/dose/calculate', data);
      return response.data;
    } catch (error) {
      console.error('Dose calculation error:', error);
      throw error;
    }
  },
  
  // Chat endpoints
  parseDoseRequest: async (message) => {
    try {
      const response = await axiosInstance.post('/chat/parse-dose', { message });
      return response.data;
    } catch (error) {
      console.error('Parse dose error:', error);
      throw error;
    }
  },
  
  chatMessage: async (message) => {
    try {
      const response = await axiosInstance.post('/chat/message', { message });
      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  },
  
  getMedicineInfo: async (medicineName) => {
    try {
      const response = await axiosInstance.post('/chat/medicine-info', { medicine_name: medicineName });
      return response.data;
    } catch (error) {
      console.error('Medicine info error:', error);
      throw error;
    }
  },
  
  // Health check
  healthCheck: async () => {
    try {
      const response = await axiosInstance.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check error:', error);
      throw error;
    }
  },
  
  // Database check
  dbCheck: async () => {
    try {
      const response = await axiosInstance.get('/db-check');
      return response.data;
    } catch (error) {
      console.error('DB check error:', error);
      throw error;
    }
  },
  
  // Get all calculators
  getCalculators: async () => {
    return [
      { id: 'crcl', name: 'Creatinine Clearance (Cockcroft-Gault)', description: 'Estimates renal function for drug dosing', icon: 'Heart' },
      { id: 'ckd-epi', name: 'CKD-EPI eGFR', description: 'Estimates GFR using creatinine equation', icon: 'Activity' },
      { id: 'map', name: 'Mean Arterial Pressure (MAP)', description: 'Calculates average arterial pressure', icon: 'Gauge' },
      { id: 'chads-vasc', name: 'CHA₂DS₂-VASc Score', description: 'Stroke risk assessment in AF', icon: 'Brain' },
      { id: 'ascvd', name: 'ASCVD Risk Estimator', description: '10-year cardiovascular risk', icon: 'TrendingUp' },
      { id: 'bmi-bsa', name: 'BMI & BSA', description: 'Body mass index and surface area', icon: 'Scale' },
    ];
  },
};