import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Select, Button, Alert, Spin } from "antd";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  withCredentials: true,
});

const Translation = () => {
  const { videoId } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const youtubeUrl = searchParams.get("url");

  const [targetLanguage, setTargetLanguage] = useState("");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const languages = [
    { value: "Hindi", label: "Hindi" },
    { value: "Spanish", label: "Spanish" },
    { value: "French", label: "French" },
    { value: "German", label: "German" },
    { value: "Japanese", label: "Japanese" },
    { value: "Korean", label: "Korean" },
    { value: "Chinese", label: "Chinese" },
    { value: "Telugu", label: "Telugu" },
    { value: "Bengali", label: "Bengali" },
  ];

  const handleTranslate = async () => {
    if (!targetLanguage) {
      setError("Please select a target language");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data } = await api.post("/api/get_translation", {
        youtube_url: decodeURIComponent(youtubeUrl),
        targetlanguage: targetLanguage,
      });
      setTranslation(data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] overflow-auto p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Video Translation</h2>
          <div className="flex gap-4 mb-6">
            <Select
              placeholder="Select target language"
              style={{ width: 200 }}
              onChange={setTargetLanguage}
              options={languages}
            />
            <Button
              type="primary"
              onClick={handleTranslate}
              disabled={isLoading}
            >
              Translate
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-32">
            <Spin size="large" />
          </div>
        )}

        {error && <Alert message={error} type="error" className="mb-4" />}

        {translation && (
          <div className="space-y-6 text-lg bg-white p-6 rounded-lg shadow">
            {translation.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Translation;
