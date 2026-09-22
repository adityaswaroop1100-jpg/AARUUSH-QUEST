export type AppScreen = 'welcome' | 'login' | 'map' | 'challenge' | 'completed';
export type AppTab = 'map' | 'portals' | 'status' | 'inventory';

export type PortalStatus = 'available' | 'completed' | 'failed' | 'locked';
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD';

export type VisualChallengeType = 
  | 'gear_rotation'
  | 'logic_gate'
  | 'cyber_hex'
  | 'data_anomaly'
  | 'circuit_signal'
  | 'orbital_vector'
  | 'market_trend'
  | 'code_cipher'
  | 'drone_defense'
  | 'bio_sequence'
  | 'packet_route'
  | 'cad_blueprint';

export interface ChallengeOption {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
}

export interface MicroChallenge {
  title: string;
  category: string;
  description: string;
  instructions: string;
  visualType: VisualChallengeType;
  options: ChallengeOption[];
  correctOptionIndex: number;
  explanation: string;
  basePoints: number;
  timeBonusLimitSec: number;
  hint: string;
  interactiveData?: {
    gearSpeed?: number;
    initialDirection?: 'clockwise' | 'counter-clockwise';
    hexCodes?: string[];
    sequence?: string[];
    targetValue?: string;
    chartValues?: number[];
  };
}

export interface AnswerRecordResult {
  earnedPoints: number;
  basePoints: number;
  speedBonus: number;
  streakBonus: number;
  domainClearBonus: number;
  isDuplicate: boolean;
  isDomainMastered: boolean;
  totalSolvedInDomain: number;
  totalQuestionsInDomain: number;
}

export interface DomainPortal {
  id: string;
  name: string;
  code: string;
  category: string;
  symbol: string;
  description: string;
  difficulty: DifficultyLevel;
  x: number; // 0 to 100 percentage on grid map
  y: number; // 0 to 100 percentage on grid map
  connections: string[]; // Connected portal IDs
  challenge: MicroChallenge;
  challenges?: MicroChallenge[];
  rewardArtifact?: {
    name: string;
    icon: string;
    description: string;
    rarity: 'Common' | 'Rare' | 'Legendary';
  };
}

export interface Artifact {
  id: string;
  name: string;
  domain: string;
  icon: string;
  description: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  acquiredAt: number;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  icon: string;
  count: number;
  effect: 'time_boost' | 'instant_solve' | 'neural_hint';
}

export interface FestivalEvent {
  id: string;
  time: string;
  title: string;
  domain: string;
  venue: string;
  type: 'Flagship' | 'Workshop' | 'ProShow' | 'Hackathon';
  highlight?: boolean;
}
