import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Alert, Button, Spin } from "antd";
import { FileText, Download, BookOpen } from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  withCredentials: true,
});

const Summary = () => {
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadLoading, setDownloadLoading] = useState(false);
  const { videoId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const youtubeUrl = searchParams.get("url");

  useEffect(() => {
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
        setError(err.response?.data?.error || err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSummary();
  }, [youtubeUrl]);

  const handleDownload = async () => {
    setDownloadLoading(true);
    try {
      const response = await api.post(
        "/api/download",
        {
          youtube_url: decodeURIComponent(youtubeUrl),
          summary: summary,
        },
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([response.data], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `summary_${videoId}.txt`;
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (err) {
      setError("Failed to download summary");
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] overflow-y-auto">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Video Summary
          </h2>
          <p className="text-slate-600 text-center max-w-lg">
            Get a concise overview of the video content
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Spin size="large" />
          </div>
        ) : error ? (
          <Alert message={error} type="error" showIcon className="mb-6" />
        ) : (
          summary && (
            <>
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 relative">
                <Button
                  type="primary"
                  icon={<Download className="w-4 h-4" />}
                  onClick={handleDownload}
                  loading={downloadLoading}
                  className="bg-indigo-600 hover:bg-indigo-700 absolute top-4 right-4"
                >
                  Download Summary
                </Button>
                <div className="flex items-center gap-2 mb-4 text-slate-600">
                  <FileText className="w-5 h-5" />
                  <span className="font-medium">Summary Content</span>
                </div>
                <div className="prose max-w-none">
                  {summary.split("\n\n").map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-slate-800 leading-relaxed mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Summary;
