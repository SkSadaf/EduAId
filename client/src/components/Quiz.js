import React, { useState, useEffect } from "react";
import { Button, Radio, Space, Progress, message } from "antd";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  withCredentials: true,
});

const Quiz = () => {
  const { videoId } = useParams();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const youtubeUrl = searchParams.get("url");
        if (!youtubeUrl) {
          throw new Error("No URL provided");
        }

        // Clean the URL by removing time parameter
        const cleanUrl = youtubeUrl.split("&t=")[0];

        const { data } = await api.post("/api/generate_mcqs", {
          youtube_url: decodeURIComponent(cleanUrl),
        });

        if (!Array.isArray(data)) {
          throw new Error("Invalid response format");
        }

        const transformedQuestions = data.map((item) => ({
          question: item.question,
          options: Object.values(item.options),
          correctAnswer: item.correct_answer,
        }));

        setQuestions(transformedQuestions);
      } catch (error) {
        console.error("Quiz error:", error);
        message.error(error.message || "Failed to load quiz questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [location.search]);

  const handleAnswerSelect = (e) => {
    setSelectedAnswer(e.target.value);
  };

  const handleNext = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      setIsQuizComplete(true);
    }
  };

  const handleRetry = () => {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setScore(0);
    setIsQuizComplete(false);
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-lg">Loading quiz questions...</div>
      </div>
    );
  }

  if (isQuizComplete) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-8">
        <h2 className="text-2xl font-bold">Quiz Complete!</h2>
        <Progress type="circle" percent={percentage} />
        <div className="text-lg">
          You scored {score} out of {questions.length} questions
        </div>
        <Button type="primary" onClick={handleRetry}>
          Try Again
        </Button>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];
  if (!currentQuestionData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-lg">No questions available</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="text-lg">
          Question {currentQuestion + 1} of {questions.length}
        </div>
        <div className="text-lg">
          Score: {score}/{currentQuestion}
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-md">
        <h3 className="text-xl mb-4">{currentQuestionData.question}</h3>
        <Radio.Group
          onChange={handleAnswerSelect}
          value={selectedAnswer}
          className="w-full"
        >
          <Space direction="vertical" className="w-full">
            {currentQuestionData.options.map((option, index) => (
              <Radio
                key={index}
                value={option}
                className="w-full p-3 border rounded-lg mb-2 hover:bg-gray-50"
              >
                {option}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="primary" onClick={handleNext} disabled={!selectedAnswer}>
          {currentQuestion + 1 === questions.length ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  );
};

export default Quiz;
