import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

export const Alert = ({ type = 'info', children, className = '' }) => {
  const colors = {
    info: 'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
    danger: 'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/20 dark:text-red-200',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-200',
    success: 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/20 dark:text-green-200',
  };
  return (
    <div className={`p-4 border-l-4 rounded-lg ${colors[type]} ${className}`}>
      {children}
    </div>
  );
};

export const Spinner = () => (
  <div className="inline-block animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
);

export const Badge = ({ children, color = 'gray' }) => {
  const colors = {
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    green: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    red: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};