import React from 'react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          About MediDose
        </h1>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            MediDose is dedicated to providing accurate, evidence-based medication dosing tools to healthcare professionals and caregivers. Our mission is to enhance patient safety through intelligent clinical decision support.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">How It Works</h2>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
            Our platform uses AI-powered algorithms to calculate safe medication doses based on patient weight, age, and clinical guidelines. Each calculation is validated against established medical references and includes safety warnings for contraindications and drug interactions.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Medical Disclaimer</h2>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-yellow-800 dark:text-yellow-200 text-sm leading-relaxed">
              ⚠️ IMPORTANT: The information provided by MediDose is for educational purposes only and should not replace professional medical advice. Always consult with a qualified healthcare provider before administering any medication. The calculations are based on standard guidelines but may not account for individual patient factors, comorbidities, or specific clinical situations.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Data Sources</h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
            <li>British National Formulary (BNF)</li>
            <li>Lexicomp Drug Information</li>
            <li>ACC/AHA Clinical Guidelines</li>
            <li>KDIGO Clinical Practice Guidelines</li>
          </ul>
        </section>
      </div>
    </div>
  );
}