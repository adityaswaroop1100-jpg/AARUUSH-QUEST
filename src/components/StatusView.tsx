import React from 'react';
import { Trophy, Zap, Clock, Target, Award, Flame } from 'lucide-react';
import { DomainPortal } from '../types';

interface StatusViewProps {
  portals: DomainPortal[];
  completedPortals: string[];
  failedPortals: string[];
  score: number;
  streak: number;
  maxStreak: number;
  timeRemaining: number;
}

export const StatusView: React.FC<StatusViewProps> = ({
  portals,
  completedPortals,
  failedPortals,
  score,
  streak,
  maxStreak,
  timeRemaining,
}) => {
  const totalPortals = portals.length;
  const completedCount = completedPortals.length;
  const attempts = completedCount + failedPortals.length;
  const accuracy = attempts > 0 ? Math.round((completedCount / attempts) * 100) : 100;
  const timeElapsed = 180 - timeRemaining;

  // Categories
  const categories = Array.from(new Set(portals.map((p) => p.category)));

  // Simulated live leaderboards of Aaruush Fest
  const leaderboard = [
    { rank: 1, team: 'SYNAPSE_9 (IIT M)', score: 320, time: '2:15' },
    { rank: 2, team: 'YOU (LIVE QUEST)', score: score, time: `${Math.floor(timeElapsed / 60)}:${String(timeElapsed % 60).padStart(2, '0')}`, isUser: true },
    { rank: 3, team: 'CYBER_VORTEX (BITS)', score: 285, time: '2:40' },
    { rank: 4, team: 'AERO_KINETIX (SRM)', score: 260, time: '2:50' },
    { rank: 5, team: 'QUANTUM_VOID (NIT T)', score: 240, time: '2:55' },
  ].sort((a, b) => b.score - a.score).map((entry, idx) => ({ ...entry, rank: idx + 1 }));

  return (
    <div className="flex-grow flex flex-col p-4 md:p-6 max-w-4xl mx-auto w-full overflow-y-auto space-y-6">
      <div>
        <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-white uppercase tracking-tight">
          GRID TELEMETRY // STATUS
        </h2>
        <p className="font-mono text-xs text-white/60">
          REAL-TIME PERFORMANCE & BENCHMARK ANALYTICS
        </p>
      </div>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Score Card */}
        <div className="glass-panel rounded-xl p-4 border-amber-500/30">
          <div className="flex items-center justify-between text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">
            <span>Score</span>
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="font-['Space_Grotesk',sans-serif] text-2xl md:text-3xl font-bold text-amber-300">
            {score}
          </div>
          <div className="text-[10px] font-mono text-white/50 mt-1">PTS ACCUMULATED</div>
        </div>

        {/* Streak Card */}
        <div className="glass-panel rounded-xl p-4 border-orange-500/30">
          <div className="flex items-center justify-between text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">
            <span>Streak</span>
            <Flame className="w-3.5 h-3.5 text-orange-400" />
          </div>
          <div className="font-['Space_Grotesk',sans-serif] text-2xl md:text-3xl font-bold text-[#fe6b00]">
            {streak}x
          </div>
          <div className="text-[10px] font-mono text-white/50 mt-1">BEST: {maxStreak}x</div>
        </div>

        {/* Accuracy Card */}
        <div className="glass-panel rounded-xl p-4 border-cyan-500/30">
          <div className="flex items-center justify-between text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">
            <span>Accuracy</span>
            <Target className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="font-['Space_Grotesk',sans-serif] text-2xl md:text-3xl font-bold text-cyan-300">
            {accuracy}%
          </div>
          <div className="text-[10px] font-mono text-white/50 mt-1">{completedCount} BREACHES</div>
        </div>

        {/* Time Efficiency */}
        <div className="glass-panel rounded-xl p-4 border-white/10">
          <div className="flex items-center justify-between text-white/60 font-mono text-[10px] uppercase tracking-wider mb-1">
            <span>Time Left</span>
            <Clock className="w-3.5 h-3.5 text-white/40" />
          </div>
          <div className="font-['Space_Grotesk',sans-serif] text-2xl md:text-3xl font-bold text-white">
            {timeRemaining}s
          </div>
          <div className="text-[10px] font-mono text-white/50 mt-1">180s TOTAL</div>
        </div>
      </div>

      {/* Domain Mastery Breakdown */}
      <div className="glass-panel rounded-xl p-5 border-white/10">
        <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-base text-white uppercase tracking-wide mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          Domain Category Penetration
        </h3>

        <div className="space-y-3 font-mono text-xs">
          {categories.map((cat) => {
            const catPortals = portals.filter((p) => p.category === cat);
            const catCompleted = catPortals.filter((p) => completedPortals.includes(p.id)).length;
            const pct = Math.round((catCompleted / catPortals.length) * 100);

            return (
              <div key={cat}>
                <div className="flex justify-between text-white/80 mb-1">
                  <span>{cat}</span>
                  <span className="text-cyan-300 font-bold">
                    {catCompleted}/{catPortals.length} ({pct}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#1b1b20] rounded-full overflow-hidden border border-white/5">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 rounded-full transition-all duration-300"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulated Live Leaderboard */}
      <div className="glass-panel rounded-xl p-5 border-white/10">
        <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-base text-white uppercase tracking-wide mb-3 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          Aaruush Quest Live Standings
        </h3>

        <div className="divide-y divide-white/5 font-mono text-xs">
          {leaderboard.map((item) => (
            <div
              key={item.team}
              className={`py-2.5 px-3 flex items-center justify-between rounded ${
                item.isUser ? 'bg-cyan-950/50 border border-cyan-500/40 text-cyan-200' : 'text-white/80'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-bold w-5 text-amber-400">#{item.rank}</span>
                <span className="font-semibold">{item.team}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-white/60">⏱ {item.time}</span>
                <span className="font-bold text-amber-300">{item.score} PTS</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
