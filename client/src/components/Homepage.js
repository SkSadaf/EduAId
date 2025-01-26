import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";

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

  const developers = [
    {
      name: "Sai Varun Reddy",
      role: "Frontend Developer",
      image: "/team/varun.jpg",
    },
    {
      name: "Rishma Manna",
      role: "Backend Developer",
      image: "/team/rishma.jpg",
    },
    {
      name: "Sadaf Shaik",
      role: "ML Engineer",
      image: "/team/sadaf.jpg",
    },
    {
      name: "Sai Harshitha",
      role: "UI/UX Designer",
      image: "/team/harshi.jpg",
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      <main className="flex-grow">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent),radial-gradient(circle_at_70%_60%,rgba(147,51,234,0.1),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 py-16 relative">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
              Edu-AId
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              What do you wanna learn today ?
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
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  Begin
                  <span className="text-xl">→</span>
                </button>
              </form>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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
      </main>

      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Meet Our Team
            </h2>
            <p className="text-gray-600">The brilliant minds behind EduAId</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {developers.map((dev, index) => (
              <div key={index} className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white shadow-lg">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{dev.name}</h3>
                <p className="text-sm text-gray-600">{dev.role}</p>
              </div>
            ))}
          </div>

          <div className="text-center text-sm text-gray-600">
            <p className="flex items-center justify-center gap-1">
              Made with <Heart className="w-4 h-4 text-red-500" /> by Team
              EduAId
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
