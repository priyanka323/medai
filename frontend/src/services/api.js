// import axios from 'axios';

// const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// const axiosInstance = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// export const api = {
//   // Medicine search
//   searchMedicines: async (query) => {
//     const response = await axiosInstance.get(`/medicines/search?q=${encodeURIComponent(query)}`);
//     return response.data;
//   },
  
//   // Dose calculation
//   calculateDose: async (data) => {
//     const response = await axiosInstance.post('/dose/calculate', data);
//     return response.data;
//   },
  
//   // Chat endpoints
//   parseDoseRequest: async (message) => {
//     const response = await axiosInstance.post('/chat/parse-dose', { message });
//     return response.data;
//   },
  
//   chatMessage: async (message) => {
//     const response = await axiosInstance.post('/chat/message', { message });
//     return response.data;
//   },
  
//   // Get all calculators
//   getCalculators: async () => {
//     // Return static list of calculators
//     return [
//       { id: 'crcl', name: 'Creatinine Clearance (Cockcroft-Gault)', description: 'Estimates renal function for drug dosing', icon: 'Heart' },
//       { id: 'ckd-epi', name: 'CKD-EPI eGFR', description: 'Estimates GFR using creatinine equation', icon: 'Activity' },
//       { id: 'map', name: 'Mean Arterial Pressure (MAP)', description: 'Calculates average arterial pressure', icon: 'Gauge' },
//       { id: 'chads-vasc', name: 'CHA₂DS₂-VASc Score', description: 'Stroke risk assessment in AF', icon: 'Brain' },
//       { id: 'ascvd', name: 'ASCVD Risk Estimator', description: '10-year cardiovascular risk', icon: 'TrendingUp' },
//       { id: 'bmi-bsa', name: 'BMI & BSA', description: 'Body mass index and surface area', icon: 'Scale' },
//     ];
//   },
// };
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://medai-wlfd.onrender.com/api';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const api = {
  // Test connection
  testConnection: async () => {
    try {
      const response = await axiosInstance.get('/health');
      return response.data;
    } catch (error) {
      console.error('Connection test failed:', error);
      throw error;
    }
  },

  // Search medicines
  searchMedicines: async (query) => {
    try {
      console.log('Searching for:', query);
      const response = await axiosInstance.get(`/medicines/search?q=${encodeURIComponent(query)}`);
      console.log('Search response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Search API error:', error);
      return [];
    }
  },
  
  // Get all medicines
  getAllMedicines: async () => {
    try {
      const response = await axiosInstance.get('/medicines');
      return response.data;
    } catch (error) {
      console.error('Get all medicines error:', error);
      return [];
    }
  },
  
  // Get medicine stats
  getMedicineStats: async () => {
    try {
      const response = await axiosInstance.get('/medicines/stats/count');
      return response.data;
    } catch (error) {
      console.error('Get stats error:', error);
      return { totalMedicines: 0 };
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
  
  // Parse dose request
  parseDoseRequest: async (message) => {
    try {
      const response = await axiosInstance.post('/chat/parse-dose', { message });
      return response.data;
    } catch (error) {
      console.error('Parse dose error:', error);
      return { medicine: null, weight: null, age: null };
    }
  },
  
  // Chat message
  chatMessage: async (message) => {
    try {
      const response = await axiosInstance.post('/chat/message', { message });
      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      return { reply: "Sorry, I'm having trouble connecting. Please make sure the backend server is running." };
    }
  },
  
  // Get calculators list
  getCalculators: async () => {
    return [
      { id: 'crcl', name: 'Creatinine Clearance (Cockcroft-Gault)', description: 'Estimates renal function for drug dosing', icon: 'Heart' },
      { id: 'ckd-epi', name: 'CKD-EPI eGFR', description: 'Estimates GFR using creatinine equation', icon: 'Activity' },
      { id: 'map', name: 'Mean Arterial Pressure (MAP)', description: 'Calculates average arterial pressure', icon: 'Gauge' },
      { id: 'chads-vasc', name: 'CHA₂DS₂-VASc Score', description: 'Stroke risk assessment in AF', icon: 'Brain' },
      { id: 'bmi-bsa', name: 'BMI & BSA', description: 'Body mass index and surface area', icon: 'Scale' },
    ];
  },
};