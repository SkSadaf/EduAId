import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Extract video ID from URL
    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    navigate(`/video/${videoId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">URL Processor</h1>
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            placeholder="Enter YouTube URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 text-white font-medium rounded-md bg-blue-600 hover:bg-blue-700"
          >
            Begin Processing
          </button>
        </form>
      </div>
    </div>
  );
};

export default Homepage;
