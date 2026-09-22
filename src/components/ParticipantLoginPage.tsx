import React, { useState, useEffect } from 'react';
import { User, CreditCard, Mail, Phone, Fingerprint, Rocket, ArrowLeft, AlertCircle, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ParticipantFormData, getStoredParticipant } from '../utils/supabase/participants';
import { sound } from '../utils/audio';
import { AaruushLogo } from './AaruushLogo';

interface ParticipantLoginPageProps {
  onStartQuest: (data: ParticipantFormData) => void;
  onBackToWelcome: () => void;
  currentParticipant?: ParticipantFormData | null;
}

export const ParticipantLoginPage: React.FC<ParticipantLoginPageProps> = ({
  onStartQuest,
  onBackToWelcome,
  currentParticipant,
}) => {
  const [formData, setFormData] = useState<ParticipantFormData>({
    name: '',
    registration_number: '',
    srm_mail_id: '',
    contact_number: '',
    participant_id: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Always initialize with empty credentials every time user enters this page
  useEffect(() => {
    setFormData({
      name: '',
      registration_number: '',
      srm_mail_id: '',
      contact_number: '',
      participant_id: '',
    });
    setErrors({});
    setIsSubmitting(false);
  }, []);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Full name is required';
    if (!formData.registration_number.trim()) newErrors.registration_number = 'Registration number is required';
    if (!formData.srm_mail_id.trim()) {
      newErrors.srm_mail_id = 'SRM mail ID is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.srm_mail_id.trim())) newErrors.srm_mail_id = 'Enter a valid email address';
    }
    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else {
      const cleanPhone = formData.contact_number.replace(/\D/g, '');
      if (cleanPhone.length < 10) newErrors.contact_number = 'Enter a valid 10-digit contact number';
    }
    if (!formData.participant_id.trim()) newErrors.participant_id = 'Participant ID is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) { sound.playFail(); return; }
    setIsSubmitting(true);
    sound.playSelect();
    try { await onStartQuest(formData); } catch (err) { console.error(err); setIsSubmitting(false); }
  };

  const handleSaveOnly = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validate()) { sound.playFail(); return; }
    try {
      localStorage.setItem('aaruush_quest_participant', JSON.stringify(formData));
      setSaveSuccess(true);
      sound.playSelect();
      setTimeout(() => { onBackToWelcome(); }, 1000);
    } catch (err) { console.warn(err); onBackToWelcome(); }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between font-['Rajdhani',sans-serif] selection:bg-[#00f0ff] selection:text-[#00363a] bg-[#050508] overflow-y-auto text-white">

      {/* EXACT same hero background as WelcomeScreen */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050508]">
        <img
          alt="Ancient x AI 3D Sculpture"
          className="w-full h-full object-cover object-center filter blur-[1.5px] opacity-85 transition-all duration-700"
          src="https://lh3.googleusercontent.com/aida/AP1WRLsM7pCziVQ9Spv-OCnEuXEIqymjw0UtISQpo1csyxkPrDuAc93Es7Vc1PtVLLdeKCNBz087U3YpaRtjiEf2k_Twaa_GE1o2LpWLY3TIgukLTzjOw8gwuORLHQygouOBenUWoGb37f7u4I2fEh3XM9qYwvtIkNUuwNBXKqvD5HIauDBzii5OrRkEqJEEThdJb4kD2HGKaw5atmVOBwwH_uvwMpqoc_vQNdy1RPWrjjXkbshJiIn86ATZ7CM"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/60 via-[#050508]/25 to-[#050508]/85" />
      </div>

      {/* Same overlays as WelcomeScreen */}
      <div className="fixed inset-0 digital-grid z-0 pointer-events-none opacity-40" />
      <div className="fixed inset-0 noise-overlay z-0 mix-blend-overlay pointer-events-none opacity-60" />
      <div className="fixed top-1/4 -right-1/4 w-[500px] h-[500px] bg-[#00f0ff]/10 blur-[140px] rounded-full z-0 pointer-events-none" />
      <div className="fixed bottom-1/4 -left-1/4 w-[450px] h-[450px] bg-[#fe6b00]/10 blur-[140px] rounded-full z-0 pointer-events-none" />

      {/* Header - same pill style as WelcomeScreen */}
      <header className="relative z-20 w-full max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={() => { sound.playClick(); onBackToWelcome(); }}
          className="flex items-center gap-2 bg-[#0c0c14]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 transition-all text-xs shadow-lg cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-cyan-400" />
          <span className="font-['Rajdhani',sans-serif] font-bold tracking-wider text-sm hidden sm:inline">BACK TO WELCOME</span>
        </button>
        <div className="flex items-center gap-2 bg-[#0c0c14]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse shadow-[0_0_8px_#00f0ff]" />
          <span className="font-['Orbitron',sans-serif] text-[11px] font-bold text-cyan-300 tracking-widest uppercase">
            PARTICIPANT CLEARANCE // 5 COMPONENTS
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="relative z-10 w-full flex-grow flex flex-col items-center justify-center px-4 md:px-10 py-4 max-w-2xl mx-auto">
        <div className="w-full flex flex-col items-center text-center animate-fade-in">

          {/* Solar Sun Aura & Logo - EXACT copy from WelcomeScreen */}
          <div className="text-center w-full mb-4 flex flex-col items-center">
            <div className="relative inline-flex items-center justify-center mb-3">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-r from-[#fe6b00]/25 via-[#ffd602]/40 to-[#00f0ff]/25 blur-xl pointer-events-none animate-solar-pulse" />
              <div className="absolute top-1/2 left-1/2 pointer-events-none animate-sun-spin w-[160px] h-[160px] md:w-[190px] md:h-[190px]">
                <svg viewBox="0 0 200 200" className="w-full h-full opacity-85 drop-shadow-[0_0_10px_rgba(255,214,2,0.5)]">
                  <defs>
                    <radialGradient id="plGold" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#fff275" stopOpacity="0.9" />
                      <stop offset="40%" stopColor="#ffd602" stopOpacity="0.75" />
                      <stop offset="80%" stopColor="#fe6b00" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#ff7700" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5, 180, 202.5, 225, 247.5, 270, 292.5, 315, 337.5].map((angle, i) => (
                    <path key={angle} d={i % 2 === 0 ? "M97.5 100 L100 35 L102.5 100 Z" : "M98 100 L100 48 L102 100 Z"} fill="url(#plGold)" transform={`rotate(${angle} 100 100)`} />
                  ))}
                </svg>
              </div>
              <div className="absolute top-1/2 left-1/2 pointer-events-none animate-sun-reverse w-[140px] h-[140px] md:w-[170px] md:h-[170px]">
                <svg viewBox="0 0 200 200" className="w-full h-full opacity-60 drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]">
                  <defs>
                    <radialGradient id="plCyan" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                      <stop offset="40%" stopColor="#00f0ff" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#00f0ff" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {[11.25, 41.25, 71.25, 101.25, 131.25, 161.25, 191.25, 221.25, 251.25, 281.25, 311.25, 341.25].map((angle) => (
                    <polygon key={angle} points="98.5,100 100,42 101.5,100" fill="url(#plCyan)" transform={`rotate(${angle} 100 100)`} />
                  ))}
                </svg>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 rounded-full border border-[#ffd602]/30 shadow-[0_0_20px_rgba(255,214,2,0.35)] pointer-events-none" />
              <AaruushLogo className="relative z-10 w-24 md:w-32 h-24 md:h-32 mx-auto" />
            </div>

            <h1 className="font-['Orbitron',sans-serif] text-[36px] sm:text-[46px] leading-[1.02] font-black tracking-tight mb-1 uppercase drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
              <span className="text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]">AARUUSH</span>
              <br />
              <span className="text-[#00f0ff] glow-text-cyan tracking-wider drop-shadow-[0_0_30px_rgba(0,240,255,0.8)]">QUEST</span>
            </h1>
            <p className="font-['Rajdhani',sans-serif] text-[14px] text-amber-300/90 font-bold tracking-widest uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
              OFFICIAL PARTICIPANT REGISTRATION
            </p>
          </div>

          {/* Form - same glass-panel card style as Duration/Objective cards */}
          <div className="w-full max-w-md">

            {saveSuccess && (
              <div className="flex items-center gap-2 p-3 mb-3 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-300 font-mono">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Details saved! Returning to welcome...</span>
              </div>
            )}

            <div className="flex items-center gap-2 px-3.5 py-2.5 mb-3 rounded-xl glass-panel border-cyan-500/25 bg-[#0e0e16]/80 text-[11px] text-cyan-300/90 font-mono shadow-[0_0_12px_rgba(0,240,255,0.15)]">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>Your 5 credentials link to your live score (50–250 PTS) in the mainframe database.</span>
            </div>

            <form onSubmit={handleStart} className="space-y-2.5">

              {/* NAME */}
              <div className="glass-panel rounded-xl p-4 flex items-center gap-4 transition-all hover:border-cyan-400/60 text-left bg-[#0e0e16]/80 border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shrink-0">
                  <User className="w-5 h-5 text-cyan-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-['Rajdhani',sans-serif] text-xs text-cyan-200/70 uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1">
                    NAME <span className="text-[#fe6b00]">*</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. ADITYA SWAROOP"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full bg-transparent border-0 border-b ${errors.name ? 'border-red-500' : 'border-white/15 focus:border-cyan-400'} text-white font-['Orbitron',sans-serif] text-[13px] tracking-wider pb-0.5 placeholder:text-white/25 focus:outline-none transition-all`}
                    autoComplete="name"
                  />
                  {errors.name && <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-mono"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                </div>
              </div>

              {/* REGISTRATION NUMBER */}
              <div className="glass-panel rounded-xl p-4 flex items-center gap-4 transition-all hover:border-[#ffd602]/60 text-left bg-[#0e0e16]/80 border-amber-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <div className="p-2.5 rounded-lg bg-[#ffd602]/10 border border-[#ffd602]/30 flex items-center justify-center shrink-0">
                  <CreditCard className="w-5 h-5 text-[#ffd602]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-['Rajdhani',sans-serif] text-xs text-amber-200/70 uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1">
                    REGISTRATION NUMBER <span className="text-[#fe6b00]">*</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. RA2311003010123"
                    value={formData.registration_number}
                    onChange={(e) => setFormData({ ...formData, registration_number: e.target.value.toUpperCase() })}
                    className={`w-full bg-transparent border-0 border-b ${errors.registration_number ? 'border-red-500' : 'border-white/15 focus:border-[#ffd602]'} text-white font-['Orbitron',sans-serif] text-[13px] tracking-wider pb-0.5 placeholder:text-white/25 focus:outline-none transition-all uppercase`}
                  />
                  {errors.registration_number && <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-mono"><AlertCircle className="w-3 h-3" /> {errors.registration_number}</p>}
                </div>
              </div>

              {/* SRM MAIL ID */}
              <div className="glass-panel rounded-xl p-4 flex items-center gap-4 transition-all hover:border-cyan-400/60 text-left bg-[#0e0e16]/80 border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-cyan-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-['Rajdhani',sans-serif] text-xs text-cyan-200/70 uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1">
                    SRM MAIL ID <span className="text-[#fe6b00]">*</span>
                  </div>
                  <input
                    type="email"
                    placeholder="e.g. as1234@srmist.edu.in"
                    value={formData.srm_mail_id}
                    onChange={(e) => setFormData({ ...formData, srm_mail_id: e.target.value })}
                    className={`w-full bg-transparent border-0 border-b ${errors.srm_mail_id ? 'border-red-500' : 'border-white/15 focus:border-cyan-400'} text-white font-['Orbitron',sans-serif] text-[13px] tracking-wider pb-0.5 placeholder:text-white/25 focus:outline-none transition-all lowercase`}
                    autoComplete="email"
                  />
                  {errors.srm_mail_id && <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-mono"><AlertCircle className="w-3 h-3" /> {errors.srm_mail_id}</p>}
                </div>
              </div>

              {/* CONTACT NUMBER */}
              <div className="glass-panel rounded-xl p-4 flex items-center gap-4 transition-all hover:border-[#ff7700]/60 text-left bg-[#0e0e16]/80 border-orange-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <div className="p-2.5 rounded-lg bg-[#ff7700]/10 border border-[#ff7700]/30 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#ff7700]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-['Rajdhani',sans-serif] text-xs text-orange-200/70 uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1">
                    CONTACT NUMBER <span className="text-[#fe6b00]">*</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formData.contact_number}
                    onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                    className={`w-full bg-transparent border-0 border-b ${errors.contact_number ? 'border-red-500' : 'border-white/15 focus:border-[#ff7700]'} text-white font-['Orbitron',sans-serif] text-[13px] tracking-wider pb-0.5 placeholder:text-white/25 focus:outline-none transition-all`}
                    autoComplete="tel"
                  />
                  {errors.contact_number && <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-mono"><AlertCircle className="w-3 h-3" /> {errors.contact_number}</p>}
                </div>
              </div>

              {/* PARTICIPANT ID */}
              <div className="glass-panel rounded-xl p-4 flex items-center gap-4 transition-all hover:border-[#fe6b00]/60 text-left bg-[#0e0e16]/80 border-orange-500/20 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
                <div className="p-2.5 rounded-lg bg-[#fe6b00]/10 border border-[#fe6b00]/30 flex items-center justify-center shrink-0">
                  <Fingerprint className="w-5 h-5 text-[#fe6b00]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-['Rajdhani',sans-serif] text-xs text-orange-200/70 uppercase tracking-widest font-bold mb-0.5 flex items-center gap-1">
                    PARTICIPANT ID <span className="text-[#fe6b00]">*</span>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. AR-2026-9481"
                    value={formData.participant_id}
                    onChange={(e) => setFormData({ ...formData, participant_id: e.target.value.toUpperCase() })}
                    className={`w-full bg-transparent border-0 border-b ${errors.participant_id ? 'border-red-500' : 'border-white/15 focus:border-[#fe6b00]'} text-white font-['Orbitron',sans-serif] text-[13px] tracking-wider pb-0.5 placeholder:text-white/25 focus:outline-none transition-all uppercase`}
                  />
                  {errors.participant_id && <p className="text-[10px] text-red-400 mt-1 flex items-center gap-1 font-mono"><AlertCircle className="w-3 h-3" /> {errors.participant_id}</p>}
                </div>
              </div>

              {/* CTA Buttons - same style as WelcomeScreen START QUEST button */}
              <div className="pt-1 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 font-['Orbitron',sans-serif] text-[14px] md:text-[16px] uppercase tracking-widest bg-gradient-to-r from-[#00f0ff] via-[#7df4ff] to-[#00d0e0] text-[#00282c] px-6 py-4 shadow-[0_0_25px_rgba(0,240,255,0.6)] hover:shadow-[0_0_40px_rgba(0,240,255,0.9)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group rounded-xl font-black cursor-pointer border border-cyan-200/50 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /><span>AUTHENTICATING...</span></>
                  ) : (
                    <><span>SUBMIT & START QUEST</span><Rocket className="w-4 h-4 text-[#00282c] group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform" /></>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleSaveOnly}
                  disabled={isSubmitting}
                  className="py-4 px-6 rounded-xl border border-white/20 hover:border-cyan-400 bg-[#0c0c14]/85 hover:bg-[#151522] text-white font-['Rajdhani',sans-serif] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer backdrop-blur-md shadow-lg"
                >
                  <span>SAVE ONLY</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer - exact same as WelcomeScreen */}
      <footer className="relative z-10 w-full text-center font-['Rajdhani',sans-serif] text-[13px] md:text-[14px] text-white/80 font-bold flex justify-center items-center gap-3 pt-4 border-t border-white/10 mt-auto drop-shadow-md px-6 pb-4">
        <span className="flex items-center gap-2 uppercase tracking-widest text-cyan-300">
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] animate-ping" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#00f0ff] -ml-4" />
          SYSTEM ONLINE
        </span>
        <span className="text-white/30">|</span>
        <span className="tracking-widest text-amber-300 font-mono text-xs">SRMIST KTR FESTIVAL GRID</span>
        <span className="text-white/30">|</span>
        <span className="tracking-widest text-white/90 font-mono text-xs">v2.4.1</span>
      </footer>
    </div>
  );
};
