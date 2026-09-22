import React, { useState } from 'react';
import { Play, Check, Search, Filter, Sparkles } from 'lucide-react';
import { DomainPortal } from '../types';
import { DomainLogo } from './DomainLogos';
import { sound } from '../utils/audio';

interface PortalsListViewProps {
  portals: DomainPortal[];
  completedPortals: string[];
  failedPortals: string[];
  solvedQuestions?: Record<string, number[]>;
  onSelectPortal: (id: string) => void;
}

export const PortalsListView: React.FC<PortalsListViewProps> = ({
  portals,
  completedPortals,
  failedPortals,
  solvedQuestions = {},
  onSelectPortal,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'AVAILABLE' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPortals = portals.filter((p) => {
    const domainSolved = solvedQuestions[p.id] || [];
    const totalCount = p.challenges?.length || 5;
    const isCompleted = completedPortals.includes(p.id) || domainSolved.length >= totalCount;
    if (filter === 'AVAILABLE' && isCompleted) return false;
    if (filter === 'COMPLETED' && !isCompleted) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-grow flex flex-col p-4 md:p-6 max-w-4xl mx-auto w-full overflow-y-auto">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-white uppercase tracking-tight">
            DOMAIN PORTALS
          </h2>
          <p className="font-mono text-xs text-white/60">
            {completedPortals.length} / {portals.length} DOMAINS BREACHED
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          {(['ALL', 'AVAILABLE', 'COMPLETED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                sound.playClick();
                setFilter(tab);
              }}
              className={`px-3 py-1.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-all cursor-pointer ${
                filter === tab
                  ? 'bg-cyan-400 text-cyan-950 font-bold shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-[#1b1b20] text-white/70 hover:text-white border border-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Search Box */}
      <div className="relative mb-6">
        <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by domain, code, or technical category..."
          className="w-full bg-[#1b1b20]/90 border border-white/15 focus:border-cyan-400 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-white placeholder-white/40 outline-none transition-colors"
        />
      </div>

      {/* Grid of Domain Cards */}
      {/* Grid of Domain Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {filteredPortals.map((portal) => {
          const domainSolved = solvedQuestions[portal.id] || [];
          const totalQuestions = portal.challenges?.length || 5;
          const isCompleted = completedPortals.includes(portal.id) || domainSolved.length >= totalQuestions;
          const isFailed = failedPortals.includes(portal.id) && !isCompleted;

          return (
            <div
              key={portal.id}
              className={`glass-panel rounded-xl p-4 flex flex-col justify-between border transition-all hover:scale-[1.01] ${
                isCompleted
                  ? 'border-[#ffd602]/50 bg-[#221b00]/40 shadow-[0_0_15px_rgba(255,214,2,0.15)]'
                  : isFailed
                  ? 'border-red-500/40 bg-red-950/20'
                  : 'border-white/10 hover:border-cyan-400/50'
              }`}
            >
              <div>
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-xl shrink-0 transition-all ${
                    isCompleted
                      ? 'bg-[#221b00] text-[#ffd602] border border-[#ffd602]/50 shadow-[0_0_10px_rgba(255,214,2,0.3)]'
                      : isFailed
                      ? 'bg-red-950/60 text-red-400 border border-red-500/40'
                      : 'bg-[#141419] text-cyan-300 border border-cyan-500/30'
                  }`}>
                    <DomainLogo id={portal.id} name={portal.name} className="w-9 h-9" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-[10px] text-cyan-300 font-bold px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-500/30">
                        {portal.code}
                      </span>
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded font-semibold ${
                          portal.difficulty === 'EASY'
                            ? 'text-green-300 bg-green-950/50'
                            : portal.difficulty === 'MEDIUM'
                            ? 'text-amber-300 bg-amber-950/50'
                            : 'text-red-300 bg-red-950/50'
                        }`}
                      >
                        {portal.difficulty}
                      </span>
                    </div>

                    <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-base text-white truncate">
                      {portal.name}
                    </h3>
                    <div className="font-mono text-[10px] text-white/50 truncate">
                      {portal.category}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                  {portal.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="font-mono text-[10px] text-amber-300 font-semibold">
                  {domainSolved.length > 0 && !isCompleted
                    ? `SOLVED ${domainSolved.length}/${totalQuestions} • +${totalQuestions * 2} PTS`
                    : `${totalQuestions} QUESTIONS • +${totalQuestions * 2} PTS`}
                </span>

                <button
                  onClick={() => {
                    sound.playPortalOpen();
                    onSelectPortal(portal.id);
                  }}
                  className={`px-3 py-1.5 rounded font-mono text-xs uppercase font-bold tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                    isCompleted
                      ? 'bg-[#ffd602]/20 border border-[#ffd602]/40 text-[#ffd602] hover:bg-[#ffd602]/30'
                      : domainSolved.length > 0
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-cyan-950 shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                      : 'bg-cyan-400 hover:bg-cyan-300 text-cyan-950 shadow-[0_0_10px_rgba(0,240,255,0.3)]'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>SECURED</span>
                    </>
                  ) : domainSolved.length > 0 ? (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>RESUME</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-current" />
                      <span>BREACH</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
