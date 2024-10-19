"use client"

import  { useState, useEffect } from 'react'

const LEVELS = [
  { name: "Level 1", range: [1, 5] },
  { name: "Level 2", range: [6, 10] },
  { name: "Level 3", range: [11, 20] },
]

const SEA_CREATURES = [
  { name: "Octopus", emoji: "🐙" },
  { name: "Crab", emoji: "🦀" },
  { name: "Turtle", emoji: "🐢" },
]

const FISH_TYPES = ["🐠", "🐡", "🐟", "🦈", "🐬", "🐳"]

const CORRECT_PHRASES = ["Radical!", "Awesome!", "Super!"]
const TOO_HIGH_PHRASE = "That's too many!"
const TOO_LOW_PHRASE = "That's too small!"

const ANIMATION_DURATION = 1 // seconds

export default function CountingFishGame() {
  const [gameState, setGameState] = useState("start")
  const [currentLevel, setCurrentLevel] = useState(0)
  const [question, setQuestion] = useState({ fishCount: 0, options: [], fishPositions: [] })
  const [score, setScore] = useState(0)
  const [roundResults, setRoundResults] = useState([])
  const [feedback, setFeedback] = useState("")
  const [remainingOptions, setRemainingOptions] = useState([])
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1)
  const [fishState, setFishState] = useState("entering") // "entering", "static", "exiting"

  useEffect(() => {
    if (gameState === "playing") {
      generateQuestion()
    }
  }, [gameState, currentLevel])

  const generateQuestion = () => {
    const { range } = LEVELS[currentLevel]
    const fishCount = Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0]
    const correctAnswer = fishCount
    let options = [
      Math.max(range[0], correctAnswer - 1),
      correctAnswer,
      Math.min(range[1], correctAnswer + 1)
    ]

    options.sort((a, b) => a - b)

    const fishPositions = Array(fishCount).fill(0).map(() => ({
      type: FISH_TYPES[Math.floor(Math.random() * FISH_TYPES.length)],
      startPosition: Math.random() < 0.5 ? 'left' : 'right',
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 60 + 20}%`,
      animationDelay: `${Math.random() * 0.1}s`,
    }))

    setQuestion({ fishCount, options, fishPositions })
    setRemainingOptions(options)
    setFeedback("")
    setFishState("entering")
    setTimeout(() => setFishState("static"), ANIMATION_DURATION * 1000)
  }

  const handleAnswer = (selectedAnswer) => {
    if (roundResults.length === 0 || roundResults[roundResults.length - 1].questionNumber !== currentQuestionNumber) {
      const isCorrect = selectedAnswer === question.fishCount
      const newResult = {
        questionNumber: currentQuestionNumber,
        fishCount: question.fishCount,
        correct: isCorrect,
      }
      setRoundResults([...roundResults, newResult])
      if (isCorrect) {
        setScore(score + 1)
      }
    }

    if (selectedAnswer === question.fishCount) {
      setFeedback(CORRECT_PHRASES[Math.floor(Math.random() * CORRECT_PHRASES.length)])
      setFishState("exiting")
      
      if (roundResults.length + 1 >= 10) {
        setTimeout(() => setGameState("roundComplete"), ANIMATION_DURATION * 500)
      } else {
        setCurrentQuestionNumber(currentQuestionNumber + 1)
        // setTimeout(generateQuestion, ANIMATION_DURATION * 1000 + 1500)
        generateQuestion()
      }
    } else if (selectedAnswer > question.fishCount) {
      setFeedback(TOO_HIGH_PHRASE)
      setRemainingOptions(remainingOptions.filter(option => option !== selectedAnswer))
    } else {
      setFeedback(TOO_LOW_PHRASE)
      setRemainingOptions(remainingOptions.filter(option => option !== selectedAnswer))
    }
  }

  const startGame = () => {
    setGameState("playing")
    setScore(0)
    setRoundResults([])
    setCurrentQuestionNumber(1)
  }

  const nextLevel = () => {
    if (currentLevel + 1 < LEVELS.length) {
      setCurrentLevel(currentLevel + 1)
      startGame()
    } else {
      setGameState("gameComplete")
    }
  }

  const renderStart = () => (
    <div className="w-full max-w-md mx-auto bg-gradient-to-b from-blue-200 to-blue-400 rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <h1 className="text-4xl font-bold text-blue-800">Counting Fish</h1>
        <button 
          onClick={startGame} 
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-xl transition duration-200"
        >
          GO
        </button>
      </div>
    </div>
  )

  const renderPlaying = () => (
    <div className="w-full max-w-md mx-auto bg-gradient-to-b from-blue-200 to-blue-400 rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <h2 className="text-2xl font-bold text-blue-800">{LEVELS[currentLevel].name}</h2>
        <div className="relative w-full h-64 bg-blue-300 rounded-lg overflow-hidden">
          {question.fishPositions.map((fish, i) => (
            <span 
              key={i} 
              role="img" 
              aria-label="fish" 
              className={`absolute text-3xl transition-all duration-${ANIMATION_DURATION * 200} ease-in-out`}
              style={{ 
                top: fish.top,
                left: fishState === "entering" 
                  ? (fish.startPosition === 'left' ? '-10%' : '110%')
                  : (fishState === "exiting" 
                    ? (fish.startPosition === 'left' ? '110%' : '-10%')
                    : fish.left),
                // transitionDelay: fish.animationDelay,
                transform: fish.startPosition === 'right' ? 'scaleX(-1)' : 'none',
              }}
            >
              {fish.type}
            </span>
          ))}
        </div>
        <div className="flex justify-center space-x-4">
          {remainingOptions.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="bg-white text-blue-800 hover:bg-blue-100 px-6 py-3 rounded-lg text-xl transition duration-200"
            >
              {option}
            </button>
          ))}
        </div>
        {feedback && (
          <div className="text-xl font-bold text-blue-800">{feedback}</div>
        )}
      </div>
    </div>
  )

  const renderRoundComplete = () => (
    <div className="w-full max-w-md mx-auto bg-gradient-to-b from-blue-200 to-blue-400 rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <h2 className="text-2xl font-bold text-blue-800">Round {currentLevel + 1} Complete!</h2>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr>
                <th className="px-4 py-2">Question</th>
                <th className="px-4 py-2">Fish Count</th>
                <th className="px-4 py-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {roundResults.map((result, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{result.questionNumber}</td>
                  <td className="px-4 py-2">{result.fishCount}</td>
                  <td className="px-4 py-2">{result.correct ? '✅' : '❌'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="text-2xl font-bold text-blue-800">
          Score: {score * 10}%
        </div>
        <div className="flex justify-center space-x-4">
          {SEA_CREATURES.map((creature, index) => (
            <button
              key={index}
              onClick={nextLevel}
              className="bg-white text-blue-800 hover:bg-blue-100 px-6 py-3 rounded-lg text-3xl transition duration-200"
            >
              {creature.emoji}
            </button>
          ))}
        </div>
      </div>
    </div>
  )

  const renderGameComplete = () => (
    <div className="w-full max-w-md mx-auto bg-gradient-to-b from-blue-200 to-blue-400 rounded-lg shadow-lg">
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <h2 className="text-2xl font-bold text-blue-800">Congratulations!</h2>
        <p className="text-xl text-blue-800">You finished all 3 rounds!</p>
        <button 
          onClick={() => {setCurrentLevel(0); startGame()}} 
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-full text-xl transition duration-200"
        >
          Play Again
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-blue-100 flex items-center justify-center p-4">
      {gameState === "start" && renderStart()}
      {gameState === "playing" && renderPlaying()}
      {gameState === "roundComplete" && renderRoundComplete()}
      {gameState === "gameComplete" && renderGameComplete()}
    </div>
  )
}