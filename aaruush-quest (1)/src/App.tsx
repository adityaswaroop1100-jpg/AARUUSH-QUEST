import React, { useState, useEffect, useRef } from 'react';
import { DOMAIN_PORTALS } from './data/portals';
import { AppScreen, AppTab, DomainPortal } from './types';
import { WelcomeScreen } from './components/WelcomeScreen';
import { CyberMap } from './components/CyberMap';
import { ChallengeModal } from './components/ChallengeModal';
import { QuestCompleteScreen } from './components/QuestCompleteScreen';
import { PortalsListView } from './components/PortalsListView';
import { StatusView } from './components/StatusView';
import { InventoryView } from './components/InventoryView';
import { FestivalScheduleModal } from './components/FestivalScheduleModal';
import { sound } from './utils/audio';

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [activeTab, setActiveTab] = useState<AppTab>('map');
  const [selectedPortalId, setSelectedPortalId] = useState<string | null>(null);
  
  // Quest state
  const [timeRemaining, setTimeRemaining] = useState<number>(180); // 3 minutes = 180s
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [completedPortals, setCompletedPortals] = useState<string[]>([]);
  const [failedPortals, setFailedPortals] = useState<string[]>([]);
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);

  // Power-ups
  const [powerUps, setPowerUps] = useState({
    timeWarp: 1,
    neuralHint: 2,
    overcharge: 1,
  });
  const [isOverchargeActive, setIsOverchargeActive] = useState<boolean>(false);

  // Sound and Modals
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showScheduleModal, setShowScheduleModal] = useState<boolean>(false);

  const portals = DOMAIN_PORTALS;

  // Toggle Sound
  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playClick();
  };

  // Timer Countdown Effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isTimerActive && (screen === 'map' || screen === 'challenge')) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            // Quest Over
            setIsTimerActive(false);
            setScreen('completed');
            return 0;
          }
          if (prev <= 10) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, screen]);

  // Start Quest
  const handleStartQuest = () => {
    setTimeRemaining(180);
    setScore(0);
    setCompletedPortals([]);
    setFailedPortals([]);
    setStreak(0);
    setMaxStreak(0);
    setPowerUps({
      timeWarp: 1,
      neuralHint: 2,
      overcharge: 1,
    });
    setIsOverchargeActive(false);
    setIsTimerActive(true);
    setActiveTab('map');
    setSelectedPortalId(null);
    setScreen('map');
  };

  // Select a portal to challenge
  const handleSelectPortal = (portalId: string) => {
    setSelectedPortalId(portalId);
    setScreen('challenge');
  };

  // Solve Challenge
  const handleSolveChallenge = (portalId: string, isCorrect: boolean, timeSpentSec: number) => {
    const portal = portals.find((p) => p.id === portalId);
    if (!portal) return;

    if (isCorrect) {
      const isFirstCompletion = !completedPortals.includes(portalId);
      
      if (isFirstCompletion) {
        setCompletedPortals((prev) => [...prev, portalId]);
      }

      // Calculate score
      let earnedPoints = portal.challenge.basePoints;

      // Speed bonus
      if (timeSpentSec <= portal.challenge.timeBonusLimitSec) {
        earnedPoints += 10;
      }

      // Streak bonus
      const currentStreak = streak + 1;
      earnedPoints += Math.min(15, currentStreak * 2);

      // Overcharge multiplier
      if (isOverchargeActive) {
        earnedPoints *= 2;
        setIsOverchargeActive(false);
      }

      setScore((prev) => prev + earnedPoints);
      setStreak((prev) => {
        const next = prev + 1;
        setMaxStreak((m) => Math.max(m, next));
        return next;
      });

      // Check if all 17 portals completed
      const totalCompletedAfterThis = isFirstCompletion ? completedPortals.length + 1 : completedPortals.length;
      if (totalCompletedAfterThis >= portals.length) {
        setTimeout(() => {
          setIsTimerActive(false);
          setScreen('completed');
        }, 1200);
        return;
      }
    } else {
      if (!failedPortals.includes(portalId)) {
        setFailedPortals((prev) => [...prev, portalId]);
      }
      setStreak(0);
    }

    // Return to map screen
    setScreen('map');
    setSelectedPortalId(null);
  };

  // Use Time Warp Power-up
  const handleUseTimeWarp = () => {
    if (powerUps.timeWarp > 0) {
      setPowerUps((prev) => ({ ...prev, timeWarp: prev.timeWarp - 1 }));
      setTimeRemaining((prev) => prev + 30);
    }
  };

  // Use Overcharge Power-up
  const handleUseOvercharge = () => {
    if (powerUps.overcharge > 0 && !isOverchargeActive) {
      setPowerUps((prev) => ({ ...prev, overcharge: prev.overcharge - 1 }));
      setIsOverchargeActive(true);
    }
  };

  // Use Hint in Challenge
  const handleUseHint = () => {
    if (powerUps.neuralHint > 0) {
      setPowerUps((prev) => ({ ...prev, neuralHint: prev.neuralHint - 1 }));
      return true;
    }
    return false;
  };

  // Render current screen
  const currentPortal = portals.find((p) => p.id === selectedPortalId);

  return (
    <div className="w-full min-h-screen bg-[#080808] text-[#e4e1e9]">
      {/* 1. Welcome Screen */}
      {screen === 'welcome' && (
        <WelcomeScreen
          onStartQuest={handleStartQuest}
          onOpenSchedule={() => setShowScheduleModal(true)}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* 2. Main Quest Dashboard (Map / Portals / Status / Inventory) */}
      {screen === 'map' && (
        <div className="h-screen w-full flex flex-col justify-between">
          {activeTab === 'map' && (
            <CyberMap
              portals={portals}
              completedPortals={completedPortals}
              failedPortals={failedPortals}
              timeRemaining={timeRemaining}
              score={score}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              onSelectPortal={handleSelectPortal}
              onCompleteQuest={() => {
                setIsTimerActive(false);
                setScreen('completed');
              }}
            />
          )}

          {activeTab === 'portals' && (
            <div className="h-screen w-full flex flex-col justify-between bg-[#080808]">
              {/* Header Bar */}
              <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0e0e13]/80 backdrop-blur-md">
                <div className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-white">
                  AARUUSH QUEST // PORTALS
                </div>
                <div className="font-mono text-sm text-cyan-300 font-bold bg-cyan-950/60 px-3 py-1 rounded border border-cyan-500/30">
                  ⏱ {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                </div>
              </header>

              <PortalsListView
                portals={portals}
                completedPortals={completedPortals}
                failedPortals={failedPortals}
                onSelectPortal={handleSelectPortal}
              />

              {/* Bottom Nav Bar */}
              <footer className="w-full border-t border-white/10 bg-[#0e0e13]/90 px-4 py-2">
                <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
                  {(['map', 'portals', 'status', 'inventory'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        sound.playClick();
                        setActiveTab(tab);
                      }}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all capitalize font-mono text-xs cursor-pointer ${
                        activeTab === tab ? 'text-[#00f0ff] font-bold drop-shadow-[0_0_8px_#00f0ff]' : 'text-white/50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </footer>
            </div>
          )}

          {activeTab === 'status' && (
            <div className="h-screen w-full flex flex-col justify-between bg-[#080808]">
              {/* Header Bar */}
              <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0e0e13]/80 backdrop-blur-md">
                <div className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-white">
                  AARUUSH QUEST // LIVE TELEMETRY
                </div>
                <div className="font-mono text-sm text-amber-300 font-bold bg-amber-950/60 px-3 py-1 rounded border border-amber-500/30">
                  {score} PTS
                </div>
              </header>

              <StatusView
                portals={portals}
                completedPortals={completedPortals}
                failedPortals={failedPortals}
                score={score}
                streak={streak}
                maxStreak={maxStreak}
                timeRemaining={timeRemaining}
              />

              {/* Bottom Nav Bar */}
              <footer className="w-full border-t border-white/10 bg-[#0e0e13]/90 px-4 py-2">
                <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
                  {(['map', 'portals', 'status', 'inventory'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        sound.playClick();
                        setActiveTab(tab);
                      }}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all capitalize font-mono text-xs cursor-pointer ${
                        activeTab === tab ? 'text-[#00f0ff] font-bold drop-shadow-[0_0_8px_#00f0ff]' : 'text-white/50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </footer>
            </div>
          )}

          {activeTab === 'inventory' && (
            <div className="h-screen w-full flex flex-col justify-between bg-[#080808]">
              {/* Header Bar */}
              <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0e0e13]/80 backdrop-blur-md">
                <div className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-white">
                  AARUUSH QUEST // INVENTORY
                </div>
                <div className="font-mono text-sm text-cyan-300 font-bold bg-cyan-950/60 px-3 py-1 rounded border border-cyan-500/30">
                  {completedPortals.length} ARTIFACTS
                </div>
              </header>

              <InventoryView
                portals={portals}
                completedPortals={completedPortals}
                powerUps={powerUps}
                onUseTimeWarp={handleUseTimeWarp}
                onUseOvercharge={handleUseOvercharge}
                isOverchargeActive={isOverchargeActive}
              />

              {/* Bottom Nav Bar */}
              <footer className="w-full border-t border-white/10 bg-[#0e0e13]/90 px-4 py-2">
                <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
                  {(['map', 'portals', 'status', 'inventory'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        sound.playClick();
                        setActiveTab(tab);
                      }}
                      className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all capitalize font-mono text-xs cursor-pointer ${
                        activeTab === tab ? 'text-[#00f0ff] font-bold drop-shadow-[0_0_8px_#00f0ff]' : 'text-white/50'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </footer>
            </div>
          )}
        </div>
      )}

      {/* 3. Micro Challenge Screen (Matches Image 7) */}
      {screen === 'challenge' && currentPortal && (
        <ChallengeModal
          portal={currentPortal}
          timeRemaining={timeRemaining}
          completedCount={completedPortals.length}
          totalPortals={portals.length}
          onSolveChallenge={handleSolveChallenge}
          onBackToMap={() => {
            sound.playClick();
            setScreen('map');
          }}
          onUseHint={handleUseHint}
          hintCount={powerUps.neuralHint}
        />
      )}

      {/* 4. Quest Complete / Rank Screen (Matches Image 5) */}
      {screen === 'completed' && (
        <QuestCompleteScreen
          score={score}
          completedCount={completedPortals.length}
          totalPortals={portals.length}
          totalTimeSec={180 - timeRemaining}
          onPlayAgain={handleStartQuest}
          onViewSchedule={() => setShowScheduleModal(true)}
        />
      )}

      {/* Festival Schedule Modal */}
      {showScheduleModal && (
        <FestivalScheduleModal onClose={() => setShowScheduleModal(false)} />
      )}
    </div>
  );
}
