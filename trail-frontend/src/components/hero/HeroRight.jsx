import React, { useRef, useEffect, useState } from "react";

const TOTAL_FRAMES = 300;
const START_FRAME = 1;

const FRAME_PATH = (index) =>
  `/images/hero-images/hero-right/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

let canvasEl = null;
let imagesArr = [];
let lastDrawnFrame = -1;

const drawFrame = (frameIndex) => {
  const canvas = canvasEl;
  if (!canvas) return;

  const imageIndex = frameIndex - START_FRAME;
  const img = imagesArr[imageIndex];
  if (!img || !img.complete || !img.naturalWidth) return;
  if (frameIndex === lastDrawnFrame) return;
  lastDrawnFrame = frameIndex;

  const ctx = canvas.getContext("2d");
  const parent = canvas.parentElement;
  if (!parent) return;

  const containerWidth = parent.clientWidth;
  const containerHeight = parent.clientHeight;
  if (!containerWidth || !containerHeight) return;

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const width = Math.round(containerWidth * dpr);
  const height = Math.round(containerHeight * dpr);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${containerWidth}px`;
    canvas.style.height = `${containerHeight}px`;
  }

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, containerWidth, containerHeight);

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const containerRatio = containerWidth / containerHeight;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imgRatio > containerRatio) {
    drawWidth = containerWidth;
    drawHeight = drawWidth / imgRatio;
    offsetX = 0;
    offsetY = (containerHeight - drawHeight) / 2;
  } else {
    drawHeight = containerHeight;
    drawWidth = drawHeight * imgRatio;
    offsetX = (containerWidth - drawWidth) / 2;
    offsetY = 0;
  }

  ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
};

const redrawCurrentFrame = () => {
  const frameToRedraw = lastDrawnFrame === -1 ? START_FRAME : lastDrawnFrame;
  lastDrawnFrame = -1;
  drawFrame(frameToRedraw);
};

export const setHeroFrameProgress = (progress) => {
  const frame = Math.round(START_FRAME + progress * (TOTAL_FRAMES - START_FRAME));
  drawFrame(frame);
};

export const initHeroFrame = () => {
  drawFrame(START_FRAME);
};

const HeroRight = () => {
  const canvasRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    let cancelled = false;
    const imgs = [];
    const totalToLoad = TOTAL_FRAMES - START_FRAME + 1;

    for (let i = START_FRAME; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      const onSettle = () => {
        loadedCount++;
        if (!cancelled && loadedCount === totalToLoad) {
          imagesArr = imgs;
          setImagesLoaded(true);
        }
      };
      img.onload = onSettle;
      img.onerror = onSettle;
      imgs.push(img);
    }

    return () => {
      cancelled = true;
      imagesArr = [];
      lastDrawnFrame = -1;
    };
  }, []);

  useEffect(() => {
    canvasEl = canvasRef.current;
    if (imagesLoaded) {
      lastDrawnFrame = -1;
      drawFrame(START_FRAME);
    }

    const handleResize = () => {
      redrawCurrentFrame();
    };

    window.addEventListener("resize", handleResize);

    let resizeObserver = null;
    if (canvasEl && canvasEl.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(canvasEl.parentElement);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      canvasEl = null;
    };
  }, [imagesLoaded]);

  return (
    <div className="relative flex items-center justify-center w-full h-[48vh] sm:h-[46vh] md:h-[50vh] lg:h-full overflow-hidden">
      {!imagesLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-[#9577F4] border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      <canvas
        ref={canvasRef}
        className={`w-full h-full block transition-opacity duration-300 ${
          imagesLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
};

export default HeroRight;