import { useState, useEffect } from 'react';
import birdImage from '../assets/bird.jpg'
import hippoImage from '../assets/hippo.jpg'
import lionImage from '../assets/lion.jpeg'


const questions = [
  { id: 1, animal: 'bird', count: 2, image: birdImage },
  { id: 2, animal: 'hippo', count: 3, image: hippoImage },
  { id: 3, animal: 'lion', count: 1, image: lionImage },
  { id: 4, animal: 'bird', count: 1, image: birdImage },
  { id: 5, animal: 'lion', count: 2, image: lionImage },
  { id: 6, animal: 'hippo', count: 1, image: hippoImage },
  { id: 7, animal: 'bird', count: 3, image: birdImage },
  { id: 8, animal: 'lion', count: 3, image: lionImage },
  { id: 9, animal: 'hippo', count: 2, image: hippoImage },
];

const encouragements = ["Super!", "Excellent!", "Awesome!"];

export default function Learn3() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [clickedOrder, setClickedOrder] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [encouragement, setEncouragement] = useState('');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestionsAttempted, setTotalQuestionsAttempted] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setTimeElapsed((prev) => prev + 1), 1000);
    if (isCompleted) {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isCompleted]);

  const handleImageClick = (index) => {
    if (!clickedOrder.includes(index)) {
      setClickedOrder([...clickedOrder, index]);
    }
  };

  const calculateScore = (isCorrect) => {
    if (score < 70) {
      return isCorrect ? score + 8 : Math.max(0, score - 3);
    } else if (score < 90) {
      return isCorrect ? score + 5 : Math.max(70, score - 6);
    } else {
      return isCorrect ? score + 2 : Math.max(90, score - 8);
    }
  };

  const handleSubmit = () => {
    const correctCount = questions[currentQuestion].count;
    const isCorrect = selectedAnswer === correctCount;
    setScore((prevScore) => calculateScore(isCorrect));
    setTotalQuestionsAttempted((prev) => prev + 1);
    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
      const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
      setEncouragement(randomEncouragement);
      setTimeout(() => {
        setEncouragement('');
        handleNextQuestion();
      }, 1000);
    } else {
      setShowExplanation(true);
    }
  };

  const handleNextQuestion = () => {
    if (score >= 100) {
      setIsCompleted(true);
    } else {
      setCurrentQuestion((currentQuestion + 1) % questions.length);
      setClickedOrder([]);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-400 text-white">
        <h1 className="text-4xl font-bold mb-4">Congratulations!</h1>
        <p className="text-xl mb-2">Your final score: {score}</p>
        <p className="text-lg mb-2">Time elapsed: {Math.floor(timeElapsed / 60)}:{timeElapsed % 60}</p>
        <p className="text-lg mb-2">Questions correct: {correctAnswers} / {totalQuestionsAttempted}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="question-section mb-4">
          <h2 className="text-2xl font-bold mb-4">Count the {questions[currentQuestion].animal}s</h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[...Array(questions[currentQuestion].count)].map((_, index) => (
              <div
                key={index}
                className="relative animal-image border-2 border-gray-300 rounded-lg p-2 cursor-pointer hover:border-blue-500"
                onClick={() => handleImageClick(index)}
              >
                <img src={questions[currentQuestion].image} alt={questions[currentQuestion].animal} className="w-full h-auto rounded-md" />
                {clickedOrder.includes(index) && (
                  <span className="absolute top-2 left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                    {clickedOrder.indexOf(index) + 1}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="answer-section mb-4">
          <p className="text-lg mb-2">How many {questions[currentQuestion].animal}s are there?</p>
          <div className="flex space-x-4">
            {[1, 2, 3].map((option) => (
              <button
                key={option}
                className={`py-2 px-4 rounded-lg font-bold ${selectedAnswer === option ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                onClick={() => setSelectedAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <button onClick={handleSubmit} className="w-full mt-4 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg">
            Submit
          </button>
        </div>
        {showExplanation && (
          <div className="explanation-section mt-4 p-4 bg-red-100 rounded-lg">
            <p className="text-lg font-bold text-red-600 mb-4">Sorry, incorrect...</p>
            <div className="question-section mb-4">
              <h2 className="text-2xl font-bold mb-4">Count the {questions[currentQuestion].animal}s</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[...Array(questions[currentQuestion].count)].map((_, index) => (
                  <div
                    key={index}
                    className="relative animal-image border-2 border-gray-300 rounded-lg p-2"
                  >
                    <img src={questions[currentQuestion].image} alt={questions[currentQuestion].animal} className="w-full h-auto rounded-md" />
                  </div>
                ))}
              </div>
            </div>
            <div className="answer-section mb-4">
              <p className="text-lg mb-2">How many {questions[currentQuestion].animal}s are there?</p>
              <div className="flex space-x-4">
                {[1, 2, 3].map((option) => (
                  <button
                    key={option}
                    className={`py-2 px-4 rounded-lg font-bold bg-gray-200`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <p className="text-lg mb-2 font-bold">Your answer:</p>
            <div className="flex space-x-4 mb-4">
              {[1, 2, 3].map((option, index) => (
                <button
                  key={index}
                  className={`py-2 px-4 rounded-lg font-bold ${selectedAnswer === option ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="question-section mb-4">
              <h2 className="text-2xl font-bold mb-4">Count the {questions[currentQuestion].animal}s again</h2>
              <div className="grid grid-cols-3 gap-4 mb-4">
                {[...Array(questions[currentQuestion].count)].map((_, index) => (
                  <div
                    key={index}
                    className={`relative animal-image border-2 rounded-lg p-2 ${index === 0 ? 'border-yellow-500' : 'border-gray-300'}`}
                  >
                    <img src={questions[currentQuestion].image} alt={questions[currentQuestion].animal} className="w-full h-auto rounded-md" />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-lg font-bold text-yellow-600 mb-4">There are {questions[currentQuestion].count} {questions[currentQuestion].animal}s.</div>
            <button onClick={handleNextQuestion} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg">
              Got it
            </button>
          </div>
        )}
      </div>
      <div className="score-section mt-4 text-xl font-bold">
        <p>Score: {score}</p>
        <p>Time elapsed: {Math.floor(timeElapsed / 60)}:{timeElapsed % 60}</p>
      </div>
      {encouragement && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg text-4xl font-bold">{encouragement}</div>
        </div>
      )}
    </div>
  );
}



