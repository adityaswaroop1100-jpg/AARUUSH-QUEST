import React from 'react';

interface AaruushLogoProps {
  className?: string;
  size?: number;
}

export const AaruushLogo: React.FC<AaruushLogoProps> = ({
  className = "w-28 md:w-36 h-28 md:h-36",
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center select-none pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 260 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full filter drop-shadow-[0_0_25px_rgba(255,214,2,0.9)] drop-shadow-[0_0_45px_rgba(254,107,0,0.7)] animate-pulse-glow"
      >
        <defs>
          {/* Circular Core Radial Gradient */}
          <radialGradient id="aaruushDarkCore" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0d1117" stopOpacity="0.85" />
            <stop offset="65%" stopColor="#090b10" stopOpacity="0.7" />
            <stop offset="90%" stopColor="#050608" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#050608" stopOpacity="0" />
          </radialGradient>

          {/* Central Starburst Light Gradient */}
          <radialGradient id="aaruushBurstGradGold" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor="#ffd602" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#fe6b00" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ff7700" stopOpacity="0" />
          </radialGradient>

          <radialGradient id="aaruushBurstGradCyan" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
            <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.65" />
            <stop offset="85%" stopColor="#0077ff" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
          </radialGradient>

          {/* Main Orange Solar Arch Gradient */}
          <linearGradient id="aaruushSunArchGrad" x1="10%" y1="100%" x2="90%" y2="0%">
            <stop offset="0%" stopColor="#e54300" />
            <stop offset="25%" stopColor="#ff5900" />
            <stop offset="60%" stopColor="#fe6b00" />
            <stop offset="85%" stopColor="#ff8400" />
            <stop offset="100%" stopColor="#ffa000" />
          </linearGradient>

          {/* Golden Yellow Inner 'a' Flame Gradient */}
          <linearGradient id="aaruushFlameAGrad" x1="20%" y1="10%" x2="80%" y2="90%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="20%" stopColor="#fff685" />
            <stop offset="55%" stopColor="#ffd602" />
            <stop offset="85%" stopColor="#ffbf00" />
            <stop offset="100%" stopColor="#ff9000" />
          </linearGradient>
        </defs>

        {/* ─── 1. Soft Circular Core with Zero Square Edges ─── */}
        <circle cx="130" cy="130" r="105" fill="url(#aaruushDarkCore)" />
        <circle cx="130" cy="130" r="105" stroke="rgba(255,214,2,0.2)" strokeWidth="1" />

        {/* ─── 2. Fine Starburst Radiating Light Beams (Cyan & Gold) ─── */}
        <g opacity="0.85">
          {/* Golden fine needles */}
          {[0, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165, 180, 195, 210, 225, 240, 255, 270, 285, 300, 315, 330, 345].map((deg) => (
            <line
              key={`gold-${deg}`}
              x1="130"
              y1="130"
              x2="130"
              y2={deg % 30 === 0 ? "35" : "55"}
              stroke="url(#aaruushBurstGradGold)"
              strokeWidth={deg % 45 === 0 ? "1.8" : "1.1"}
              strokeLinecap="round"
              transform={`rotate(${deg} 130 130)`}
            />
          ))}
          {/* Cyan secondary needles */}
          {[7.5, 37.5, 67.5, 97.5, 127.5, 157.5, 187.5, 217.5, 247.5, 277.5, 307.5, 337.5].map((deg) => (
            <line
              key={`cyan-${deg}`}
              x1="130"
              y1="130"
              x2="130"
              y2="45"
              stroke="url(#aaruushBurstGradCyan)"
              strokeWidth="1.2"
              strokeLinecap="round"
              transform={`rotate(${deg} 130 130)`}
            />
          ))}
        </g>

        {/* Center Glow Corona */}
        <circle cx="130" cy="130" r="38" fill="url(#aaruushBurstGradGold)" opacity="0.75" />

        {/* ─── 3. Authentic Aaruush Radiating Flares (Orange Solar Rays) ─── */}
        <g stroke="url(#aaruushSunArchGrad)" strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Ray 1: Bottom-Left horizontal tapering flare */}
          <path
            d="M 52 152 Q 74 153 92 156"
            strokeWidth="8.5"
          />

          {/* Ray 2: Mid-Left diagonal upward flare */}
          <path
            d="M 54 110 Q 76 122 96 142"
            strokeWidth="9"
          />

          {/* Ray 3: Upper-Left flame curl flare */}
          <path
            d="M 104 78 Q 110 94 112 114"
            strokeWidth="8.5"
          />

          {/* Ray 4: Upper-Right flame flare */}
          <path
            d="M 156 78 Q 150 94 148 114"
            strokeWidth="8.5"
          />

          {/* Ray 5: Right wavy solar flame flare */}
          <path
            d="M 166 140 Q 182 128 200 126 Q 208 125 214 128"
            strokeWidth="8.5"
          />
        </g>

        {/* ─── 4. Main Aaruush Sun Arch (Smooth Rising Sun Dome) ─── */}
        <path
          d="M 94 178 C 90 138 106 114 130 114 C 154 114 170 138 166 178"
          stroke="url(#aaruushSunArchGrad)"
          strokeWidth="15"
          strokeLinecap="round"
          fill="none"
        />

        {/* ─── 5. Core Golden Stylized 'a' Flourish ─── */}
        <path
          d="M 110 166 C 110 148 120 136 132 136 C 144 136 150 146 148 158 C 146 170 124 172 116 166 C 110 160 118 148 136 150 C 148 152 156 160 160 172"
          stroke="url(#aaruushFlameAGrad)"
          strokeWidth="10.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Intense Central Sparkle */}
        <circle cx="131" cy="151" r="2.8" fill="#ffffff" />
      </svg>
    </div>
  );
};
