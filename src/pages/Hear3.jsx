import { useState, useEffect, useRef } from 'react';
import audio1 from '../assets/one.mp3';
import audio2 from '../assets/two.mp3';
import audio3 from '../assets/three.mp3';

const questions = [
  { id: 1, audio: audio3, options: [1, 2, 3], answer: 3 },
  { id: 2, audio: audio1, options: [2, 1, 3], answer: 1 },
  { id: 3, audio: audio2, options: [3, 2, 1], answer: 2 },
  { id: 4, audio: audio1, options: [2, 1, 3], answer: 1 },
  { id: 5, audio: audio3, options: [3, 1, 2], answer: 3 },
  { id: 6, audio: audio2, options: [1, 3, 2], answer: 2 },
  { id: 7, audio: audio3, options: [3, 2, 1], answer: 3 },
  { id: 8, audio: audio1, options: [1, 3, 2], answer: 1 },
  { id: 9, audio: audio3, options: [2, 3, 1], answer: 3 },
  { id: 10, audio: audio1, options: [1, 3, 2], answer: 1 },
  { id: 11, audio: audio2, options: [2, 1, 3], answer: 2 },
  { id: 12, audio: audio3, options: [3, 1, 2], answer: 3 },
];

const encouragements = ["Super!", "Excellent!", "Awesome!"];

export default function Hear3() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestionsAttempted, setTotalQuestionsAttempted] = useState(0);
  const [encouragement, setEncouragement] = useState('');

  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (isCompleted) {
      clearInterval(timerRef.current);
    }
  }, [isCompleted]);

  const calculateScore = (isCorrect) => {
    if (score < 70) {
      return isCorrect ? score + 8 : Math.max(0, score - 3);
    } else if (score < 90) {
      return isCorrect ? score + 5 : Math.max(70, score - 6);
    } else {
      return isCorrect ? score + 2 : Math.max(90, score - 8);
    }
  };

  const handleOptionClick = (index) => {
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) {
      alert("You should select a number before submitting.");
      return;
    }

    const currentQ = questions[currentQuestion];
    const isCorrect = currentQ.options[selectedAnswer] === currentQ.answer;

    setTotalQuestionsAttempted(totalQuestionsAttempted + 1);

    if (isCorrect) {
      const newScore = calculateScore(true);
      setScore(newScore);
      setCorrectAnswers(correctAnswers + 1);
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      setEncouragement(randomEncouragement);
      setTimeout(() => {
        setEncouragement('');
        if (newScore >= 100) {
          setIsCompleted(true);
          return;
        }
        setCurrentQuestion((prevQuestion) => (prevQuestion + 1) % questions.length);
        setSelectedAnswer(null);
      }, 1000);
    } else {
      setScore(calculateScore(false));
      setShowExplanation(true);
    }
  };

  const handleGotIt = () => {
    setShowExplanation(false);
    setSelectedAnswer(null);
    setCurrentQuestion((prevQuestion) => (prevQuestion + 1) % questions.length);
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-400 text-white">
        <h1 className="text-4xl font-bold mb-4">Congratulations!</h1>
        <p className="text-xl mb-2">You have completed the quiz.</p>
        <p className="text-lg mb-2">Time spent: {Math.floor(timeElapsed / 60)}min {timeElapsed % 60}sec</p>
        <p className="text-lg mb-2">Score: {score}</p>
        <p className="text-lg mb-4">Questions correct: {correctAnswers} / {totalQuestionsAttempted}</p>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between mb-4">
          <div className="text-sm">Questions answered: {totalQuestionsAttempted}</div>
          <div className="text-sm">Time elapsed: {Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</div>
        </div>
        <h2 className="text-xl font-bold mb-4">Press play. What number do you hear?</h2>
        <audio controls src={currentQ.audio} className="mb-4" />
        <div className="grid grid-cols-3 gap-4 mb-4">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              className={`p-4 text-2xl font-bold rounded ${
                selectedAnswer === index ? 'bg-blue-500 text-white' : 'bg-gray-200'
              }`}
              onClick={() => handleOptionClick(index)}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
          onClick={handleSubmit}
        >
          Submit
        </button>
        {showExplanation && (
          <div className="mt-4 bg-white border border-gray-300 rounded-lg overflow-hidden">
            {/* Incorrect Answer Notification */}
            <div className="bg-blue-500 text-white p-4">
              <h3 className="font-bold text-xl mb-2">Sorry, incorrect...</h3>
              <p className="font-semibold">The correct answer is:</p>
              <div className="flex items-center mt-2 space-x-2">
                {currentQ.options.map((option, index) => (
                  <span
                    key={index}
                    className={`p-2 text-2xl font-bold rounded ${
                      currentQ.answer === option ? 'bg-blue-700 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {option}
                  </span>
                ))}
              </div>
            </div>
            {/* Review Section */}
            <div className="p-4 border-t border-gray-300">
              <div className="flex items-center">
                <div className="bg-green-500 text-white px-2 py-1 mr-2 rounded-md font-semibold">Review</div>
                <h4 className="font-bold text-green-700">Explanation</h4>
              </div>
              <div className="mt-4">
                <p className="font-bold">Press play. What number do you hear?</p>
                <audio controls src={currentQ.audio} className="my-2" />
                <div className="flex items-center mt-2 space-x-2">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      className={`p-2 text-2xl font-bold rounded bg-gray-200 `}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <p className="mt-4 font-bold">You answered:</p>
                <div className="flex items-center mt-2 space-x-2">
  {currentQ.options.map((option, index) => (
    <span
      key={index}
      className={`p-2 text-2xl font-bold rounded ${
        selectedAnswer === index ? 'bg-blue-700 text-white' : 'bg-gray-200'
      }`}
    >
      {option}
    </span>
  ))}
</div>
              </div>
              {/* Solve Section */}
              <div className="flex items-center mt-6">
                <div className="bg-orange-500 text-white px-2 py-1 mr-2 rounded-md font-semibold">Solve</div>
                <p className="font-bold text-orange-600">Listen to the number again.</p>
              </div>
              <audio controls src={currentQ.audio} className="my-2" />
              <div className="text-2xl font-bold text-gray-700 mt-4">
                {currentQ.answer}
              </div>
              <button
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 mt-4"
                onClick={handleGotIt}
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 text-2xl font-bold">Score: {score}</div>
      {encouragement && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg text-4xl font-bold">{encouragement}</div>
        </div>
      )}
    </div>
  );
}
