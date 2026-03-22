// import React, { useState, useEffect } from 'react';
// import MedicineSearch from '../components/MedicineSearch';
// import DoseResult from '../components/DoseResult';
// import AIChatBot from '../components/AIChatBot';
// import { Alert, Spinner, Card } from '../components/UI';
// import { api } from '../services/api';
// import toast from 'react-hot-toast';

// export default function CalculatorPage() {
//   const [selectedMed, setSelectedMed] = useState(null);
//   const [weight, setWeight] = useState('');
//   const [ageYears, setAgeYears] = useState('');
//   const [ageMonths, setAgeMonths] = useState('');
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//  // const [showAIChat, setShowAIChat] = useState(true);
//   const [aiSuggestion, setAiSuggestion] = useState(null);
//   const [dbStatus, setDbStatus] = useState(null);
//   const [medicineCount, setMedicineCount] = useState(0);

//   useEffect(() => {
//     // Check database connection
//     const checkDatabase = async () => {
//       try {
//         const stats = await api.getMedicineStats();
//         setMedicineCount(stats.totalMedicines);
//         setDbStatus('connected');
//         toast.success(`Connected to database with ${stats.totalMedicines} medicines`);
//       } catch (err) {
//         console.error('Database connection error:', err);
//         setDbStatus('error');
//         toast.error('Cannot connect to database. Please check if backend server is running.');
//       }
//     };
//     checkDatabase();
//   }, []);

//   const totalMonths = () => (parseFloat(ageYears) || 0) * 12 + (parseFloat(ageMonths) || 0);

//   const handleCalculate = async () => {
//     if (!selectedMed) {
//       toast.error('Please select a medicine');
//       return;
//     }
//     if (!weight) {
//       toast.error('Please enter weight');
//       return;
//     }
    
//     setLoading(true);
//     setError(null);
//     setResult(null);
//     try {
//       const data = await api.calculateDose({
//         medicine_id: selectedMed.id,
//         weight_kg: parseFloat(weight),
//         age_months: totalMonths() || 1,
//       });
//       setResult(data);
//       toast.success('Dose calculated successfully!');
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//       toast.error('Failed to calculate dose');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAISuggestion = (suggestion) => {
//     setAiSuggestion(suggestion);
//     if (suggestion.medicine) {
//       setSelectedMed(suggestion.medicine);
//       toast.success('AI suggestion applied!');
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto">
//       {/* Database Status Banner */}
//       {dbStatus === 'connected' && (
//         <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
//           <p className="text-sm text-green-700 dark:text-green-300">
//             ✅ Database connected successfully with {medicineCount} medicines available
//           </p>
//         </div>
//       )}
      
//       {dbStatus === 'error' && (
//         <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
//           <p className="text-sm text-red-700 dark:text-red-300">
//             ⚠️ Cannot connect to database. Please make sure the backend server is running at http://localhost:5000
//           </p>
//         </div>
//       )}

//       <div className="mb-8 text-center">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           AI-Powered Dose Calculator
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400 mt-2">
//           Smart dosing with predictive analytics and clinical intelligence
//         </p>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
//         {/* Left Column - AI Chat */}
//         <div className="lg:col-span-1">
//           <Card className="sticky top-24">
//             <div className="">
//               <AIChatBot onRecommendation={handleAISuggestion} />
//             </div>
//           </Card>
//         </div>

//         {/* Right Column - Calculator */}
//         <div className="flex justify-center">
//           <Card>
//             <div className="p-6">
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Medication Details</h2>
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Medicine *
//                   </label>
//                   <MedicineSearch
//                     value={selectedMed}
//                     onSelect={(med) => {
//                       setSelectedMed(med);
//                       setResult(null);
//                       setError(null);
//                     }}
//                     placeholder="Type medicine name..."
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Weight (kg) *
//                   </label>
//                   <input
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-800 dark:text-white"
//                     type="number"
//                     min="0.5"
//                     step="0.1"
//                     placeholder="e.g., 70"
//                     value={weight}
//                     onChange={(e) => setWeight(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                     Age
//                   </label>
//                   <div className="grid grid-cols-2 gap-3">
//                     <input
//                       className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-800 dark:text-white"
//                       type="number"
//                       min="0"
//                       placeholder="Years"
//                       value={ageYears}
//                       onChange={(e) => setAgeYears(e.target.value)}
//                     />
//                     <input
//                       className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-800 dark:text-white"
//                       type="number"
//                       min="0"
//                       max="11"
//                       placeholder="Months"
//                       value={ageMonths}
//                       onChange={(e) => setAgeMonths(e.target.value)}
//                     />
//                   </div>
//                 </div>

//                 <button
//                   className="w-full py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                   onClick={handleCalculate}
//                   disabled={!selectedMed || !weight || loading || dbStatus === 'error'}
//                 >
//                   {loading ? <Spinner /> : 'Calculate Safe Dose →'}
//                 </button>

//                 {error && (
//                   <Alert type="danger" className="mt-4">
//                     {error}
//                   </Alert>
//                 )}
//               </div>
//             </div>
//           </Card>

//           {result && <DoseResult result={result} />}
//         </div>
//       </div>
//     </div>
//   );
// // }
// import React, { useState, useEffect } from 'react';
// import MedicineSearch from '../components/MedicineSearch';
// import DoseResult from '../components/DoseResult';
// import AIChatBot from '../components/AIChatBot';
// import { Alert, Spinner, Card } from '../components/UI';
// import { api } from '../services/api';
// import toast from 'react-hot-toast';

// export default function CalculatorPage() {
//   const [selectedMed, setSelectedMed] = useState(null);
//   const [weight, setWeight] = useState('');
//   const [ageYears, setAgeYears] = useState('');
//   const [ageMonths, setAgeMonths] = useState('');
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [aiSuggestion, setAiSuggestion] = useState(null);
//   const [dbStatus, setDbStatus] = useState(null);
//   const [medicineCount, setMedicineCount] = useState(0);

//   useEffect(() => {
//     // Check database connection
//     const checkDatabase = async () => {
//       try {
//         const stats = await api.getMedicineStats();
//         setMedicineCount(stats.totalMedicines);
//         setDbStatus('connected');
//         toast.success(`Connected to database with ${stats.totalMedicines} medicines`);
//       } catch (err) {
//         console.error('Database connection error:', err);
//         setDbStatus('error');
//         toast.error('Cannot connect to database. Please check if backend server is running.');
//       }
//     };
//     checkDatabase();
//   }, []);

//   const totalMonths = () => (parseFloat(ageYears) || 0) * 12 + (parseFloat(ageMonths) || 0);

//   const handleCalculate = async () => {
//     if (!selectedMed) {
//       toast.error('Please select a medicine');
//       return;
//     }
//     if (!weight) {
//       toast.error('Please enter weight');
//       return;
//     }
    
//     setLoading(true);
//     setError(null);
//     setResult(null);
//     try {
//       const data = await api.calculateDose({
//         medicine_id: selectedMed.id,
//         weight_kg: parseFloat(weight),
//         age_months: totalMonths() || 1,
//       });
//       setResult(data);
//       toast.success('Dose calculated successfully!');
//     } catch (err) {
//       setError(err.response?.data?.error || err.message);
//       toast.error('Failed to calculate dose');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleAISuggestion = (suggestion) => {
//     setAiSuggestion(suggestion);
//     if (suggestion.medicine) {
//       setSelectedMed(suggestion.medicine);
//       toast.success('AI suggestion applied!');
//     }
//   };

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Database Status Banner */}
//       {dbStatus === 'connected' && (
//         <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded">
//           <p className="text-sm text-green-700 dark:text-green-300">
//             ✅ Database connected successfully with {medicineCount} medicines available
//           </p>
//         </div>
//       )}
      
//       {dbStatus === 'error' && (
//         <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded">
//           <p className="text-sm text-red-700 dark:text-red-300">
//             ⚠️ Cannot connect to database. Please make sure the backend server is running at http://localhost:5000
//           </p>
//         </div>
//       )}

//       {/* Page Header */}
//       <div className="mb-8 text-center">
//         <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//           AI-Powered Dose Calculator
//         </h1>
//         <p className="text-gray-600 dark:text-gray-400 mt-2">
//           Smart dosing with predictive analytics and clinical intelligence
//         </p>
//       </div>

//       {/* Vertical Layout - Everything Stacked */}
//       <div className="flex flex-col gap-6">
//         {/* AI Chat Section - Full Width */}
//         <Card>
//           <AIChatBot onRecommendation={handleAISuggestion} />
//         </Card>

//         {/* Medication Form Section */}
//         <Card>
//           <div className="p-6">
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
//               Medication Details
//             </h2>
            
//             <div className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Medicine *
//                 </label>
//                 <MedicineSearch
//                   value={selectedMed}
//                   onSelect={(med) => {
//                     setSelectedMed(med);
//                     setResult(null);
//                     setError(null);
//                   }}
//                   placeholder="Type medicine name..."
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Weight (kg) *
//                 </label>
//                 <input
//                   className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-800 dark:text-white"
//                   type="number"
//                   min="0.5"
//                   step="0.1"
//                   placeholder="e.g., 70"
//                   value={weight}
//                   onChange={(e) => setWeight(e.target.value)}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
//                   Age
//                 </label>
//                 <div className="grid grid-cols-2 gap-3">
//                   <input
//                     className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-800 dark:text-white"
//                     type="number"
//                     min="0"
//                     placeholder="Years"
//                     value={ageYears}
//                     onChange={(e) => setAgeYears(e.target.value)}
//                   />
//                   <input
//                     className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-800 dark:text-white"
//                     type="number"
//                     min="0"
//                     max="11"
//                     placeholder="Months"
//                     value={ageMonths}
//                     onChange={(e) => setAgeMonths(e.target.value)}
//                   />
//                 </div>
//               </div>

//               <button
//                 className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
//                 onClick={handleCalculate}
//                 disabled={!selectedMed || !weight || loading || dbStatus === 'error'}
//               >
//                 {loading ? <Spinner /> : 'Calculate Safe Dose →'}
//               </button>

//               {error && (
//                 <Alert type="danger" className="mt-4">
//                   {error}
//                 </Alert>
//               )}
//             </div>
//           </div>
//         </Card>

//         {/* Results Section - Below the Form */}
//         {result && (
//           <div className="mt-2">
//             <DoseResult result={result} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from 'react';
import MedicineSearch from '../components/MedicineSearch';
import DoseResult from '../components/DoseResult';
import AIChatBot from '../components/AIChatBot';
import { Alert, Spinner, Card } from '../components/UI';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export default function CalculatorPage() {
  const [selectedMed, setSelectedMed] = useState(null);
  const [weight, setWeight] = useState('');
  const [ageYears, setAgeYears] = useState('');
  const [ageMonths, setAgeMonths] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbStatus, setDbStatus] = useState(null);
  const [medicineCount, setMedicineCount] = useState(0);

  useEffect(() => {
    // Check database connection
    const checkDatabase = async () => {
      try {
        const stats = await api.getMedicineStats();
        setMedicineCount(stats.totalMedicines);
        setDbStatus('connected');
        toast.success(`Connected to database with ${stats.totalMedicines} medicines`);
      } catch (err) {
        console.error('Database connection error:', err);
        setDbStatus('error');
        toast.error('Cannot connect to database. Please check if backend server is running.');
      }
    };
    checkDatabase();
  }, []);

  const totalMonths = () => (parseFloat(ageYears) || 0) * 12 + (parseFloat(ageMonths) || 0);

  const handleCalculate = async () => {
    if (!selectedMed) {
      toast.error('Please select a medicine');
      return;
    }
    if (!weight) {
      toast.error('Please enter weight');
      return;
    }
    
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await api.calculateDose({
        medicine_id: selectedMed.id,
        weight_kg: parseFloat(weight),
        age_months: totalMonths() || 1,
      });
      setResult(data);
      toast.success('Dose calculated successfully!');
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      toast.error('Failed to calculate dose');
    } finally {
      setLoading(false);
    }
  };

  const handleAISuggestion = (suggestion) => {
    if (suggestion.medicine) {
      setSelectedMed(suggestion.medicine);
      toast.success('AI suggestion applied!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      {/* Centered Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Database Status Banner */}
        {dbStatus === 'connected' && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 rounded-lg max-w-3xl mx-auto">
            <p className="text-sm text-green-700 dark:text-green-300">
              ✅ Database connected successfully with {medicineCount} medicines available
            </p>
          </div>
        )}
        
        {dbStatus === 'error' && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-lg max-w-3xl mx-auto">
            <p className="text-sm text-red-700 dark:text-red-300">
              ⚠️ Cannot connect to database. Please make sure the backend server is running.
            </p>
          </div>
        )}

        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            AI-Powered Dose Calculator
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Smart dosing with predictive analytics and clinical intelligence
          </p>
        </div>

        {/* Main Content - Centered with 70% width on desktop */}
        <div className="flex justify-center">
          <div className="w-full lg:w-[70%] space-y-6">
            {/* AI Chat Section */}
            <Card className="shadow-lg">
              <AIChatBot onRecommendation={handleAISuggestion} />
            </Card>

            {/* Medication Form Section */}
            <Card className="shadow-lg">
              <div className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Medication Details
                </h2>
                
                <div className="space-y-5">
                  {/* Medicine Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Medicine <span className="text-red-500">*</span>
                    </label>
                    <MedicineSearch
                      value={selectedMed}
                      onSelect={(med) => {
                        setSelectedMed(med);
                        setResult(null);
                        setError(null);
                      }}
                      placeholder="Type medicine name..."
                    />
                  </div>

                  {/* Weight Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Weight (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-800 dark:text-white transition"
                      type="number"
                      min="0.5"
                      step="0.1"
                      placeholder="e.g., 70"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </div>

                  {/* Age Field */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Age
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-800 dark:text-white transition"
                        type="number"
                        min="0"
                        placeholder="Years"
                        value={ageYears}
                        onChange={(e) => setAgeYears(e.target.value)}
                      />
                      <input
                        className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-800 dark:text-white transition"
                        type="number"
                        min="0"
                        max="11"
                        placeholder="Months"
                        value={ageMonths}
                        onChange={(e) => setAgeMonths(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Calculate Button */}
                  <button
                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-md"
                    onClick={handleCalculate}
                    disabled={!selectedMed || !weight || loading || dbStatus === 'error'}
                  >
                    {loading ? <Spinner /> : 'Calculate Safe Dose →'}
                  </button>

                  {/* Error Message */}
                  {error && (
                    <Alert type="danger" className="mt-4">
                      {error}
                    </Alert>
                  )}
                </div>
              </div>
            </Card>

            {/* Results Section - Below the Form */}
            {result && (
              <div className="mt-2 animate-fadeIn">
                <DoseResult result={result} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}