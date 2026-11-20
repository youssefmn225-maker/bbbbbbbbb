'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, ChevronsUpDown } from 'lucide-react';

const glassPanel = {
  background: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow:
    '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 0 rgba(255,255,255,0), 0 0 0 rgba(255,255,255,0)',
};

const glassPanelBlur = {
  backdropFilter: 'blur(24px) saturate(1.8)',
  WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
};

const ACTIVE_GLOW =
  '0 8px 40px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 1.5px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.08)';

function MenuItem({
  label,
  color,
  onClick,
  children,
}: {
  label: string;
  color: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: 0.06 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5"
      style={{ minHeight: 44, background: 'transparent' }}
    >
      <motion.button
        onClick={onClick}
        animate={{ x: hovered ? 3 : 0, scale: hovered ? 1.08 : 1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 320, damping: 20 }}
        className="flex min-w-0 flex-1 cursor-pointer items-center gap-2.5"
        style={{ background: 'transparent', transformOrigin: 'left center' }}
      >
        <div
          className="flex shrink-0 items-center justify-center rounded-xl"
          style={{ width: 32, height: 32, background: `${color}18`, border: `1px solid ${color}22`, color }}
        >
          {children}
        </div>
        <span
          className="text-sm font-medium"
          style={{
            color: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.70)',
            transition: 'color 0.15s',
          }}
        >
          {label}
        </span>
      </motion.button>
    </motion.div>
  );
}

export default function GlassUserMenu({
  logo,
  name,
  onOpenProfile,
}: {
  logo: string;
  name: string;
  onOpenProfile: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative flex flex-col items-center">
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        animate={{ boxShadow: open ? ACTIVE_GLOW : glassPanel.boxShadow }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
        className="relative isolate flex cursor-pointer items-center gap-2 rounded-2xl px-4 py-2.5"
        style={{ background: glassPanel.background, border: glassPanel.border }}
      >
        <div className="pointer-events-none absolute inset-0 z-[-1] rounded-2xl" style={glassPanelBlur} />
        <img src={logo} alt={name} className="h-8 w-8 shrink-0 rounded-full object-cover" />
        <span className="text-sm font-semibold text-white/80">{name}</span>
        <ChevronsUpDown size={16} className="text-white/40" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: -8, filter: 'blur(4px)' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: -8, filter: 'blur(4px)' }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            className="absolute left-1/2 top-full z-50 mt-2 w-[min(256px,calc(100vw-32px))] rounded-2xl p-2"
            style={{ ...glassPanel, ...glassPanelBlur, transformOrigin: 'top center' }}
          >
            <p className="mb-0.5 px-3 pt-1 text-[10px] font-semibold uppercase tracking-widest text-white/25">
              Account
            </p>
            <MenuItem
              label="Profile"
              color="#A78BFA"
              onClick={() => {
                setOpen(false);
                onOpenProfile();
              }}
            >
              <User size={16} />
            </MenuItem>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
