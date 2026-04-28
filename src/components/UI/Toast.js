import React, { useEffect } from 'react';

// Simple Toast Component (Could be expanded or replaced with a library like react-hot-toast)
const Toast = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-600' : 'bg-blue-600';

  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-xl flex items-center space-x-3 z-50 animate-fade-in-up`}>
      <span>{message}</span>
      <button onClick={onClose} className="text-white hover:text-gray-200">
        &times;
      </button>
    </div>
  );
};

export default Toast;
