import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 240;
const FRAME_PATH = (i) =>
  `/images/hero-images/frame_${String(i).padStart(3, "0")}.jpg`;

/**
 * HeroCanvas
 * Renders a single <canvas> that scrubs through a 240-frame JPG sequence
 * driven by scroll position. Designed to sit inside the existing hero's
 * right-side visual container without affecting layout, text, or nav.
 */
const HeroCanvas = ({ sectionRef }) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const loadedCountRef = useRef(0);
  const rafPendingRef = useRef(false);

  // Draws a given frame index onto the canvas using object-contain scaling
  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    // CSS (visual) size of the canvas box
    const cssWidth = canvas.clientWidth;
    const cssHeight = canvas.clientHeight;
    if (cssWidth === 0 || cssHeight === 0) return;

    const targetW = Math.round(cssWidth * dpr);
    const targetH = Math.round(cssHeight * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // object-contain math: fit image fully inside canvas, centered, no distortion
    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.naturalWidth / img.naturalHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      // image is relatively wider -> fit to width
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    } else {
      // image is relatively taller -> fit to height
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useEffect(() => {
    let isCancelled = false;
    const images = new Array(FRAME_COUNT);
    imagesRef.current = images;

    // --- Preload sequence ---
    // Load frame 1 first (and block on it) so we can paint immediately,
    // then load the rest in the background.
    const loadImage = (i) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          loadedCountRef.current += 1;
          resolve();
        };
        img.onerror = () => {
          loadedCountRef.current += 1;
          resolve();
        };
        img.src = FRAME_PATH(i + 1); // frame_001.jpg is index 0
        images[i] = img;
      });
    };

    let ctx; // gsap context for scoped cleanup
    let resizeObserver;

    const init = async () => {
      // Load first frame, paint it immediately so there's no blank canvas
      await loadImage(0);
      if (isCancelled) return;
      renderFrame(0);

      // Load the rest of the sequence in the background
      const rest = [];
      for (let i = 1; i < FRAME_COUNT; i++) {
        rest.push(loadImage(i));
      }
      await Promise.all(rest);
      if (isCancelled) return;

      // --- GSAP ScrollTrigger wiring ---
      ctx = gsap.context(() => {
        const triggerEl = sectionRef?.current || wrapperRef.current;
        if (!triggerEl) return;

        const frameState = { frame: 0 };

        gsap.to(frameState, {
          frame: FRAME_COUNT - 1,
          ease: "none",
          scrollTrigger: {
            trigger: triggerEl,
            start: "top top",
            // Tuned, viewport-relative length instead of a huge fixed value.
            // This is a FUNCTION so it recalculates correctly on resize
            // (paired with invalidateOnRefresh below).
            end: () => "+=" + window.innerHeight * 1.5,
            scrub: true,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          onUpdate: () => {
            const frameIndex = Math.round(frameState.frame);
            if (frameIndex !== currentFrameRef.current) {
              currentFrameRef.current = frameIndex;
              renderFrame(frameIndex);
            }
          },
        });
      }, wrapperRef);

      // Positions/heights can shift slightly once all images are known-loaded
      // (fonts, layout settle). Refresh once so start/end stay accurate.
      ScrollTrigger.refresh();
    };

    init();

    // Re-render current frame on resize (keeps canvas sharp / correctly fit)
    const handleResize = () => {
      if (rafPendingRef.current) return;
      rafPendingRef.current = true;
      requestAnimationFrame(() => {
        renderFrame(currentFrameRef.current);
        rafPendingRef.current = false;
      });
    };

    resizeObserver = new ResizeObserver(handleResize);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);
    window.addEventListener("resize", handleResize);

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      if (ctx) ctx.revert(); // kills ScrollTrigger + tween scoped to wrapperRef
      imagesRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="w-full h-full flex items-center justify-center"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full max-h-[70vh] lg:max-h-[80vh]"
      />
    </div>
  );
};

export default HeroCanvas;