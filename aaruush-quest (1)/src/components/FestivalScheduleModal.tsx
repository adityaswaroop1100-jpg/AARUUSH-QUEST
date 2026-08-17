import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Tag, X, Sparkles, Check } from 'lucide-react';
import { FESTIVAL_SCHEDULE } from '../data/portals';
import { FestivalEvent } from '../types';
import { sound } from '../utils/audio';

interface FestivalScheduleModalProps {
  onClose: () => void;
}

export const FestivalScheduleModal: React.FC<FestivalScheduleModalProps> = ({ onClose }) => {
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  const toggleBookmark = (id: string) => {
    sound.playClick();
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredEvents = FESTIVAL_SCHEDULE.filter((ev) => {
    if (selectedType === 'ALL') return true;
    return ev.type === selectedType;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="glass-panel max-w-2xl w-full max-h-[90vh] rounded-2xl p-6 border-cyan-500/40 shadow-2xl flex flex-col relative text-left animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-cyan-500/20 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-['Space_Grotesk',sans-serif] text-xl font-bold text-white uppercase tracking-tight">
                AARUUSH '26 FESTIVAL SCHEDULE
              </h2>
              <p className="font-mono text-xs text-cyan-400/80">
                OFFICIAL DOMAINS, FLAGSHIP EVENTS & PROSHOWS
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-4">
          {['ALL', 'Flagship', 'ProShow', 'Hackathon', 'Workshop'].map((type) => (
            <button
              key={type}
              onClick={() => {
                sound.playClick();
                setSelectedType(type);
              }}
              className={`px-3 py-1 rounded-full font-mono text-xs uppercase tracking-wider transition-all shrink-0 cursor-pointer ${
                selectedType === type
                  ? 'bg-cyan-400 text-cyan-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                  : 'bg-[#1b1b20] text-white/60 hover:text-white border border-white/10'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Event List */}
        <div className="flex-grow overflow-y-auto space-y-3 pr-1">
          {filteredEvents.map((ev) => {
            const isBookmarked = bookmarkedIds.includes(ev.id);

            return (
              <div
                key={ev.id}
                className={`p-4 rounded-xl border transition-all ${
                  ev.highlight
                    ? 'bg-gradient-to-r from-[#1b1b20] to-[#252030] border-amber-500/40 shadow-[0_0_15px_rgba(255,214,2,0.1)]'
                    : 'bg-[#1b1b20]/80 border-white/10 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-cyan-300 font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {ev.time}
                    </span>
                    <span
                      className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        ev.type === 'ProShow'
                          ? 'bg-[#fe6b00]/20 text-[#fe6b00] border border-[#fe6b00]/40'
                          : ev.type === 'Flagship'
                          ? 'bg-[#ffd602]/20 text-[#ffd602] border border-[#ffd602]/40'
                          : 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      {ev.type}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleBookmark(ev.id)}
                    className={`font-mono text-[10px] px-2.5 py-1 rounded flex items-center gap-1 transition-all cursor-pointer ${
                      isBookmarked
                        ? 'bg-green-500/20 text-green-300 border border-green-500/40'
                        : 'bg-white/5 text-white/50 hover:text-white border border-white/10'
                    }`}
                  >
                    {isBookmarked ? (
                      <>
                        <Check className="w-3 h-3 text-green-400 stroke-[3]" />
                        <span>SAVED</span>
                      </>
                    ) : (
                      <span>+ REMIND</span>
                    )}
                  </button>
                </div>

                <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-base text-white mb-1">
                  {ev.title}
                </h3>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 font-mono text-xs text-white/60 mt-2">
                  <div className="flex items-center gap-1 text-white/70">
                    <Tag className="w-3 h-3 text-cyan-400" />
                    <span>Domain: {ev.domain}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/70">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    <span>{ev.venue}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between">
          <div className="font-mono text-xs text-white/50">
            SRMIST Kattankulathur Campus • Aaruush '26
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(0,240,255,0.4)] cursor-pointer"
          >
            RETURN TO QUEST
          </button>
        </div>
      </div>
    </div>
  );
};
