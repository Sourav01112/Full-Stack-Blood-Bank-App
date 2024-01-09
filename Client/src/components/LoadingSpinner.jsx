import React from "react";

export const LoadingSpinner = () => {
  return (
    // <div className="fixed inset-0 bg-black opacity-80 z-[9999] flex justify-center items-center">
    //   <div className="border-5 h-20 w-1 border-white border-solid border-t-transparent animate-spin"></div>
    // </div>

    <div className="fixed inset-0 bg-black bg-opacity-80 z-[9999] flex justify-center items-center">
    <div className="border-4 h-20 w-20 border-white border-solid border-t-transparent rounded-full animate-spin">
      {/* You can customize the spinner icon or use an SVG here */}
      <svg
        className="animate-spin h-16 w-16 text-white"
        fill="none"
        viewBox="0 0 30 30"
        stroke="currentColor"
      >
        <circle cx="12" cy="12" r="8" strokeWidth="5" strokeLinecap="round" />
        <path d="M12 2a10 10 0 0 1 10 10h-2a8 8 0 0 0-8-8V2z" />
      </svg>
    </div>
    <div className="ml-4 text-white">{"please wait..."}</div>
  </div>
  
  );
};
