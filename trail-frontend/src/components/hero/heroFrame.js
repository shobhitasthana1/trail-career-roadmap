// Frame-sequence engine for the hero canvas animation.
// This logic was moved out of HeroRight.jsx so that the component file only
// exports a component (react-refresh/only-export-components). All state and
// behaviour are unchanged: HeroRight drives loading/canvas lifecycle through
// the setter helpers below, and Hero.jsx drives playback through
// setHeroFrameProgress / initHeroFrame.

export const TOTAL_FRAMES = 300;
export const START_FRAME = 1;

export const FRAME_PATH = (index) =>
  `/images/hero-images/hero-right/ezgif-frame-${String(index).padStart(3, "0")}.jpg`;

let canvasEl = null;
let imagesArr = [];
let lastDrawnFrame = -1;

export const setHeroCanvas = (el) => {
  canvasEl = el;
};

export const setHeroImages = (imgs) => {
  imagesArr = imgs;
};

export const clearHeroImages = () => {
  imagesArr = [];
};

export const resetHeroFrame = () => {
  lastDrawnFrame = -1;
};

export const drawHeroFrame = (frameIndex) => {
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

export const redrawHeroFrame = () => {
  const frameToRedraw = lastDrawnFrame === -1 ? START_FRAME : lastDrawnFrame;
  lastDrawnFrame = -1;
  drawHeroFrame(frameToRedraw);
};

export const setHeroFrameProgress = (progress) => {
  const frame = Math.round(START_FRAME + progress * (TOTAL_FRAMES - START_FRAME));
  drawHeroFrame(frame);
};

export const initHeroFrame = () => {
  drawHeroFrame(START_FRAME);
};
