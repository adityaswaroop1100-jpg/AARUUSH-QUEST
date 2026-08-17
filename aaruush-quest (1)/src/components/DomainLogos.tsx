import React from 'react';

interface DomainLogoProps {
  id?: string;
  name?: string;
  className?: string;
  size?: number | string;
  glow?: boolean;
}

export const DomainLogo: React.FC<DomainLogoProps> = ({
  id,
  name,
  className = 'w-6 h-6',
  size,
  glow = false,
}) => {
  // Normalize lookup key
  const key = (id || name || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const style = size ? { width: size, height: size } : undefined;

  const getLogoContent = () => {
    // 1. Vimanaz (Aeronautics & Aerospace)
    if (key.includes('viman')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" />
          {/* Supersonic Jet Aircraft flying to top-right */}
          <path d="M74 25 C72 26 66 33 60 38 L43 28 C41 27 38 28 39 30 L45 42 L25 51 L20 46 C19 45 17 46 18 48 L22 58 L19 63 C18 65 19 67 22 66 L30 63 L46 68 L49 79 C50 81 52 81 53 79 L57 65 L76 52 C81 48 83 40 82 32 C81 26 77 24 74 25 Z" />
          {/* Jet Engine Nacelles on wings */}
          <rect x="36" y="27" width="3.5" height="8" rx="1.75" transform="rotate(35 36 27)" />
          <rect x="44" y="32" width="3.5" height="8" rx="1.75" transform="rotate(35 44 32)" />
          <rect x="66" y="55" width="3.5" height="8" rx="1.75" transform="rotate(35 66 55)" />
          <rect x="71" y="60" width="3.5" height="8" rx="1.75" transform="rotate(35 71 60)" />
        </svg>
      );
    }

    // 2. Webnexus (Web Tech & Cloud Systems)
    if (key.includes('nexus') || key.includes('web')) {
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" strokeWidth="6" />
          {/* Geodesic sphere network */}
          <g strokeWidth="1" opacity="0.6">
            <circle cx="50" cy="50" r="33" strokeDasharray="3 3" />
            <ellipse cx="50" cy="50" rx="33" ry="14" />
            <ellipse cx="50" cy="50" rx="14" ry="33" />
            <line x1="26" y1="26" x2="74" y2="74" />
            <line x1="26" y1="74" x2="74" y2="26" />
            <line x1="50" y1="17" x2="83" y2="50" />
            <line x1="83" y1="50" x2="50" y2="83" />
            <line x1="50" y1="83" x2="17" y2="50" />
            <line x1="17" y1="50" x2="50" y2="17" />
          </g>
          {/* Central 3D Hexagonal Block with circuit nodes */}
          <g strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            {/* Hexagon Outline */}
            <path d="M50 32 L65 41 L65 59 L50 68 L35 59 L35 41 Z" />
            {/* 3D Inner Y Cube */}
            <path d="M50 50 L50 68" />
            <path d="M50 50 L65 41" />
            <path d="M50 50 L35 41" />
            {/* Circuit Nodes */}
            <circle cx="50" cy="24" r="3" fill="currentColor" />
            <line x1="50" y1="27" x2="50" y2="32" />
            <circle cx="73" cy="37" r="3" fill="currentColor" />
            <line x1="70" y1="38" x2="65" y2="41" />
            <circle cx="73" cy="63" r="3" fill="currentColor" />
            <line x1="70" y1="62" x2="65" y2="59" />
            <circle cx="50" cy="76" r="3" fill="currentColor" />
            <line x1="50" y1="73" x2="50" y2="68" />
            <circle cx="27" cy="63" r="3" fill="currentColor" />
            <line x1="30" y1="62" x2="35" y2="59" />
            <circle cx="27" cy="37" r="3" fill="currentColor" />
            <line x1="30" y1="38" x2="35" y2="41" />
          </g>
        </svg>
      );
    }

    // 3. X-Zone & Esports (Gaming, Cyber & Esports)
    if (key.includes('xzone') || key.includes('esport') || key.includes('cyber')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" />
          {/* Tactical Shooter Soldier Silhouette */}
          <path d="M47 24 C44 24 41 27 41 30 C41 33 43 36 47 36 C50 36 53 33 53 30 C53 27 50 24 47 24 Z" />
          <path d="M38 37 C34 39 33 43 34 50 L39 52 L36 64 L28 72 C26 74 27 77 31 77 C34 77 37 73 40 68 L47 55 L54 68 C56 73 58 77 62 77 C65 77 66 74 64 71 L56 55 L55 45 L62 46 L71 39 L72 38 L63 37 L58 40 L53 37 C48 35 42 35 38 37 Z" />
          {/* Weapon / Rifle in hands */}
          <path d="M51 38 L69 35 L70 38 L65 40 L64 45 L60 44 L61 40 L51 41 Z" />
        </svg>
      );
    }

    // 4. Yuddhame (Cyber Warfare & Tactical Intelligence)
    if (key.includes('yuddhame') || key.includes('data')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" />
          {/* Computer Monitor */}
          <rect x="22" y="34" width="37" height="24" rx="2" fill="none" stroke="currentColor" strokeWidth="4" />
          <rect x="37" y="58" width="6" height="8" />
          <rect x="31" y="66" width="18" height="3" rx="1.5" />
          {/* PC Tower Chassis */}
          <rect x="63" y="34" width="15" height="35" rx="2" />
          <line x1="64" y1="41" x2="77" y2="41" stroke="#080808" strokeWidth="2.5" />
          <line x1="64" y1="47" x2="77" y2="47" stroke="#080808" strokeWidth="2.5" />
          <circle cx="70.5" cy="59" r="3" fill="#080808" />
        </svg>
      );
    }

    // 5. Agritech (Smart Agriculture & Biotechnology)
    if (key.includes('agri') || key.includes('bio')) {
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" strokeWidth="6" />
          {/* Circular biological sensor chamber */}
          <circle cx="50" cy="50" r="26" strokeWidth="3.5" />
          {/* Conduits / Flow Ports */}
          <g strokeWidth="3.5" strokeLinecap="round">
            <line x1="14" y1="45" x2="24" y2="45" />
            <line x1="14" y1="50" x2="24" y2="50" />
            <line x1="14" y1="55" x2="24" y2="55" />
            <line x1="76" y1="45" x2="86" y2="45" />
            <line x1="76" y1="50" x2="86" y2="50" />
            <line x1="76" y1="55" x2="86" y2="55" />
            {/* Diagonal T-caps */}
            <line x1="68" y1="32" x2="77" y2="23" />
            <line x1="73" y1="20" x2="82" y2="28" />
            <line x1="32" y1="68" x2="23" y2="77" />
            <line x1="20" y1="73" x2="28" y2="82" />
          </g>
          {/* Central Circuit Tree with Leaves */}
          <g fill="currentColor" stroke="none">
            {/* Trunk with node */}
            <rect x="48.5" y="47" width="3" height="15" rx="1.5" />
            <circle cx="50" cy="62" r="2.5" />
            {/* Left branch node */}
            <circle cx="43" cy="50" r="2" />
            <rect x="43" y="49" width="7" height="2" />
            {/* Right branch node */}
            <circle cx="57" cy="50" r="2" />
            <rect x="50" y="49" width="7" height="2" />
            {/* Sprouting leaf nodes */}
            <path d="M50 35 C47 38 47 43 50 46 C53 43 53 38 50 35 Z" />
            <path d="M43 40 C39 42 38 46 41 49 C44 47 45 43 43 40 Z" />
            <path d="M57 40 C55 43 56 47 59 49 C62 46 61 42 57 40 Z" />
            <path d="M37 45 C34 46 33 50 36 52 C38 51 39 47 37 45 Z" />
            <path d="M63 45 C61 47 62 51 64 52 C67 50 66 46 63 45 Z" />
          </g>
        </svg>
      );
    }

    // 6. Architecture (Spatial Design & Architecture)
    if (key.includes('arch') || key.includes('blueprint')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="6" />
          {/* Inner circle compass frame */}
          <circle cx="50" cy="50" r="22" fill="none" stroke="currentColor" strokeWidth="2.5" />
          
          {/* Radial Skyline Monuments Silhouette */}
          {/* Eiffel Tower (top right) */}
          <polygon points="68,28 75,18 73,18 73,16 71,16 71,28" />
          {/* Taj Mahal (top) */}
          <path d="M46 16 Q50 12 54 16 L56 26 L44 26 Z" />
          {/* Statue of Liberty (top left) */}
          <path d="M34 23 L37 20 L38 27 L33 27 Z" />
          {/* Colosseum (bottom left) */}
          <rect x="25" y="60" width="10" height="8" rx="1" transform="rotate(-30 30 64)" />
          {/* Leaning Tower of Pisa (bottom right) */}
          <rect x="65" y="60" width="8" height="12" rx="1" transform="rotate(25 69 66)" />
          {/* Sydney Opera / Lotus (right) */}
          <path d="M72 44 Q78 48 72 52 Z" />
          {/* Big Ben / Spire (bottom left) */}
          <polygon points="22,62 17,64 25,70" />
          {/* Christ the Redeemer (left) */}
          <path d="M20 46 L27 48 L27 50 L20 52 Z" />

          {/* Central Drafting Compass / Divider */}
          <g transform="translate(50, 50)">
            <circle cx="0" cy="-12" r="3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <rect x="-1" y="-17" width="2" height="5" />
            {/* Compass legs */}
            <path d="M-2 -8 L-9 14 L-7 14 L-1 -4 Z" />
            <path d="M2 -8 L9 14 L7 14 L1 -4 Z" />
            {/* Measuring Arc */}
            <path d="M-6 4 A8 8 0 0 1 6 4" fill="none" stroke="currentColor" strokeWidth="2" />
          </g>
        </svg>
      );
    }

    // 7. Bluebook (Finance, Management & Economics)
    if (key.includes('bluebook') || key.includes('fin')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" />
          {/* Twisting Double Helix DNA Strand */}
          <g stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            {/* Base pair cross rungs */}
            <line x1="39" y1="30" x2="47" y2="35" />
            <line x1="42" y1="38" x2="52" y2="43" />
            <line x1="46" y1="46" x2="56" y2="51" />
            <line x1="50" y1="54" x2="60" y2="59" />
            <line x1="54" y1="62" x2="63" y2="67" />
          </g>
          {/* Helix Strands */}
          <path
            d="M36 26 C42 34 58 42 62 52 C66 62 56 70 54 74 C50 78 44 76 46 72 C48 68 58 62 55 54 C52 46 38 38 34 30 C32 26 34 24 36 26 Z"
            fill="currentColor"
          />
          <path
            d="M58 24 C56 28 46 34 43 42 C40 50 50 58 52 62 C54 66 56 70 58 74"
            fill="none"
            stroke="currentColor"
            strokeWidth="5.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    // 8. Challenges & Championships (Competitive Challenges & Dynamics)
    if (key.includes('challenge') || key.includes('champ') || key.includes('kinetix')) {
      return (
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Golden Shield Border */}
          <circle cx="50" cy="50" r="44" stroke="#ff9900" strokeWidth="5" />
          <circle cx="50" cy="50" r="39" stroke="#ffb700" strokeWidth="1.5" strokeDasharray="4 2" />
          {/* Rising Sun Rays */}
          <g stroke="#ffb700" strokeWidth="2.5" strokeLinecap="round">
            <line x1="50" y1="16" x2="50" y2="22" />
            <line x1="33" y1="21" x2="37" y2="26" />
            <line x1="67" y1="21" x2="63" y2="26" />
            <line x1="23" y1="32" x2="28" y2="35" />
            <line x1="77" y1="32" x2="72" y2="35" />
          </g>
          {/* Aaruush Rising Crest 'A' */}
          <path
            d="M38 32 C38 24 62 24 62 32 C62 42 42 42 40 46 C38 50 48 50 54 48"
            stroke="#ff9900"
            strokeWidth="3.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Trophy Cup */}
          <g fill="#ffb700" stroke="#ff9900" strokeWidth="1">
            <path d="M43 56 L57 56 L55 68 C55 71 52 73 50 73 C48 73 45 71 45 68 Z" />
            {/* Handles */}
            <path d="M43 58 C39 58 39 65 43 65" fill="none" stroke="#ffb700" strokeWidth="1.5" />
            <path d="M57 58 C61 58 61 65 57 65" fill="none" stroke="#ffb700" strokeWidth="1.5" />
            {/* Star inside cup */}
            <polygon points="50,60 51.5,64 55,64 52,66 53.5,70 50,67.5 46.5,70 48,66 45,64 48.5,64" fill="#1b1202" />
            {/* Stem & Base */}
            <rect x="48.5" y="73" width="3" height="4" fill="#ffb700" />
            <rect x="44" y="77" width="12" height="2.5" rx="1" fill="#ffb700" />
          </g>
          {/* Laurels */}
          <g fill="#ffb700" opacity="0.85">
            <ellipse cx="34" cy="68" rx="2" ry="4" transform="rotate(-40 34 68)" />
            <ellipse cx="38" cy="74" rx="2" ry="4" transform="rotate(-65 38 74)" />
            <ellipse cx="66" cy="68" rx="2" ry="4" transform="rotate(40 66 68)" />
            <ellipse cx="62" cy="74" rx="2" ry="4" transform="rotate(65 62 74)" />
          </g>
        </svg>
      );
    }

    // 9. Cosmic Quest (Astronomy & Space Exploration)
    if (key.includes('cosmic') || key.includes('space') || key.includes('genesis')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" />
          {/* Cosmic Dark Dome */}
          <circle cx="50" cy="50" r="28" fill="currentColor" />
          {/* Stars */}
          <circle cx="44" cy="32" r="1" fill="#080808" />
          <circle cx="68" cy="44" r="1.2" fill="#080808" />
          <polygon points="60,36 61,38 63,38 61.5,39 62,41 60,40 58,41 58.5,39 57,38 59,38" fill="#080808" />
          {/* Astronaut Helmet Visor & Reflection */}
          <path
            d="M34 54 C34 40 66 40 66 54 C66 62 58 68 50 68 C42 68 34 62 34 54 Z"
            fill="#080808"
          />
          {/* Visor Crescent Glow */}
          <path
            d="M40 50 C40 44 60 44 60 50 C60 46 44 46 40 50 Z"
            fill="currentColor"
          />
          {/* Helmet collar */}
          <path d="M36 65 C40 69 60 69 64 65 L66 73 C60 77 40 77 34 73 Z" fill="#080808" />
        </svg>
      );
    }

    // 10. Digital Design (Digital Arts, Procedural Graphics & UI/UX)
    if (key.includes('digital') || key.includes('design') || key.includes('media')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" />
          {/* Diagonal 35mm Film Strip */}
          <g transform="rotate(-35 50 50)">
            <rect x="35" y="16" width="30" height="68" rx="2" fill="currentColor" />
            {/* Film sprocket holes left */}
            <rect x="37" y="20" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="37" y="28" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="37" y="36" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="37" y="44" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="37" y="52" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="37" y="60" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="37" y="68" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="37" y="76" width="3" height="4" rx="0.5" fill="#080808" />
            {/* Film sprocket holes right */}
            <rect x="60" y="20" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="60" y="28" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="60" y="36" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="60" y="44" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="60" y="52" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="60" y="60" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="60" y="68" width="3" height="4" rx="0.5" fill="#080808" />
            <rect x="60" y="76" width="3" height="4" rx="0.5" fill="#080808" />

            {/* Frame 1: Video Camera */}
            <rect x="42" y="22" width="16" height="16" rx="1" fill="#080808" />
            <rect x="44" y="27" width="7" height="6" fill="currentColor" />
            <polygon points="52,28 56,26 56,34 52,32" fill="currentColor" />

            {/* Frame 2: Photo Camera */}
            <rect x="42" y="42" width="16" height="16" rx="1" fill="#080808" />
            <rect x="44" y="48" width="12" height="8" rx="1" fill="currentColor" />
            <circle cx="50" cy="52" r="2.5" fill="#080808" />

            {/* Frame 3: Mouse Cursor Arrow */}
            <rect x="42" y="62" width="16" height="16" rx="1" fill="#080808" />
            <polygon points="46,64 46,74 49,71 52,76 54,75 51,70 55,70" fill="currentColor" />
          </g>
        </svg>
      );
    }

    // 11. Electrizite (Electrical, Electronics & Circuits)
    if (key.includes('electr') || key.includes('elc')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" />
          {/* High Voltage Lightning Bolt */}
          <polygon points="56,21 32,50 49,50 43,79 68,46 51,46" />
        </svg>
      );
    }

    // 12. Fundaz (Fundamental Sciences & Logic)
    if (key.includes('fundaz') || key.includes('logic') || key.includes('atom')) {
      return (
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" strokeWidth="6" />
          {/* Rutherford Bohr Atomic Orbitals */}
          <ellipse cx="50" cy="50" rx="36" ry="14" strokeWidth="3" transform="rotate(30 50 50)" />
          <ellipse cx="50" cy="50" rx="36" ry="14" strokeWidth="3" transform="rotate(-30 50 50)" />
          <ellipse cx="50" cy="50" rx="36" ry="14" strokeWidth="3" transform="rotate(90 50 50)" />
          {/* Orbiting Electrons */}
          <circle cx="20" cy="38" r="4" fill="currentColor" />
          <circle cx="80" cy="38" r="4" fill="currentColor" />
          <circle cx="50" cy="84" r="4" fill="currentColor" />
          {/* Central Nucleus with Pi Symbol */}
          <circle cx="50" cy="50" r="11" fill="#080808" stroke="currentColor" strokeWidth="2.5" />
          <text x="50" y="55" fontSize="13" fontWeight="bold" fontFamily="serif" textAnchor="middle" fill="currentColor" stroke="none">
            π
          </text>
        </svg>
      );
    }

    // 13. Konstruktion & Canoe Challenge (Civil, Structures & Naval Engineering)
    if (key.includes('konstruktion') || key.includes('canoe') || key.includes('engineering') || key.includes('civil')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" />
          {/* Front Engineer with Hard Hat */}
          <g transform="translate(10, 5)">
            {/* Hard Hat */}
            <path d="M22 34 C22 25 38 25 38 34 L41 37 L19 37 Z" />
            <rect x="18" y="37" width="24" height="2" rx="1" />
            {/* Head Silhouette */}
            <path d="M24 39 L36 39 L34 49 L26 49 Z" />
            {/* Torso */}
            <path d="M14 54 C14 51 20 50 30 50 C40 50 46 51 46 54 L46 72 L14 72 Z" />
          </g>
          {/* Background Engineer (Offset right) */}
          <g transform="translate(36, 12)" opacity="0.9">
            {/* Hard Hat */}
            <path d="M22 34 C22 26 36 26 36 34 L39 37 L19 37 Z" />
            <rect x="18" y="37" width="22" height="2" rx="1" />
            {/* Head Silhouette */}
            <path d="M24 39 L34 39 L32 47 L26 47 Z" />
            {/* Torso */}
            <path d="M16 52 C16 50 20 49 29 49 C38 49 42 50 42 52 L42 65 L16 65 Z" />
          </g>
        </svg>
      );
    }

    // 14. Machination (Mechanical Kinematics & Precision Automation)
    if (key.includes('machin') || key.includes('mch')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" />
          {/* Circular Saw Blade / Gear Teeth Ring */}
          <path
            d="M50 20 L53 26 L60 22 L61 29 L68 27 L66 34 L74 34 L70 41 L77 43 L72 49 L79 52 L72 56 L77 62 L70 63 L72 70 L65 69 L65 76 L59 73 L56 79 L51 75 L47 80 L44 74 L39 78 L37 71 L31 73 L31 66 L25 67 L27 60 L21 59 L25 53 L20 50 L25 45 L21 40 L27 38 L25 31 L32 32 L33 25 L39 28 L42 22 L47 26 Z"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
          />
          {/* Inner Clear Circle */}
          <circle cx="50" cy="50" r="22" fill="#080808" stroke="currentColor" strokeWidth="2.5" />
          {/* Crossed Dual Engine Pistons */}
          <g transform="translate(50, 50)">
            {/* Piston 1 (Top Left to Bottom Right) */}
            <g transform="rotate(-45)">
              <rect x="-6" y="-18" width="12" height="10" rx="1.5" />
              <rect x="-2" y="-9" width="4" height="18" />
              <circle cx="0" cy="11" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            </g>
            {/* Piston 2 (Top Right to Bottom Left) */}
            <g transform="rotate(45)">
              <rect x="-6" y="-18" width="12" height="10" rx="1.5" />
              <rect x="-2" y="-9" width="4" height="18" />
              <circle cx="0" cy="11" r="4" fill="none" stroke="currentColor" strokeWidth="2" />
            </g>
          </g>
        </svg>
      );
    }

    // 15. Mageffici & Entrepreneurial Symposium (Management & Entrepreneurship)
    if (key.includes('mageffici') || key.includes('entrepreneur') || key.includes('cognition')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" />
          {/* Ascending 3-Bar Chart */}
          <rect x="35" y="50" width="10" height="20" rx="1" />
          <rect x="47" y="41" width="10" height="29" rx="1" />
          <rect x="59" y="32" width="10" height="38" rx="1" />
          {/* Upward Leaping Businessman with Briefcase */}
          {/* Head */}
          <circle cx="52" cy="22" r="3.5" />
          {/* Body Leaping */}
          <path d="M48 27 L42 35 L47 38 L54 32 L56 38 L60 40 L57 32 Z" />
          {/* Briefcase */}
          <rect x="36" y="32" width="7" height="6" rx="1" />
          <path d="M38 32 L38 30 L41 30 L41 32" fill="none" stroke="currentColor" strokeWidth="1" />
          {/* Dynamic Swoosh Orbit */}
          <path
            d="M31 71 C38 78 68 78 74 52"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
      );
    }

    // 16. Praesentatio (Technical Paper Presentation & Defense Research)
    if (key.includes('praesentatio') || key.includes('praesidium') || key.includes('paper')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" />
          {/* Projection Presentation Screen */}
          <rect x="48" y="27" width="4" height="4" />
          <rect x="27" y="31" width="46" height="5" rx="1" />
          {/* White Screen canvas */}
          <rect x="29" y="36" width="42" height="24" fill="none" stroke="currentColor" strokeWidth="4" />
          {/* Tripod Stand */}
          <path d="M50 60 L50 66 L38 77" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
          <path d="M50 66 L62 77" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    }

    // 17. Robogyan (Robotics & Autonomous Intelligence)
    if (key.includes('robo') || key.includes('rbg')) {
      return (
        <svg viewBox="0 0 100 100" fill="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" strokeWidth="7" />
          {/* Head */}
          <rect x="40" y="30" width="20" height="18" rx="2" />
          {/* Ear sensors */}
          <circle cx="38" cy="39" r="3" />
          <circle cx="62" cy="39" r="3" />
          {/* Neck */}
          <rect x="47" y="48" width="6" height="3" />
          {/* Body Torso */}
          <rect x="42" y="51" width="16" height="16" rx="2" />
          <circle cx="50" cy="56" r="1.5" fill="#080808" />
          {/* Claw Arms */}
          <g fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {/* Left Arm & Claw */}
            <line x1="42" y1="57" x2="35" y2="57" />
            <path d="M32 50 C28 52 28 62 32 64" strokeWidth="3" />
            {/* Right Arm & Claw */}
            <line x1="58" y1="57" x2="65" y2="57" />
            <path d="M68 50 C72 52 72 62 68 64" strokeWidth="3" />
          </g>
          {/* Legs & Feet */}
          <rect x="45" y="67" width="2.5" height="5" />
          <rect x="52.5" y="67" width="2.5" height="5" />
          <polygon points="40,73 48,73 47,71 42,71" />
          <polygon points="52,73 60,73 58,71 53,71" />
        </svg>
      );
    }

    // Default Fallback
    return (
      <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="44" strokeWidth="6" />
        <polygon points="50,25 75,70 25,70" strokeWidth="4" />
      </svg>
    );
  };

  return (
    <div
      style={style}
      className={`inline-flex items-center justify-center shrink-0 aspect-square ${className} ${
        glow ? 'drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]' : ''
      }`}
    >
      {getLogoContent()}
    </div>
  );
};
