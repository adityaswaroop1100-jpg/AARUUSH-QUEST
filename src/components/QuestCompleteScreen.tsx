import React, { useState } from 'react';
import { Award, Share2, Calendar, RotateCcw, Check, Sparkles, Trophy, Compass } from 'lucide-react';
import { sound } from '../utils/audio';

interface QuestCompleteProps {
  score: number;
  completedCount: number;
  totalPortals: number;
  totalSolvedQuestions?: number;
  totalQuestions?: number;
  totalTimeSec: number;
  onPlayAgain: () => void;
  onViewSchedule: () => void;
}

export const QuestCompleteScreen: React.FC<QuestCompleteProps> = ({
  score,
  completedCount,
  totalPortals,
  totalSolvedQuestions = 0,
  totalQuestions = 85,
  totalTimeSec,
  onPlayAgain,
  onViewSchedule,
}) => {
  const [copied, setCopied] = useState(false);

  // Play fanfare on mount
  React.useEffect(() => {
    sound.playVictory();
  }, []);

  const getRank = () => {
    if (score >= 1400 || completedCount >= 17) return 'AARUUSH CHAMPION';
    if (score >= 1000 || completedCount >= 12) return 'CYBER PRODIGY';
    if (score >= 600 || completedCount >= 7) return 'GRID TACTICIAN';
    return 'TECH INITIATE';
  };

  const getPercentile = () => {
    if (score >= 1400 || completedCount >= 17) return 'Global Top 5% • Master Tier';
    if (score >= 1000 || completedCount >= 12) return 'Global Top 15% • Elite Tier';
    if (score >= 600 || completedCount >= 7) return 'Global Top 35% • Specialist Tier';
    return 'Grid Participant';
  };

  const handleShare = () => {
    sound.playSelect();
    const shareText = `⚡ I just conquered AARUUSH QUEST with ${score} PTS (${completedCount}/${totalPortals} domains secured, ${totalSolvedQuestions}/${totalQuestions} MCQs solved)! Rank: ${getRank()} 🏆 #Aaruush2026 #SRMIST`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-[#080808] font-['Geist',sans-serif] selection:bg-[#00f0ff] selection:text-[#00363a] text-[#e4e1e9] overflow-y-auto py-10 px-4">
      {/* Background Layers */}
      <div className="fixed inset-0 digital-grid z-0 pointer-events-none" />
      <div className="fixed inset-0 noise-overlay z-0 mix-blend-overlay pointer-events-none" />
      <div className="fixed top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#ffd602]/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#00f0ff]/10 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Main Content Container (Matches Image 5) */}
      <main className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center gap-5 my-auto animate-fade-in">
        
        {/* Mission Accomplished Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1b1b20] border border-cyan-500/40 text-cyan-300 font-mono text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <Trophy className="w-3.5 h-3.5 text-[#ffd602]" />
          <span>MISSION ACCOMPLISHED</span>
        </div>

        {/* Quest Complete Title */}
        <h1 className="font-['Space_Grotesk',sans-serif] text-4xl md:text-5xl font-bold uppercase tracking-tight text-white text-center leading-tight drop-shadow-[0_0_25px_rgba(0,240,255,0.4)]">
          QUEST<br />
          <span className="text-[#00f0ff] glow-text-cyan">COMPLETE</span>
        </h1>

        {/* Final Rank Hero Card (Matches Image 5) */}
        <div className="w-full glass-panel rounded-2xl p-6 flex flex-col items-center text-center border-amber-500/30 shadow-[0_0_30px_rgba(255,214,2,0.15)]">
          {/* Glowing Circular Medal Badge */}
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-[#221b00] border-2 border-[#ffd602] flex items-center justify-center shadow-[0_0_30px_rgba(255,214,2,0.7)] animate-pulse">
              <div className="p-3 rounded-full bg-[#ffd602]/20 border border-[#ffd602]/40">
                <Award className="w-10 h-10 text-[#ffd602]" />
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-[#ffd602] absolute -top-1 -right-1 animate-bounce" />
          </div>

          <div className="font-mono text-[11px] text-white/60 tracking-widest uppercase mb-1">
            FINAL RANK
          </div>

          <div className="font-['Space_Grotesk',sans-serif] text-2xl md:text-3xl font-bold uppercase text-[#ffd602] glow-text-yellow tracking-wide">
            {getRank()}
          </div>
        </div>

        {/* Total Score Card (Matches Image 5) */}
        <div className="w-full glass-panel rounded-xl p-5 flex flex-col justify-between border-white/10 text-left">
          <div className="flex items-center justify-between font-mono text-xs text-white/60 uppercase tracking-widest mb-1">
            <span>TOTAL SCORE</span>
            <RotateCcw className="w-3.5 h-3.5 text-white/40" />
          </div>
          <div className="font-['Space_Grotesk',sans-serif] text-3xl md:text-4xl font-bold text-white tracking-tight">
            {score} PTS
          </div>
          <div className="font-mono text-xs text-white/50 mt-1 flex items-center justify-between">
            <span>{getPercentile()}</span>
            <span className="text-cyan-300 font-semibold">{totalSolvedQuestions} / {totalQuestions} MCQs Solved</span>
          </div>
        </div>

        {/* Domains Explored Card (Matches Image 5) */}
        <div className="w-full glass-panel rounded-xl p-5 flex flex-col justify-between border-white/10 text-left">
          <div className="flex items-center justify-between font-mono text-xs text-white/60 uppercase tracking-widest mb-2">
            <span>DOMAINS EXPLORED</span>
            <Compass className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-['Space_Grotesk',sans-serif] text-3xl font-bold text-white tracking-tight flex items-baseline gap-1">
            <span className="text-[#fe6b00]">{completedCount}</span>
            <span className="text-white/40 text-xl">/{totalPortals}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-[#1b1b20] rounded-full overflow-hidden mt-3 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#fe6b00] via-[#ffd602] to-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]"
              style={{ width: `${Math.min(100, (completedCount / totalPortals) * 100)}%` }}
            />
          </div>
        </div>

        {/* Share Button (Matches Image 5) */}
        <button
          onClick={handleShare}
          className="w-full py-4 px-6 rounded-md bg-[#00f0ff] hover:bg-[#7df4ff] text-[#00363a] font-mono font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.7)] transition-all cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#00363a] stroke-[3]" />
              <span>SCORECARD COPIED!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 fill-current" />
              <span>SHARE YOUR RANK</span>
            </>
          )}
        </button>

        {/* Welcome to Aaruush Festival Section (Matches Image 5) */}
        <div className="w-full border-t border-white/10 pt-6 mt-2 text-center">
          <h2 className="font-['Space_Grotesk',sans-serif] text-xl md:text-2xl font-bold text-white mb-2">
            Welcome to Aaruush
          </h2>
          <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-4 px-2">
            You have unlocked the full festival experience. The grid is active, the domains are open. Prepare for the next phase.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                sound.playSelect();
                onViewSchedule();
              }}
              className="flex-1 py-3 px-4 rounded border border-white/20 hover:border-cyan-400 bg-[#1b1b20] hover:bg-[#25252d] text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-cyan-300" />
              <span>VIEW FULL SCHEDULE</span>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onPlayAgain();
              }}
              className="py-3 px-4 rounded border border-white/20 hover:border-amber-400 bg-[#1b1b20] hover:bg-[#25252d] text-white font-mono text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-amber-300" />
              <span>REPLAY</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
