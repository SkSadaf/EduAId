import React from "react";

const Summary = () => {
  return (
    <div className="h-[calc(100vh-200px)] overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Video Summary</h2>
        <div className="space-y-6 text-lg">
          <p>Key points from the video will appear here...</p>
        </div>
      </div>
    </div>
  );
};

export default Summary;
