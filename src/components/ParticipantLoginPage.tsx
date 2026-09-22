import React, { useState, useEffect } from 'react';
import { User, CreditCard, Mail, Phone, Fingerprint, Rocket, ArrowLeft, AlertCircle, Loader2, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { ParticipantFormData, getStoredParticipant } from '../utils/supabase/participants';
import { sound } from '../utils/audio';

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

  useEffect(() => {
    const existing = currentParticipant || getStoredParticipant();
    if (existing) {
      setFormData(existing);
    }
  }, [currentParticipant]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.registration_number.trim()) {
      newErrors.registration_number = 'Registration number is required (e.g. RA2311003010...)';
    }

    if (!formData.srm_mail_id.trim()) {
      newErrors.srm_mail_id = 'SRM mail ID is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.srm_mail_id.trim())) {
        newErrors.srm_mail_id = 'Enter a valid email address';
      }
    }

    if (!formData.contact_number.trim()) {
      newErrors.contact_number = 'Contact number is required';
    } else {
      const cleanPhone = formData.contact_number.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        newErrors.contact_number = 'Enter a valid 10-digit contact number';
      }
    }

    if (!formData.participant_id.trim()) {
      newErrors.participant_id = 'Participant ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      sound.playFail();
      return;
    }
    setIsSubmitting(true);
    sound.playSelect();
    try {
      await onStartQuest(formData);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handleSaveOnly = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!validate()) {
      sound.playFail();
      return;
    }
    try {
      localStorage.setItem('aaruush_quest_participant', JSON.stringify(formData));
      setSaveSuccess(true);
      sound.playSelect();
      setTimeout(() => {
        onBackToWelcome();
      }, 1000);
    } catch (err) {
      console.warn(err);
      onBackToWelcome();
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-between font-['Rajdhani',sans-serif] selection:bg-[#00f0ff] selection:text-[#00363a] bg-[#050508] overflow-y-auto text-white py-6 px-4">
      {/* Hero Image Layer - Exact same background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050508]">
        <img
          alt="Ancient x AI 3D Sculpture"
          className="w-full h-full object-cover object-center filter blur-[2px] opacity-75"
          src="https://lh3.googleusercontent.com/aida/AP1WRLsM7pCziVQ9Spv-OCnEuXEIqymjw0UtISQpo1csyxkPrDuAc93Es7Vc1PtVLLdeKCNBz087U3YpaRtjiEf2k_Twaa_GE1o2LpWLY3TIgukLTzjOw8gwuORLHQygouOBenUWoGb37f7u4I2fEh3XM9qYwvtIkNUuwNBXKqvD5HIauDBzii5OrRkEqJEEThdJb4kD2HGKaw5atmVOBwwH_uvwMpqoc_vQNdy1RPWrjjXkbshJiIn86ATZ7CM"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050508]/75 via-[#050508]/40 to-[#050508]/90" />
      </div>

      {/* Cyber Overlays */}
      <div className="fixed inset-0 digital-grid z-0 pointer-events-none opacity-40" />
      <div className="fixed inset-0 noise-overlay z-0 mix-blend-overlay pointer-events-none opacity-60" />
      <div className="fixed top-1/4 -right-1/4 w-[500px] h-[500px] bg-[#00f0ff]/10 blur-[140px] rounded-full z-0 pointer-events-none" />
      <div className="fixed bottom-1/4 -left-1/4 w-[450px] h-[450px] bg-[#fe6b00]/10 blur-[140px] rounded-full z-0 pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-4xl mx-auto flex items-center justify-between mb-4">
        <button
          onClick={() => {
            sound.playClick();
            onBackToWelcome();
          }}
          className="p-2 rounded-full bg-[#0c0c14]/80 border border-white/20 hover:border-cyan-400 text-white hover:text-cyan-300 transition-all text-xs flex items-center gap-2 px-4 backdrop-blur-md cursor-pointer shadow-lg"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span className="font-['Rajdhani',sans-serif] font-bold tracking-wider text-sm">BACK TO WELCOME</span>
        </button>

        <div className="flex items-center gap-2 bg-[#0c0c14]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-cyan-500/30 shadow-[0_0_12px_rgba(0,240,255,0.2)]">
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
          <span className="font-['Orbitron',sans-serif] text-[11px] font-bold text-cyan-300 tracking-widest uppercase">
            PARTICIPANT CLEARANCE // 5 COMPONENTS
          </span>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 w-full max-w-xl mx-auto flex flex-col items-center my-auto animate-fade-in">
        
        {/* Logo Emblem Header */}
        <div className="flex items-center gap-3 mb-4">
          <img
            alt="Aaruush Logo"
            className="w-12 h-auto object-contain filter drop-shadow-[0_0_15px_rgba(255,214,2,0.8)]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCcnDZtIgxYsJkIok4wSdJNN7Ic_e9h03oJ89fvWdyZ3_lx2oF-lBhCXhPtQI_OgM9vko2Nnt-o5iTXgrZFe9lMsl81KLNfVHR7BERRgfWjFkxmRGj102GhIHwjhgLVXmOx90-zqeyW9P6rSGg5ikrDF8Xv12IUEXqaVP6Woc9XoQ3c5yXMw8yTMu0FRhyLJP5O1U4R5iedknOCLZMro_tRmcshhaibwc4azfbZ6ZUQi0a4HIFg_6yP-QPU2t1DhYGgzPg"
          />
          <div className="text-left">
            <h1 className="font-['Orbitron',sans-serif] text-2xl font-black tracking-wider text-white">
              AARUUSH <span className="text-[#00f0ff] glow-text-cyan">QUEST</span>
            </h1>
            <p className="text-xs text-amber-300 font-mono tracking-widest uppercase">
              OFFICIAL PARTICIPANT REGISTRATION
            </p>
          </div>
        </div>

        {/* The Cyber Form Panel */}
        <div className="w-full glass-panel bg-[#0d0d16]/90 border border-cyan-500/40 rounded-2xl p-6 sm:p-8 shadow-[0_0_40px_rgba(0,240,255,0.25)] text-left relative overflow-hidden">
          
          <div className="flex items-center gap-2.5 p-3 mb-5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200/90 font-mono">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Enter the 5 required components. They will be bound to your live game points (50–250 PTS) in Supabase.</span>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-emerald-950/60 border border-emerald-500/50 text-xs text-emerald-300 font-mono animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Details saved locally! Returning to welcome screen...</span>
            </div>
          )}

          <form onSubmit={handleStart} className="space-y-4">
            {/* 1. NAME */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-white/90 uppercase mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" />
                <span>1. NAME</span>
                <span className="text-[#fe6b00]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. ADITYA SWAROOP"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full bg-[#13131e] border ${
                  errors.name ? 'border-red-500' : 'border-white/20 focus:border-cyan-400'
                } rounded-lg px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all`}
                autoComplete="name"
              />
              {errors.name && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            {/* 2. REGISTRATION NUMBER */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-white/90 uppercase mb-1 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#ffd602]" />
                <span>2. REGISTRATION NUMBER</span>
                <span className="text-[#fe6b00]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. RA2311003010123"
                value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value.toUpperCase() })}
                className={`w-full bg-[#13131e] border ${
                  errors.registration_number ? 'border-red-500' : 'border-white/20 focus:border-cyan-400'
                } rounded-lg px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all uppercase`}
              />
              {errors.registration_number && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" /> {errors.registration_number}
                </p>
              )}
            </div>

            {/* 3. SRM MAIL ID */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-white/90 uppercase mb-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>3. SRM MAIL ID</span>
                <span className="text-[#fe6b00]">*</span>
              </label>
              <input
                type="email"
                placeholder="e.g. as1234@srmist.edu.in"
                value={formData.srm_mail_id}
                onChange={(e) => setFormData({ ...formData, srm_mail_id: e.target.value })}
                className={`w-full bg-[#13131e] border ${
                  errors.srm_mail_id ? 'border-red-500' : 'border-white/20 focus:border-cyan-400'
                } rounded-lg px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all lowercase`}
                autoComplete="email"
              />
              {errors.srm_mail_id && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" /> {errors.srm_mail_id}
                </p>
              )}
            </div>

            {/* 4. CONTACT NUMBER */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-white/90 uppercase mb-1 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-green-400" />
                <span>4. CONTACT NUMBER</span>
                <span className="text-[#fe6b00]">*</span>
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={formData.contact_number}
                onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
                className={`w-full bg-[#13131e] border ${
                  errors.contact_number ? 'border-red-500' : 'border-white/20 focus:border-cyan-400'
                } rounded-lg px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all`}
                autoComplete="tel"
              />
              {errors.contact_number && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" /> {errors.contact_number}
                </p>
              )}
            </div>

            {/* 5. PARTICIPANT ID */}
            <div>
              <label className="block text-xs font-bold tracking-widest text-white/90 uppercase mb-1 flex items-center gap-1.5">
                <Fingerprint className="w-3.5 h-3.5 text-[#fe6b00]" />
                <span>5. PARTICIPANT ID</span>
                <span className="text-[#fe6b00]">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. AR-2026-9481"
                value={formData.participant_id}
                onChange={(e) => setFormData({ ...formData, participant_id: e.target.value.toUpperCase() })}
                className={`w-full bg-[#13131e] border ${
                  errors.participant_id ? 'border-red-500' : 'border-white/20 focus:border-cyan-400'
                } rounded-lg px-4 py-3 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all uppercase`}
              />
              {errors.participant_id && (
                <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3 h-3" /> {errors.participant_id}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="pt-3 flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 font-['Orbitron',sans-serif] text-sm md:text-base font-bold uppercase tracking-wider bg-gradient-to-r from-[#00f0ff] via-[#7df4ff] to-[#00d0e0] text-[#00282c] py-4 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>AUTHENTICATING...</span>
                  </>
                ) : (
                  <>
                    <span>SUBMIT & START QUEST</span>
                    <Rocket className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSaveOnly}
                disabled={isSubmitting}
                className="py-4 px-6 rounded-xl border border-white/20 hover:border-cyan-400 bg-[#1b1b26] hover:bg-[#232332] text-white font-['Rajdhani',sans-serif] font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>SAVE ONLY</span>
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center font-['Rajdhani',sans-serif] text-xs text-white/60 font-bold flex justify-center items-center gap-3 pt-4 border-t border-white/10 mt-6">
        <span className="text-cyan-400">SRMIST FESTIVAL MAINFRAME</span>
        <span className="text-white/20">|</span>
        <span className="text-amber-400 font-mono">SUPABASE CONNECTED</span>
      </footer>
    </div>
  );
};
