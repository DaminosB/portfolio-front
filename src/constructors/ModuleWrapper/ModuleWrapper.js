"use client";
import styles from "./ModuleWrapper.module.css";

// React hooks and context
import { useState, useContext, useEffect, useRef, createContext } from "react";
import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

// Components
import Carousel from "@/components/Carousel/Carousel";
import DotButton from "@/components/DotButton/DotButton";
import ScrollBar from "@/components/ScrollBar/ScrollBar";
import useScrollTracker from "@/hooks/useScrollTracker";

// Create a context to share state and actions with child components
export const ModuleContext = createContext();

const ModuleWrapper = ({ inlineStyle, customColors, module, children }) => {
  // -------------------------------------------------------------------------
  // States and Refs
  // -------------------------------------------------------------------------
  const [isActiveSection, setIsActiveSection] = useState(false); // Tracks if the module is active
  const [xScrollRatio, setXScrollRatio] = useState(0); // Tracks horizontal scroll ratio
  const [scrollBarMetrics, setScrollBarMetrics] = useState({
    thumbHeight: 0,
    scrollProgress: 0,
  }); // Scrollbar metrics: thumb height and scroll progress

  const sectionRef = useRef(null); // Reference to the main section DOM element
  const ghostRef = useRef(null); // Reference to the "ghost" element
  const sectionCoordsRef = useRef(null); // Cached section coordinates
  const scrollableElemsRef = useRef([]); // Stores scrollable child elements
  const cachedYScrollPosition = useRef(0); // Stores the last Y scroll position

  const {
    activeCoords: [activeContainerIndex, activeChildIndex],
    showModale,
    getSectionCoords,
    setModaleContent,
  } = useContext(LayoutContext);

  // -------------------------------------------------------------------------
  // Scroll Management (X and Y axes)
  // -------------------------------------------------------------------------

  // A ghost element serves as a placeholder to simulate scrolling.
  // It dynamically adjusts its width and height to match the total overflow content
  // (horizontal for media galleries and vertical for overflowing module content).
  // This allows the scroller to have the proper scroll dimensions without requiring
  // the actual {children} elements to move, as they remain sticky at top: 0 and left: 0.

  // Handles vertical scrolling for overflowing content
  const { scrollPosition: yScrollPosition, scrollTrack: yScrollTrack } =
    useScrollTracker();

  // Handles horizontal scrolling for media galleries
  const {
    scrollPosition: xScrollPosition,
    scrollTrack: xScrollTrack,
    displayIndex: galleryIndex,
  } = useScrollTracker(true);

  // Unified scroll handler for both axes
  const handleOnScroll = (e) => {
    xScrollTrack(e, [1]); // Track horizontal scroll
    yScrollTrack(e); // Track vertical scroll
  };

  // -------------------------------------------------------------------------
  // Functions: Media handling and scrolling actions
  // -------------------------------------------------------------------------

  // Filter and deduplicate media assets to display in the carousel
  const mediasToDisplay = module.mediaBlocks
    ? populateMediasToDisplay(module.mediaBlocks)
    : null;

  // Opens a carousel modal at the selected media
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

  // Allows child components to register as scrollable elements
  const addScrollableElem = (element) => {
    if (!scrollableElemsRef.current.includes(element)) {
      scrollableElemsRef.current.push(element);
    }
  };

  // Scroll-related functions for the ScrollBar component:
  // Scrolls by a portion of the visible height when arrows are clicked
  const arrowsFunction = (multiplyer) => {
    const scroller = sectionRef.current.firstElementChild;
    const scrollValue = multiplyer * (scroller.offsetHeight / 3);
    scroller.scrollBy({ top: scrollValue, behavior: "smooth" });
  };

  // Scrolls instantly by a given deltaY when the thumb is dragged
  const grabbingFunction = (deltaY) => {
    const scroller = sectionRef.current.firstElementChild;
    scroller.scrollBy({ top: deltaY, behavior: "instant" });
  };

  // Scrolls smoothly to a position determined by the clicked ratio on the scrollbar track
  const scrollToClickPosition = (yRatio) => {
    const scroller = sectionRef.current.firstElementChild;
    const scrollTarget = scroller.scrollHeight * yRatio;
    scroller.scrollTo({ top: scrollTarget, behavior: "smooth" });
  };

  // -------------------------------------------------------------------------
  // Effects: Activity monitoring and layout updates
  // -------------------------------------------------------------------------
  useEffect(() => {
    const section = sectionRef.current;

    // Cache section coordinates if not already calculated
    if (!sectionCoordsRef.current)
      sectionCoordsRef.current = getSectionCoords(section);

    const [containerIndex, sectionIndex] = sectionCoordsRef.current;

    // Determine if the current module is active
    const isActive =
      activeContainerIndex === containerIndex &&
      activeChildIndex === sectionIndex;

    if (isActive !== isActiveSection) setIsActiveSection(isActive);

    // Update the ghost element's height based on the largest overflow
    const ghost = ghostRef.current;
    const ghostHeight = scrollableElemsRef.current.reduce(
      (maxOverflow, elem) => {
        const overflowY = elem.scrollHeight - elem.offsetHeight;
        return Math.max(maxOverflow, overflowY);
      },
      0
    );

    ghost.style.height = `${ghostHeight}px`;

    // Calculate and update scrollbar metrics
    const scroller = section.firstElementChild;
    const yOverflowRatio = scroller.scrollHeight / scroller.offsetHeight;
    const newThumbHeight = 100 / yOverflowRatio;
    const maxYScrollPosition = scroller.scrollHeight - scroller.offsetHeight;
    const newYScrollProgress = yScrollPosition / maxYScrollPosition;

    setScrollBarMetrics({
      thumbHeight: newThumbHeight,
      scrollProgress: newYScrollProgress,
    });

    // Cache the latest Y scroll position
    cachedYScrollPosition.current = yScrollPosition;

    // Update X scroll ratio
    const newXScrollRatio = xScrollPosition / scroller.clientWidth || 0;
    if (newXScrollRatio !== xScrollRatio) {
      setXScrollRatio(newXScrollRatio);
    }
  }, [
    isActiveSection,
    activeChildIndex,
    activeContainerIndex,
    getSectionCoords,
    yScrollPosition,
    xScrollPosition,
    xScrollRatio,
  ]);

  const maxGalleryLength = module.mediaBlocks.reduce(
    (maxCount, block) => Math.max(maxCount, block.mediaAssets.length),
    0
  );

  const contextValues = {
    isActiveSection,
    openCarousel,
    showModale,
    addScrollableElem,
    sectionScrollDeltaY: yScrollPosition - cachedYScrollPosition.current,
    sectionXScrollRatio: xScrollRatio,
  };

  const galleryIndicatorInlineStyle = {
    backgroundColor: customColors.mainColor,
    color: customColors.secondaryColor,
  };

  const ghostInlineStyle = {
    width: `${maxGalleryLength * 100}%`,
  };

  return (
    <ModuleContext.Provider value={contextValues}>
      <section
        className={styles.moduleWrapper}
        style={inlineStyle}
        ref={sectionRef}
      >
        <div className={styles.scroller} onScroll={handleOnScroll}>
          {children}

          {/* --------------------------------------------------- */}
          {/* ---------------------- GHOST ---------------------- */}
          {/* --------------------------------------------------- */}

          <div className={styles.ghost} style={ghostInlineStyle} ref={ghostRef}>
            {Array.from({ length: maxGalleryLength }).map((_, index) => (
              <div key={index}></div>
            ))}
          </div>
        </div>

        {/* --------------------------------------------------- */}
        {/* ------------ GALLERY NAVIGATION BUTTONS ----------- */}
        {/* --------------------------------------------------- */}
        {maxGalleryLength > 1 && (
          <div className={styles.navContainer}>
            <nav style={galleryIndicatorInlineStyle}>
              {Array.from({ length: maxGalleryLength }).map((_, index) => {
                const handleOnClick = () => {
                  const scroller = sectionRef.current.firstElementChild;
                  const ghost = ghostRef.current;
                  const scrollTarget = ghost.children[index].offsetLeft;
                  scroller.scrollTo({ left: scrollTarget, behavior: "smooth" });
                };
                return (
                  <DotButton
                    key={index}
                    isActive={index === galleryIndex}
                    onClickFunction={handleOnClick}
                  />
                );
              })}
            </nav>
          </div>
        )}

        {/* --------------------------------------------------- */}
        {/* -------------------- SCROLLBAR -------------------- */}
        {/* --------------------------------------------------- */}
        <ScrollBar
          customColors={customColors}
          metrics={scrollBarMetrics}
          arrowsFunction={arrowsFunction}
          grabbingFunction={grabbingFunction}
          scrollToClickPosition={scrollToClickPosition}
        />
      </section>
    </ModuleContext.Provider>
  );
};

export default ModuleWrapper;

/* Utility to populate media assets for the carousel */
const populateMediasToDisplay = (mediaBlocks) =>
  mediaBlocks
    .flatMap((block) =>
      block.mediaAssets.filter((asset) => asset.addToCarousel)
    )
    .filter(
      (asset, index, array) =>
        index === array.findIndex((subItem) => subItem.id === asset.id)
    );
