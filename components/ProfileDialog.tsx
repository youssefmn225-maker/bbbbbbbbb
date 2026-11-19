'use client';

import React, { useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import {
  X,
  Instagram,
  Facebook,
  Send,
  MessageCircle,
  Sparkles,
  Zap,
  ShieldCheck,
} from 'lucide-react';

// CHANGE ME: your real links
const LINKS = {
  whatsapp: 'https://wa.me/YOUR_NUMBER',
  instagram: 'https://instagram.com/YOUR_NAME',
  telegram: 'https://t.me/YOUR_NAME',
  facebook: 'https://facebook.com/YOUR_PAGE',
};

type Card = {
  title: string;
  sub: string;
  color: string;
  href?: string;
  icon: React.ReactNode;
};

const CONTACT_CARDS: Card[] = [
  { title: 'Instagram', sub: 'Latest designs', color: '#FF4D8D', href: LINKS.instagram, icon: <Instagram size={22} /> },
  { title: 'WhatsApp', sub: 'Chat now', color: '#25D366', href: LINKS.whatsapp, icon: <MessageCircle size={22} /> },
  { title: 'Telegram', sub: 'Live support', color: '#2AABEE', href: LINKS.telegram, icon: <Send size={22} /> },
  { title: 'Facebook', sub: 'Official page', color: '#3B82F6', href: LINKS.facebook, icon: <Facebook size={22} /> },
];

const FEATURE_CARDS: Card[] = [
  { title: 'Unique creativity', sub: 'Designs you will not see twice', color: '#A78BFA', icon: <Sparkles size={22} /> },
  { title: 'Blazing performance', sub: 'Fast response everywhere', color: '#FBBF24', icon: <Zap size={22} /> },
  { title: 'Security and trust', sub: 'High security standards', color: '#34D399', icon: <ShieldCheck size={22} /> },
];

// One glass card with 3D tilt, cursor glare and a rotating gradient edge
function GlassCardItem({ card, compact }: { card: Card; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });
  const glareX = useTransform(mx, (v) => `${v * 100}%`);
  const glareY = useTransform(my, (v) => `${v * 100}%`);

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  const Wrapper: any = card.href ? motion.a : motion.div;
  const linkProps = card.href ? { href: card.href, target: '_blank', rel: 'noopener noreferrer' } : {};

  return (
    <Wrapper
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...linkProps}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      whileTap={{ scale: 0.97 }}
      className="relative block overflow-hidden rounded-3xl p-[1px]"
    >
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-40"
        style={{ background: `linear-gradient(135deg, ${card.color}, transparent 60%)` }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <div
        className={`relative rounded-3xl ${compact ? 'p-4' : 'p-5'}`}
        style={{
          background: 'rgba(255,255,255,0.07)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.12)',
        }}
      >
        <motion.div
          className="pointer-events-none absolute h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-2xl"
          style={{ left: glareX, top: glareY, background: card.color }}
        />
        <div className="relative flex items-center gap-3">
          <div
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
            style={{ background: `${card.color}22`, border: `1px solid ${card.color}44`, color: card.color }}
          >
            {card.icon}
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-white/90">{card.title}</h3>
            <p className="truncate text-xs text-white/50">{card.sub}</p>
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

export default function ProfileDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-[28px] border border-white/10 bg-black/80 p-6 md:p-8"
            style={{ boxShadow: '0 0 80px rgba(139,92,246,0.25)' }}
          >
            {/* Magic-bento style ambient glow behind the cards */}
            <div className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-purple-600/30 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-0 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />

            <button
              onClick={onClose}
              className="absolute left-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/10"
              aria-label="Close"
            >
              <X size={18} />
            </button>

            {/* Header: logo is now the profile picture */}
            <div className="relative mb-6 flex flex-col items-center text-center">
              {/* CHANGE ME: your logo path inside the public folder */}
              <img
                src="/logo.png"
                alt="BLACK-X"
                className="mb-3 h-20 w-20 rounded-2xl border border-white/10 object-cover"
              />
              <h2 className="text-3xl font-bold text-white">BLACK-X</h2>
              <p className="mt-1 text-sm text-white/60">Digital design and development studio</p>
            </div>

            {/* Three feature cards */}
            <div className="relative mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {FEATURE_CARDS.map((c) => (
                <GlassCardItem key={c.title} card={c} compact />
              ))}
            </div>

            {/* Four contact cards */}
            <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CONTACT_CARDS.map((c) => (
                <GlassCardItem key={c.title} card={c} />
              ))}
            </div>

            {/* Filler ideas component goes here: see File 2 */}
            <div id="profile-extras" className="relative mt-4" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
