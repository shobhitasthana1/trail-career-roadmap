import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 300;
const FRAME_PATH = (i) =>
  `/images/hero-images/ezgif-frame-${String(i).padStart(3, "0")}.jpg`;

const SectionTwoCanvas = ({ sectionRef }) => {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const rafPendingRef = useRef(false);

  const resizeCanvasToWrapper = () => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return false;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = wrapper.clientWidth;
    const cssHeight = wrapper.clientHeight;
    if (cssWidth === 0 || cssHeight === 0) return false;

    const targetW = Math.round(cssWidth * dpr);
    const targetH = Math.round(cssHeight * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }
    return true;
  };

  const renderFrame = (index) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = imagesRef.current[index];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    if (!resizeCanvasToWrapper()) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasAspect = canvas.width / canvas.height;
    const imgAspect = img.naturalWidth / img.naturalHeight;

    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      drawHeight = canvas.height;
      drawWidth = drawHeight * imgAspect;
      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = 0;
    } else {
      drawWidth = canvas.width;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = (canvas.height - drawHeight) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
  };

  useEffect(() => {
    let isCancelled = false;
    const images = new Array(FRAME_COUNT);
    imagesRef.current = images;

    const loadImage = (i) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = resolve;
        img.src = FRAME_PATH(i + 1);
        images[i] = img;
      });
    };

    let ctx;
    let resizeObserver;

    const init = async () => {
      await loadImage(0);
      if (isCancelled) return;

      await new Promise((resolve) => requestAnimationFrame(resolve));
      if (isCancelled) return;

      resizeCanvasToWrapper();
      renderFrame(0);

      const rest = [];
      for (let i = 1; i < FRAME_COUNT; i++) {
        rest.push(loadImage(i));
      }
      await Promise.all(rest);
      if (isCancelled) return;

      resizeCanvasToWrapper();
      renderFrame(currentFrameRef.current);

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
            end: () => "+=" + window.innerHeight * 3,
            scrub: 0.5,
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

      ScrollTrigger.refresh();
    };

    init();

    const handleResize = () => {
      if (rafPendingRef.current) return;
      rafPendingRef.current = true;
      requestAnimationFrame(() => {
        resizeCanvasToWrapper();
        renderFrame(currentFrameRef.current);
        rafPendingRef.current = false;
      });
    };

    resizeObserver = new ResizeObserver(handleResize);
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current);
    window.addEventListener("resize", handleResize);

    return () => {
      isCancelled = true;
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      if (ctx) ctx.revert();
      imagesRef.current = [];
    };
  }, []);

  return (
    <div ref={wrapperRef} className="w-full h-screen">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default SectionTwoCanvas;