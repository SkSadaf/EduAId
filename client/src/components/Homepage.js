import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const features = [
    {
      emoji: "🧠",
      title: "Smart Summaries",
      description:
        "Get concise, accurate summaries of any YouTube video content",
    },
    {
      emoji: "📝",
      title: "Interactive Quizzes",
      description: "Test your understanding with auto-generated quizzes",
    },
    {
      emoji: "🌎",
      title: "Multi-language Support",
      description: "Translate content into multiple languages instantly",
    },
    {
      emoji: "⚡",
      title: "Time-Saving",
      description:
        "Extract key insights quickly without watching entire videos",
    },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      const encodedUrl = encodeURIComponent(url);
      navigate(`/video/${videoId}?url=${encodedUrl}`);
    } catch (error) {
      console.error("URL parsing error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Your AI Video Learning Assistant
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Transform any YouTube video into an interactive learning experience
          </p>

          <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="flex gap-4 mb-16">
              <input
                type="url"
                placeholder="Enter YouTube URL"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="flex-1 px-6 py-4 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                Begin
                <span className="text-xl">→</span>
              </button>
            </form>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="mb-4 text-4xl">{feature.emoji}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Homepage;
