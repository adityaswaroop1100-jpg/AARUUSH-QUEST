import React from 'react';
import { VisualChallengeType } from '../types';

interface VisualizerProps {
  type: VisualChallengeType;
  title: string;
}

export const ChallengeVisualizer: React.FC<VisualizerProps> = ({ type }) => {
  switch (type) {
    case 'gear_rotation':
      return (
        <div className="w-full flex flex-col items-center justify-center p-4 my-3 bg-[#0e0e13]/80 rounded-lg border border-cyan-500/20">
          <div className="relative w-64 h-24 flex items-center justify-center gap-1 overflow-hidden">
            {/* Gear 1 - Input Driver CW */}
            <div className="relative flex flex-col items-center">
              <svg className="w-12 h-12 text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
              </svg>
              <span className="text-[9px] font-mono text-cyan-300 mt-1 uppercase">Drive (CW)</span>
            </div>

            {/* Gear 2 - CCW */}
            <div className="relative flex flex-col items-center -ml-2">
              <svg className="w-9 h-9 text-amber-400 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="2.5" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            </div>

            {/* Gear 3 - CW */}
            <div className="relative flex flex-col items-center -ml-2">
              <svg className="w-10 h-10 text-cyan-400 animate-spin" style={{ animationDuration: '3.3s' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="2.5" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            </div>

            {/* Gear 4 - CCW */}
            <div className="relative flex flex-col items-center -ml-2">
              <svg className="w-8 h-8 text-amber-400 animate-spin" style={{ animationDuration: '2.7s', animationDirection: 'reverse' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="2" />
                <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            </div>

            {/* Gear 5 - Target Output */}
            <div className="relative flex flex-col items-center -ml-2">
              <svg className="w-12 h-12 text-[#fe6b00] animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 1v3M12 20v3M1 12h3M20 12h3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
              </svg>
              <span className="text-[9px] font-mono text-[#fe6b00] mt-1 uppercase font-bold">Target (?)</span>
            </div>
          </div>
          <div className="text-[11px] font-mono text-white/60 tracking-wider mt-1">
            5-STAGE SPUR TRAIN • RATIO 1:1
          </div>
        </div>
      );

    case 'logic_gate':
      return (
        <div className="w-full flex flex-col items-center p-3 my-3 bg-[#0e0e13]/80 rounded-lg border border-cyan-500/20 font-mono text-xs">
          <div className="flex items-center justify-center gap-3 w-full py-2">
            <div className="flex flex-col gap-1 text-cyan-300">
              <span className="bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">A = 1</span>
              <span className="bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">B = 1</span>
              <span className="bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/40">C = 0</span>
            </div>
            <div className="text-white/40 text-lg">➔</div>
            <div className="bg-[#1f1f25] px-3 py-2 rounded border border-amber-500/30 text-amber-300 font-semibold text-center">
              (A ⊼ B) ⊕ (B ∨ ¬C)
            </div>
            <div className="text-white/40 text-lg">➔</div>
            <div className="bg-cyan-500/20 px-3 py-2 rounded border border-cyan-400 text-cyan-200 font-bold">
              Q = ?
            </div>
          </div>
        </div>
      );

    case 'cyber_hex':
      return (
        <div className="w-full p-3 my-3 bg-[#0e0e13]/80 rounded-lg border border-cyan-500/20 font-mono text-xs">
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="p-2 rounded bg-cyan-950/40 border border-cyan-500/30">
              <div className="text-cyan-400 text-[10px]">CIPHER BYTE</div>
              <div className="text-white font-bold text-sm">0x5C (0101 1100)</div>
            </div>
            <div className="p-2 rounded bg-orange-950/40 border border-orange-500/30">
              <div className="text-[#ffb693] text-[10px]">XOR MASK</div>
              <div className="text-white font-bold text-sm">0x3A (0011 1010)</div>
            </div>
          </div>
          <div className="text-center mt-2 text-[11px] text-cyan-300">
            [⊕ BITWISE XOR COMPUTATION]
          </div>
        </div>
      );

    case 'data_anomaly':
      return (
        <div className="w-full p-3 my-3 bg-[#0e0e13]/80 rounded-lg border border-cyan-500/20">
          <div className="flex justify-between text-[11px] font-mono text-white/70 mb-2">
            <span>DISTRIBUTION: μ=100, σ=15</span>
            <span className="text-cyan-400">NORMAL RANGE: [70 .. 130]</span>
          </div>
          <div className="relative h-12 bg-[#1b1b20] rounded flex items-center px-4 overflow-hidden border border-white/10">
            <div className="absolute inset-y-0 left-[25%] w-[50%] bg-cyan-500/10 border-x border-cyan-500/30"></div>
            {/* Cluster points */}
            <div className="w-2 h-2 rounded-full bg-cyan-400 absolute left-[35%]"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400 absolute left-[48%]"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400 absolute left-[55%]"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400 absolute left-[62%]"></div>
            {/* Anomaly point */}
            <div className="w-3 h-3 rounded-full bg-red-500 animate-ping absolute right-[6%]"></div>
            <div className="w-3 h-3 rounded-full bg-red-400 absolute right-[6%] shadow-[0_0_8px_#ff0055]"></div>
          </div>
          <div className="text-right text-[10px] font-mono text-red-400 mt-1">
            ▲ ANOMALY FLAG &gt; 3.0σ
          </div>
        </div>
      );

    case 'packet_route':
      return (
        <div className="w-full p-3 my-3 bg-[#0e0e13]/80 rounded-lg border border-cyan-500/20 font-mono text-xs">
          <div className="flex items-center justify-between gap-2 text-center">
            <div className="px-2 py-1 bg-cyan-950/60 rounded border border-cyan-500/40 text-cyan-300">
              ORIGIN [EDGE]
            </div>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-cyan-500 via-amber-400 to-cyan-500 relative">
              <div className="w-2 h-2 rounded-full bg-white absolute -top-[3px] left-1/2 animate-ping"></div>
            </div>
            <div className="px-2 py-1 bg-amber-950/60 rounded border border-amber-500/40 text-amber-300">
              DEST [TELEMETRY]
            </div>
          </div>
          <div className="text-center text-[10px] text-white/60 mt-2">
            REQUIREMENT: 0-RTT HANDSHAKE & LOW JITTER
          </div>
        </div>
      );

    case 'orbital_vector':
      return (
        <div className="w-full p-3 my-3 bg-[#0e0e13]/80 rounded-lg border border-cyan-500/20">
          <div className="relative h-16 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full border border-cyan-500/40 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-cyan-400/80 shadow-[0_0_12px_#00f0ff]"></div>
            </div>
            <div className="absolute w-36 h-12 rounded-full border border-dashed border-amber-400/60 animate-spin" style={{ animationDuration: '10s' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-[#fe6b00] absolute -top-1 left-1/2"></div>
            </div>
          </div>
          <div className="text-center text-[10px] font-mono text-amber-300">
            ORBITAL TRANSFER TRAJECTORY Δv
          </div>
        </div>
      );

    case 'market_trend':
      return (
        <div className="w-full p-3 my-3 bg-[#0e0e13]/80 rounded-lg border border-cyan-500/20 font-mono text-xs">
          <div className="flex justify-between text-white/80 mb-1">
            <span className="text-cyan-400">POOL A: $2,400</span>
            <span className="text-[#fe6b00]">POOL B: $2,460</span>
          </div>
          <div className="h-1.5 w-full bg-[#1b1b20] rounded-full overflow-hidden flex">
            <div className="w-[60%] bg-cyan-500"></div>
            <div className="w-[40%] bg-[#fe6b00]"></div>
          </div>
          <div className="flex justify-between text-[10px] text-white/60 mt-1">
            <span>GROSS SPREAD: +2.5%</span>
            <span>TOTAL GAS & FEE: 0.8%</span>
          </div>
        </div>
      );

    case 'cad_blueprint':
      return (
        <div className="w-full p-2.5 my-2.5 bg-[#0e0e13]/80 rounded-lg border border-cyan-500/20 font-mono text-xs">
          <div className="flex items-center justify-between text-[10px] text-cyan-300 mb-1 border-b border-cyan-500/20 pb-1">
            <span>SCHEMATIC // SCALE 1:50</span>
            <span className="text-amber-400">PLANAR ELEVATION</span>
          </div>
          <div className="h-12 w-full rounded bg-[#131318] border border-dashed border-cyan-500/30 flex items-center justify-around relative overflow-hidden">
            <div className="w-5 h-8 border-2 border-cyan-400/80 bg-cyan-950/40 flex items-center justify-center text-[8px] text-cyan-200 font-bold">
              COL 1
            </div>
            <div className="h-1.5 w-24 bg-cyan-400/80 rounded" />
            <div className="w-5 h-8 border-2 border-cyan-400/80 bg-cyan-950/40 flex items-center justify-center text-[8px] text-cyan-200 font-bold">
              COL 2
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};
