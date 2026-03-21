// import React, { useState, useEffect, useRef } from 'react';
// import { Search, X } from 'lucide-react';
// import { api } from '../services/api';

// export default function MedicineSearch({ value, onSelect, placeholder = "Search medicine..." }) {
//   const [query, setQuery] = useState(value?.name || "");
//   const [results, setResults] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const containerRef = useRef(null);

//   useEffect(() => {
//     const handler = (e) => {
//       if (containerRef.current && !containerRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handler);
//     return () => document.removeEventListener("mousedown", handler);
//   }, []);

//   useEffect(() => {
//     if (query.length < 2) {
//       setResults([]);
//       setOpen(false);
//       return;
//     }
    
//     setLoading(true);
//     const timer = setTimeout(async () => {
//       try {
//         const data = await api.searchMedicines(query);
//         const uniqueData = Array.from(new Map(data.map(item => [item.id, item])).values());
//         setResults(uniqueData);
//         setOpen(true);
//       } catch (error) {
//         console.error("Search failed:", error);
//         setResults([]);
//       } finally {
//         setLoading(false);
//       }
//     }, 300);
    
//     return () => clearTimeout(timer);
//   }, [query]);

//   const handleSelect = (med) => {
//     setQuery(med.name);
//     setOpen(false);
//     onSelect(med);
//   };

//   const handleChange = (e) => {
//     setQuery(e.target.value);
//     onSelect(null);
//   };

//   const clearSearch = () => {
//     setQuery("");
//     onSelect(null);
//     setOpen(false);
//   };

//   return (
//     <div className="relative w-full" ref={containerRef}>
//       <div className="relative">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
//         <input
//           className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition dark:bg-gray-800 dark:border-gray-600 dark:text-white"
//           placeholder={placeholder}
//           value={query}
//           onChange={handleChange}
//           onFocus={() => results.length > 0 && setOpen(true)}
//           autoComplete="off"
//         />
//         {query && (
//           <button
//             onClick={clearSearch}
//             className="absolute right-3 top-1/2 transform -translate-y-1/2"
//           >
//             <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
//           </button>
//         )}
//         {loading && (
//           <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//             <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
//           </div>
//         )}
//       </div>

//       {open && results.length > 0 && (
//         <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
//           {results.map((med) => (
//             <div
//               key={med.id}
//               className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition"
//               onClick={() => handleSelect(med)}
//             >
//               <div className="flex-1">
//                 <div className="font-medium text-gray-900 dark:text-white">{med.name}</div>
//                 <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
//                   {med.category} · {med.route}
//                 </div>
//               </div>
//               {med.dose_per_kg && (
//                 <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full whitespace-nowrap ml-2">
//                   {med.dose_per_kg} mg/kg
//                 </span>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { api } from '../services/api';

export default function MedicineSearch({ value, onSelect, placeholder = "Type medicine name..." }) {
  const [query, setQuery] = useState(value?.name || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Search medicines when query changes
  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const data = await api.searchMedicines(query);
        console.log('Search results:', data);
        setResults(data);
        setOpen(data.length > 0);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (med) => {
    setQuery(med.name);
    setOpen(false);
    onSelect(med);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSelect(null);
  };

  const clearSearch = () => {
    setQuery("");
    onSelect(null);
    setOpen(false);
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          placeholder={placeholder}
          value={query}
          onChange={handleChange}
          onFocus={() => results.length > 0 && setOpen(true)}
          autoComplete="off"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        {loading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-500"></div>
          </div>
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto z-50">
          {results.map((med) => (
            <div
              key={med.id}
              className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition"
              onClick={() => handleSelect(med)}
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900 dark:text-white">{med.name}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {med.category} · {med.route}
                </div>
              </div>
              {med.dose_per_kg && (
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full whitespace-nowrap ml-2">
                  {med.dose_per_kg} mg/kg
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}