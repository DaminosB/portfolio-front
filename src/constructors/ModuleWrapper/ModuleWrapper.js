"use client";
import styles from "./ModuleWrapper.module.css";

// React hooks imports
import { useState, useContext, useEffect, useRef, createContext } from "react";
import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";
import { SnapScrollerContext } from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";

export const ModuleContext = createContext();

// Components imports
import Carousel from "@/components/Carousel/Carousel";
import useScrollTracker from "@/hooks/useScrollTracker";

const ModuleWrapper = ({ medias, inlineStyle, customColors, children }) => {
  // This state is changed when the viewer clicks the content
  // On false, none of the dragging effects are active
  const [isActiveSection, setIsActiveSection] = useState(false);
  const { activeCoords, showModale, getSectionCoords, setModaleContent } =
    useContext(LayoutContext);
  const [activeContainerIndex, activeChildIndex] = activeCoords;

  const sectionRef = useRef(null);

  const sectionCoordsRef = useRef(null);

  const movableElemPositions = useRef([]);

  const { scrollTrack, scrollPosition } = useScrollTracker();

  const openCarousel = (mediaId) => {
    const mediaIndex = medias.findIndex((media) => media.id === mediaId);
    setModaleContent(
      <Carousel
        medias={medias}
        indexStart={mediaIndex}
        customColors={customColors}
      />
    );
  };

  const syncScroll = (scrollPosition) => {
    const sectionNode = sectionRef.current;

    const movableElements = Array.from(sectionNode.firstElementChild.children);

    const initialPositionFirstElement = movableElements[0].offsetTop;

    const allElementsAligned = movableElements.every(
      (elem) => elem.offsetTop === initialPositionFirstElement
    );

    if (!allElementsAligned || movableElements.length === 1) return;

    const tallestElemIndex = movableElements
      .map((element) => element.scrollHeight)
      .reduce(
        (maxIndex, currentValue, currentIndex, scrollHeights) =>
          currentValue > scrollHeights[maxIndex] ? currentIndex : maxIndex,
        0
      );

    movableElements.forEach((element, i) => {
      const translateValue = movableElemPositions.current[i] || 0;

      const elemBottomPosition =
        translateValue + (element.scrollHeight - scrollPosition);

      if (
        elemBottomPosition < sectionNode.offsetHeight &&
        i !== tallestElemIndex
      ) {
        const newTranslateValue =
          scrollPosition + (element.offsetHeight - element.scrollHeight);
        element.style.transform = `translateY(${newTranslateValue}px)`;
        movableElemPositions.current[i] = newTranslateValue;
      } else if (translateValue > scrollPosition) {
        element.style.transform = `translateY(${scrollPosition}px)`;
        movableElemPositions.current[i] = scrollPosition;
      }
    });
  };

  useEffect(() => {
    if (!sectionCoordsRef.current)
      sectionCoordsRef.current = getSectionCoords(sectionRef.current);

    const [containerIndex, sectionIndex] = sectionCoordsRef.current;

    const isActive =
      activeContainerIndex === containerIndex &&
      activeChildIndex === sectionIndex;

    if (isActive) {
      setIsActiveSection(true);
      syncScroll(scrollPosition);
    } else setIsActiveSection(false);
  }, [
    activeCoords,
    activeChildIndex,
    activeContainerIndex,
    getSectionCoords,
    scrollPosition,
  ]);

  const contextValues = { isActiveSection, openCarousel, showModale };

  const handleStopPropagation = (e) => {
    const sectionNode = sectionRef.current;

    const isAtBottom =
      sectionNode.scrollHeight - (scrollPosition + sectionNode.offsetHeight) <
      1;

    if (!isAtBottom) e.stopPropagation();
  };

  return (
    <ModuleContext.Provider value={contextValues}>
      <section
        className={styles.moduleWrapper}
        style={inlineStyle}
        ref={sectionRef}
        onScroll={scrollTrack}
        onWheel={handleStopPropagation}
        onTouchMove={handleStopPropagation}
      >
        {children}
      </section>
    </ModuleContext.Provider>
  );
};

export default ModuleWrapper;
