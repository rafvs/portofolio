import { useEffect, useRef, useState, useCallback } from 'react';
import './RevealImage.css';

// LaserFlow-style interactive reveal WITHOUT any WebGL laser beam.
// The image lives hidden behind a radial CSS mask; moving the cursor over the
// area drives the mask center (--mx/--my) so the picture is "painted" in under
// a spotlight that follows the pointer. Leaving the area parks the mask off
// canvas so everything hides again. A separate glitch overlay flashes an image
// on a fixed interval, independent of hover (paused while the user is hovering
// so the two effects don't collide).
const RevealImage = ({
  images = [],
  glitchImages,
  revealRadius = 240,
  glitchInterval = 6000,
  glitchDuration = 600,
  blendMode = 'lighten',
  hint = '',
  className = ''
}) => {
  const wrapRef = useRef(null);
  const isRevealingRef = useRef(false);
  const [revealing, setRevealing] = useState(false);
  const [glitching, setGlitching] = useState(false);
  const [glitchSrc, setGlitchSrc] = useState(null);

  const revealSrc = images[0] || null;
  const glitchPool = glitchImages && glitchImages.length ? glitchImages : images;

  const setMask = useCallback((x, y) => {
    const el = wrapRef.current;
    if (!el) return;
    el.style.setProperty('--mx', `${x}px`);
    el.style.setProperty('--my', `${y}px`);
  }, []);

  const hideMask = useCallback(() => setMask(-9999, -9999), [setMask]);

  const localPoint = (clientX, clientY) => {
    const rect = wrapRef.current.getBoundingClientRect();
    return { x: clientX - rect.left, y: clientY - rect.top };
  };

  const handleMouseEnter = () => {
    isRevealingRef.current = true;
    setRevealing(true);
  };

  const handleMouseMove = e => {
    if (!wrapRef.current) return;
    const { x, y } = localPoint(e.clientX, e.clientY);
    setMask(x, y);
  };

  const handleMouseLeave = () => {
    isRevealingRef.current = false;
    setRevealing(false);
    hideMask();
  };

  // Touch: no hover, so a tap toggles the reveal at the tapped point.
  const handlePointerDown = e => {
    if (e.pointerType !== 'touch' || !wrapRef.current) return;
    const next = !isRevealingRef.current;
    isRevealingRef.current = next;
    setRevealing(next);
    if (next) {
      const { x, y } = localPoint(e.clientX, e.clientY);
      setMask(x, y);
    } else {
      hideMask();
    }
  };

  useEffect(() => {
    hideMask();
  }, [hideMask]);

  // Periodic glitch flash, paused while the user is actively revealing.
  useEffect(() => {
    if (!glitchPool.length) return undefined;
    let hideTimer;
    let index = 0;
    const id = setInterval(() => {
      if (isRevealingRef.current) return;
      index = (index + 1) % glitchPool.length;
      setGlitchSrc(glitchPool[index]);
      setGlitching(true);
      hideTimer = setTimeout(() => setGlitching(false), glitchDuration);
    }, glitchInterval);
    return () => {
      clearInterval(id);
      clearTimeout(hideTimer);
    };
  }, [glitchPool, glitchInterval, glitchDuration]);

  return (
    <div
      ref={wrapRef}
      className={`reveal-image${className ? ` ${className}` : ''}`}
      style={{ '--reveal-r': `${revealRadius}px` }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onPointerDown={handlePointerDown}
    >
      {revealSrc && (
        <div
          className="reveal-image__layer"
          style={{ backgroundImage: `url(${revealSrc})`, mixBlendMode: blendMode }}
        />
      )}

      {glitchSrc && (
        <div
          className={`reveal-image__glitch${glitching ? ' is-active' : ''}`}
          style={{ '--glitch-src': `url(${glitchSrc})` }}
          aria-hidden="true"
        />
      )}

      <span className={`reveal-image__hint${revealing ? ' is-hidden' : ''}`}>{hint}</span>
    </div>
  );
};

export default RevealImage;
