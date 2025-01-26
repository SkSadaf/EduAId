import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Alert, Button, Spin } from "antd";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  withCredentials: true,
});

const Summary = () => {
  const { videoId } = useParams();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  console.log(searchParams, "String");
  const youtubeUrl = searchParams.get("url");
  console.log(youtubeUrl, "youtubeUrl");

  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSummary = async () => {
    if (!youtubeUrl) return;
    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/api/summarize", {
        youtube_url: decodeURIComponent(youtubeUrl),
      });
      setSummary(data.summary);
    } catch (err) {
      console.error("Error details:", err);
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [youtubeUrl]);

  const handleDownload = async () => {
    try {
      const response = await api.post(
        "/download",
        {
          url: decodeURIComponent(youtubeUrl),
          summary,
        },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `summary_${videoId}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Video Summary</h2>
          {summary && (
            <Button type="primary" onClick={handleDownload}>
              Download Summary
            </Button>
          )}
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        )}

        {error && <Alert message={error} type="error" className="mb-4" />}

        {summary && (
          <div className="space-y-6 text-lg bg-white p-6 rounded-lg shadow">
            {summary.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Summary;
