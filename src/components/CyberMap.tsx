import React, { useState } from 'react';
import { Compass, Globe, Check, AlertCircle, Zap, Shield, Sparkles, Map as MapIcon, Layers, BarChart3, Package, Play } from 'lucide-react';
import { DomainPortal, AppTab } from '../types';
import { DomainLogo } from './DomainLogos';
import { sound } from '../utils/audio';

interface CyberMapProps {
  portals: DomainPortal[];
  completedPortals: string[];
  failedPortals: string[];
  solvedQuestions?: Record<string, number[]>;
  timeRemaining: number;
  score: number;
  activeTab: AppTab;
  onChangeTab: (tab: AppTab) => void;
  onSelectPortal: (portalId: string) => void;
  onCompleteQuest: () => void;
}

export const CyberMap: React.FC<CyberMapProps> = ({
  portals,
  completedPortals,
  failedPortals,
  solvedQuestions = {},
  timeRemaining,
  score,
  activeTab,
  onChangeTab,
  onSelectPortal,
  onCompleteQuest,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showCoreModal, setShowCoreModal] = useState<boolean>(false);

  // Format timer MM:SS
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const selectedPortal = portals.find((p) => p.id === selectedNodeId);

  const handleNodeClick = (portal: DomainPortal) => {
    sound.playSelect();
    setSelectedNodeId(portal.id);
  };

  const handleLaunchPortal = (portalId: string) => {
    sound.playPortalOpen();
    onSelectPortal(portalId);
  };

  return (
    <div className="relative h-screen w-full flex flex-col justify-between bg-[#080808] font-['Geist',sans-serif] text-[#e4e1e9] selection:bg-[#00f0ff] selection:text-[#00363a] overflow-hidden">
      {/* Background Layers */}
      <div className="absolute inset-0 digital-grid z-0 opacity-80" />
      <div className="absolute inset-0 noise-overlay z-0 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#00f0ff]/5 blur-[160px] rounded-full pointer-events-none z-0" />

      {/* Top Header Bar (Matches Image 3) */}
      <header className="relative z-20 w-full px-4 md:px-8 py-4 flex items-center justify-between border-b border-white/5 bg-[#080808]/70 backdrop-blur-md">
        {/* Left Compass Icon */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-[#1b1b20] border border-cyan-500/30">
            <Compass className="w-5 h-5 text-cyan-300 animate-spin" style={{ animationDuration: '30s' }} />
          </div>
          <div className="hidden sm:block">
            <div className="font-mono text-[10px] text-cyan-400/80 uppercase tracking-widest">
              SRM INSTITUTE OF SCIENCE & TECH
            </div>
            <div className="font-mono text-[11px] text-white/50">
              SCORE: <span className="text-amber-300 font-bold">{score} / 250</span>
            </div>
          </div>
        </div>

        {/* Center Title */}
        <div className="text-center">
          <h1 className="font-['Space_Grotesk',sans-serif] text-xl md:text-2xl font-bold tracking-tight text-white uppercase flex items-center justify-center gap-1.5 drop-shadow-lg">
            <span>AARUUSH</span>
            <span className="text-[#00f0ff] glow-text-cyan">QUEST</span>
          </h1>
        </div>

        {/* Right Timer Box (Matches Image 3) */}
        <div
          className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#1b1b20]/90 border font-mono font-bold tracking-widest text-sm md:text-base backdrop-blur-md transition-all ${
            timeRemaining <= 30
              ? 'border-red-500 text-red-400 animate-pulse shadow-[0_0_15px_rgba(255,0,0,0.5)]'
              : 'border-cyan-500/40 text-white shadow-[0_0_12px_rgba(0,240,255,0.25)]'
          }`}
        >
          <span className="text-xs text-white/60 font-normal">⏱</span>
          <span className="font-mono">{formattedTime}</span>
        </div>
      </header>

      {/* Main Interactive Interactive Cyber Grid Map Canvas */}
      <main className="relative z-10 flex-grow w-full h-full overflow-hidden flex items-center justify-center p-2 md:p-6">
        <div className="relative w-full max-w-4xl h-full max-h-[640px] rounded-2xl bg-[#131318]/60 border border-white/10 backdrop-blur-sm overflow-hidden flex items-center justify-center">
          
          {/* Radar Scan Line effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-[100%] h-[100%] rounded-full border border-cyan-500/20" />
            <div className="absolute w-[70%] h-[70%] rounded-full border border-cyan-500/20" />
            <div className="absolute w-[40%] h-[40%] rounded-full border border-cyan-500/20" />
            <div className="absolute inset-0 animate-radar bg-gradient-to-tr from-transparent via-cyan-500/10 to-transparent" />
          </div>

          {/* SVG Connection Vectors */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <linearGradient id="linkGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#ffd602" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00f0ff" stopOpacity="0.8" />
              </linearGradient>
              <linearGradient id="linkGradNormal" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00f0ff" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#3b494b" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Central Core Vectors to major hubs */}
            {portals.map((portal) => (
              <line
                key={`core-to-${portal.id}`}
                x1="50%"
                y1="50%"
                x2={`${portal.x}%`}
                y2={`${portal.y}%`}
                stroke="rgba(0, 240, 255, 0.08)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            ))}

            {/* Inter-node connection lines */}
            {portals.map((portal) => {
              return portal.connections.map((targetId) => {
                const target = portals.find((p) => p.id === targetId);
                if (!target || target.id < portal.id) return null; // Avoid duplicate lines
                const isConnectedCompleted =
                  completedPortals.includes(portal.id) && completedPortals.includes(target.id);

                return (
                  <g key={`${portal.id}-${target.id}`}>
                    <line
                      x1={`${portal.x}%`}
                      y1={`${portal.y}%`}
                      x2={`${target.x}%`}
                      y2={`${target.y}%`}
                      stroke={isConnectedCompleted ? 'url(#linkGradActive)' : 'rgba(228, 225, 233, 0.15)'}
                      strokeWidth={isConnectedCompleted ? '2' : '1'}
                    />
                    {/* Animated Data Packets along completed lines */}
                    {isConnectedCompleted && (
                      <circle
                        r="2.5"
                        fill="#ffd602"
                        className="animate-ping"
                        cx={`${(portal.x + target.x) / 2}%`}
                        cy={`${(portal.y + target.y) / 2}%`}
                      />
                    )}
                  </g>
                );
              });
            })}
          </svg>

          {/* Central CORE SYSTEM Node (Matches Image 3) */}
          <button
            onClick={() => {
              sound.playSelect();
              setShowCoreModal(true);
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 group cursor-pointer"
            title="Core System Hub"
          >
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#1b1b20]/90 border-2 border-cyan-400 flex flex-col items-center justify-center p-2 text-center shadow-[0_0_30px_rgba(0,240,255,0.4)] group-hover:shadow-[0_0_45px_rgba(0,240,255,0.8)] transition-all group-hover:scale-105">
              <div className="w-10 h-10 rounded-full bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center mb-1">
                <Globe className="w-6 h-6 text-cyan-300 group-hover:rotate-90 transition-transform duration-700" />
              </div>
              <div className="font-['Space_Grotesk',sans-serif] font-bold text-[10px] md:text-[11px] text-white tracking-widest uppercase leading-tight">
                CORE<br />SYSTEM
              </div>
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 animate-ping" />
            </div>
          </button>

          {/* 17 Domain Nodes (Matches Image 3 exact box & triangular styles) */}
          {portals.map((portal) => {
            const isCompleted = completedPortals.includes(portal.id);
            const isFailed = failedPortals.includes(portal.id);
            const isSelected = selectedNodeId === portal.id;

            return (
              <div
                key={portal.id}
                style={{
                  left: `${portal.x}%`,
                  top: `${portal.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute z-10 flex flex-col items-center"
              >
                <button
                  onClick={() => handleNodeClick(portal)}
                  className={`relative p-1.5 md:p-2 rounded-xl transition-all duration-300 cursor-pointer flex items-center justify-center ${
                    isCompleted
                      ? 'bg-[#221b00]/90 border-2 border-[#ffd602] shadow-[0_0_18px_rgba(255,214,2,0.6)] text-[#ffd602]'
                      : isFailed
                      ? 'bg-red-950/80 border border-red-500 text-red-400 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
                      : isSelected
                      ? 'bg-cyan-950/90 border-2 border-cyan-300 scale-110 shadow-[0_0_20px_rgba(0,240,255,0.7)] text-cyan-300'
                      : 'bg-[#1b1b20]/85 border border-cyan-500/30 hover:border-cyan-400 hover:scale-110 text-white/90 shadow-[0_0_10px_rgba(0,0,0,0.5)]'
                  }`}
                  title={`${portal.name} - ${isCompleted ? 'COMPLETED' : 'AVAILABLE'}`}
                >
                  {/* Official Domain Logo */}
                  <div className="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center relative">
                    <DomainLogo id={portal.id} name={portal.name} className="w-full h-full" />
                    {isCompleted && (
                      <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#ffd602] rounded-full flex items-center justify-center shadow">
                        <Check className="w-2.5 h-2.5 text-black stroke-[3]" />
                      </span>
                    )}
                  </div>

                  {/* Pulsing indicator if currently selected */}
                  {isSelected && (
                    <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                </button>

                {/* Node Monospace Label (Matches Image 3) */}
                <div
                  className={`mt-1 font-mono text-[9px] md:text-[10px] font-medium tracking-wide px-1.5 py-0.5 rounded backdrop-blur-sm pointer-events-none transition-all max-w-[105px] md:max-w-[130px] text-center leading-tight ${
                    isCompleted
                      ? 'bg-[#221b00]/95 text-[#ffd602] border border-[#ffd602]/40 font-bold'
                      : isSelected
                      ? 'bg-cyan-950/95 text-cyan-200 border border-cyan-400 font-bold'
                      : 'bg-[#0e0e13]/85 text-white/90 border border-white/10'
                  }`}
                  title={portal.name}
                >
                  {portal.name}
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Selected Portal Bottom Sheet / Launch Card */}
      {selectedPortal && (
        <div className="relative z-30 w-full max-w-xl mx-auto px-4 pb-2 animate-fade-in">
          <div className="glass-panel rounded-xl p-4 border-cyan-500/40 shadow-2xl flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 flex-1 min-w-0">
              <div className="p-2 rounded-xl bg-[#131318] border border-cyan-500/30 text-cyan-300 shrink-0 shadow-md">
                <DomainLogo id={selectedPortal.id} name={selectedPortal.name} className="w-8 h-8 md:w-9 md:h-9" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 font-mono text-[10px] text-cyan-300 font-bold uppercase">
                    {selectedPortal.code}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                      completedPortals.includes(selectedPortal.id) || (solvedQuestions[selectedPortal.id] || []).length >= (selectedPortal.challenges?.length || 5)
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/40'
                        : (solvedQuestions[selectedPortal.id] || []).length > 0
                        ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/40'
                        : 'bg-cyan-950/40 text-cyan-300'
                    }`}
                  >
                    {completedPortals.includes(selectedPortal.id) || (solvedQuestions[selectedPortal.id] || []).length >= (selectedPortal.challenges?.length || 5)
                      ? '✓ SECURED'
                      : (solvedQuestions[selectedPortal.id] || []).length > 0
                      ? `${(solvedQuestions[selectedPortal.id] || []).length}/${selectedPortal.challenges?.length || 5} SOLVED`
                      : selectedPortal.difficulty}
                  </span>
                </div>
                <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-base md:text-lg text-white truncate">
                  {selectedPortal.name}
                </h3>
                <p className="text-white/70 text-xs line-clamp-1 font-mono">
                  {(selectedPortal.challenges?.length || 5)} MCQs • +{(selectedPortal.challenges?.length || 5) * 2} Base Marks (Max 250 Cap)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setSelectedNodeId(null)}
                className="px-3 py-2 rounded bg-white/10 hover:bg-white/20 text-white font-mono text-xs cursor-pointer"
              >
                CLOSE
              </button>
              <button
                onClick={() => handleLaunchPortal(selectedPortal.id)}
                className="px-4 py-2.5 rounded bg-cyan-400 hover:bg-cyan-300 text-cyan-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.4)] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>
                  {completedPortals.includes(selectedPortal.id) || (solvedQuestions[selectedPortal.id] || []).length >= (selectedPortal.challenges?.length || 5)
                    ? 'REPLAY'
                    : (solvedQuestions[selectedPortal.id] || []).length > 0
                    ? 'RESUME'
                    : 'ENTER'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Core System Modal */}
      {showCoreModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel max-w-md w-full rounded-2xl p-6 border-cyan-400 shadow-2xl relative text-left animate-fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-cyan-500/20 mb-4">
              <div className="flex items-center gap-2 text-cyan-300 font-mono text-sm font-bold">
                <Globe className="w-5 h-5 text-cyan-400" />
                CORE SYSTEM MAINFRAME
              </div>
              <button
                onClick={() => setShowCoreModal(false)}
                className="text-white/60 hover:text-white font-mono text-xs px-2.5 py-1 bg-white/10 rounded cursor-pointer"
              >
                ESC
              </button>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div className="p-3 bg-cyan-950/40 rounded border border-cyan-500/30 flex justify-between items-center">
                <span>GRID INTEGRITY:</span>
                <span className="text-cyan-300 font-bold text-sm">
                  {Math.round((completedPortals.length / portals.length) * 100)}% ONLINE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2.5 bg-[#1b1b20] rounded border border-white/10">
                  <div className="text-white/50 text-[10px]">PORTALS BREACHED</div>
                  <div className="text-white font-bold text-lg">
                    {completedPortals.length} / {portals.length}
                  </div>
                </div>
                <div className="p-2.5 bg-[#1b1b20] rounded border border-white/10">
                  <div className="text-white/50 text-[10px]">CURRENT SCORE</div>
                  <div className="text-amber-300 font-bold text-lg">{score} PTS</div>
                </div>
              </div>

              {completedPortals.length >= 17 ? (
                <button
                  onClick={() => {
                    setShowCoreModal(false);
                    onCompleteQuest();
                  }}
                  className="w-full py-3 bg-[#ffd602] hover:bg-[#ffe170] text-[#221b00] font-bold rounded uppercase tracking-wider text-sm shadow-[0_0_20px_rgba(255,214,2,0.5)] cursor-pointer"
                >
                  🏆 CLAIM CHAMPIONSHIP RANK
                </button>
              ) : (
                <div className="text-center text-white/70 text-[11px] py-1">
                  Breach all 17 domain portals to unlock full Core System Overdrive.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Tabs (Matches Image 3) */}
      <footer className="relative z-20 w-full border-t border-white/10 bg-[#0e0e13]/90 backdrop-blur-lg px-4 py-2">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
          {/* Map Tab */}
          <button
            onClick={() => {
              sound.playClick();
              onChangeTab('map');
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'map'
                ? 'text-[#00f0ff] font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <MapIcon className={`w-5 h-5 mb-1 ${activeTab === 'map' ? 'stroke-[2.5]' : ''}`} />
            <span className="font-mono text-[11px] uppercase tracking-wider">Map</span>
          </button>

          {/* Portals Tab */}
          <button
            onClick={() => {
              sound.playClick();
              onChangeTab('portals');
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'portals'
                ? 'text-[#00f0ff] font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Layers className={`w-5 h-5 mb-1 ${activeTab === 'portals' ? 'stroke-[2.5]' : ''}`} />
            <span className="font-mono text-[11px] uppercase tracking-wider">Portals</span>
          </button>

          {/* Status Tab */}
          <button
            onClick={() => {
              sound.playClick();
              onChangeTab('status');
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'status'
                ? 'text-[#00f0ff] font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <BarChart3 className={`w-5 h-5 mb-1 ${activeTab === 'status' ? 'stroke-[2.5]' : ''}`} />
            <span className="font-mono text-[11px] uppercase tracking-wider">Status</span>
          </button>

          {/* Inventory Tab */}
          <button
            onClick={() => {
              sound.playClick();
              onChangeTab('inventory');
            }}
            className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all cursor-pointer ${
              activeTab === 'inventory'
                ? 'text-[#00f0ff] font-bold drop-shadow-[0_0_8px_rgba(0,240,255,0.6)]'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <Package className={`w-5 h-5 mb-1 ${activeTab === 'inventory' ? 'stroke-[2.5]' : ''}`} />
            <span className="font-mono text-[11px] uppercase tracking-wider">Inventory</span>
          </button>
        </div>
      </footer>
    </div>
  );
};
