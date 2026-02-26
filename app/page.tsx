"use client";

import { useState } from "react";
import Image from "next/image";

type PersonalityKey = "bold-adventurer" | "cozy-classic" | "zen-minimalist" | "night-owl";
type Screen = "lookup" | "intro" | "question" | "returning" | "result";

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

interface Member {
  id: string;
  name: string;
  tier: string;
  points: number;
  personality: string | null;
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
  const max = Math.max(...Object.values(counts));
  return personalities.find((p) => counts[p.key] === max)!;
}

function getPersonality(key: string): Personality | undefined {
  return personalities.find((p) => p.key === key);
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("lookup");
  const [member, setMember] = useState<Member | null>(null);
  const [memberIdInput, setMemberIdInput] = useState("");
  const [memberError, setMemberError] = useState("");
  const [isLooking, setIsLooking] = useState(false);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<PersonalityKey[]>([]);

  const [result, setResult] = useState<Personality | null>(null);
  const [pointsAwarded, setPointsAwarded] = useState<{ total: number } | null>(null);

  async function handleLookup() {
    const id = memberIdInput.trim().toUpperCase();
    if (!id) {
      setMemberError("Please enter your loyalty card number.");
      return;
    }
    setIsLooking(true);
    setMemberError("");
    try {
      const res = await fetch(`/api/member?id=${encodeURIComponent(id)}`);
      if (!res.ok) {
        setMemberError("Member not found. Check your card number and try again.");
        setIsLooking(false);
        return;
      }
      const data: Member = await res.json();
      setMember(data);
      setIsLooking(false);
      if (data.personality) {
        setScreen("returning");
      } else {
        // Brief welcome then advance to intro
        setScreen("intro");
      }
    } catch {
      setMemberError("Something went wrong. Please try again.");
      setIsLooking(false);
    }
  }

  function handleSkip() {
    setMember(null);
    setScreen("intro");
  }

  function startQuiz() {
    setCurrentQuestion(0);
    setAnswers([]);
    setResult(null);
    setPointsAwarded(null);
    setScreen("question");
  }

  async function handleAnswer(personality: PersonalityKey) {
    const newAnswers = [...answers, personality];
    setAnswers(newAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const finalResult = getResult(newAnswers);
      setResult(finalResult);

      if (member) {
        try {
          const res = await fetch("/api/member/personality", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memberId: member.id, personalityKey: finalResult.key }),
          });
          if (res.ok) {
            const data = await res.json();
            setPointsAwarded({ total: data.updatedPoints });
            setMember((prev) => prev ? { ...prev, points: data.updatedPoints, personality: finalResult.key } : prev);
          }
        } catch {
          // Points save failed silently — result still shown
        }
      }

      setScreen("result");
    }
  }

  function resetToLookup() {
    setScreen("lookup");
    setMember(null);
    setMemberIdInput("");
    setMemberError("");
    setAnswers([]);
    setResult(null);
    setPointsAwarded(null);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div
        className="w-full max-w-xl rounded-2xl p-8 sm:p-10"
        style={{
          backgroundColor: "#FFFDF8",
          boxShadow: "0 8px 40px rgba(90, 55, 20, 0.15)",
        }}
      >
        {/* LOOKUP SCREEN */}
        {screen === "lookup" && (
          <div className="flex flex-col items-center text-center gap-6">
            <div className="text-5xl">☕</div>
            <h1
              className="text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif", color: "#3B2A1A" }}
            >
              What&apos;s Your Coffee Personality?
            </h1>
            <p className="text-lg" style={{ color: "#8B7355" }}>
              Enter your loyalty card number to save your result and earn bonus points.
            </p>

            <div className="w-full flex flex-col gap-3">
              <input
                type="text"
                value={memberIdInput}
                onChange={(e) => { setMemberIdInput(e.target.value); setMemberError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                placeholder="e.g. BC-1001"
                className="w-full px-4 py-3 rounded-xl border-2 text-base outline-none transition-colors"
                style={{
                  borderColor: memberError ? "#C0392B" : "#EDD9B8",
                  color: "#3B2A1A",
                  backgroundColor: "#FFFDF8",
                }}
                onFocus={(e) => { if (!memberError) e.currentTarget.style.borderColor = "#A0714F"; }}
                onBlur={(e) => { if (!memberError) e.currentTarget.style.borderColor = "#EDD9B8"; }}
              />
              {memberError && (
                <p className="text-sm text-left" style={{ color: "#C0392B" }}>
                  {memberError}
                </p>
              )}
              <button
                onClick={handleLookup}
                disabled={isLooking}
                className="w-full px-8 py-3 rounded-xl text-white font-semibold text-lg transition-colors disabled:opacity-60"
                style={{ backgroundColor: "#A0714F" }}
                onMouseOver={(e) => { if (!isLooking) e.currentTarget.style.backgroundColor = "#7A5338"; }}
                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = "#A0714F"; }}
              >
                {isLooking ? "Finding your account…" : "Find My Account"}
              </button>
            </div>

            <button
              onClick={handleSkip}
              className="text-sm underline underline-offset-2 transition-colors"
              style={{ color: "#8B7355" }}
              onMouseOver={(e) => (e.currentTarget.style.color = "#A0714F")}
              onMouseOut={(e) => (e.currentTarget.style.color = "#8B7355")}
            >
              Skip &amp; take as guest →
            </button>
          </div>
        )}

        {/* INTRO SCREEN */}
        {screen === "intro" && (
          <div className="flex flex-col items-center text-center gap-6">
            <div className="text-5xl">☕</div>
            {member && (
              <div
                className="w-full rounded-xl px-4 py-3 text-sm font-medium"
                style={{ backgroundColor: "#F5ECD7", color: "#5A3714" }}
              >
                Welcome back, {member.name}! · {member.tier} · {member.points} pts
              </div>
            )}
            <h1
              className="text-4xl font-bold leading-tight"
              style={{ fontFamily: "var(--font-playfair), serif", color: "#3B2A1A" }}
            >
              What&apos;s Your Coffee Personality?
            </h1>
            <p className="text-lg" style={{ color: "#8B7355" }}>
              Answer 3 quick questions and we&apos;ll reveal your perfect Basecamp Coffee match.
              {member && " Complete the quiz to earn 25 bonus points!"}
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

        {/* RETURNING MEMBER SCREEN */}
        {screen === "returning" && member && member.personality && (() => {
          const saved = getPersonality(member.personality!);
          return (
            <div className="flex flex-col items-center text-center gap-6">
              <div className="text-5xl">👋</div>
              <h2
                className="text-3xl font-bold"
                style={{ fontFamily: "var(--font-playfair), serif", color: "#3B2A1A" }}
              >
                Welcome back, {member.name}!
              </h2>
              <p style={{ color: "#8B7355" }}>
                {member.tier} · {member.points} pts
              </p>

              {saved && (
                <>
                  <div className="w-full aspect-video relative rounded-2xl overflow-hidden">
                    <Image
                      src={saved.image}
                      alt={saved.name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#A0714F" }}>
                      Your Saved Coffee Personality
                    </p>
                    <h3
                      className="text-2xl font-bold"
                      style={{ fontFamily: "var(--font-playfair), serif", color: "#3B2A1A" }}
                    >
                      {saved.name}
                    </h3>
                    <p className="text-lg italic" style={{ color: "#8B7355" }}>
                      &ldquo;{saved.tagline}&rdquo;
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
                      ☕ {saved.coffee}
                    </p>
                  </div>
                </>
              )}

              <button
                onClick={startQuiz}
                className="px-8 py-3 rounded-xl text-white font-semibold text-base transition-colors"
                style={{ backgroundColor: "#A0714F" }}
                onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#7A5338")}
                onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#A0714F")}
              >
                Retake the quiz
              </button>
            </div>
          );
        })()}

        {/* QUESTION SCREEN */}
        {screen === "question" && (
          <div className="flex flex-col gap-6">
            <div>
              <div className="flex justify-between text-sm mb-2" style={{ color: "#8B7355" }}>
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round((currentQuestion / questions.length) * 100)}%</span>
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
        {screen === "result" && result && (
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

            {member && pointsAwarded && (
              <div
                className="w-full rounded-xl px-6 py-4 text-center"
                style={{ backgroundColor: "#EAF4E8", border: "1.5px solid #6aad5b" }}
              >
                <p className="text-base font-semibold" style={{ color: "#2d6a1f" }}>
                  🎉 +25 points added! You now have {pointsAwarded.total} points.
                </p>
              </div>
            )}

            {!member && (
              <p className="text-sm" style={{ color: "#8B7355" }}>
                Taking as guest — no points awarded.{" "}
                <button
                  onClick={resetToLookup}
                  className="underline underline-offset-2"
                  style={{ color: "#A0714F" }}
                >
                  Sign in to earn points
                </button>
              </p>
            )}

            <button
              onClick={resetToLookup}
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
