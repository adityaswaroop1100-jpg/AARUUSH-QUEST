import React, { useState, useEffect } from 'react';
import { Sparkles, Zap, Shield, Flame, Crosshair } from 'lucide-react';
import { AnswerRecordResult } from '../types';

interface CyberCombatArenaProps {
  portalName: string;
  portalColor?: string;
  answeredState: 'pending' | 'correct' | 'wrong';
  lastResult?: AnswerRecordResult | null;
  questionNumber: number;
  totalQuestions: number;
  streak: number;
}

export const CyberCombatArena: React.FC<CyberCombatArenaProps> = ({
  portalName,
  portalColor = '#00f0ff',
  answeredState,
  lastResult,
  questionNumber,
  totalQuestions,
  streak,
}) => {
  const [combatState, setCombatState] = useState<'idle' | 'attack' | 'damage' | 'deflect'>('idle');
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number }>>([]);
  const [floatingText, setFloatingText] = useState<{ text: string; color: string } | null>(null);

  useEffect(() => {
    if (answeredState === 'correct') {
      setCombatState('attack');
      const pts = lastResult?.earnedPoints || 2;
      const streakBonus = lastResult?.streakBonus ? ' • STREAK x' + (streak + 1) : '';
      setFloatingText({ text: `CRITICAL HIT! +${pts} PTS${streakBonus}`, color: '#00f0ff' });

      // Generate burst particles
      const newParticles = Array.from({ length: 18 }).map((_, i) => ({
        id: Date.now() + i,
        x: 65 + (Math.random() * 20 - 10),
        y: 45 + (Math.random() * 30 - 15),
        color: ['#00f0ff', '#ffd602', '#ffffff', '#fe6b00'][Math.floor(Math.random() * 4)],
        size: Math.random() * 6 + 3,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setCombatState('idle');
        setFloatingText(null);
      }, 900);
      return () => clearTimeout(timer);
    } else if (answeredState === 'wrong') {
      setCombatState('deflect');
      setFloatingText({ text: 'FIREWALL DEFLECTED • SHIELD HIT', color: '#ff3366' });

      const newParticles = Array.from({ length: 10 }).map((_, i) => ({
        id: Date.now() + i,
        x: 35 + (Math.random() * 20 - 10),
        y: 50 + (Math.random() * 20 - 10),
        color: ['#ff0055', '#fe6b00', '#ffffff'][Math.floor(Math.random() * 3)],
        size: Math.random() * 5 + 3,
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setCombatState('idle');
        setFloatingText(null);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setCombatState('idle');
      setFloatingText(null);
      setParticles([]);
    }
  }, [answeredState, lastResult]);

  return (
    <div className="w-full relative my-3 rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-[#090b14]/90 via-[#0d1020]/80 to-[#07080f]/95 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.18)] select-none">
      
      {/* ─── Cyber Grid Battle Arena Floor ─── */}
      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#00f0ff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-10 bg-gradient-to-t from-cyan-500/10 to-transparent pointer-events-none" />

      {/* Arena Header Bar */}
      <div className="relative z-10 px-3.5 py-1.5 border-b border-white/10 flex items-center justify-between font-mono text-[10px] text-white/70 bg-black/40 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 text-cyan-300">
          <Crosshair className="w-3 h-3 text-cyan-400" />
          <span className="font-bold tracking-wider">TACTICAL BREACH // COMBAT LINK</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/40">NODE {questionNumber + 1}/{totalQuestions}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        </div>
      </div>

      {/* ─── Main Battleground Viewport ─── */}
      <div className="relative h-32 sm:h-36 w-full flex items-center justify-between px-6 sm:px-12 overflow-hidden">
        
        {/* Floating Combat Damage / Score Banner */}
        {floatingText && (
          <div className="absolute top-2 inset-x-0 flex justify-center z-30 pointer-events-none animate-bounce">
            <span
              className="px-3 py-1 rounded-full text-xs font-['Orbitron',sans-serif] font-black tracking-wider uppercase shadow-2xl border"
              style={{
                backgroundColor: 'rgba(5, 5, 10, 0.92)',
                borderColor: floatingText.color,
                color: floatingText.color,
                boxShadow: `0 0 20px ${floatingText.color}80`,
              }}
            >
              {floatingText.text}
            </span>
          </div>
        )}

        {/* Dynamic Explosion Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full pointer-events-none animate-ping"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              boxShadow: `0 0 8px ${p.color}`,
              animationDuration: '0.6s',
            }}
          />
        ))}

        {/* ─── 1. HERO CHARACTER (CYBERNETIC STRIKER) ─── */}
        <div
          className={`relative z-20 flex flex-col items-center transition-all duration-300 ${
            combatState === 'attack'
              ? 'translate-x-12 sm:translate-x-20 scale-110 drop-shadow-[0_0_25px_#00f0ff]'
              : combatState === 'deflect'
              ? '-translate-x-4 scale-95 opacity-80 filter brightness-150'
              : 'translate-x-0 scale-100'
          }`}
        >
          {/* Energy Blade / Attack Beam Projection */}
          {combatState === 'attack' && (
            <div className="absolute top-6 left-12 w-28 sm:w-44 h-4 bg-gradient-to-r from-cyan-400 via-white to-transparent rounded-full blur-[2px] shadow-[0_0_20px_#00f0ff] pointer-events-none animate-pulse" />
          )}

          {/* Hero SVG Rig */}
          <div className="relative w-16 h-20 sm:w-20 sm:h-24">
            <svg viewBox="-15 0 135 120" className="w-full h-full overflow-visible filter drop-shadow-[0_0_12px_rgba(0,240,255,0.7)]">
              {/* Back Plasma Wings / Thruster Jet */}
              <path
                d="M 25 55 L 5 45 L 20 70 Z"
                fill="#fe6b00"
                className="animate-pulse"
                opacity="0.9"
              />
              <path
                d="M 25 55 L 0 50 L 15 75 Z"
                fill="#ffd602"
                className="animate-ping"
                style={{ animationDuration: '0.8s' }}
              />

              {/* Lower Body / Armored Greaves */}
              <path d="M 38 85 L 32 110 L 45 110 L 46 88 Z" fill="#0c192c" stroke="#00f0ff" strokeWidth="1.5" />
              <path d="M 52 85 L 56 110 L 68 110 L 58 88 Z" fill="#0c192c" stroke="#00f0ff" strokeWidth="1.5" />

              {/* Torso / Exosuit Core */}
              <path
                d="M 32 45 L 68 45 L 60 88 L 40 88 Z"
                fill="#0f192b"
                stroke="#00f0ff"
                strokeWidth="2"
              />
              {/* Glowing Arc Reactor Chest Core */}
              <circle cx="50" cy="62" r="6" fill="#00f0ff" className="animate-pulse" />
              <circle cx="50" cy="62" r="3" fill="#ffffff" />

              {/* Left Arm & Cyber Katana Blade */}
              <g className={combatState === 'attack' ? 'origin-[50px_50px] rotate-[-25deg]' : ''}>
                <path d="M 62 48 L 78 60 L 72 70" stroke="#00f0ff" strokeWidth="4" strokeLinecap="round" fill="none" />
                {/* Plasma Blade */}
                <path
                  d="M 74 65 L 105 40 L 108 43 L 76 68 Z"
                  fill="url(#katanaGrad)"
                  filter="drop-shadow(0 0 8px #00f0ff)"
                />
              </g>

              {/* Armored Shoulders */}
              <path d="M 24 45 L 34 38 L 40 48 Z" fill="#00f0ff" />
              <path d="M 76 45 L 66 38 L 60 48 Z" fill="#00f0ff" />

              {/* Cybernetic Helmet & Neon Visor */}
              <path
                d="M 38 20 C 38 10, 62 10, 62 20 L 64 38 L 36 38 Z"
                fill="#0a121e"
                stroke="#00f0ff"
                strokeWidth="2"
              />
              {/* Glowing Visor Line */}
              <path
                d="M 40 25 L 60 25"
                stroke="#00f0ff"
                strokeWidth="3.5"
                strokeLinecap="round"
                className="animate-pulse"
              />
              {/* Crest Antenna */}
              <line x1="50" y1="12" x2="50" y2="4" stroke="#ffd602" strokeWidth="2" />
              <circle cx="50" cy="3" r="2" fill="#ffd602" />

              <defs>
                <linearGradient id="katanaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="60%" stopColor="#7df4ff" />
                  <stop offset="100%" stopColor="#ffffff" />
                </linearGradient>
              </defs>
            </svg>

            {/* Ground Shadow / Hover Ring */}
            <div className="w-14 h-2 bg-cyan-400/30 rounded-full blur-[3px] mx-auto mt-[-4px] animate-pulse" />
          </div>

          <span className="font-mono text-[9px] font-bold text-cyan-300 mt-1 uppercase tracking-wider">
            GRID STRIKER
          </span>
        </div>

        {/* ─── CLASH MIDFIELD ENERGY FX ─── */}
        <div className="flex-1 flex flex-col items-center justify-center px-2">
          {combatState === 'attack' ? (
            <div className="flex items-center gap-1 text-[#ffd602] animate-ping">
              <Zap className="w-8 h-8 fill-current drop-shadow-[0_0_15px_#ffd602]" />
            </div>
          ) : combatState === 'deflect' ? (
            <div className="flex items-center gap-1 text-red-500 animate-pulse">
              <Shield className="w-7 h-7 text-red-400 drop-shadow-[0_0_15px_#ff0055]" />
            </div>
          ) : (
            <div className="w-full flex items-center justify-center gap-2">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-cyan-500/40 via-cyan-400/80 to-transparent" />
              <span className="font-['Orbitron',sans-serif] text-[9px] font-bold text-white/40 tracking-widest uppercase">
                VS
              </span>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-amber-500/80 to-amber-500/40" />
            </div>
          )}
        </div>

        {/* ─── 2. DOMAIN BOSS TARGET (FIREWALL GUARDIAN CORE) ─── */}
        <div
          className={`relative z-20 flex flex-col items-center transition-all duration-300 ${
            combatState === 'attack'
              ? 'translate-x-3 scale-90 filter brightness-200'
              : combatState === 'deflect'
              ? 'scale-110 drop-shadow-[0_0_20px_#ff0055]'
              : 'scale-100'
          }`}
        >
          {/* Guardian Boss SVG */}
          <div className="relative w-16 h-20 sm:w-20 sm:h-24 flex items-center justify-center">
            
            {/* Outer Spinning Defense Rings */}
            <div
              className={`absolute inset-0 rounded-full border-2 border-dashed ${
                combatState === 'attack' ? 'border-red-400 animate-spin' : 'border-amber-400/60 animate-spin'
              }`}
              style={{ animationDuration: combatState === 'attack' ? '1s' : '6s' }}
            />
            <div
              className="absolute inset-2 rounded-full border border-cyan-400/40 animate-spin"
              style={{ animationDuration: '4s', animationDirection: 'reverse' }}
            />

            {/* Core Sentinel Sphere */}
            <div
              className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl rotate-45 flex items-center justify-center transition-all ${
                combatState === 'attack'
                  ? 'bg-red-600 shadow-[0_0_30px_#ff0055]'
                  : 'bg-[#191408] border-2 border-[#fe6b00] shadow-[0_0_20px_rgba(254,107,0,0.6)]'
              }`}
            >
              {/* Ominous Guardian Eye */}
              <div className="-rotate-45 flex flex-col items-center justify-center">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#fe6b00] to-[#ffd602] flex items-center justify-center shadow-[0_0_12px_#ffd602] animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-black" />
                </div>
              </div>
            </div>

            {/* Boss Energy Spikes */}
            <div className="absolute -top-1 w-2 h-4 bg-[#ffd602] rounded-full blur-[1px] animate-pulse" />
            <div className="absolute -bottom-1 w-2 h-4 bg-[#fe6b00] rounded-full blur-[1px] animate-pulse" />
          </div>

          <span className="font-mono text-[9px] font-bold text-amber-400 mt-1 uppercase tracking-wider truncate max-w-[100px] text-center">
            {portalName}
          </span>
        </div>
      </div>

      {/* ─── Health / Breach Gauge Bar ─── */}
      <div className="px-4 pb-2 pt-1 flex items-center justify-between gap-3 text-[10px] font-mono border-t border-white/5 bg-black/30">
        <div className="flex items-center gap-1.5 text-cyan-300">
          <Shield className="w-3 h-3 text-cyan-400" />
          <span>HERO INTEGRITY: 100%</span>
        </div>
        <div className="flex-1 max-w-[140px] h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-[#fe6b00] transition-all duration-500 rounded-full"
            style={{ width: `${Math.round(((questionNumber + 1) / totalQuestions) * 100)}%` }}
          />
        </div>
        <div className="text-amber-400 font-bold">
          BREACH {Math.round(((questionNumber + 1) / totalQuestions) * 100)}%
        </div>
      </div>
    </div>
  );
};
