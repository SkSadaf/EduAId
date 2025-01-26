import React, { useState } from "react";
import { Input, Button, Alert, Spin } from "antd";
import { Search, FileText } from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  withCredentials: true,
});

const Timestamp = () => {
  const [topic, setTopic] = useState("");
  const [timestamps, setTimestamps] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!topic) {
      setError("Please enter a topic");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const searchParams = new URLSearchParams(window.location.search);
      const youtubeUrl = searchParams.get("url");

      const { data } = await api.post("/api/get_timestamps", {
        youtube_url: decodeURIComponent(youtubeUrl),
        topic: topic,
      });

      if (data.status === "success") {
        setTimestamps(data.timestamps);
      } else {
        throw new Error(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] overflow-y-auto">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Topic Timestamps
          </h2>
          <p className="text-slate-600 text-center max-w-lg">
            Find specific moments in the video by searching for topics
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex gap-4 justify-center">
            <Input
              prefix={<Search className="w-4 h-4 text-slate-400" />}
              placeholder="Enter topic to find timestamps"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="max-w-md"
            />
            <Button
              type="primary"
              onClick={handleSearch}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Search
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        )}

        {error && (
          <Alert message={error} type="error" className="mb-6" showIcon />
        )}

        {timestamps && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-600">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Found Timestamps</span>
            </div>
            <div className="prose max-w-none text-slate-800">{timestamps}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Timestamp;
