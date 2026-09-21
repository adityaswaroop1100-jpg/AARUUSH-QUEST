import React, { useState } from 'react';
import { Compass, RotateCw, RotateCcw, Square, Sparkles, CheckCircle, XCircle, ArrowRight, Lightbulb } from 'lucide-react';
import { DomainPortal } from '../types';
import { ChallengeVisualizer } from './Visualizers';
import { DomainLogo } from './DomainLogos';
import { sound } from '../utils/audio';

interface ChallengeModalProps {
  portal: DomainPortal;
  timeRemaining: number;
  completedCount: number;
  totalPortals: number;
  onSolveChallenge: (portalId: string, isCorrect: boolean, timeSpentSec: number, pointsEarned?: number) => void;
  onBackToMap: () => void;
  onUseHint: () => boolean;
  hintCount: number;
}

export const ChallengeModal: React.FC<ChallengeModalProps> = ({
  portal,
  timeRemaining,
  completedCount,
  totalPortals,
  onSolveChallenge,
  onBackToMap,
  onUseHint,
  hintCount,
}) => {
  const questionsList = (portal.challenges && portal.challenges.length > 0)
    ? portal.challenges
    : [portal.challenge];

  const [questionIndex, setQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answeredState, setAnsweredState] = useState<'pending' | 'correct' | 'wrong'>('pending');
  const [showHint, setShowHint] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [accumulatedPoints, setAccumulatedPoints] = useState<number>(0);
  const startTime = React.useRef(Date.now());

  // Format timer MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const currentChallenge = questionsList[questionIndex] || portal.challenge;

  const handleSelectOption = (idx: number) => {
    if (answeredState !== 'pending') return;
    
    setSelectedOption(idx);
    const isCorrect = idx === currentChallenge.correctOptionIndex;
    const qPoints = currentChallenge.basePoints || 10;

    if (isCorrect) {
      sound.playCorrect();
      setAnsweredState('correct');
      setCorrectCount(prev => prev + 1);
      setAccumulatedPoints(prev => prev + qPoints);
    } else {
      sound.playWrong();
      setAnsweredState('wrong');
    }

    // Delay to display visual feedback before next question or concluding portal
    setTimeout(() => {
      if (questionIndex + 1 < questionsList.length) {
        setQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setAnsweredState('pending');
        setShowHint(false);
      } else {
        const totalTimeSpent = Math.max(1, Math.round((Date.now() - startTime.current) / 1000));
        const avgTimePerQuestion = Math.max(1, Math.round(totalTimeSpent / questionsList.length));
        const finalCorrectCount = isCorrect ? correctCount + 1 : correctCount;
        const finalPoints = isCorrect ? accumulatedPoints + qPoints : accumulatedPoints;
        const overallSuccess = finalCorrectCount > 0;
        onSolveChallenge(portal.id, overallSuccess, avgTimePerQuestion, finalPoints);
      }
    }, 1400);
  };

  const handleHintClick = () => {
    if (showHint) return;
    if (hintCount > 0) {
      if (onUseHint()) {
        sound.playSelect();
        setShowHint(true);
      }
    } else {
      sound.playWrong();
    }
  };

  // Helper icon for buttons
  const getOptionIcon = (optLabel: string) => {
    const lower = optLabel.toLowerCase();
    if (lower.includes('counter-clockwise') || lower.includes('ccw')) {
      return <RotateCcw className="w-5 h-5 text-[#ffb693] shrink-0" />;
    }
    if (lower.includes('clockwise') || lower.includes('cw')) {
      return <RotateCw className="w-5 h-5 text-[#7df4ff] shrink-0" />;
    }
    if (lower.includes('static') || lower.includes('zero') || lower.includes('low')) {
      return <Square className="w-5 h-5 text-white/50 shrink-0" />;
    }
    return <Sparkles className="w-5 h-5 text-[#ffd602] shrink-0" />;
  };

  const progressPercent = Math.min(100, Math.round((completedCount / totalPortals) * 100));

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#080808] font-['Geist',sans-serif] selection:bg-[#00f0ff] selection:text-[#00363a] text-[#e4e1e9] overflow-y-auto">
      {/* Cyber Grid Background */}
      <div className="fixed inset-0 digital-grid z-0 pointer-events-none" />
      <div className="fixed inset-0 noise-overlay z-0 mix-blend-overlay pointer-events-none" />
      <div className="fixed top-1/3 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#00f0ff]/5 blur-[120px] rounded-full z-0 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
        <button
          onClick={onBackToMap}
          className="flex items-center gap-2 group cursor-pointer text-left"
          title="Return to Grid Map"
        >
          <div className="p-1.5 rounded-full bg-[#1b1b20] border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
            <Compass className="w-5 h-5 text-cyan-300 group-hover:rotate-45 transition-transform" />
          </div>
          <span className="font-['Space_Grotesk',sans-serif] font-bold text-base tracking-wider text-white">
            AARUUSH QUEST
          </span>
        </button>

        {/* Timer Box */}
        <div
          className={`flex items-center gap-2 px-3 py-1.5 rounded bg-[#1b1b20]/90 border font-mono font-bold tracking-widest text-sm backdrop-blur-md ${
            timeRemaining < 30
              ? 'border-red-500 text-red-400 animate-pulse shadow-[0_0_12px_rgba(255,0,0,0.4)]'
              : 'border-cyan-500/40 text-white shadow-[0_0_10px_rgba(0,240,255,0.2)]'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>⏱ {formattedTime}</span>
        </div>
      </header>

      {/* Main Micro Challenge Card (Matches Image 7) */}
      <main className="relative z-10 w-full max-w-xl mx-auto px-4 py-3 flex-grow flex flex-col justify-center">
        <div className="glass-panel rounded-2xl p-6 md:p-8 border-t-2 border-t-[#00f0ff] shadow-2xl relative">
          
          {/* Tag Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-950/80 border border-cyan-500/40 text-[#00f0ff] font-mono text-[11px] font-bold tracking-widest uppercase shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              🧠 {currentChallenge.category}
            </div>

            {questionsList.length > 1 && (
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-cyan-500/30 text-cyan-300 font-mono text-[11px] font-bold tracking-wider">
                <span>QUESTION {questionIndex + 1} OF {questionsList.length}</span>
              </div>
            )}

            <button
              onClick={handleHintClick}
              disabled={showHint}
              className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-300 hover:text-amber-200 bg-amber-950/40 border border-amber-500/30 px-2.5 py-1 rounded transition-all cursor-pointer"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>{showHint ? 'HINT ACTIVE' : `HINT (${hintCount})`}</span>
            </button>
          </div>

          {/* Question Step Indicators if multiple */}
          {questionsList.length > 1 && (
            <div className="w-full flex gap-1.5 mb-3">
              {questionsList.map((_, qIdx) => (
                <div
                  key={qIdx}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                    qIdx < questionIndex
                      ? 'bg-green-400'
                      : qIdx === questionIndex
                      ? 'bg-cyan-400 shadow-[0_0_8px_#00f0ff]'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Domain Official Emblem */}
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-2xl bg-[#131318]/90 border border-cyan-500/40 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.25)] flex items-center justify-center">
              <DomainLogo id={portal.id} name={portal.name} className="w-12 h-12 md:w-14 md:h-14" />
            </div>
          </div>

          {/* Title */}
          <h2 className="font-['Space_Grotesk',sans-serif] text-2xl md:text-3xl font-bold uppercase tracking-wide text-white text-center mb-2">
            {currentChallenge.title}
          </h2>

          {/* Description */}
          <p className="text-white/90 text-sm md:text-base text-center font-medium leading-relaxed mb-3">
            {currentChallenge.description}
          </p>

          {/* Context Instructions */}
          {currentChallenge.instructions && (
            <div className="text-center font-mono text-xs text-cyan-200/90 bg-cyan-950/30 py-1.5 px-3 rounded border border-cyan-500/20 mb-3">
              {currentChallenge.instructions}
            </div>
          )}

          {/* Interactive Visualizer */}
          <ChallengeVisualizer type={currentChallenge.visualType} title={currentChallenge.title} />

          {/* Hint Overlay if opened */}
          {showHint && (
            <div className="mb-4 p-3 bg-amber-950/60 border border-amber-500/40 rounded-lg text-amber-200 font-mono text-xs flex items-start gap-2 animate-fade-in">
              <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>NEURAL HINT:</strong> {currentChallenge.hint}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="flex flex-col gap-3 my-4">
            {currentChallenge.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectOpt = idx === currentChallenge.correctOptionIndex;

              let btnStyle = 'border-white/15 bg-[#1b1b20]/90 text-white hover:border-cyan-400 hover:bg-[#25252d]';
              
              if (answeredState === 'correct') {
                if (isSelected) {
                  btnStyle = 'border-green-400 bg-green-950/80 text-green-200 shadow-[0_0_18px_rgba(74,222,128,0.5)]';
                } else {
                  btnStyle = 'opacity-40 border-white/10 bg-[#1b1b20]';
                }
              } else if (answeredState === 'wrong') {
                if (isSelected) {
                  btnStyle = 'border-red-500 bg-red-950/80 text-red-200 shadow-[0_0_18px_rgba(239,68,68,0.5)]';
                } else if (isCorrectOpt) {
                  btnStyle = 'border-green-500/60 bg-green-950/40 text-green-300';
                } else {
                  btnStyle = 'opacity-40 border-white/10 bg-[#1b1b20]';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(idx)}
                  disabled={answeredState !== 'pending'}
                  className={`w-full p-4 rounded-xl border text-left font-mono transition-all duration-200 flex items-center justify-between cursor-pointer ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    {getOptionIcon(opt.label)}
                    <div>
                      <div className="text-sm md:text-[15px] font-bold tracking-wider uppercase">
                        {opt.label}
                      </div>
                      {opt.sublabel && (
                        <div className="text-[11px] text-white/50 tracking-normal mt-0.5">
                          {opt.sublabel}
                        </div>
                      )}
                    </div>
                  </div>

                  {answeredState !== 'pending' && isSelected && (
                    <div>
                      {isCorrectOpt ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Feedback Explanation Message */}
          {answeredState !== 'pending' && (
            <div
              className={`p-3 rounded-lg font-mono text-xs mt-2 text-left animate-fade-in ${
                answeredState === 'correct'
                  ? 'bg-green-950/50 border border-green-500/40 text-green-300'
                  : 'bg-red-950/50 border border-red-500/40 text-red-300'
              }`}
            >
              <div className="font-bold flex items-center gap-1.5 mb-1">
                {answeredState === 'correct' ? '✅ PORTAL BREACH SUCCESSFUL! (+POINTS)' : '⚠️ CIPHER ERROR // DATA LOGGED'}
              </div>
              <p className="text-white/80 text-[11px] leading-relaxed">
                {currentChallenge.explanation}
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Progress Bar (Matches Image 7) */}
      <footer className="relative z-20 w-full max-w-xl mx-auto px-4 py-5">
        <div className="flex items-center justify-between font-mono text-xs mb-2">
          <span className="text-[#00f0ff] font-bold tracking-widest uppercase">
            PROGRESS
          </span>
          <span className="text-white/90 tracking-wider">
            <strong className="text-white">{completedCount}</strong> / {totalPortals} Domains Explored
          </span>
        </div>

        {/* Progress Fill Line */}
        <div className="w-full h-1.5 bg-[#1b1b20] rounded-full overflow-hidden border border-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#00f0ff] via-[#7df4ff] to-[#ffd602] transition-all duration-500 rounded-full shadow-[0_0_8px_#00f0ff]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </footer>
    </div>
  );
};
