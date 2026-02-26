"use client";

import { useState } from "react";
import Image from "next/image";

type PersonalityKey = "bold-adventurer" | "cozy-classic" | "zen-minimalist" | "night-owl";

interface Question {
  text: string;
  options: { emoji: string; label: string; personality: PersonalityKey }[];
}

interface Personality {
  key: PersonalityKey;
  name: string;
  tagline: string;
  coffee: string;
  image: string;
}

const questions: Question[] = [
  {
    text: "Pick your Netflix Friday night:",
    options: [
      { emoji: "🎬", label: "Action thriller — the more intense, the better", personality: "bold-adventurer" },
      { emoji: "🛋️", label: "Comfort rewatch you've seen 10 times", personality: "cozy-classic" },
      { emoji: "🎥", label: "Documentary about something obscure and fascinating", personality: "zen-minimalist" },
      { emoji: "🌙", label: "Whatever's on at 1am, honestly", personality: "night-owl" },
    ],
  },
  {
    text: "Which character is most you?",
    options: [
      { emoji: "🤠", label: "Indiana Jones — adventure first, questions later", personality: "bold-adventurer" },
      { emoji: "🌿", label: "Samwise Gamgee — reliable, warm, makes the best food", personality: "cozy-classic" },
      { emoji: "🔍", label: "Sherlock Holmes — sharp mind, needs no one", personality: "zen-minimalist" },
      { emoji: "🦇", label: "Batman — does their best work after dark", personality: "night-owl" },
    ],
  },
  {
    text: "What's your phone's battery level right now?",
    options: [
      { emoji: "⚡", label: "Always above 80% — I stay charged and ready", personality: "bold-adventurer" },
      { emoji: "😊", label: "Somewhere comfy around 50%", personality: "cozy-classic" },
      { emoji: "🔋", label: "Exactly at 20% — I only charge what I need", personality: "zen-minimalist" },
      { emoji: "💀", label: "Dead. Charging it at 2am like usual", personality: "night-owl" },
    ],
  },
];

const personalities: Personality[] = [
  {
    key: "bold-adventurer",
    name: "Bold Adventurer",
    tagline: "You live for intensity",
    coffee: "Double Espresso",
    image: "/bold-adventurer.jpg",
  },
  {
    key: "cozy-classic",
    name: "Cozy Classic",
    tagline: "Comfort in every cup",
    coffee: "Medium Roast Drip",
    image: "/cozy-classic.jpg",
  },
  {
    key: "zen-minimalist",
    name: "Zen Minimalist",
    tagline: "Simple. Clean. Perfect.",
    coffee: "Black Coffee, Single Origin",
    image: "/zen-minimalist.jpg",
  },
  {
    key: "night-owl",
    name: "Night Owl",
    tagline: "Sleep is optional",
    coffee: "Red Eye (coffee + espresso shot)",
    image: "/night-owl.jpg",
  },
];

function getResult(answers: PersonalityKey[]): Personality {
  const counts: Record<PersonalityKey, number> = {
    "bold-adventurer": 0,
    "cozy-classic": 0,
    "zen-minimalist": 0,
    "night-owl": 0,
  };
  for (const a of answers) counts[a]++;
  // Return first personality in list order that has the highest count
  const max = Math.max(...Object.values(counts));
  return personalities.find((p) => counts[p.key] === max)!;
}

export default function Home() {
  const [currentQuestion, setCurrentQuestion] = useState(-1); // -1 = intro
  const [answers, setAnswers] = useState<PersonalityKey[]>([]);
  const [showResult, setShowResult] = useState(false);

  function startQuiz() {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  }

  function handleAnswer(personality: PersonalityKey) {
    const newAnswers = [...answers, personality];
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  }

  function resetQuiz() {
    setCurrentQuestion(-1);
    setAnswers([]);
    setShowResult(false);
  }

  const result = showResult ? getResult(answers) : null;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-xl rounded-2xl p-8 sm:p-10"
        style={{
          backgroundColor: "#FFFDF8",
          boxShadow: "0 8px 40px rgba(90, 55, 20, 0.15)",
        }}
      >
        {/* INTRO SCREEN */}
        {currentQuestion === -1 && !showResult && (
          <div className="flex flex-col items-center text-center gap-6">
            <div className="text-5xl">☕</div>
            <h1
              className="text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif", color: "#3B2A1A" }}
            >
              What&apos;s Your Coffee Personality?
            </h1>
            <p className="text-lg" style={{ color: "#8B7355" }}>
              Answer 3 quick questions and we&apos;ll reveal your perfect Basecamp Coffee match.
            </p>
            <button
              onClick={startQuiz}
              className="mt-2 px-8 py-3 rounded-xl text-white font-semibold text-lg transition-colors"
              style={{ backgroundColor: "#A0714F" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#7A5338")}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#A0714F")}
            >
              Start Quiz
            </button>
          </div>
        )}

        {/* QUESTION SCREEN */}
        {currentQuestion >= 0 && !showResult && (
          <div className="flex flex-col gap-6">
            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-sm mb-2" style={{ color: "#8B7355" }}>
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full rounded-full h-2" style={{ backgroundColor: "#EDD9B8" }}>
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: "#A0714F",
                    width: `${(currentQuestion / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-playfair), serif", color: "#3B2A1A" }}
            >
              {questions[currentQuestion].text}
            </h2>

            <div className="flex flex-col gap-3">
              {questions[currentQuestion].options.map((option) => (
                <button
                  key={option.personality}
                  onClick={() => handleAnswer(option.personality)}
                  className="flex items-center gap-3 px-5 py-4 rounded-xl text-left text-base font-medium transition-colors border-2"
                  style={{ borderColor: "#EDD9B8", color: "#3B2A1A", backgroundColor: "#FFFDF8" }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = "#A0714F";
                    e.currentTarget.style.borderColor = "#A0714F";
                    e.currentTarget.style.color = "#FFFFFF";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = "#FFFDF8";
                    e.currentTarget.style.borderColor = "#EDD9B8";
                    e.currentTarget.style.color = "#3B2A1A";
                  }}
                >
                  <span className="text-2xl">{option.emoji}</span>
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* RESULT SCREEN */}
        {showResult && result && (
          <div className="flex flex-col items-center text-center gap-6">
            <div className="w-full aspect-video relative rounded-2xl overflow-hidden">
              <Image
                src={result.image}
                alt={result.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#A0714F" }}>
                Your Coffee Personality
              </p>
              <h2
                className="text-3xl font-bold"
                style={{ fontFamily: "var(--font-playfair), serif", color: "#3B2A1A" }}
              >
                You&apos;re a {result.name}!
              </h2>
              <p className="text-xl italic" style={{ color: "#8B7355" }}>
                &ldquo;{result.tagline}&rdquo;
              </p>
            </div>

            <div
              className="w-full rounded-xl px-6 py-4"
              style={{ backgroundColor: "#F5ECD7" }}
            >
              <p className="text-sm font-semibold uppercase tracking-wide mb-1" style={{ color: "#8B7355" }}>
                Your Coffee Match
              </p>
              <p className="text-lg font-bold" style={{ color: "#3B2A1A" }}>
                ☕ {result.coffee}
              </p>
            </div>

            <button
              onClick={resetQuiz}
              className="px-8 py-3 rounded-xl font-semibold text-base transition-colors border-2"
              style={{ borderColor: "#A0714F", color: "#A0714F", backgroundColor: "transparent" }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = "#A0714F";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "#A0714F";
              }}
            >
              Take it again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
