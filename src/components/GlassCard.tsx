'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export type GlassCardData = {
  title: string;
  subtitle: string;
  color: string;
  gradient: string;
  cta: string;
  href?: string;
  icon: ReactNode;
};

export default function GlassCardItem({
  title,
  subtitle,
  color,
  gradient,
  cta,
  href,
  icon,
}: GlassCardData) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(mouseY, [0, 1], [8, -8]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [0, 1], [-8, 8]), { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const first = gradient.split(',')[0].trim();
  const second = gradient.split(',')[1]?.trim() ?? first;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="relative h-full w-full overflow-hidden rounded-3xl p-[1px]"
    >
      <motion.div
        className="absolute inset-0 rounded-3xl opacity-30"
        style={{ background: `linear-gradient(135deg, ${gradient}, transparent 60%)` }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />

      <div
        className="relative flex h-full flex-col rounded-3xl p-5"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(24px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(24px) saturate(1.8)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.12)',
        }}
      >
        <motion.div
          className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: `${color}18`, border: `1px solid ${color}22`, color }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 15 }}
        >
          {icon}
        </motion.div>

        <h3 className="mb-1 text-base font-semibold text-white/90">{title}</h3>
        <p className="mb-4 text-sm leading-relaxed text-white/40">{subtitle}</p>

        <motion.a
          href={href}
          target={href ? '_blank' : undefined}
          rel="noopener noreferrer"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="mt-auto flex w-full cursor-pointer items-center justify-between rounded-2xl px-4 py-3"
          style={{
            background: `linear-gradient(135deg, ${first}40, ${second}28)`,
            border: `1px solid ${first}55`,
            boxShadow: `0 2px 12px ${first}25`,
            transition: 'box-shadow 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.boxShadow = `0 4px 20px ${first}45`)}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = `0 2px 12px ${first}25`)}
        >
          <span className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.75)' }}>
            {cta}
          </span>
          <ArrowRight size={16} style={{ color: 'rgba(255,255,255,0.55)' }} />
        </motion.a>

        <div
          className="absolute left-6 right-6 top-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)' }}
        />
      </div>
    </motion.div>
  );
}
