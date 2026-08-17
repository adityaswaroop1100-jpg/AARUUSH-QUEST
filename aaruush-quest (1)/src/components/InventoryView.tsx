import React from 'react';
import { Package, Sparkles, Clock, Lightbulb, Zap, Shield, Check } from 'lucide-react';
import { DomainPortal } from '../types';
import { DomainLogo } from './DomainLogos';
import { sound } from '../utils/audio';

interface InventoryViewProps {
  portals: DomainPortal[];
  completedPortals: string[];
  powerUps: {
    timeWarp: number;
    neuralHint: number;
    overcharge: number;
  };
  onUseTimeWarp: () => void;
  onUseOvercharge: () => void;
  isOverchargeActive: boolean;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  portals,
  completedPortals,
  powerUps,
  onUseTimeWarp,
  onUseOvercharge,
  isOverchargeActive,
}) => {
  // Collect all artifacts from breached portals
  const unlockedArtifacts = portals
    .filter((p) => completedPortals.includes(p.id) && p.rewardArtifact)
    .map((p) => ({
      domain: p.name,
      ...p.rewardArtifact!,
    }));

  return (
    <div className="flex-grow flex flex-col p-4 md:p-6 max-w-4xl mx-auto w-full overflow-y-auto space-y-6">
      <div>
        <h2 className="font-['Space_Grotesk',sans-serif] text-2xl font-bold text-white uppercase tracking-tight">
          CYBER INVENTORY // ARTIFACTS
        </h2>
        <p className="font-mono text-xs text-white/60">
          TACTICAL POWER-UPS & UNLOCKED FESTIVAL HARDWARE
        </p>
      </div>

      {/* Power-ups Section */}
      <div>
        <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-cyan-300 uppercase tracking-widest mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-cyan-400" />
          Tactical Overdrive Modules
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Time Warp */}
          <div className="glass-panel rounded-xl p-4 border-cyan-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                  <Clock className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded">
                  x{powerUps.timeWarp}
                </span>
              </div>
              <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-white">
                TIME WARP (+30s)
              </h4>
              <p className="text-[11px] text-white/60 mt-1 leading-normal">
                Injects +30 seconds of computational clock time immediately.
              </p>
            </div>

            <button
              onClick={() => {
                if (powerUps.timeWarp > 0) {
                  sound.playSelect();
                  onUseTimeWarp();
                }
              }}
              disabled={powerUps.timeWarp <= 0}
              className={`mt-4 w-full py-2 rounded font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                powerUps.timeWarp > 0
                  ? 'bg-cyan-400 hover:bg-cyan-300 text-cyan-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              ACTIVATE (+30s)
            </button>
          </div>

          {/* Neural Hint */}
          <div className="glass-panel rounded-xl p-4 border-amber-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs text-amber-300 font-bold bg-amber-950/60 px-2 py-0.5 rounded">
                  x{powerUps.neuralHint}
                </span>
              </div>
              <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-white">
                NEURAL HINT DECODER
              </h4>
              <p className="text-[11px] text-white/60 mt-1 leading-normal">
                Reveals the underlying principle during any active challenge.
              </p>
            </div>

            <div className="mt-4 text-center font-mono text-[11px] text-amber-300/80 py-1.5 bg-amber-950/20 rounded border border-amber-500/20">
              AVAILABLE IN CHALLENGE
            </div>
          </div>

          {/* Overcharge 2X */}
          <div className="glass-panel rounded-xl p-4 border-orange-500/30 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-orange-950/80 border border-orange-500/40 text-[#fe6b00]">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="font-mono text-xs text-[#fe6b00] font-bold bg-orange-950/60 px-2 py-0.5 rounded">
                  x{powerUps.overcharge}
                </span>
              </div>
              <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-white">
                OVERCHARGE (2X SCORE)
              </h4>
              <p className="text-[11px] text-white/60 mt-1 leading-normal">
                Doubles score multiplier for the next 2 portal breaches.
              </p>
            </div>

            <button
              onClick={() => {
                if (powerUps.overcharge > 0 && !isOverchargeActive) {
                  sound.playSelect();
                  onUseOvercharge();
                }
              }}
              disabled={powerUps.overcharge <= 0 || isOverchargeActive}
              className={`mt-4 w-full py-2 rounded font-mono text-xs uppercase font-bold tracking-wider transition-all cursor-pointer ${
                isOverchargeActive
                  ? 'bg-[#fe6b00]/30 text-[#fe6b00] border border-[#fe6b00]'
                  : powerUps.overcharge > 0
                  ? 'bg-[#fe6b00] hover:bg-[#ff842a] text-[#351000] shadow-[0_0_12px_rgba(254,107,0,0.4)]'
                  : 'bg-white/5 text-white/30 cursor-not-allowed'
              }`}
            >
              {isOverchargeActive ? '⚡ ACTIVE (2X)' : 'ENGAGE 2X'}
            </button>
          </div>
        </div>
      </div>

      {/* Unlocked Artifacts Showcase */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-[#ffd602] uppercase tracking-widest flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#ffd602]" />
            Acquired Festival Artifacts ({unlockedArtifacts.length}/{portals.length})
          </h3>
        </div>

        {unlockedArtifacts.length === 0 ? (
          <div className="glass-panel rounded-xl p-8 text-center text-white/50 font-mono text-xs border-dashed border-white/20">
            No artifacts acquired yet. Breach domain portals on the Cyber Map to unlock hardware relics!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {unlockedArtifacts.map((art) => (
              <div
                key={art.name}
                className={`glass-panel rounded-xl p-4 border transition-all ${
                  art.rarity === 'Legendary'
                    ? 'border-[#ffd602]/50 shadow-[0_0_15px_rgba(255,214,2,0.15)] bg-[#221b00]/30'
                    : art.rarity === 'Rare'
                    ? 'border-cyan-500/40 bg-cyan-950/20'
                    : 'border-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-[#141419] border border-white/10 text-cyan-300">
                      <DomainLogo name={art.domain} className="w-5 h-5" />
                    </div>
                    <span className="font-mono text-[10px] text-white/70 uppercase font-semibold">
                      {art.domain}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                      art.rarity === 'Legendary'
                        ? 'text-[#ffd602] bg-[#ffd602]/20 border border-[#ffd602]/40'
                        : art.rarity === 'Rare'
                        ? 'text-cyan-300 bg-cyan-950 border border-cyan-500/40'
                        : 'text-white/70 bg-white/10'
                    }`}
                  >
                    {art.rarity}
                  </span>
                </div>

                <h4 className="font-['Space_Grotesk',sans-serif] font-bold text-sm text-white mb-1">
                  {art.name}
                </h4>
                <p className="text-xs text-white/70 leading-relaxed">
                  {art.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
