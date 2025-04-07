import React from "react";

export function LoadingScreen() {
  
  return (
    <div className="fixed inset-0 bg-blue-600 flex flex-col items-center justify-center z-50">
      <div className="text-center">
        <h1 className="text-white text-4xl font-bold mb-4">ShivajiKvastudentdata</h1>
        <div className="w-16 h-16 border-t-4 border-blue-200 border-solid rounded-full animate-spin mb-6"></div>
        <p className="text-blue-100 text-xl">Provided to you by Eshan Ali</p>
      </div>
    </div>
  );
}

export default LoadingScreen;