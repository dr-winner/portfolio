'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { SnowTrailLabView } from './SnowTrailLabView';

interface QuestionItem {
  id: number;
  question: string;
  answer: string;
  hint: string;
  userAnswer: string;
  isCorrect: boolean;
}

const INITIAL_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    question: 'Identify the machine that processed the surveillance footage.',
    answer: 'Workstation',
    hint: 'A machine with dedicated high-performance GPU and multi-core capabilities suited for continuous video de-obfuscation without thermal throttling.',
    userAnswer: '',
    isCorrect: false,
  },
  {
    id: 2,
    question: 'Identify the machine that holds the network log.',
    answer: 'Server',
    hint: 'Runs 24/7 continuously in the cold room to capture and maintain all incoming and outgoing visitor traffic records.',
    userAnswer: '',
    isCorrect: false,
  },
  {
    id: 3,
    question: 'Identify the machine that holds the recovered browser profile.',
    answer: 'Laptop',
    hint: 'A portable battery-powered machine plugged into the damaged open chassis in the meeting room.',
    userAnswer: '',
    isCorrect: false,
  },
  {
    id: 4,
    question: 'Identify the machine that scanned the archive.',
    answer: 'Desktop',
    hint: 'A general daily office desktop terminal used to decompress and virus-scan incoming archive payloads.',
    userAnswer: '',
    isCorrect: false,
  },
  {
    id: 5,
    question: 'Identify the device that received the location SMS.',
    answer: 'Smartphone',
    hint: 'A handheld mobile device with cellular connectivity, optical camera lens, and SMS push capabilities.',
    userAnswer: '',
    isCorrect: false,
  },
  {
    id: 6,
    question: 'Identify the class of device you had to disable to stop the intrusion.',
    answer: 'IoT',
    hint: 'Smart appliances connected to the local Wi-Fi (such as smart thermostats and wireless speakers) acting as persistence pivot footholds.',
    userAnswer: '',
    isCorrect: false,
  },
];

export function TryHackMeRoomLayout() {
  const [questions, setQuestions] = useState<QuestionItem[]>(INITIAL_QUESTIONS);
  const [hintVisible, setHintVisible] = useState<Record<number, boolean>>({});
  const [isLabFullscreen, setIsLabFullscreen] = useState(false);
  const [splitView, setSplitView] = useState(true);

  const handleAnswerChange = (id: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, userAnswer: value } : q))
    );
  };

  const handleSubmit = (id: number) => {
    setQuestions((prev) =>
      prev.map((q) => {
        if (q.id !== id) return q;
        const normalizedUser = q.userAnswer.trim().toLowerCase();
        const normalizedTarget = q.answer.toLowerCase();
        const isMatch =
          normalizedUser === normalizedTarget ||
          (id === 5 && normalizedUser === 'phone') ||
          (id === 6 && (normalizedUser === 'iot devices' || normalizedUser === 'iot device'));
        return { ...q, isCorrect: isMatch };
      })
    );
  };

  const toggleHint = (id: number) => {
    setHintVisible((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const solvedCount = questions.filter((q) => q.isCorrect).length;
  const progressPercent = Math.round((solvedCount / questions.length) * 100);

  // Auto-fill or mark hint when a clue is found in the 3D room
  const handleClueFound = (clueIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx === clueIndex && !q.isCorrect) {
          return { ...q, userAnswer: q.answer, isCorrect: true };
        }
        return q;
      })
    );
  };

  // If in dedicated fullscreen 3D lab mode
  if (isLabFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col">
        <SnowTrailLabView
          onExitLab={() => setIsLabFullscreen(false)}
          onClueFound={handleClueFound}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070e14] text-zinc-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. TRYHACKME OFFICIAL BRAND HEADER */}
      <header className="h-14 border-b border-[#1b2b34] bg-[#0c161d] px-4 sm:px-6 flex items-center justify-between z-30 select-none">
        <div className="flex items-center gap-6">
          <Link href="/academy" className="flex items-center gap-2 group">
            <span className="font-mono font-black text-sm text-emerald-400 group-hover:text-emerald-300 transition-colors">
              [TRYHACKME]
            </span>
            <span className="text-zinc-600 font-mono text-xs hidden sm:inline">|</span>
            <span className="text-zinc-300 font-mono text-xs hidden sm:inline">
              ACADEMY 3D ROOM
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-xs font-medium text-zinc-400">
            <span className="text-white border-b-2 border-emerald-400 pb-4 pt-4 font-bold">
              Learn
            </span>
            <span className="hover:text-white cursor-pointer transition-colors">Practice</span>
            <span className="hover:text-white cursor-pointer transition-colors">Compete</span>
            <span className="hover:text-white cursor-pointer transition-colors">Certifications</span>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {/* Progress Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#1b2b34] bg-[#091217] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-zinc-300">Room Progress:</span>
            <span className="font-bold text-emerald-400">{progressPercent}%</span>
          </div>

          {/* Fullscreen 3D Lab Toggle */}
          <button
            type="button"
            onClick={() => setIsLabFullscreen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-500/20"
          >
            🎮 Enter Fullscreen 3D Lab
          </button>

          {/* Split Screen Toggle */}
          <button
            type="button"
            onClick={() => setSplitView((v) => !v)}
            className="px-3 py-1.5 rounded-lg border border-[#1b2b34] bg-[#0e1c24] hover:bg-[#152732] text-xs font-mono text-zinc-300 hover:text-white transition-colors hidden sm:flex items-center gap-1.5"
          >
            <span>{splitView ? 'Hide Split View' : 'Show Split View'}</span>
          </button>
        </div>
      </header>

      {/* 2. HERO ROOM DETAILS BANNER */}
      <section className="bg-gradient-to-r from-[#0d1720] via-[#09131a] to-[#070e14] border-b border-[#1b2b34] px-4 sm:px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          {/* Snowflake Badge Icon */}
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/30 to-teal-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 text-2xl shadow-lg shadow-emerald-950">
            ❄️
          </div>
          <div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              <span>Learn</span>
              <span>&gt;</span>
              <span className="text-emerald-400 font-bold">Advent of Cyber Warmup</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Snow Trail
            </h1>
            <p className="text-xs text-zinc-400 max-w-2xl mt-0.5 leading-relaxed">
              Join McSkidy as she takes back her deserted office in Wareville and learns which devices are best suited to which forensic and defensive tasks.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 bg-[#0c161d] px-3 py-1.5 rounded-lg border border-[#1b2b34]">
            <span>⏱ 60 min</span>
            <span>•</span>
            <span className="text-amber-400 font-bold">⚡ Medium</span>
            <span>•</span>
            <span>👥 5,825 Users</span>
          </div>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE: SPLIT-VIEW PANELS */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        {/* LEFT PANE: Task 1 Instructions & Questions List */}
        <div
          className={`flex-col overflow-y-auto border-r border-[#1b2b34] bg-[#0c161d] p-6 space-y-6 scrollbar-thin scrollbar-thumb-zinc-700 ${
            splitView ? 'w-full lg:w-[48%] flex' : 'w-full flex max-w-5xl mx-auto border-r-0'
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
                      ? 'border-emerald-500/60 bg-emerald-950/20'
                      : 'border-[#1b2b34] bg-[#0f1b22]'
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
                        if (e.key === 'Enter' && !q.isCorrect) handleSubmit(q.id);
                      }}
                      placeholder="Type your answer here..."
                      className={`flex-1 px-3 py-2 rounded-lg font-mono text-xs border focus:outline-none transition-all ${
                        q.isCorrect
                          ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300 font-bold'
                          : 'bg-[#091217] border-[#1b2b34] text-white focus:border-emerald-500 placeholder-zinc-600'
                      }`}
                    />
                    <button
                      type="button"
                      disabled={q.isCorrect || !q.userAnswer.trim()}
                      onClick={() => handleSubmit(q.id)}
                      className={`px-4 py-2 rounded-lg font-bold font-mono text-xs uppercase tracking-wider transition-all disabled:opacity-40 ${
                        q.isCorrect
                          ? 'bg-emerald-600 text-black cursor-default'
                          : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      {q.isCorrect ? 'Correct' : 'Submit'}
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
          <div className="w-full lg:w-[52%] flex flex-col bg-[#070b0e] relative h-[650px] lg:h-auto">
            {/* Top Control Bar of 3D Frame */}
            <div className="h-9 px-4 bg-[#0a1217] border-b border-[#1b2b34] flex items-center justify-between text-[11px] font-mono text-zinc-400 z-30 select-none">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold text-zinc-200">INTERACTIVE 3D ROOM: TBFC WAREVILLE</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]">
                <button
                  type="button"
                  onClick={() => setIsLabFullscreen(true)}
                  className="text-emerald-400 hover:underline font-bold"
                >
                  ⛶ Expand Lab
                </button>
                <span className="text-zinc-500">Resolution: 100% Desktop</span>
                <span className="text-emerald-500 font-bold">● Active WebGL Engine</span>
              </div>
            </div>

            {/* Embedded 3D Office Environment */}
            <div className="flex-1 w-full relative overflow-hidden">
              <SnowTrailLabView
                onExitLab={() => setSplitView(false)}
                onClueFound={handleClueFound}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
