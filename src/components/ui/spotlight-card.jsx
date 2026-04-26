import { useEffect, useRef } from 'react';
import './spotlight-card.css';

const glowColorMap = {
  blue: { base: 220, spread: 200 },
  purple: { base: 280, spread: 300 },
  green: { base: 120, spread: 200 },
  red: { base: 0, spread: 200 },
  orange: { base: 30, spread: 200 },
  gold: { base: 45, spread: 200 } // CMSVize special
};

const sizeMap = {
  sm: 'w-48 h-64',
  md: 'w-64 h-80',
  lg: 'w-80 h-96'
};

const GlowCard = ({ 
  children, 
  className = '', 
  glowColor = 'gold', // Default to CMSVize gold
  size = 'md',
  width,
  height,
  customSize = false
}) => {
  const cardRef = useRef(null);
  const innerRef = useRef(null);

  useEffect(() => {
    // Only enable glow effect on desktop with fine pointer (mouse)
    const isDesktop = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isDesktop) return;

    const syncPointer = (e) => {
      const { clientX: x, clientY: y } = e;
      
      if (cardRef.current) {
        cardRef.current.style.setProperty('--x', x.toFixed(2));
        cardRef.current.style.setProperty('--xp', (x / window.innerWidth).toFixed(2));
        cardRef.current.style.setProperty('--y', y.toFixed(2));
        cardRef.current.style.setProperty('--yp', (y / window.innerHeight).toFixed(2));
      }
    };

    document.addEventListener('pointermove', syncPointer, { passive: true });
    return () => document.removeEventListener('pointermove', syncPointer);
  }, []);

  const { base, spread } = glowColorMap[glowColor] || glowColorMap['gold'];

  const getSizeClasses = () => {
    if (customSize) {
      return ''; 
    }
    return sizeMap[size];
  };

  const getInlineStyles = () => {
    const isDesktop = typeof window !== 'undefined' && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const baseStyles = {
      '--base': base,
      '--spread': spread,
      '--radius': '14',
      '--border': '1', // Refined border
      '--backdrop': 'rgba(255, 255, 255, 0.02)',
      '--backup-border': 'rgba(255, 255, 255, 0.05)',
      '--size': '300', // Bigger glow
      '--outer': '1',
      '--border-size': 'calc(var(--border, 1) * 1px)',
      '--spotlight-size': 'calc(var(--size, 150) * 1px)',
      '--hue': 'calc(var(--base) + (var(--xp, 0) * var(--spread, 0)))',
      backgroundColor: 'var(--backdrop, transparent)',
      backgroundSize: 'calc(100% + (2 * var(--border-size))) calc(100% + (2 * var(--border-size)))',
      backgroundPosition: '50% 50%',
      border: 'var(--border-size) solid var(--backup-border)',
      position: 'relative',
      touchAction: isDesktop ? 'none' : 'auto',
    };

    if (isDesktop) {
      baseStyles.backgroundImage = `radial-gradient(
        var(--spotlight-size) var(--spotlight-size) at
        calc(var(--x, 0) * 1px)
        calc(var(--y, 0) * 1px),
        hsl(var(--hue, 210) calc(var(--saturation, 100) * 1%) calc(var(--lightness, 70) * 1%) / var(--bg-spot-opacity, 0.08)), transparent
      )`;
      baseStyles.backgroundAttachment = 'fixed';
    } else {
      baseStyles.backgroundAttachment = 'initial';
    }

    if (width !== undefined) {
      baseStyles.width = typeof width === 'number' ? `${width}px` : width;
    }
    if (height !== undefined) {
      baseStyles.height = typeof height === 'number' ? `${height}px` : height;
    }

    return baseStyles;
  };

  return (
    <>
      <div
        ref={cardRef}
        data-glow
        style={getInlineStyles()}
        className={`
          ${getSizeClasses()}
          ${!customSize ? 'aspect-[3/4]' : ''}
          rounded-2xl 
          relative 
          grid 
          grid-rows-[1fr_auto] 
          shadow-[0_1rem_2rem_-1rem_rgba(0,0,0,0.5)] 
          p-8 
          gap-4 
          backdrop-blur-[10px]
          ${className}
        `}
      >
        <div ref={innerRef} data-glow></div>
        {children}
      </div>
    </>
  );
};

export { GlowCard };
