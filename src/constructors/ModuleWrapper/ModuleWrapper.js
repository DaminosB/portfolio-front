"use client";
import styles from "./ModuleWrapper.module.css";

// React hooks imports
import { useState, useContext, useEffect, useRef, createContext } from "react";
import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

export const ModuleContext = createContext();

// Components imports
import Carousel from "@/components/Carousel/Carousel";

const ModuleWrapper = ({ inlineStyle, customColors, module, children }) => {
  // This state is changed when the viewer clicks the content
  // On false, none of the dragging effects are active
  const [isActiveSection, setIsActiveSection] = useState(false);

  const { activeCoords, showModale, getSectionCoords, setModaleContent } =
    useContext(LayoutContext);
  const [activeContainerIndex, activeChildIndex] = activeCoords;

  const sectionRef = useRef(null);
  const sectionCoordsRef = useRef(null);

  const [galleryIndex, setGalleryIndex] = useState(0);

  const maxGalleryIndex = module.mediaBlocks.reduce(
    (maxAssetsCount, mediaBlock) =>
      Math.max(maxAssetsCount, mediaBlock.mediaAssets.length - 1),
    0
  );

  const mediasToDisplay = module.mediaBlocks
    ? module.mediaBlocks
        .flatMap((mediaBlock) =>
          mediaBlock.mediaAssets.filter(
            (mediaAsset) => mediaAsset.addToCarousel
          )
        )
        .filter(
          (mediaAsset, index, array) =>
            index === array.findIndex((subItem) => subItem.id === mediaAsset.id)
        )
    : null;

  const openCarousel = (mediaId) => {
    const mediaIndex = mediasToDisplay.findIndex(
      (media) => media.id === mediaId
    );
    setModaleContent(
      <Carousel
        mediasToDisplay={mediasToDisplay}
        mediaBlocks={module.mediaBlocks}
        indexStart={mediaIndex}
        customColors={customColors}
      />
    );
  };

  useEffect(() => {
    const section = sectionRef.current;

    if (!sectionCoordsRef.current)
      sectionCoordsRef.current = getSectionCoords(section);

    const [containerIndex, sectionIndex] = sectionCoordsRef.current;

    const isActive =
      activeContainerIndex === containerIndex &&
      activeChildIndex === sectionIndex;

    setIsActiveSection(isActive);
  }, [activeCoords, activeChildIndex, activeContainerIndex, getSectionCoords]);

  const contextValues = {
    isActiveSection,
    openCarousel,
    showModale,
    galleryIndex,
    setGalleryIndex,
  };

  const wheelDebounce = useRef(true);

  const handleOnWheel = (e) => {
    const { deltaX, deltaY } = e;

    if (Math.abs(deltaX) < Math.abs(deltaY)) return;
    else {
      changeGalleryIndex(deltaX);
      e.stopPropagation();
    }
  };

  const previousTouchPositionsRef = useRef({ x: 0, y: 0 });

  const handleTouchEvents = (e) => {
    switch (e.type) {
      case "touchstart":
        previousTouchPositionsRef.current = {
          x: e.targetTouches[0].clientX,
          y: e.targetTouches[0].clientY,
        };
        break;

      case "touchmove":
        const previousTouchPositions = previousTouchPositionsRef.current;
        const deltaX = previousTouchPositions.x - e.targetTouches[0].clientX;
        const deltaY = previousTouchPositions.y - e.targetTouches[0].clientY;

        if (Math.abs(deltaX) < Math.abs(deltaY)) return;
        else {
          changeGalleryIndex(deltaX);
          e.stopPropagation();
        }

        previousTouchPositionsRef.current = {
          x: e.targetTouches[0].clientX,
          y: e.targetTouches[0].clientY,
        };

        break;

      default:
        break;
    }
  };

  const changeGalleryIndex = (deltaX) => {
    if (wheelDebounce.current) {
      wheelDebounce.current = false;

      if (deltaX > 0 && galleryIndex < maxGalleryIndex) {
        setGalleryIndex((prev) => prev + 1);
      } else if (deltaX < 0 && galleryIndex > 0) {
        setGalleryIndex((prev) => prev - 1);
      }

      setTimeout(() => {
        wheelDebounce.current = true;
      }, 500);
    }
  };

  return (
    <ModuleContext.Provider value={contextValues}>
      <section
        className={styles.moduleWrapper}
        style={inlineStyle}
        ref={sectionRef}
        onWheel={handleOnWheel}
        onTouchStart={handleTouchEvents}
        onTouchMove={handleTouchEvents}
      >
        {children}
      </section>
    </ModuleContext.Provider>
  );
};

export default ModuleWrapper;
