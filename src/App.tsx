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
import { ParticipantFormData, registerParticipant, updateParticipantLiveScore, getStoredParticipant } from './utils/supabase/participants';
import { ParticipantLoginPage } from './components/ParticipantLoginPage';

// Helper to reliably count total solved questions across all domains
const getTotalSolvedCount = (solvedMap: Record<string, number[]>): number =>
  (Object.values(solvedMap) as number[][]).reduce((acc: number, l: number[]) => acc + (Array.isArray(l) ? l.length : 0), 0);

export default function App() {
  const [screen, setScreen] = useState<AppScreen>('welcome');
  const [activeTab, setActiveTab] = useState<AppTab>('map');
  const [selectedPortalId, setSelectedPortalId] = useState<string | null>(null);

  // Participant State
  const [currentParticipant, setCurrentParticipant] = useState<ParticipantFormData | null>(null);
  const [participantDbId, setParticipantDbId] = useState<string | null>(null);
  const currentParticipantRef = useRef<ParticipantFormData | null>(null);
  const participantDbIdRef = useRef<string | null>(null);
  const [isSyncingScore, setIsSyncingScore] = useState<boolean>(false);
  const [scoreSynced, setScoreSynced] = useState<boolean>(false);
  
  // Quest state (Calibrated for Min: 50 PTS, Max: 250 PTS)
  const MIN_SCORE = 50;
  const MAX_SCORE = 250;
  const [timeRemaining, setTimeRemaining] = useState<number>(180); // 3 minutes = 180s
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [score, setScore] = useState<number>(MIN_SCORE);
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

  // Calculate rank from score and completed count
  const getRank = (sc: number, comp: number) => {
    if (sc >= 220 || comp >= 17) return 'AARUUSH CHAMPION';
    if (sc >= 170 || comp >= 12) return 'CYBER PRODIGY';
    if (sc >= 110 || comp >= 7) return 'GRID TACTICIAN';
    return 'TECH INITIATE';
  };

  // Real-time synchronization to Supabase database
  const syncScoreToDatabase = (
    currentScore: number,
    completedCount: number,
    totalSolvedCount: number,
    timeRemainingSec: number
  ) => {
    const p = currentParticipantRef.current;
    const dbId = participantDbIdRef.current;
    if (!p && !dbId) return;

    const rank = getRank(currentScore, completedCount);
    updateParticipantLiveScore(dbId, p, {
      score: currentScore,
      completedPortals: completedCount,
      totalSolvedQuestions: totalSolvedCount,
      timeSpentSec: Math.max(0, 180 - timeRemainingSec),
      rank,
    }).catch((err) => console.warn('Live score sync error:', err));
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
          // Real-time periodic database update every 10 seconds
          if (prev % 10 === 0) {
            const allSolved = getTotalSolvedCount(solvedQuestions);
            syncScoreToDatabase(score, completedPortals.length, allSolved, prev);
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, screen, score, completedPortals, solvedQuestions]);

  // Start Quest
  const handleStartQuest = async (participantData?: ParticipantFormData) => {
    if (participantData) {
      setCurrentParticipant(participantData);
      currentParticipantRef.current = participantData;
      setParticipantDbId(null);
      participantDbIdRef.current = null;
      try {
        localStorage.removeItem('aaruush_quest_participant_db_id');
      } catch (e) {}

      try {
        const res = await registerParticipant(participantData);
        if (res.id) {
          setParticipantDbId(res.id);
          participantDbIdRef.current = res.id;
        }
      } catch (err) {
        console.warn('Participant DB registration warning:', err);
      }
    }
    setScoreSynced(false);
    setIsSyncingScore(false);
    setTimeRemaining(180);
    setScore(MIN_SCORE);
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

  // Prevent data loss if tab is closed or reloaded mid-game
  useEffect(() => {
    const handleBeforeUnload = () => {
      const p = currentParticipantRef.current;
      const dbId = participantDbIdRef.current;
      if (p || dbId) {
        const allSolved = getTotalSolvedCount(solvedQuestions);
        syncScoreToDatabase(score, completedPortals.length, allSolved, timeRemaining);
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [score, completedPortals, solvedQuestions, timeRemaining]);

  // Sync score with Supabase database when quest is completed
  useEffect(() => {
    if (screen === 'completed' && (currentParticipant || participantDbIdRef.current)) {
      setIsSyncingScore(true);
      const totalSolved = getTotalSolvedCount(solvedQuestions);
      const rank = getRank(score, completedPortals.length);

      updateParticipantLiveScore(participantDbIdRef.current, currentParticipant, {
        score,
        completedPortals: completedPortals.length,
        totalSolvedQuestions: totalSolved,
        timeSpentSec: 180 - timeRemaining,
        rank,
      }).then((res) => {
        setIsSyncingScore(false);
        if (res.success) {
          setScoreSynced(true);
        }
      }).catch((err) => {
        console.warn('Score sync warning:', err);
        setIsSyncingScore(false);
      });
    }
  }, [screen]);

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

  // Real-time answer recording with anti-exploit verification & calibrated [50, 250] scoring
  const handleRecordAnswer = (
    portalId: string,
    questionIndex: number,
    isCorrect: boolean,
    timeSpentSec: number,
    basePoints: number = 2
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

    // Standardized Marks Breakdown calibrated for [50, 250]:
    // Base marks: 2 pts per question (85 questions = 170 base pts)
    const earnedBase = basePoints > 0 ? basePoints : 2;

    // Speed bonus: +1 pt if answered within timeBonusLimitSec (10s)
    const timeLimit = questionsList[questionIndex]?.timeBonusLimitSec || 10;
    const speedBonus = timeSpentSec <= timeLimit ? 1 : 0;

    // Streak bonus: +1 pt if streak >= 2
    const nextStreak = streak + 1;
    const streakBonus = nextStreak >= 2 ? 1 : 0;

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
      domainClearBonus = 1; // +1 pt Domain Mastery Clearance Bonus
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
    const nextScore = Math.min(MAX_SCORE, Math.max(MIN_SCORE, score + totalEarnedThis));
    const nextCompletedCount = (domainClearBonus > 0 && !completedPortals.includes(portalId))
      ? completedPortals.length + 1
      : completedPortals.length;

    const allSolvedCount = getTotalSolvedCount(solvedQuestions) + (isAlreadySolved ? 0 : 1);

    // Strictly enforce minimum 50 and maximum 250
    setScore(nextScore);
    setStreak(nextStreak);
    setMaxStreak((prevMax) => Math.max(prevMax, nextStreak));

    // Live update to Supabase in real-time immediately!
    syncScoreToDatabase(nextScore, nextCompletedCount, allSolvedCount, timeRemaining);

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
          onOpenLogin={() => setScreen('login')}
          participant={currentParticipant}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
        />
      )}

      {/* 1b. Dedicated 5-Component Participant Login Screen */}
      {screen === 'login' && (
        <ParticipantLoginPage
          currentParticipant={currentParticipant}
          onStartQuest={(data) => {
            handleStartQuest(data);
          }}
          onBackToWelcome={() => {
            setScreen('welcome');
          }}
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
          participant={currentParticipant}
          isSyncingScore={isSyncingScore}
          scoreSynced={scoreSynced}
          onPlayAgain={() => {
            setCurrentParticipant(null);
            setScreen('welcome');
          }}
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
