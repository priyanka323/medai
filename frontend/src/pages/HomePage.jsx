import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calculator, MessageCircle, Shield, TrendingUp, Clock } from 'lucide-react';

export default function HomePage() {
  const features = [
    { icon: Heart, title: 'Smart Dose Calculator', description: 'AI-powered medication dosing based on weight and age' },
    { icon: Calculator, title: 'Clinical Calculators', description: 'CrCl, eGFR, MAP, CHA₂DS₂-VASc, and more' },
    { icon: MessageCircle, title: 'AI Assistant', description: 'Chat with our AI for medication guidance' },
    { icon: Shield, title: 'Safety First', description: 'Built-in safety checks and contraindications' },
    { icon: TrendingUp, title: 'Evidence-Based', description: 'Based on latest clinical guidelines' },
    { icon: Clock, title: 'Quick & Easy', description: 'Instant results with interactive UI' },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center py-16 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl">
        <div className="flex justify-center mb-6">
          <img src="/logo192.png" alt="MediDose Logo" className="h-12 w-12" />
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
          Medical Dose Calculator
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          AI-powered clinical decision support for accurate medication dosing and risk assessment
        </p>
        <div className="flex justify-center space-x-4 mt-8">
          <Link
            to="/dose"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition font-semibold"
          >
            Calculate Dose
          </Link>
          <Link
            to="/calculators"
            className="px-6 py-3 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition font-semibold"
          >
            Explore Calculators
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div>
        <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg w-fit mb-4">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-xl">
          <div className="text-3xl font-bold text-green-600">50+</div>
          <div className="text-gray-600 dark:text-gray-400">Medications</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl">
          <div className="text-3xl font-bold text-blue-600">10+</div>
          <div className="text-gray-600 dark:text-gray-400">Clinical Calculators</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
          <div className="text-3xl font-bold text-purple-600">24/7</div>
          <div className="text-gray-600 dark:text-gray-400">AI Assistant Support</div>
        </div>
      </div>
    </div>
  );
}