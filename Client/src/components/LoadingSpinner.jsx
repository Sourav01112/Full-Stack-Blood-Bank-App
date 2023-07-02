import React from "react";

export const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black opacity-80 z-50 flex justify-center items-center">
      <div className="border-4 h-10 w-10 border-white border-solid border-t-transparent animate-spin rounded-full"></div>
    </div>
  );
};
