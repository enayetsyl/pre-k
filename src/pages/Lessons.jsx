import { useState, useEffect, useRef } from 'react';

const questions = [
  // Original questions
  { id: 1, text: "Pick every 1", options: [1, 1, 2], answer: [0, 1] },
  { id: 2, text: "Pick every 2", options: [1, 2, 2], answer: [1, 2] },
  { id: 3, text: "Pick every 3", options: [2, 3, 2], answer: [1] },
  
  // Additional variations for "Pick every 1"
  { id: 4, text: "Pick every 1", options: [1, 2, 3], answer: [0] },
  { id: 5, text: "Pick every 1", options: [3, 1, 1], answer: [1, 2] },
  { id: 6, text: "Pick every 1", options: [3, 1, 3], answer: [1] },

  // Additional variations for "Pick every 2"
  { id: 7, text: "Pick every 2", options: [2, 1, 3], answer: [0] },       
  { id: 8, text: "Pick every 2", options: [2, 2, 2], answer: [0, 1, 2] },  
  { id: 9, text: "Pick every 2", options: [3, 2, 1], answer: [1] },        

  // Additional variations for "Pick every 3"
  { id: 10, text: "Pick every 3", options: [3, 1, 3], answer: [0, 2] },    
  { id: 11, text: "Pick every 3", options: [2, 3, 3], answer: [1, 2] },    
  { id: 12, text: "Pick every 3", options: [3, 3, 1], answer: [0, 1] },    
];


const encouragements = ["Super!", "Excellent!", "Awesome!"];

export default function Lessons() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalQuestionsAttempted, setTotalQuestionsAttempted] = useState(0);
  const [encouragement, setEncouragement] = useState('');

  const timerRef = useRef(null); // Store reference to the timer

  useEffect(() => {
    // Start the timer when the component mounts
    timerRef.current = setInterval(() => {
      setTimeElapsed((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timerRef.current); // Clean up timer when component unmounts
  }, []);

  useEffect(() => {
    // Stop the timer when the lesson is completed
    if (isCompleted) {
      clearInterval(timerRef.current);
    }
  }, [isCompleted]);

  const handleOptionClick = (index) => {
    const newSelectedAnswers = [...selectedAnswers];
    const optionIndex = newSelectedAnswers.indexOf(index);
    if (optionIndex > -1) {
      newSelectedAnswers.splice(optionIndex, 1);
    } else {
      newSelectedAnswers.push(index);
    }
    setSelectedAnswers(newSelectedAnswers);
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
    if (selectedAnswers.length === 0) {
      alert("You should select at least one item.");
      return;
    }

    const currentQ = questions[currentQuestion];
    const isCorrect = JSON.stringify([...selectedAnswers].sort()) === JSON.stringify([...currentQ.answer].sort());

    setTotalQuestionsAttempted(totalQuestionsAttempted + 1); // Increment total questions attempted

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
          setSelectedAnswers([]);
          return;
        }
        setCurrentQuestion((prevQuestion) => (prevQuestion + 1) % questions.length);
        setSelectedAnswers([]);
      }, 1000);
    } else {
      setScore(calculateScore(false));
      setShowExplanation(true);
    }
  };

  const handleGotIt = () => {
    setShowExplanation(false);
    setSelectedAnswers([]);
    setCurrentQuestion((prevQuestion) => (prevQuestion + 1) % questions.length);
  };

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-blue-400 text-white">
        <h1 className="text-4xl font-bold mb-4">Dynamite!</h1>
        <p className="text-xl mb-2">You have mastered the skill and earned a gold medal.</p>
        <div className="bg-yellow-400 rounded-full p-2 mb-4">🏅</div>
        <p className="text-lg mb-2">Time spent: {Math.floor(timeElapsed / 60)}min {timeElapsed % 60}sec</p>
        <p className="text-lg mb-2">SmartScore: 100</p>
        <p className="text-lg mb-4">Questions correct: {correctAnswers} / {totalQuestionsAttempted}</p>
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Keep practicing
        </button>
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
        <h2 className="text-xl font-bold mb-4">{currentQ.text}</h2>
        <div className="grid grid-cols-3 gap-4 mb-4">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              className={`p-4 text-2xl font-bold rounded ${
                selectedAnswers.includes(index) ? 'bg-blue-500 text-white' : 'bg-gray-200'
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
            <div className="bg-blue-500 text-white p-4">
              <h3 className="font-bold text-xl">Sorry, incorrect...</h3>
              <p>The correct answer is:</p>
              <div className="flex mt-2">
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 flex items-center justify-center text-xl font-bold rounded mr-2 ${
                      currentQ.answer.includes(index) ? 'bg-white text-blue-500' : 'bg-blue-400'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <h4 className="font-bold mb-2">Explanation</h4>
              <div className="bg-green-100 p-2 rounded mb-2">
                <p>{currentQ.text}</p>
                <div className="flex mt-2">
                  {currentQ.options.map((option, index) => (
                    <div
                      key={index}
                      className="w-10 h-10 flex items-center justify-center text-lg font-bold bg-white border border-gray-300 rounded mr-2"
                    >
                      {option}
                    </div>
                  ))}
                </div>
              </div>
              <p className="mb-2">You answered:</p>
              <div className="flex mb-2">
                {currentQ.options.map((option, index) => (
                  <div
                    key={index}
                    className={`w-10 h-10 flex items-center justify-center text-lg font-bold rounded mr-2 ${
                      selectedAnswers.includes(index) ? 'bg-blue-500 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {option}
                  </div>
                ))}
              </div>
              <p className="font-bold">Take a closer look:</p>
              <p>{selectedAnswers.length === 0 ? "You did not pick any numbers." : `You picked ${selectedAnswers.map(i => currentQ.options[i]).join(', ')}, not ${currentQ.answer.map(i => currentQ.options[i]).join(', ')}.`}</p>
            </div>
            <div className="bg-orange-100 p-4">
              <h4 className="font-bold mb-2">Hint</h4>
              <p>This is the number {currentQ.answer.map(i => currentQ.options[i]).join(', ')}:</p>
              <div className="text-6xl font-bold">{currentQ.answer.map(i => currentQ.options[i]).join(', ')}</div>
            </div>
            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4"
              onClick={handleGotIt}
            >
              Got it
            </button>
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
