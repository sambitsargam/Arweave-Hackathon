import React from "react";
import GIF from "../assets/img/splash.gif";
function ThemedSuspense() {
  return (
    <div className="w-full flex flex-col items-center justify-center h-screen p-6 text-lg font-medium text-gray-600 dark:text-gray-400 dark:bg-gray-900">
      <img src={GIF} className="h-64 mb-20" />
    </div>
  );
}

export default ThemedSuspense;
