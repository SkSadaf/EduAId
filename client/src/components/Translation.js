import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Select, Button, Alert, Spin } from "antd";
import { Globe, FileText } from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  withCredentials: true,
});

const Translation = () => {
  const [targetLanguage, setTargetLanguage] = useState("");
  const [translation, setTranslation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const youtubeUrl = searchParams.get("url");

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
    <div className="h-[calc(100vh-200px)] overflow-y-auto">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl text-center font-bold text-slate-900 mb-2">
            Translation
          </h2>
          <p className="text-slate-600 text-center max-w-lg">
            Select your preferred language to translate the video content
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex gap-4 justify-center">
            <Select
              placeholder="Select target language"
              style={{ width: 200 }}
              onChange={setTargetLanguage}
              options={languages}
              className="h-10"
            />
            <Button
              type="primary"
              onClick={handleTranslate}
              disabled={isLoading}
              className="h-10 bg-blue-600"
            >
              Translate
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

        {translation && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-2 mb-4 text-slate-600">
              <FileText className="w-5 h-5" />
              <span className="font-medium">Translated Content</span>
            </div>
            <div className="space-y-4 text-slate-800">
              {translation.split("\n\n").map((paragraph, index) => (
                <p key={index} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Translation;
