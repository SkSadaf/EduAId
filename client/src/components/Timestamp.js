import React, { useState } from "react";
import { Input, Button, Alert, Spin } from "antd";
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
        setError(data.message);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Topic Timestamps</h2>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Enter topic to find timestamps"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1"
            />
            <Button type="primary" onClick={handleSearch} disabled={isLoading}>
              Search
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        )}

        {error && <Alert message={error} type="error" className="mb-4" />}

        {timestamps && (
          <div className="space-y-6 text-lg bg-white p-6 rounded-lg shadow">
            {timestamps}
          </div>
        )}
      </div>
    </div>
  );
};

export default Timestamp;
