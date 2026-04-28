import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  return (
    <div className="flex items-center justify-center p-4 my-8 bg-red-900/30 border border-red-500 rounded-lg max-w-lg mx-auto">
      <AlertCircle className="w-6 h-6 text-red-500 mr-3" />
      <p className="text-red-200">{message}</p>
    </div>
  );
};

export default ErrorMessage;
