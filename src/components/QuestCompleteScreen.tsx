import React, { useState, useEffect } from 'react';
import { Award, Share2, Calendar, RotateCcw, Check, Sparkles, Trophy, Compass, ShieldCheck, User, Database, Loader2, RefreshCw, Medal } from 'lucide-react';
import { sound } from '../utils/audio';
import { ParticipantFormData, LeaderboardPlayer, fetchLeaderboard } from '../utils/supabase/participants';

interface QuestCompleteProps {
  score: number;
  completedCount: number;
  totalPortals: number;
  totalSolvedQuestions?: number;
  totalQuestions?: number;
  totalTimeSec: number;
  participant?: ParticipantFormData | null;
  isSyncingScore?: boolean;
  scoreSynced?: boolean;
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
  participant,
  isSyncingScore = false,
  scoreSynced = true,
  onPlayAgain,
  onViewSchedule,
}) => {
  const [copied, setCopied] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardPlayer[]>([]);
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState<boolean>(true);

  // Play fanfare on mount
  useEffect(() => {
    sound.playVictory();
  }, []);

  // Fetch leaderboard on mount and when score sync completes
  const loadLeaderboardData = async () => {
    setIsLoadingLeaderboard(true);
    try {
      const data = await fetchLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      console.warn('Leaderboard error:', err);
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  useEffect(() => {
    loadLeaderboardData();
    // Refresh after 2.5s in case score sync just finished
    const timer = setTimeout(() => {
      loadLeaderboardData();
    }, 2500);
    return () => clearTimeout(timer);
  }, [scoreSynced]);

  const getRank = () => {
    if (score >= 220 || completedCount >= 17) return 'AARUUSH CHAMPION';
    if (score >= 170 || completedCount >= 12) return 'CYBER PRODIGY';
    if (score >= 110 || completedCount >= 7) return 'GRID TACTICIAN';
    return 'TECH INITIATE';
  };

  const getPercentile = () => {
    if (score >= 220 || completedCount >= 17) return 'Global Top 5% • Champion Tier';
    if (score >= 170 || completedCount >= 12) return 'Global Top 15% • Prodigy Tier';
    if (score >= 110 || completedCount >= 7) return 'Global Top 35% • Tactician Tier';
    return 'Grid Participant • Initiate Tier';
  };

  // Find player's position in leaderboard
  const userLeaderboardIndex = leaderboard.findIndex((player) => {
    if (!participant) return false;
    const sameReg = player.registration_number?.trim().toUpperCase() === participant.registration_number?.trim().toUpperCase();
    const samePid = player.participant_id?.trim().toUpperCase() === participant.participant_id?.trim().toUpperCase();
    return sameReg && samePid;
  });

  const userRankPosition = userLeaderboardIndex !== -1 ? userLeaderboardIndex + 1 : null;
  const totalPlayersCount = leaderboard.length;

  const handleShare = () => {
    sound.playSelect();
    const rankPosText = userRankPosition ? ` (Leaderboard Rank #${userRankPosition} of ${totalPlayersCount})` : '';
    const participantLabel = participant ? `[${participant.name} | ID: ${participant.participant_id}] ` : '';
    const shareText = `⚡ ${participantLabel}conquered AARUUSH QUEST with ${score}/250 PTS${rankPosText}! Secured ${completedCount}/${totalPortals} domains and solved ${totalSolvedQuestions}/${totalQuestions} MCQs! Rank: ${getRank()} 🏆 #Aaruush2026 #SRMIST`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}m ${remainder < 10 ? '0' : ''}${remainder}s`;
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between bg-[#080808] font-['Geist',sans-serif] selection:bg-[#00f0ff] selection:text-[#00363a] text-[#e4e1e9] overflow-y-auto py-10 px-4">
      {/* Background Layers */}
      <div className="fixed inset-0 digital-grid z-0 pointer-events-none" />
      <div className="fixed inset-0 noise-overlay z-0 mix-blend-overlay pointer-events-none" />
      <div className="fixed top-1/4 -right-1/4 w-[600px] h-[600px] bg-[#ffd602]/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="fixed bottom-1/4 -left-1/4 w-[600px] h-[600px] bg-[#00f0ff]/10 blur-[150px] rounded-full pointer-events-none z-0" />

      {/* Main Content Container */}
      <main className="relative z-10 w-full max-w-lg mx-auto flex flex-col items-center gap-5 my-auto animate-fade-in">
        
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

        {/* ─── YOUR LEADERBOARD POSITION BANNER ─── */}
        <div className="w-full glass-panel rounded-2xl p-5 border-amber-500/40 bg-gradient-to-b from-[#201802]/80 via-[#151205]/90 to-[#0e0e16]/95 shadow-[0_0_35px_rgba(255,214,2,0.25)] text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffd602]/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="font-mono text-[11px] text-amber-300/80 tracking-widest uppercase mb-1 flex items-center justify-center gap-1.5">
            <Medal className="w-4 h-4 text-[#ffd602]" />
            <span>YOUR LEADERBOARD STANDING</span>
          </div>

          {isLoadingLeaderboard ? (
            <div className="flex items-center justify-center gap-2 py-3 text-white/60 font-mono text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
              <span>CALCULATING POSITION IN GRID...</span>
            </div>
          ) : userRankPosition ? (
            <div className="py-2">
              <div className="font-['Orbitron',sans-serif] text-3xl sm:text-4xl font-black text-[#ffd602] glow-text-yellow tracking-wider">
                #{userRankPosition} <span className="text-white/40 text-lg font-mono font-normal">OF {totalPlayersCount} PLAYERS</span>
              </div>
              <p className="font-mono text-xs text-cyan-300 mt-1">
                {userRankPosition === 1 ? '🥇 TOP OF THE GRID — #1 LEADERBOARD CHAMPION' :
                 userRankPosition <= 3 ? '🥈 PODIUM FINISH — TOP 3 CONQUEROR' :
                 `Beat ${Math.round(((totalPlayersCount - userRankPosition) / totalPlayersCount) * 100)}% of festival participants`}
              </p>
            </div>
          ) : (
            <div className="py-2">
              <div className="font-['Orbitron',sans-serif] text-2xl font-bold text-white tracking-wider">
                {score} <span className="text-amber-400 text-sm font-mono">PTS SCORED</span>
              </div>
              <p className="font-mono text-xs text-white/50 mt-1">
                {totalPlayersCount} registered player{totalPlayersCount !== 1 ? 's' : ''} in festival mainframe
              </p>
            </div>
          )}
        </div>

        {/* Final Rank Hero Card */}
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
            FINAL CLEARANCE TIER
          </div>

          <div className="font-['Space_Grotesk',sans-serif] text-2xl md:text-3xl font-bold uppercase text-[#ffd602] glow-text-yellow tracking-wide">
            {getRank()}
          </div>
        </div>

        {/* Participant Clearance & Database Sync Card */}
        {participant && (
          <div className="w-full glass-panel rounded-xl p-4 border-cyan-500/30 bg-[#0e0e16]/80 text-left shadow-[0_0_20px_rgba(0,240,255,0.1)]">
            <div className="flex items-center justify-between font-mono text-[11px] text-cyan-300 uppercase tracking-widest mb-2 pb-1.5 border-b border-white/10">
              <span className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                OFFICIAL PARTICIPANT DOSSIER
              </span>
              <span className="text-amber-400 font-bold">{participant.participant_id}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-white/40 block text-[10px] uppercase">PARTICIPANT</span>
                <span className="text-white font-bold truncate block">{participant.name}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px] uppercase">REGISTRATION NO</span>
                <span className="text-cyan-300 font-bold tracking-wider block">{participant.registration_number}</span>
              </div>
              <div className="col-span-2 pt-1 border-t border-white/5 flex items-center justify-between text-[11px]">
                <span className="text-white/40 truncate">{participant.srm_mail_id}</span>
                <span className="text-white/50">{participant.contact_number}</span>
              </div>
            </div>

            {/* Supabase Status Indicator */}
            <div className="mt-2.5 pt-2 border-t border-cyan-500/20 flex items-center justify-between text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-cyan-300">
                <Database className="w-3 h-3 text-cyan-400" />
                <span>MAINFRAME STATUS:</span>
              </span>
              {isSyncingScore ? (
                <span className="flex items-center gap-1 text-amber-300">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>SYNCHRONIZING SCORE...</span>
                </span>
              ) : (
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Check className="w-3 h-3 text-emerald-400 stroke-[3]" />
                  <span>RECORD LOCKED ({score} PTS)</span>
                </span>
              )}
            </div>
          </div>
        )}

        {/* Total Score Card */}
        <div className="w-full glass-panel rounded-xl p-5 flex flex-col justify-between border-white/10 text-left">
          <div className="flex items-center justify-between font-mono text-xs text-white/60 uppercase tracking-widest mb-1">
            <span>TOTAL SCORE</span>
            <RotateCcw className="w-3.5 h-3.5 text-white/40" />
          </div>
          <div className="font-['Space_Grotesk',sans-serif] text-3xl md:text-4xl font-bold text-white tracking-tight flex items-baseline gap-2">
            <span>{score}</span>
            <span className="text-white/40 text-lg font-mono">/ 250 PTS</span>
          </div>
          <div className="font-mono text-xs text-white/50 mt-1 flex items-center justify-between">
            <span>{getPercentile()}</span>
            <span className="text-cyan-300 font-semibold">{totalSolvedQuestions} / {totalQuestions} MCQs Solved</span>
          </div>
        </div>

        {/* Domains Explored Card */}
        <div className="w-full glass-panel rounded-xl p-5 flex flex-col justify-between border-white/10 text-left">
          <div className="flex items-center justify-between font-mono text-xs text-white/60 uppercase tracking-widest mb-2">
            <span>DOMAINS EXPLORED</span>
            <Compass className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="font-['Space_Grotesk',sans-serif] text-3xl font-bold text-white tracking-tight flex items-baseline gap-1">
            <span className="text-[#fe6b00]">{completedCount}</span>
            <span className="text-white/40 text-xl">/{totalPortals}</span>
          </div>

          <div className="w-full h-1.5 bg-[#1b1b20] rounded-full overflow-hidden mt-3 border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-[#fe6b00] via-[#ffd602] to-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]"
              style={{ width: `${Math.min(100, (completedCount / totalPortals) * 100)}%` }}
            />
          </div>
        </div>

        {/* ─── LIVE MAINFRAME LEADERBOARD SECTION ─── */}
        <div className="w-full glass-panel rounded-xl p-4 border-cyan-500/25 bg-[#0a0a12]/90 shadow-[0_0_25px_rgba(0,240,255,0.15)] text-left">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#ffd602]" />
              <span className="font-['Orbitron',sans-serif] text-xs font-bold uppercase tracking-wider text-white">
                FESTIVAL LEADERBOARD
              </span>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                loadLeaderboardData();
              }}
              disabled={isLoadingLeaderboard}
              className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
              title="Refresh standings"
            >
              <RefreshCw className={`w-3 h-3 ${isLoadingLeaderboard ? 'animate-spin' : ''}`} />
              <span>REFRESH</span>
            </button>
          </div>

          {isLoadingLeaderboard && leaderboard.length === 0 ? (
            <div className="py-6 flex flex-col items-center justify-center text-white/50 font-mono text-xs gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              <span>FETCHING LEADERBOARD DATA...</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="py-4 text-center font-mono text-xs text-white/40">
              No participant scores logged yet.
            </div>
          ) : (
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {leaderboard.map((item, idx) => {
                const rankNum = idx + 1;
                const isCurrentUser = participant && (
                  item.registration_number?.trim().toUpperCase() === participant.registration_number?.trim().toUpperCase() &&
                  item.participant_id?.trim().toUpperCase() === participant.participant_id?.trim().toUpperCase()
                );

                const getMedalIcon = (r: number) => {
                  if (r === 1) return '🥇';
                  if (r === 2) return '🥈';
                  if (r === 3) return '🥉';
                  return `#${r}`;
                };

                return (
                  <div
                    key={item.id || idx}
                    className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-cyan-950/80 to-amber-950/60 border border-cyan-400/80 shadow-[0_0_12px_rgba(0,240,255,0.3)] text-white'
                        : 'bg-[#12121a]/70 hover:bg-[#181824] border border-white/5 text-white/80'
                    }`}
                  >
                    {/* Rank & Name */}
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-6 text-center font-bold shrink-0 ${rankNum <= 3 ? 'text-base' : 'text-xs text-white/50'}`}>
                        {getMedalIcon(rankNum)}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold truncate text-white">{item.name}</span>
                          {isCurrentUser && (
                            <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 border border-cyan-400/40 text-[9px] font-bold text-cyan-300">
                              YOU
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-white/40 block truncate">
                          {item.participant_id || item.registration_number}
                        </span>
                      </div>
                    </div>

                    {/* Score & Time */}
                    <div className="text-right shrink-0 ml-2">
                      <div className="font-['Orbitron',sans-serif] font-bold text-amber-300">
                        {item.score} <span className="text-[10px] text-white/50 font-mono">PTS</span>
                      </div>
                      <div className="text-[10px] text-white/40">
                        {item.completed_portals || 0}/17 dom • {formatTime(item.time_spent_seconds || 0)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Share Button */}
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

        {/* Welcome to Aaruush Festival Section */}
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
