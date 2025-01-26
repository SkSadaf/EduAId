import React, { useState, useEffect } from "react";
import { Button, Radio, Space, Progress, message } from "antd";
import { useParams } from "react-router-dom";

const Quiz = () => {
  const { videoId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuestions();
  }, [videoId]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch(`/api/quiz/${videoId}`);
      const data = await response.json();
      setQuestions(data.questions);
      setLoading(false);
    } catch (error) {
      message.error("Failed to load quiz questions");
      setLoading(false);
    }
  };

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
        <h3 className="text-xl mb-4">{currentQuestionData?.question}</h3>
        <Radio.Group
          onChange={handleAnswerSelect}
          value={selectedAnswer}
          className="w-full"
        >
          <Space direction="vertical" className="w-full">
            {currentQuestionData?.options.map((option, index) => (
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
