import React from 'react';
import { CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function DoseResult({ result }) {
  if (!result) return null;

  const { medicine, category, route, patient, dosing, safe, warnings, notes, interactions } = result;

  return (
    <div className={`mt-6 rounded-xl overflow-hidden shadow-lg transition-all ${
      safe ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20' : 
      'bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20'
    }`}>
      {/* Header */}
      <div className={`p-4 ${safe ? 'bg-green-500' : 'bg-red-500'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-white">
            {safe ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span className="font-semibold">{safe ? 'Safe Dose' : 'Review Required'}</span>
          </div>
          <div className="flex space-x-2">
            <span className="px-2 py-1 bg-white/20 rounded text-xs text-white">{category}</span>
            <span className="px-2 py-1 bg-white/20 rounded text-xs text-white">{route}</span>
            <span className="px-2 py-1 bg-white/20 rounded text-xs text-white">{patient.patient_type}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Medicine Name */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{medicine}</h2>

        {/* Hero Dose */}
        <div className="text-center mb-6">
          <div className="inline-flex items-baseline bg-white dark:bg-gray-800 rounded-2xl px-6 py-4 shadow-md">
            <span className="text-5xl font-bold text-blue-600 dark:text-blue-400">{dosing.final_dose_mg}</span>
            <span className="text-xl text-gray-500 ml-1">mg</span>
            <span className="text-sm text-gray-500 ml-2">per dose</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {dosing.frequency} · {dosing.doses_per_day} times daily
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{dosing.daily_dose_mg} mg</div>
            <div className="text-xs text-gray-500">Daily Total</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{dosing.dose_per_kg_used} mg/kg</div>
            <div className="text-xs text-gray-500">Dose Formula</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{dosing.doses_per_day}×</div>
            <div className="text-xs text-gray-500">Times / Day</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
            <div className="text-lg font-bold text-gray-900 dark:text-white">{dosing.max_single_dose_mg} mg</div>
            <div className="text-xs text-gray-500">Max Single</div>
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mb-4 space-y-2">
            {warnings.map((w, i) => (
              <div key={i} className={`flex items-start space-x-2 p-3 rounded-lg ${
                w.includes('WARNING') ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' : 
                'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
              }`}>
                <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{w}</span>
              </div>
            ))}
          </div>
        )}

        {/* Notes */}
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div>
              <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Clinical Notes</div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{notes}</p>
            </div>
          </div>
        </div>

        {/* Interactions */}
        {interactions?.length > 0 && (
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">Known Interactions</div>
            <div className="flex flex-wrap gap-2">
              {interactions.map((i) => (
                <span key={i} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded text-xs text-gray-700 dark:text-gray-300">
                  {i}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}