import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Button, FloatButton } from "antd";
import axios from "axios";
import {
  MessageOutlined,
  SendOutlined,
  CloseOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  withCredentials: true,
});

const WatchVideo = () => {
  const { videoId } = useParams();
  const location = useLocation();
  const [isChatExpanded, setIsChatExpanded] = useState(true);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setChatHistory((prev) => [...prev, { type: "user", content: userMessage }]);
    setMessage("");
    setIsLoading(true);

    try {
      const searchParams = new URLSearchParams(location.search);
      const youtubeUrl = searchParams.get("url");

      const { data } = await api.post("/api/get_qa", {
        youtube_url: decodeURIComponent(youtubeUrl),
        question: userMessage,
      });

      if (data.status === "success") {
        setChatHistory((prev) => [
          ...prev,
          { type: "bot", content: data.answer },
        ]);
      } else {
        throw new Error(data.message || "Failed to get response");
      }
    } catch (error) {
      message.error(error.message || "Failed to get response");
      setChatHistory((prev) => [
        ...prev,
        {
          type: "bot",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex relative">
      <div
        className={`flex-1 transition-all duration-300 ${
          isChatExpanded ? "w-2/3" : "w-full"
        }`}
      >
        <iframe
          className="w-full h-full rounded-lg"
          src={`https://www.youtube.com/embed/${videoId}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />

        {!isChatExpanded && (
          <FloatButton
            icon={<MessageOutlined />}
            type="primary"
            style={{ right: 24, top: 100 }}
            tooltip="Open Chat"
            onClick={() => setIsChatExpanded(true)}
          />
        )}
      </div>

      <div
        className={`bg-white border-l border-gray-200 transition-all duration-300 flex flex-col
        ${isChatExpanded ? "w-1/3" : "w-0"}`}
      >
        <div className="flex justify-between items-center p-4 rounded bg-blue-600">
          <h3
            className={`font-semibold text-white ${
              !isChatExpanded && "hidden"
            }`}
          >
            AI Chat Companion
          </h3>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={() => setIsChatExpanded(false)}
            className="text-white hover:text-gray-200"
          />
        </div>

        {isChatExpanded && (
          <>
            <div className="flex-1 p-4 overflow-auto space-y-4">
              {chatHistory.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 
                    ${
                      msg.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <LoadingOutlined /> Thinking...
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t bg-gray-50"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about the video..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isLoading}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  disabled={isLoading}
                  className="flex items-center"
                />
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default WatchVideo;
