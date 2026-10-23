import { useRef, useEffect, useState } from "react";
import {
  TOTAL_FRAMES,
  START_FRAME,
  FRAME_PATH,
  setHeroCanvas,
  setHeroImages,
  clearHeroImages,
  resetHeroFrame,
  drawHeroFrame,
  redrawHeroFrame,
} from "./heroFrame";

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
          setHeroImages(imgs);
          setImagesLoaded(true);
        }
      };
      img.onload = onSettle;
      img.onerror = onSettle;
      imgs.push(img);
    }

    return () => {
      cancelled = true;
      clearHeroImages();
      resetHeroFrame();
    };
  }, []);

  useEffect(() => {
    setHeroCanvas(canvasRef.current);
    if (imagesLoaded) {
      resetHeroFrame();
      drawHeroFrame(START_FRAME);
    }

    const handleResize = () => {
      redrawHeroFrame();
    };

    window.addEventListener("resize", handleResize);

    let resizeObserver = null;
    const canvas = canvasRef.current;
    if (canvas && canvas.parentElement) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      resizeObserver.observe(canvas.parentElement);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeObserver) resizeObserver.disconnect();
      setHeroCanvas(null);
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
