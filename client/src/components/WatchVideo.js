import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SendOutlined,
} from "@ant-design/icons";

const WatchVideo = () => {
  const { videoId } = useParams();
  const [isChatExpanded, setIsChatExpanded] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setChatHistory([...chatHistory, { type: "user", content: message }]);
      setMessage("");
      // Add API call here for chat response
    }
  };

  return (
    <div className="h-[calc(100vh-200px)] flex">
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
      </div>

      <div
        className={`bg-white border-l border-gray-200 transition-all duration-300 flex flex-col
        ${isChatExpanded ? "w-1/3" : "w-0"}`}
      >
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className={`font-semibold ${!isChatExpanded && "hidden"}`}>
            Chat
          </h3>
          <Button
            type="text"
            icon={
              isChatExpanded ? <MenuFoldOutlined /> : <MenuUnfoldOutlined />
            }
            onClick={() => setIsChatExpanded(!isChatExpanded)}
            className="flex items-center"
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
            </div>

            <form onSubmit={handleSendMessage} className="p-4 border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your question..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
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
