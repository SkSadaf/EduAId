import React, { useState, useEffect } from "react";
import { Button, Radio, Space, Progress, message } from "antd";
import { useParams, useLocation } from "react-router-dom";
import { BrainCircuit, ArrowRight, CheckCircle2, Trophy } from "lucide-react";
import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:5000/",
  withCredentials: true,
});

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const youtubeUrl = searchParams.get("url");
        if (!youtubeUrl) throw new Error("No URL provided");

        const cleanUrl = youtubeUrl.split("&t=")[0];
        const { data } = await api.post("/api/generate_mcqs", {
          youtube_url: decodeURIComponent(cleanUrl),
        });

        if (!Array.isArray(data)) throw new Error("Invalid response format");

        const transformedQuestions = data.map((item) => ({
          question: item.question,
          options: Object.values(item.options),
          correctAnswer: item.correct_answer,
        }));

        setQuestions(transformedQuestions);
      } catch (error) {
        message.error(error.message || "Failed to load quiz questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [location.search]);

  const handleNext = () => {
    const correctAnswerIndex =
      questions[currentQuestion].correctAnswer.charCodeAt(0) - 65;
    const isCorrect =
      selectedAnswer === questions[currentQuestion].options[correctAnswerIndex];
    if (isCorrect) setScore((prevScore) => prevScore + 1);

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer("");
    } else {
      setIsQuizComplete(true);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-lg text-slate-600">Loading quiz questions...</div>
      </div>
    );
  }

  if (isQuizComplete) {
    const percentage = (score / questions.length) * 100;
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center space-y-8 py-12">
          <div className="p-4 bg-green-50 rounded-full">
            <Trophy className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900">Quiz Complete!</h2>
          <div className="w-48">
            <Progress
              type="circle"
              percent={percentage}
              format={(percent) => (
                <div className="text-xl font-semibold">{percent}%</div>
              )}
            />
          </div>
          <div className="text-lg text-slate-600">
            You scored {score} out of {questions.length} questions
          </div>
          <Button
            type="primary"
            size="large"
            onClick={() => {
              setCurrentQuestion(0);
              setSelectedAnswer("");
              setScore(0);
              setIsQuizComplete(false);
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="h-[calc(100vh-200px)] overflow-y-auto">
      <div className="max-w-4xl mx-auto pt-8">
        <div className="flex flex-col items-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Knowledge Check
          </h2>
          <p className="text-slate-600 text-center max-w-lg">
            Test your understanding of the video content
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg text-slate-600">
              Question {currentQuestion + 1} of {questions.length}
            </div>
            <div className="text-lg font-medium text-emerald-600">
              Score: {score}/{questions.length}
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-xl font-medium text-slate-900 mb-6">
              {currentQuestionData.question}
            </h3>
            <Radio.Group
              onChange={(e) => setSelectedAnswer(e.target.value)}
              value={selectedAnswer}
              className="w-full"
            >
              <Space direction="vertical" className="w-full">
                {currentQuestionData.options.map((option, index) => (
                  <Radio
                    key={index}
                    value={option}
                    className="w-full p-4 border rounded-lg mb-3 hover:bg-slate-50 transition-colors"
                  >
                    <span className="text-slate-800">{option}</span>
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </div>

          <div className="flex justify-end">
            <Button
              type="primary"
              onClick={handleNext}
              disabled={!selectedAnswer}
              className="bg-emerald-600 hover:bg-emerald-700"
              size="large"
            >
              {currentQuestion + 1 === questions.length ? (
                <span className="flex items-center gap-2">
                  Finish <CheckCircle2 className="w-4 h-4" />
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Next <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
