import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      console.log("Submitted URL:", url);
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      console.log("Extracted videoId:", videoId);
      const encodedUrl = encodeURIComponent(url);
      console.log("Navigation path:", `/video/${videoId}?url=${encodedUrl}`);
      navigate(`/video/${videoId}?url=${encodedUrl}`);
    } catch (error) {
      console.error("URL parsing error:", error);
    }
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
