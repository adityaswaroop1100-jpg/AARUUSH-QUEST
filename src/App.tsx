import React, { useState, useEffect, useRef } from 'react';
import { DOMAIN_PORTALS } from './data/portals';
import { AppScreen, AppTab, DomainPortal, AnswerRecordResult } from './types';
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
  const [solvedQuestions, setSolvedQuestions] = useState<Record<string, number[]>>({});
  const [attemptedQuestions, setAttemptedQuestions] = useState<Record<string, number[]>>({});
  const [streak, setStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [portalQuestionIndices, setPortalQuestionIndices] = useState<Record<string, number>>({});

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
    setSolvedQuestions({});
    setAttemptedQuestions({});
    setPortalQuestionIndices({});
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

  // Select a portal to challenge and resume at the first unsolved question
  const handleSelectPortal = (portalId: string) => {
    setSelectedPortalId(portalId);
    const portal = portals.find((p) => p.id === portalId);
    const qList = portal?.challenges || [portal?.challenge];
    const solved = solvedQuestions[portalId] || [];

    // Find first unsolved question index so the player resumes smoothly
    let nextUnsolved = qList.findIndex((_, idx) => !solved.includes(idx));
    if (nextUnsolved === -1) nextUnsolved = 0;

    setPortalQuestionIndices((prev) => ({
      ...prev,
      [portalId]: nextUnsolved,
    }));
    setScreen('challenge');
  };

  // Real-time answer recording with anti-exploit verification & transparent marks breakdown
  const handleRecordAnswer = (
    portalId: string,
    questionIndex: number,
    isCorrect: boolean,
    timeSpentSec: number,
    basePoints: number = 20
  ): AnswerRecordResult => {
    const portal = portals.find((p) => p.id === portalId);
    if (!portal) {
      return {
        earnedPoints: 0,
        basePoints: 0,
        speedBonus: 0,
        streakBonus: 0,
        domainClearBonus: 0,
        isDuplicate: false,
        isDomainMastered: false,
        totalSolvedInDomain: 0,
        totalQuestionsInDomain: 5,
      };
    }

    const questionsList = (portal.challenges && portal.challenges.length > 0)
      ? portal.challenges
      : [portal.challenge];
    const totalQuestions = questionsList.length;
    const currentSolved = solvedQuestions[portalId] || [];
    const isAlreadySolved = currentSolved.includes(questionIndex);

    // Track attempt
    setAttemptedQuestions((prev) => {
      const currentList = prev[portalId] || [];
      return currentList.includes(questionIndex) ? prev : { ...prev, [portalId]: [...currentList, questionIndex] };
    });

    if (!isCorrect) {
      // Wrong answer - streak resets
      setStreak(0);
      setFailedPortals((prev) => (prev.includes(portalId) ? prev : [...prev, portalId]));

      return {
        earnedPoints: 0,
        basePoints: 0,
        speedBonus: 0,
        streakBonus: 0,
        domainClearBonus: 0,
        isDuplicate: false,
        isDomainMastered: completedPortals.includes(portalId),
        totalSolvedInDomain: currentSolved.length,
        totalQuestionsInDomain: totalQuestions,
      };
    }

    // Glitch prevention: If this question was already solved, prevent double scoring / infinite point farming
    if (isAlreadySolved) {
      return {
        earnedPoints: 0,
        basePoints: 0,
        speedBonus: 0,
        streakBonus: 0,
        domainClearBonus: 0,
        isDuplicate: true,
        isDomainMastered: completedPortals.includes(portalId),
        totalSolvedInDomain: currentSolved.length,
        totalQuestionsInDomain: totalQuestions,
      };
    }

    // Standardized Marks Breakdown:
    // Base marks: 20 pts per question
    const earnedBase = basePoints > 0 ? basePoints : 20;

    // Speed bonus: +5 pts if answered within timeBonusLimitSec (10s)
    const timeLimit = questionsList[questionIndex]?.timeBonusLimitSec || 10;
    const speedBonus = timeSpentSec <= timeLimit ? 5 : 0;

    // Streak bonus: +2 pts per consecutive streak tier (max +10 pts)
    const nextStreak = streak + 1;
    const streakBonus = Math.min(10, nextStreak * 2);

    let questionPoints = earnedBase + speedBonus + streakBonus;

    // Overcharge power-up multiplier: 2x
    if (isOverchargeActive) {
      questionPoints *= 2;
      setIsOverchargeActive(false);
    }

    // Update solved questions set
    const updatedSolved = [...currentSolved, questionIndex];
    setSolvedQuestions((prev) => ({
      ...prev,
      [portalId]: updatedSolved,
    }));

    // Check if domain is now fully solved
    const isDomainMastered = updatedSolved.length >= totalQuestions;
    let domainClearBonus = 0;

    if (isDomainMastered && !completedPortals.includes(portalId)) {
      domainClearBonus = 25; // +25 pts Domain Mastery Clearance Bonus
      setCompletedPortals((prev) => {
        if (prev.includes(portalId)) return prev;
        const updated = [...prev, portalId];
        if (updated.length >= portals.length) {
          setTimeout(() => {
            setIsTimerActive(false);
            setScreen('completed');
          }, 1200);
        }
        return updated;
      });
    }

    const totalEarnedThis = questionPoints + domainClearBonus;

    setScore((prev) => prev + totalEarnedThis);
    setStreak(nextStreak);
    setMaxStreak((prevMax) => Math.max(prevMax, nextStreak));

    return {
      earnedPoints: totalEarnedThis,
      basePoints: earnedBase,
      speedBonus,
      streakBonus,
      domainClearBonus,
      isDuplicate: false,
      isDomainMastered,
      totalSolvedInDomain: updatedSolved.length,
      totalQuestionsInDomain: totalQuestions,
    };
  };

  const handleAdvancePortalQuestion = (portalId: string, nextIndex: number) => {
    setPortalQuestionIndices((prev) => ({
      ...prev,
      [portalId]: nextIndex,
    }));
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
              solvedQuestions={solvedQuestions}
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
            <div className="h-screen w-full flex flex-col bg-[#080808] overflow-hidden">
              {/* Header Bar */}
              <header className="shrink-0 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0e0e13]/80 backdrop-blur-md">
                <div className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-white">
                  AARUUSH QUEST // PORTALS
                </div>
                <div className="font-mono text-sm text-cyan-300 font-bold bg-cyan-950/60 px-3 py-1 rounded border border-cyan-500/30">
                  ⏱ {Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}
                </div>
              </header>

              <div className="flex-1 min-h-0 overflow-y-auto w-full">
                <PortalsListView
                  portals={portals}
                  completedPortals={completedPortals}
                  failedPortals={failedPortals}
                  solvedQuestions={solvedQuestions}
                  onSelectPortal={handleSelectPortal}
                />
              </div>

              {/* Bottom Nav Bar */}
              <footer className="shrink-0 w-full border-t border-white/10 bg-[#0e0e13]/90 px-4 py-2">
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
            <div className="h-screen w-full flex flex-col bg-[#080808] overflow-hidden">
              {/* Header Bar */}
              <header className="shrink-0 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0e0e13]/80 backdrop-blur-md">
                <div className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-white">
                  AARUUSH QUEST // LIVE TELEMETRY
                </div>
                <div className="font-mono text-sm text-amber-300 font-bold bg-amber-950/60 px-3 py-1 rounded border border-amber-500/30">
                  {score} PTS
                </div>
              </header>

              <div className="flex-1 min-h-0 overflow-y-auto w-full">
                <StatusView
                  portals={portals}
                  completedPortals={completedPortals}
                  failedPortals={failedPortals}
                  solvedQuestions={solvedQuestions}
                  score={score}
                  streak={streak}
                  maxStreak={maxStreak}
                  timeRemaining={timeRemaining}
                />
              </div>

              {/* Bottom Nav Bar */}
              <footer className="shrink-0 w-full border-t border-white/10 bg-[#0e0e13]/90 px-4 py-2">
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
            <div className="h-screen w-full flex flex-col bg-[#080808] overflow-hidden">
              {/* Header Bar */}
              <header className="shrink-0 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-[#0e0e13]/80 backdrop-blur-md">
                <div className="font-['Space_Grotesk',sans-serif] font-bold text-lg text-white">
                  AARUUSH QUEST // INVENTORY
                </div>
                <div className="font-mono text-sm text-cyan-300 font-bold bg-cyan-950/60 px-3 py-1 rounded border border-cyan-500/30">
                  {completedPortals.length} ARTIFACTS
                </div>
              </header>

              <div className="flex-1 min-h-0 overflow-y-auto w-full">
                <InventoryView
                  portals={portals}
                  completedPortals={completedPortals}
                  powerUps={powerUps}
                  onUseTimeWarp={handleUseTimeWarp}
                  onUseOvercharge={handleUseOvercharge}
                  isOverchargeActive={isOverchargeActive}
                />
              </div>

              {/* Bottom Nav Bar */}
              <footer className="shrink-0 w-full border-t border-white/10 bg-[#0e0e13]/90 px-4 py-2">
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
          initialQuestionIndex={portalQuestionIndices[currentPortal.id] || 0}
          timeRemaining={timeRemaining}
          score={score}
          completedCount={completedPortals.length}
          totalPortals={portals.length}
          solvedQuestionIndices={solvedQuestions[currentPortal.id] || []}
          onRecordAnswer={handleRecordAnswer}
          onAdvanceQuestion={(nextIdx) => handleAdvancePortalQuestion(currentPortal.id, nextIdx)}
          onBackToMap={() => {
            sound.playClick();
            setScreen('map');
            setSelectedPortalId(null);
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
          totalSolvedQuestions={(Object.values(solvedQuestions) as number[][]).reduce((acc, l) => acc + l.length, 0)}
          totalQuestions={portals.length * 5}
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
