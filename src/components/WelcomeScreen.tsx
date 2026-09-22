import React from 'react';
import { Timer, Flag, Rocket, Volume2, VolumeX, Info, Calendar } from 'lucide-react';
import { sound } from '../utils/audio';
import { ParticipantModal } from './ParticipantModal';
import { ParticipantFormData } from '../utils/supabase/participants';

interface WelcomeScreenProps {
  onStartQuest: (participant: ParticipantFormData) => void;
  onOpenSchedule: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onStartQuest,
  onOpenSchedule,
  soundEnabled,
  onToggleSound,
}) => {
  const [showBriefing, setShowBriefing] = React.useState(false);
  const [showParticipantModal, setShowParticipantModal] = React.useState(false);

  const handleStart = () => {
    sound.playSelect();
    setShowParticipantModal(true);
  };

  const handleParticipantSubmit = (data: ParticipantFormData) => {
    setShowParticipantModal(false);
    onStartQuest(data);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between font-['Rajdhani',sans-serif] selection:bg-[#00f0ff] selection:text-[#00363a] bg-[#050508] overflow-hidden text-white">
      {/* Hero Image Layer (Clearly visible background with subtle light blur) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050508]">
        <img
          alt="Ancient x AI 3D Sculpture"
          className="w-full h-full object-cover object-center filter blur-[1.5px] opacity-85 transition-all duration-700"
          src="https://lh3.googleusercontent.com/aida/AP1WRLsM7pCziVQ9Spv-OCnEuXEIqymjw0UtISQpo1csyxkPrDuAc93Es7Vc1PtVLLdeKCNBz087U3YpaRtjiEf2k_Twaa_GE1o2LpWLY3TIgukLTzjOw8gwuORLHQygouOBenUWoGb37f7u4I2fEh3XM9qYwvtIkNUuwNBXKqvD5HIauDBzii5OrRkEqJEEThdJb4kD2HGKaw5atmVOBwwH_uvwMpqoc_vQNdy1RPWrjjXkbshJiIn86ATZ7CM"
        />
        {/* Subtle Vignette Overlays for Maximum Visibility & Legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/60 via-[#050508]/25 to-[#050508]/85" />
      </div>

      {/* Background Layers */}
      <div className="fixed inset-0 digital-grid z-0 pointer-events-none opacity-40" />
      <div className="fixed inset-0 noise-overlay z-0 mix-blend-overlay pointer-events-none opacity-60" />
      <div className="fixed top-1/4 -right-1/4 w-[500px] h-[500px] bg-[#00f0ff]/10 blur-[140px] rounded-full z-0 pointer-events-none" />
      <div className="fixed bottom-1/4 -left-1/4 w-[450px] h-[450px] bg-[#fe6b00]/10 blur-[140px] rounded-full z-0 pointer-events-none" />

      {/* Top Bar Utilities */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 bg-[#0c0c14]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]" />
          <span className="font-['Orbitron',sans-serif] text-[11px] font-bold text-cyan-300 tracking-widest uppercase">
            AARUUSH GRID // LEVEL 0
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              setShowBriefing(true);
            }}
            className="p-2 rounded-full bg-[#0c0c14]/80 border border-white/15 hover:border-cyan-400 text-white hover:text-cyan-300 transition-all text-xs flex items-center gap-1.5 px-3.5 backdrop-blur-md cursor-pointer shadow-lg"
            title="Quest Instructions"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline font-['Rajdhani',sans-serif] font-bold tracking-wider text-sm">BRIEFING</span>
          </button>
          <button
            onClick={() => {
              sound.playClick();
              onOpenSchedule();
            }}
            className="p-2 rounded-full bg-[#0c0c14]/80 border border-white/15 hover:border-amber-400 text-white hover:text-amber-300 transition-all text-xs flex items-center gap-1.5 px-3.5 backdrop-blur-md cursor-pointer shadow-lg"
            title="Festival Schedule"
          >
            <Calendar className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline font-['Rajdhani',sans-serif] font-bold tracking-wider text-sm">SCHEDULE</span>
          </button>
          <button
            onClick={onToggleSound}
            className="p-2 rounded-full bg-[#0c0c14]/80 border border-white/15 hover:border-cyan-400 text-white hover:text-cyan-300 transition-all backdrop-blur-md cursor-pointer shadow-lg"
            title={soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-white/40" />}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full flex-grow flex flex-col items-center justify-between px-4 md:px-10 py-6 max-w-2xl mx-auto h-full">
        <div className="flex-grow flex flex-col justify-center items-center w-full pb-8 md:pb-10 mt-auto text-center">
          
          {/* Logo & Title Section */}
          <div className="text-center w-full mb-6 md:mb-8 animate-fade-in flex flex-col items-center">
            
            {/* Solar Sun Aura & Logo Container */}
            <div className="relative inline-flex items-center justify-center mb-4">
              {/* Soft Sun Glow Corona Core */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-r from-[#fe6b00]/25 via-[#ffd602]/40 to-[#00f0ff]/25 blur-xl pointer-events-none animate-solar-pulse" />
              
              {/* Primary Golden Solar Rays - Short & Compact */}
              <div className="absolute top-1/2 left-1/2 pointer-events-none animate-sun-spin w-[180px] h-[180px] md:w-[210px] md:h-[210px]">
                <svg viewBox="0 0 200 200" className="w-full h-full opacity-85 drop-shadow-[0_0_10px_rgba(255,214,2,0.5)]">
                  <defs>
                    <radialGradient id="sunBeamGradGold" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fff275" stopOpacity="0.9" />
                      <stop offset="40%" stopColor="#ffd602" stopOpacity="0.75" />
                      <stop offset="80%" stopColor="#fe6b00" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ff7700" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* 16 Compact Golden Sun Rays */}
                  {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, i) => (
                    <path
                      key={angle}
                      d={i % 2 === 0 ? "M97.5 100 L100 35 L102.5 100 Z" : "M98 100 L100 48 L102 100 Z"}
                      fill="url(#sunBeamGradGold)"
                      transform={`rotate(${angle} 100 100)`}
                    />
                  ))}
                </svg>
              </div>

              {/* Secondary Cyan Subtle Flare Rays - Short */}
              <div className="absolute top-1/2 left-1/2 pointer-events-none animate-sun-reverse w-[160px] h-[160px] md:w-[190px] md:h-[190px]">
                <svg viewBox="0 0 200 200" className="w-full h-full opacity-60 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                  <defs>
                    <radialGradient id="sunBeamGradCyan" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                      <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* 12 Subtle Short Intersecting Rays */}
                  {[11.25, 41.25, 71.25, 101.25, 131.25, 161.25, 191.25, 221.25, 251.25, 281.25, 311.25, 341.25].map((angle) => (
                    <polygon
                      key={angle}
                      points="98.5,100 100,42 101.5,100"
                      fill="url(#sunBeamGradCyan)"
                      transform={`rotate(${angle} 100 100)`}
                    />
                  ))}
                </svg>
              </div>

              {/* Subtle Solar Ring Corona */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full border border-[#ffd602]/30 shadow-[0_0_20px_rgba(255,214,2,0.35)] pointer-events-none" />

              {/* Logo Emblem */}
              <img
                alt="Aaruush Logo"
                className="relative z-10 w-28 md:w-36 h-auto mx-auto object-contain filter drop-shadow-[0_0_20px_rgba(255,214,2,0.7)] animate-pulse-glow"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcnDZtIgxYsJkIok4wSdJNN7Ic_e9h03oJ89fvWdyZ3_lx2oF-lBhCXhPtQI_OgM9vko2Nnt-o5iTXgrZFe9lMsl81KLNfVHR7BERRgfWjFkxmRGj102GhIHwjhgLVXmOx90-zqeyW9P6rSGg5ikrDF8Xv12IUEXqaVP6Woc9XoQ3c5yXMw8yTMu0FRhyLJP5O1U4R5iedknOCLZMro_tRmcshhaibwc4azfbZ6ZUQi0a4HIFg_6yP-QPU2t1DhYGgzPg"
              />
            </div>
            
            {/* Title with Orbitron font and glowing colors */}
            <h1 className="font-['Orbitron',sans-serif] text-[44px] sm:text-[54px] md:text-[68px] leading-[1.02] font-black tracking-tight mb-3 uppercase drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
              <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">AARUUSH</span><br />
              <span className="text-[#00f0ff] glow-text-cyan tracking-wider drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]">QUEST</span>
            </h1>

            {/* Vibrant Tri-Color Tagline */}
            <p className="font-['Rajdhani',sans-serif] text-[18px] sm:text-[22px] md:text-[24px] md:flex-row md:justify-center md:gap-5 flex flex-col gap-1 items-center font-bold tracking-wider drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              <span className="text-[#ff7700] drop-shadow-[0_0_12px_rgba(255,119,0,0.6)]">17 Portals.</span>
              <span className="text-[#ffd602] drop-shadow-[0_0_12px_rgba(255,214,2,0.6)]">180 Seconds.</span>
              <span className="text-[#00f0ff] drop-shadow-[0_0_12px_rgba(0,240,255,0.6)]">1 Champion.</span>
            </p>
          </div>

          {/* Mission Details Cards */}
          <div className="w-full max-w-md flex flex-col sm:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
            {/* Duration Card */}
            <div className="glass-panel rounded-xl p-4 flex items-center gap-4 transition-all hover:border-[#ffd602]/60 flex-1 text-left bg-[#0e0e16]/80 border-amber-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <div className="p-2.5 rounded-lg bg-[#ffd602]/15 border border-[#ffd602]/40 flex items-center justify-center">
                <Timer className="w-6 h-6 text-[#ffd602]" />
              </div>
              <div>
                <div className="font-['Rajdhani',sans-serif] text-xs text-amber-200/80 uppercase tracking-widest font-bold mb-0.5">
                  DURATION
                </div>
                <div className="font-['Orbitron',sans-serif] text-[17px] md:text-[19px] text-white font-bold tracking-wider">
                  3:00 MIN
                </div>
              </div>
            </div>

            {/* Objective Card */}
            <div className="glass-panel rounded-xl p-4 flex items-center gap-4 transition-all hover:border-[#ff7700]/60 flex-1 text-left bg-[#0e0e16]/80 border-orange-500/30 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
              <div className="p-2.5 rounded-lg bg-[#ff7700]/15 border border-[#ff7700]/40 flex items-center justify-center">
                <Flag className="w-6 h-6 text-[#ff7700]" />
              </div>
              <div>
                <div className="font-['Rajdhani',sans-serif] text-xs text-orange-200/80 uppercase tracking-widest font-bold mb-0.5">
                  OBJECTIVE
                </div>
                <div className="font-['Orbitron',sans-serif] text-[17px] md:text-[19px] text-white font-bold tracking-wider">
                  ALL PORTALS
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action Button */}
          <div className="w-full max-w-md">
            <button
              onClick={handleStart}
              className="w-full font-['Orbitron',sans-serif] text-[16px] md:text-[18px] uppercase tracking-widest bg-gradient-to-r from-[#00f0ff] via-[#7df4ff] to-[#00d0e0] text-[#00282c] px-8 py-5 md:py-5.5 shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_40px_rgba(0,240,255,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group rounded-xl font-black cursor-pointer border border-cyan-200/50"
            >
              <span>START QUEST</span>
              <Rocket className="w-5 h-5 md:w-6 md:h-6 text-[#00282c] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>

        {/* System Status Footer */}
        <footer className="w-full text-center font-['Rajdhani',sans-serif] text-[13px] md:text-[14px] text-white/80 font-bold flex justify-center items-center gap-3 pt-4 border-t border-white/10 mt-auto drop-shadow-md">
          <span className="flex items-center gap-2 uppercase tracking-widest text-cyan-300">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] -ml-4" />
            SYSTEM ONLINE
          </span>
          <span className="text-white/30">|</span>
          <span className="tracking-widest text-amber-300 font-mono text-xs">SRMIST KTR FESTIVAL GRID</span>
          <span className="text-white/30">|</span>
          <span className="tracking-widest text-white/90 font-mono text-xs">v2.4.1</span>
        </footer>
      </main>

      {/* Briefing Modal */}
      {showBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="glass-panel max-w-lg w-full rounded-2xl p-6 border-cyan-500/50 bg-[#0d0d16] relative animate-fade-in text-left shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
              <div className="flex items-center gap-2 text-cyan-300 font-['Orbitron',sans-serif] text-sm font-bold">
                <Info className="w-4 h-4 text-cyan-400" />
                MISSION BRIEFING // AARUUSH QUEST
              </div>
              <button
                onClick={() => setShowBriefing(false)}
                className="text-white/70 hover:text-white font-mono text-xs px-2.5 py-1 bg-white/10 rounded cursor-pointer"
              >
                ESC
              </button>
            </div>

            <div className="space-y-3 font-['Rajdhani',sans-serif] text-sm font-medium text-white/90 leading-relaxed">
              <p className="bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-500/20">
                <strong className="text-cyan-300 font-bold block mb-0.5">1. THE CYBER GRID</strong>
                The festival grid consists of 17 specialized domain portals linked to the Core System.
              </p>
              <p className="bg-amber-950/30 p-2.5 rounded-lg border border-amber-500/20">
                <strong className="text-[#ffd602] font-bold block mb-0.5">2. TIME CONSTRAINT</strong>
                You have 180 seconds (3:00 min) total to breach as many domains as possible.
              </p>
              <p className="bg-orange-950/30 p-2.5 rounded-lg border border-orange-500/20">
                <strong className="text-[#ff7700] font-bold block mb-0.5">3. MICRO CHALLENGES</strong>
                Solve domain-specific engineering, AI, cryptographic, and algorithmic tests to activate nodes.
              </p>
              <p className="bg-green-950/30 p-2.5 rounded-lg border border-green-500/20">
                <strong className="text-green-300 font-bold block mb-0.5">4. SCORING & ARTIFACTS</strong>
                Speed and accuracy boost multipliers. Conquering all 17 awards the prestigious <span className="text-[#ffd602] font-bold">AARUUSH CHAMPION</span> rank!
              </p>
            </div>

            <button
              onClick={() => {
                setShowBriefing(false);
                handleStart();
              }}
              className="mt-6 w-full py-3.5 bg-gradient-to-r from-cyan-400 to-[#00f0ff] hover:from-cyan-300 hover:to-cyan-400 text-[#00282c] font-['Orbitron',sans-serif] font-bold uppercase tracking-wider rounded-xl text-sm transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
            >
              INITIALIZE UPLINK & START
            </button>
          </div>
        </div>
      )}

      {/* Participant Identification Modal (5 Components) */}
      <ParticipantModal
        isOpen={showParticipantModal}
        onClose={() => setShowParticipantModal(false)}
        onSubmit={handleParticipantSubmit}
      />
    </div>
  );
};
