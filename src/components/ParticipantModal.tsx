import React, { useState, useEffect } from 'react';
import { User, CreditCard, Mail, Phone, Fingerprint, X, Rocket, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';
import { ParticipantFormData, getStoredParticipant } from '../utils/supabase/participants';
import { sound } from '../utils/audio';

interface ParticipantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ParticipantFormData) => Promise<void> | void;
}

export const ParticipantModal: React.FC<ParticipantModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
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

  // Load previously saved participant details
  useEffect(() => {
    if (isOpen) {
      const stored = getStoredParticipant();
      if (stored) {
        setFormData(stored);
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.registration_number.trim()) {
      newErrors.registration_number = 'Registration number is required (e.g. RA2311...)';
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      sound.playFail();
      return;
    }

    setIsSubmitting(true);
    sound.playSelect();

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error('Participant submission error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in font-['Rajdhani',sans-serif]">
      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-[#0d0d16] border border-cyan-500/40 rounded-2xl p-6 sm:p-7 shadow-[0_0_40px_rgba(0,240,255,0.25)] flex flex-col text-left overflow-hidden">
        
        {/* Neon Accents */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#00f0ff]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#fe6b00]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-cyan-500/20 relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-400/40 text-cyan-300">
              <Fingerprint className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <div className="font-['Orbitron',sans-serif] text-sm md:text-base font-bold text-white tracking-wider uppercase">
                PARTICIPANT CLEARANCE
              </div>
              <div className="text-xs text-cyan-400/80 font-mono tracking-wide">
                AUTHENTICATE // LINK QUEST POINTS
              </div>
            </div>
          </div>
          
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            disabled={isSubmitting}
            className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informational Banner */}
        <div className="flex items-center gap-2 p-2.5 mb-4 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-200/90 font-mono relative z-10">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Your 5 credentials are bound to your live score (50–250 PTS) in the database mainframe.</span>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 relative z-10">
          {/* 1. NAME */}
          <div>
            <label className="block text-xs font-bold tracking-widest text-white/90 uppercase mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              <span>NAME</span>
              <span className="text-[#fe6b00]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. ADITYA SWAROOP"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full bg-[#13131e]/90 border ${
                errors.name ? 'border-red-500' : 'border-white/15 focus:border-cyan-400'
              } rounded-lg px-3.5 py-2.5 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all`}
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
              <span>REGISTRATION NUMBER</span>
              <span className="text-[#fe6b00]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. RA2311003010123"
              value={formData.registration_number}
              onChange={(e) => setFormData({ ...formData, registration_number: e.target.value.toUpperCase() })}
              className={`w-full bg-[#13131e]/90 border ${
                errors.registration_number ? 'border-red-500' : 'border-white/15 focus:border-cyan-400'
              } rounded-lg px-3.5 py-2.5 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all uppercase`}
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
              <span>SRM MAIL ID</span>
              <span className="text-[#fe6b00]">*</span>
            </label>
            <input
              type="email"
              placeholder="e.g. as1234@srmist.edu.in"
              value={formData.srm_mail_id}
              onChange={(e) => setFormData({ ...formData, srm_mail_id: e.target.value })}
              className={`w-full bg-[#13131e]/90 border ${
                errors.srm_mail_id ? 'border-red-500' : 'border-white/15 focus:border-cyan-400'
              } rounded-lg px-3.5 py-2.5 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all lowercase`}
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
              <span>CONTACT NUMBER</span>
              <span className="text-[#fe6b00]">*</span>
            </label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={formData.contact_number}
              onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
              className={`w-full bg-[#13131e]/90 border ${
                errors.contact_number ? 'border-red-500' : 'border-white/15 focus:border-cyan-400'
              } rounded-lg px-3.5 py-2.5 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all`}
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
              <span>PARTICIPANT ID</span>
              <span className="text-[#fe6b00]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. AR-2026-9481"
              value={formData.participant_id}
              onChange={(e) => setFormData({ ...formData, participant_id: e.target.value.toUpperCase() })}
              className={`w-full bg-[#13131e]/90 border ${
                errors.participant_id ? 'border-red-500' : 'border-white/15 focus:border-cyan-400'
              } rounded-lg px-3.5 py-2.5 text-white font-mono text-sm placeholder:text-white/30 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all uppercase`}
            />
            {errors.participant_id && (
              <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" /> {errors.participant_id}
              </p>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full font-['Orbitron',sans-serif] text-sm md:text-base font-bold uppercase tracking-wider bg-gradient-to-r from-[#00f0ff] via-[#7df4ff] to-[#00d0e0] text-[#00282c] py-3.5 rounded-xl shadow-[0_0_20px_rgba(0,240,255,0.5)] hover:shadow-[0_0_30px_rgba(0,240,255,0.8)] hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>SYNCING MAINFRAME...</span>
                </>
              ) : (
                <>
                  <span>CONFIRM & LAUNCH QUEST</span>
                  <Rocket className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
