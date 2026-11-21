"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CyberLabScene } from "@/components/academy/lab3d/CyberLabScene";

interface QuestionItem {
  id: number;
  question: string;
  expectedAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  hint: string;
}

const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    question: "Identify the machine that processed the surveillance footage.",
    expectedAnswer: "Workstation",
    userAnswer: "",
    isCorrect: false,
    hint: "High-performance compute system built for heavy rendering without thermal throttling.",
  },
  {
    id: 2,
    question: "Identify the machine that holds the network log.",
    expectedAnswer: "Server",
    userAnswer: "",
    isCorrect: false,
    hint: "Runs 24/7 in the server room managing incoming and outgoing connections.",
  },
  {
    id: 3,
    question: "Identify the machine that holds the recovered browser profile.",
    expectedAnswer: "Laptop",
    userAnswer: "",
    isCorrect: false,
    hint: "Battery-powered portable computer brought to the meeting room desk.",
  },
  {
    id: 4,
    question: "Identify the machine that scanned the archive.",
    expectedAnswer: "Desktop",
    userAnswer: "",
    isCorrect: false,
    hint: "Standard office desktop workstation used for file analysis.",
  },
  {
    id: 5,
    question: "Identify the device that received the location SMS.",
    expectedAnswer: "Smartphone",
    userAnswer: "",
    isCorrect: false,
    hint: "Handheld mobile device equipped with cellular radio and camera sensors.",
  },
  {
    id: 6,
    question: "Identify the class of device you had to disable to stop the intrusion.",
    expectedAnswer: "IoT",
    userAnswer: "",
    isCorrect: false,
    hint: "Smart office devices connected to the Wi-Fi network (thermostat, printer, speaker).",
  },
];

export function TryHackMeRoomLayout() {
  const [splitView, setSplitView] = useState<boolean>(true);
  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS);
  
  const [hintVisible, setHintVisible] = useState<Record<number, boolean>>({});

  const solvedCount = questions.filter((q) => q.isCorrect).length;
  const progressPercent = Math.round((solvedCount / questions.length) * 100);

  const handleAnswerChange = (id: number, val: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, userAnswer: val } : q))
    );
  };

  const handleSubmit = (id: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const cleanUser = q.userAnswer.trim().toLowerCase();
          const cleanExpected = q.expectedAnswer.trim().toLowerCase();
          const isRight =
            cleanUser === cleanExpected ||
            (cleanExpected === "smartphone" && (cleanUser === "phone" || cleanUser === "mobile phone" || cleanUser === "mobile")) ||
            (cleanExpected === "iot" && cleanUser === "internet of things");
          return { ...q, isCorrect: isRight };
        }
        return q;
      })
    );
  };

  const toggleHint = (id: number) => {
    setHintVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen bg-[#0b1319] text-[#e2e8f0] font-sans antialiased flex flex-col select-none">
      {/* ── TOP NAV BAR (Authentic TryHackMe Header) ── */}
      <header className="h-14 border-b border-[#1b2b34] bg-[#0c161d] px-4 flex items-center justify-between text-xs font-semibold z-40">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-emerald-400 font-extrabold text-base tracking-wider font-mono">
              [TRY<span className="text-white">HACK</span>ME]
            </span>
            <span className="text-[10px] text-zinc-500 font-mono hidden sm:inline">| ACADEMY 3D ROOM</span>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-zinc-400 text-xs">
            <Link href="/academy" className="text-zinc-200 hover:text-emerald-400 transition-colors">
              Learn
            </Link>
            <span className="text-zinc-400 hover:text-emerald-400 cursor-pointer">Practice</span>
            <span className="text-zinc-400 hover:text-emerald-400 cursor-pointer">Compete</span>
            <span className="text-zinc-400 hover:text-emerald-400 cursor-pointer">Certifications</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-[#101e26] border border-[#1b2b34] text-[11px] text-zinc-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Room Progress:</span>
            <span className="text-emerald-400 font-bold">{progressPercent}%</span>
          </div>

          <button
            type="button"
            onClick={() => setSplitView((v) => !v)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 ${
              splitView
                ? "bg-emerald-600 border-emerald-500 text-black shadow-sm"
                : "bg-[#14232c] border-[#223844] text-zinc-300 hover:border-emerald-500"
            }`}
          >
            <span>{splitView ? "◫ Hide Split View" : "◫ Show Split View"}</span>
          </button>
        </div>
      </header>

      {/* ── ROOM HERO BANNER ── */}
      <div className="bg-gradient-to-r from-[#0d1a22] via-[#09141b] to-[#070e13] border-b border-[#1b2b34] px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-900 border border-emerald-400/30 flex items-center justify-center text-3xl shadow-lg shadow-emerald-950/60">
            ❄️
          </div>
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-0.5">
              <span>Learn</span>
              <span>&gt;</span>
              <span className="text-emerald-400">Advent of Cyber Warmup</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Snow Trail
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5 max-w-2xl">
              Join McSkidy as she takes back her deserted office in Wareville and learns which devices are best suited to which forensic and defensive tasks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span>⏱️</span>
            <span>60 min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-amber-400">⚡</span>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>👥</span>
            <span>5,825 Users</span>
          </div>
        </div>
      </div>

      {/* ── MAIN SPLIT-VIEW CONTAINER ── */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT PANE: Task 1 Instructions & Questions List */}
        <div
          className={`flex-col overflow-y-auto border-r border-[#1b2b34] bg-[#0c161d] p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 ${
            splitView ? "w-full lg:w-[48%] flex" : "w-full flex max-w-5xl mx-auto border-r-0"
          }`}
        >
          {/* Task Accordion Bar */}
          <div className="flex items-center justify-between p-3.5 rounded-xl border border-emerald-900/60 bg-[#0e1c24]">
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-mono font-bold text-xs flex items-center justify-center border border-emerald-500/40">
                1
              </span>
              <div>
                <div className="text-sm font-bold text-white">Task 1: Snow Trail</div>
                <div className="text-[11px] text-zinc-400">First-Person Office Investigation & Hardware Triage</div>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/60">
              {solvedCount} / {questions.length} Complete
            </span>
          </div>

          {/* Reading Material & Scenario Description */}
          <div className="space-y-3.5 text-xs text-zinc-300 leading-relaxed font-sans">
            <p>
              Wareville has gone silent. The streets are empty, shops are deserted, and a security breach has hit the TBFC offices. Join <strong>McSkidy</strong> as she takes back her deserted office, triages digital evidence with her assistant, and learns which devices are best suited to specific forensic and defense tasks.
            </p>
            <div className="p-3.5 rounded-xl border border-zinc-800 bg-[#0f1b22] space-y-2 text-xs">
              <div className="text-emerald-400 font-bold uppercase tracking-wider text-[11px] font-mono">
                🎮 Navigation & Controls Instructions
              </div>
              <ul className="list-disc pl-4 space-y-1 text-zinc-400 text-[11px]">
                <li><strong className="text-zinc-200">WASD / Arrow Keys</strong>: Move McSkidy around the office.</li>
                <li><strong className="text-zinc-200">Mouse</strong>: Look around (Click 3D view to lock pointer, ESC to release).</li>
                <li><strong className="text-zinc-200">P / Right-Click</strong>: Pull up McSkidy&apos;s handheld Smartphone to inspect emails and tasks.</li>
                <li><strong className="text-zinc-200">E / Left-Click</strong>: Interact with targeted desks, terminals, and IoT switches.</li>
              </ul>
            </div>
          </div>

          {/* Question Section: "Answer the questions below" */}
          <div className="space-y-4 pt-2 border-t border-[#1b2b34]">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-white uppercase tracking-wider font-mono">
                Answer the questions below
              </h2>
              <span className="text-[11px] text-zinc-400 font-mono">Type answer and click Submit</span>
            </div>

            <div className="space-y-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-xl border text-xs transition-all ${
                    q.isCorrect
                      ? "border-emerald-500/60 bg-emerald-950/20"
                      : "border-[#1b2b34] bg-[#0f1b22]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="font-semibold text-zinc-200 leading-snug">
                      <span className="text-emerald-400 font-mono font-bold mr-1.5">{q.id}.</span>
                      {q.question}
                    </div>
                    {q.isCorrect && (
                      <span className="shrink-0 text-emerald-400 font-mono font-bold text-[11px] bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/80">
                        ✔ Correct
                      </span>
                    )}
                  </div>

                  {/* Submission Form */}
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      disabled={q.isCorrect}
                      value={q.userAnswer}
                      onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !q.isCorrect) handleSubmit(q.id);
                      }}
                      placeholder="Type your answer here..."
                      className={`flex-1 px-3 py-2 rounded-lg font-mono text-xs border focus:outline-none transition-all ${
                        q.isCorrect
                          ? "bg-emerald-950/40 border-emerald-700/60 text-emerald-300 font-bold"
                          : "bg-[#091217] border-[#1b2b34] text-white focus:border-emerald-500 placeholder-zinc-600"
                      }`}
                    />
                    <button
                      type="button"
                      disabled={q.isCorrect || !q.userAnswer.trim()}
                      onClick={() => handleSubmit(q.id)}
                      className={`px-4 py-2 rounded-lg font-bold font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-40 ${
                        q.isCorrect
                          ? "bg-emerald-600 text-black cursor-default"
                          : "bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20"
                      }`}
                    >
                      {q.isCorrect ? "Correct" : "Submit"}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleHint(q.id)}
                      className="px-2.5 py-2 rounded-lg border border-[#1b2b34] hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors text-xs"
                      title="Toggle Hint"
                    >
                      💡
                    </button>
                  </div>

                  {/* Optional Hint Dropdown */}
                  {hintVisible[q.id] && (
                    <div className="mt-2 text-[11px] text-amber-300 bg-amber-950/20 border border-amber-900/40 p-2 rounded-lg font-mono">
                      <strong>Hint:</strong> {q.hint}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: Interactive 3D WebGL Canvas */}
        {splitView && (
          <div className="w-full lg:w-[52%] flex flex-col bg-[#070b0e] relative h-[600px] lg:h-auto">
            {/* Top Control Bar of 3D Frame */}
            <div className="h-9 px-4 bg-[#0a1217] border-b border-[#1b2b34] flex items-center justify-between text-[11px] font-mono text-zinc-400 z-30 select-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-zinc-200">INTERACTIVE 3D ROOM: TBFC WAREVILLE</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-zinc-500">Resolution: 100% Desktop</span>
                <span className="text-emerald-500 font-bold">● Active WebGL Engine</span>
              </div>
            </div>

            {/* Embedded 3D First-Person Canvas Scene */}
            <div className="flex-1 w-full relative overflow-hidden">
              <CyberLabScene />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
