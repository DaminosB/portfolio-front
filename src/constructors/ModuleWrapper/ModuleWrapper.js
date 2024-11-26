"use client";
import styles from "./ModuleWrapper.module.css";

// React hooks imports
import { useState, useContext, useEffect, useRef, createContext } from "react";
import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

export const ModuleContext = createContext();

// Components imports
import Carousel from "@/components/Carousel/Carousel";
import DotButton from "@/components/DotButton/DotButton";
import ScrollBar from "@/components/ScrollBar/ScrollBar";

// This component wraps around each module to handle and display the media galleries and scrolling content
const ModuleWrapper = ({ inlineStyle, customColors, module, children }) => {
  // State to track whether the module is active (i.e., displayed by the viewer)
  // When false, no dragging effects are active
  const [isActiveSection, setIsActiveSection] = useState(false);

  // Ref to store the DOM element of the section
  const sectionRef = useRef(null);

  // Ref to store the coordinates of the section in the layout
  const sectionCoordsRef = useRef(null);

  const { activeCoords, showModale, getSectionCoords, setModaleContent } =
    useContext(LayoutContext);
  const [activeContainerIndex, activeChildIndex] = activeCoords;

  // State to track the current index of the media gallery being displayed
  const [galleryIndex, setGalleryIndex] = useState(0);

  // State to store the scroll metrics of each column in the module
  const [scrollMetrics, setScrollMetrics] = useState([]);

  // State to store the scroll bar's thumb height and its current scroll position ratio
  const [scrollBarMetrics, setScrollBarMetrics] = useState({
    thumbHeight: 0,
    scrollRatio: 0,
  });

  // Array of media assets to display in the carousel, filtered by "addToCarousel" flag and duplicates
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

  // This function opens the carousel in a modal with the selected media
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

  // This function is used by ModuleColumn child components to update their scroll metrics
  const updateScrollMetrics = (element, scrollPosition) => {
    // Find the index of the column in its parent container
    const elementIndex = Array.from(element.parentNode.children).findIndex(
      (child) => child === element
    );

    // Update the scrollMetrics state with the new data
    setScrollMetrics((prev) => {
      const newTab = [...prev];
      newTab[elementIndex] = { element, scrollPosition };
      return newTab;
    });
  };

  // Functions provided to the ScrollBar component for scrolling actions

  // This function is triggered when the arrow buttons are clicked
  const arrowsFunction = (multiplyer) => {
    // multiplyer: Number. Either 1 or -1, determines the scroll direction
    const section = sectionRef.current;

    // Scroll by a third of the visible part of the columns when an arrow is clicked
    const scrollValue = multiplyer * (section.offsetHeight / 3);

    // Apply the scroll value to each column
    scrollMetrics.forEach((entry) => {
      entry.element.scrollBy({ top: scrollValue, behavior: "smooth" });
    });
  };

  // This function is triggered when the scroll bar's thumb is grabbed
  const grabbingFunction = (deltaY) => {
    // Scroll each column by the value of deltaY
    scrollMetrics.forEach((entry) => {
      entry.element.scrollBy({ top: deltaY, behavior: "instant" });
    });
  };

  // This function is called when the track is clicked to scroll to the desired position
  const scrollToClickPosition = (yRatio) => {
    // Scroll each column to the position corresponding to the clicked ratio
    scrollMetrics.forEach((entry) => {
      const scrollTarget = entry.element.scrollHeight * yRatio;
      entry.element.scrollTo({ top: scrollTarget, behavior: "smooth" });
    });
  };

  // The largest media gallery determines the maximum gallery index
  const maxGalleryIndex = module.mediaBlocks.reduce(
    (maxAssetsCount, mediaBlock) =>
      Math.max(maxAssetsCount, mediaBlock.mediaAssets.length - 1),
    0
  );

  // This function handles the wheel action on the X-axis to change the gallery index
  const handleOnWheel = (e) => {
    const { deltaX, deltaY } = e;

    // If the wheel movement is more significant on the Y-axis, ignore the function
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;

    // Otherwise, stop the event from bubbling up and change the gallery index
    e.stopPropagation();
    changeGalleryIndex(deltaX);
  };

  const previousTouchPositionsRef = useRef({ x: 0, y: 0 });

  // This function handles touch events to change the gallery index on the X-axis
  const handleTouchEvents = (e) => {
    switch (e.type) {
      case "touchstart":
        // On touch start, cache the initial touch positions
        previousTouchPositionsRef.current = {
          x: e.targetTouches[0].clientX,
          y: e.targetTouches[0].clientY,
        };
        break;

      case "touchmove":
        // On touch move, calculate the movement on X and Y axes
        const previousTouchPositions = previousTouchPositionsRef.current;
        const deltaX = previousTouchPositions.x - e.targetTouches[0].clientX;
        const deltaY = previousTouchPositions.y - e.targetTouches[0].clientY;

        // If the movement is larger on the Y-axis, ignore the function
        if (Math.abs(deltaX) < Math.abs(deltaY)) return;

        // Otherwise, change the gallery index
        e.stopPropagation();
        changeGalleryIndex(deltaX);

        // Update the cached touch position
        previousTouchPositionsRef.current = {
          x: e.targetTouches[0].clientX,
          y: e.targetTouches[0].clientY,
        };
        break;

      default:
        break;
    }
  };

  // Debounce mechanism to prevent gallery index changes from happening too often
  const galleryChangeDebounce = useRef(true);

  // This function changes the gallery index based on the horizontal wheel or touch movement
  const changeGalleryIndex = (deltaX) => {
    if (galleryChangeDebounce.current) {
      galleryChangeDebounce.current = false;

      // If the movement is from right to left, and the galleryIndex is smaller than maxGalleryIndex, increase the index
      if (deltaX > 0 && galleryIndex < maxGalleryIndex) {
        setGalleryIndex((prev) => prev + 1);
      } else if (deltaX < 0 && galleryIndex > 0) {
        // If the movement is from left to right, and the galleryIndex is not 0, decrease the index
        setGalleryIndex((prev) => prev - 1);
      }

      setTimeout(() => {
        galleryChangeDebounce.current = true;
      }, 750);
    }
  };

  // Inline style for the gallery index indicator
  const galleryIndicatorInlineStyle = {
    backgroundColor: customColors.mainColor,
    color: customColors.secondaryColor,
  };

  // This effect checks if the module is active based on its coordinates and updates the scroll bar metrics
  useEffect(() => {
    const section = sectionRef.current;

    // Get section coordinates if not already done
    if (!sectionCoordsRef.current)
      sectionCoordsRef.current = getSectionCoords(section);

    const [containerIndex, sectionIndex] = sectionCoordsRef.current;

    const isActive =
      activeContainerIndex === containerIndex &&
      activeChildIndex === sectionIndex;

    // Update the active state if necessary
    if (isActive !== isActiveSection) setIsActiveSection(isActive);

    // If scrollMetrics are available, calculate and update the scrollBar metrics
    if (scrollMetrics.length > 0) {
      let tallestColumnIndex = 0;

      // Find the index of the column with the tallest content
      scrollMetrics.forEach((entry, i) => {
        const currentTallestColumn = scrollMetrics[tallestColumnIndex].element;
        if (entry.element.scrollHeight > currentTallestColumn.scrollHeight) {
          tallestColumnIndex = i;
        }
      });

      // Get the DOM element of the tallest column
      const tallestColumn = scrollMetrics[tallestColumnIndex].element;

      // Calculate the thumb height based on the percentage of the visible area
      const newThumbHeight =
        100 / (tallestColumn.scrollHeight / tallestColumn.offsetHeight);

      // Calculate the maximum scroll position in the tallest column
      const maxScrollPosition =
        tallestColumn.scrollHeight - tallestColumn.offsetHeight;

      // Calculate the scroll ratio based on the current scroll position
      const newScrollRatio =
        scrollMetrics[tallestColumnIndex].scrollPosition / maxScrollPosition;

      // Update the scroll bar metrics
      setScrollBarMetrics({
        thumbHeight: newThumbHeight,
        scrollRatio: newScrollRatio,
      });
    }
  }, [
    activeCoords,
    activeChildIndex,
    activeContainerIndex,
    getSectionCoords,
    scrollMetrics,
  ]);

  const contextValues = {
    isActiveSection,
    openCarousel,
    showModale,
    galleryIndex,
    setGalleryIndex,
    updateScrollMetrics,
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

        {/* --------------------------------------------------- */}
        {/* ------------ GALLERY NAVIGATION BUTTONS ----------- */}
        {/* --------------------------------------------------- */}

        {maxGalleryIndex > 0 && (
          <div className={styles.navContainer}>
            <nav style={galleryIndicatorInlineStyle}>
              {/* Creates a button for each media in the galleries up to the largest gallery index */}
              {Array.from({ length: maxGalleryIndex + 1 }).map((_, index) => {
                const handleOnClick = () => {
                  setGalleryIndex(index);
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
