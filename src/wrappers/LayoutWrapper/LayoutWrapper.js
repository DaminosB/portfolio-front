"use client";

import styles from "./LayoutWrapper.module.css";

// Hooks import
import { createContext, useEffect, useState, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import useScrollTracker from "@/hooks/useScrollTracker";

export const LayoutContext = createContext();

// This component serves as a wrapper for every page, setting up key parameters and states
const LayoutWrapper = ({ children }) => {
  // Stores the coordinates of the currently visible content.
  // [Index of the container, Index of the currently active section/element]
  const [activeCoords, setActiveCoords] = useState([0, 0]);

  // Stores the active section/element index for each container (which child within the container is being viewed)
  const [containersPositions, setContainersPositions] = useState([]);

  // Controls the visibility of the bottom panel and manages popups/modals
  const [endScrollValue, setEndScrollValue] = useState(0);
  const [showEndScrollPanel, setShowEndScrollPanel] = useState(false);
  const [modaleContent, setModaleContent] = useState(null);

  // Custom hook to track the scroll position and determine which section is in view
  const {
    displayIndex: activeContainerIndex, // Index of the currently visible container
    scrollPosition, // Current scrollTop value of the container
    scrollTrack, // Function to handle the onScroll event
  } = useScrollTracker();

  // Tracks the current URL to detect page changes
  const pathname = usePathname();
  const cachedPathname = useRef(null);

  // Ref to store the layout container DOM element
  const layoutRef = useRef(null);

  const previousTouchPositionsRef = useRef({ x: 0, y: 0 });

  // Function to update the position of containers and the currently visible child within each container
  const updateContainerPos = useCallback((container, newIndex) => {
    const layoutNode = layoutRef.current;
    const containersArray = Array.from(layoutNode.children);

    // Finds the index of the container in the layout
    const containerIndex = containersArray.findIndex(
      (child) => child === container
    );

    // Updates the state with the new index for the container's active section
    setContainersPositions((prev) => {
      const updatedPositions = [...prev];
      updatedPositions[containerIndex] = newIndex;
      return updatedPositions;
    });
  }, []);

  const scrollDebounce = useRef(true);

  const handleOnWheel = (e) => {
    const layoutNode = layoutRef.current;

    const childrenCumulativeHeights = Array.from(layoutNode.children)
      .filter((child) => child.tagName !== "STYLE")
      .map((child, index) => layoutNode.offsetHeight * index);

    const canTriggerFunction = allowSnapScroll(
      e.deltaX,
      e.deltaY,
      childrenCumulativeHeights
    );

    if (canTriggerFunction) {
      e.stopPropagation();
      snapScroll(e.deltaY, childrenCumulativeHeights);
    }
  };

  const handleTouchEvents = (e) => {
    switch (e.type) {
      case "touchstart":
        previousTouchPositionsRef.current = {
          x: e.targetTouches[0].clientX,
          y: e.targetTouches[0].clientY,
        };
        break;

      case "touchmove":
        const layoutNode = layoutRef.current;

        const previousTouchPositions = previousTouchPositionsRef.current;
        const deltaX = previousTouchPositions.x - e.targetTouches[0].clientX;
        const deltaY = previousTouchPositions.y - e.targetTouches[0].clientY;

        const childrenCumulativeHeights = Array.from(layoutNode.children)
          .filter((child) => child.tagName !== "STYLE")
          .map((child, index) => layoutNode.offsetHeight * index);

        const canTriggerFunction = allowSnapScroll(
          deltaX,
          deltaY,
          childrenCumulativeHeights
        );

        if (canTriggerFunction) {
          e.stopPropagation();
          snapScroll(deltaY, childrenCumulativeHeights);
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

  const allowSnapScroll = (deltaX, deltaY, childrenCumulativeHeights) => {
    // If the movement is more horizontal than vertical, return false
    const isVerticalScroll = Math.abs(deltaY) >= Math.abs(deltaX);
    if (!isVerticalScroll) return false;

    const layoutNode = layoutRef.current;
    const activeContainer = layoutNode.children[activeContainerIndex];

    // Check if we are at the top or bottom of the active container
    const isAtTop = activeContainer.scrollTop === 0;
    const isAtBottom =
      activeContainer.scrollHeight -
        (activeContainer.scrollTop + activeContainer.offsetHeight) <
      1;

    // Determine if we should allow scrolling to the next/previous container
    const canScroll = (deltaY < 0 && isAtTop) || (deltaY > 0 && isAtBottom);

    // Determine the target index in the array
    const maxIndex = childrenCumulativeHeights.length - 1;
    const nextIndex =
      deltaY > 0 ? activeContainerIndex + 1 : activeContainerIndex - 1;

    // Check if the target index is within bounds
    const isWithinBounds = nextIndex >= 0 && nextIndex <= maxIndex;

    // Return true only if both scroll conditions are met
    return canScroll && isWithinBounds;
  };

  const snapScroll = (deltaY, childrenCumulativeHeights) => {
    const layoutNode = layoutRef.current;
    const nextIndex =
      deltaY > 0 ? activeContainerIndex + 1 : activeContainerIndex - 1;

    const scrollTarget = layoutNode.scrollTop + deltaY;
    const scrollLimit = childrenCumulativeHeights[nextIndex];

    const isExcessScroll =
      deltaY > 0 ? scrollTarget > scrollLimit : scrollTarget < scrollLimit;

    if (nextIndex !== activeContainerIndex && !isExcessScroll) {
      // Trigger an instant scroll by deltaY value to initiate the scroll event
      layoutNode.scrollBy({
        top: deltaY,
        behavior: "instant",
      });

      // Delay further scrolling to control rapid wheel events
      if (scrollDebounce.current) {
        scrollDebounce.current = false;

        setTimeout(() => {
          scrollDebounce.current = true;

          // Calculate top position of the target section
          const nextSectionTop = childrenCumulativeHeights[nextIndex];

          // Calculate scroll proximity (ratio of scrolled distance to layoutNode height)
          const scrollProximity =
            1 -
            Math.abs(layoutNode.scrollTop - nextSectionTop) /
              layoutNode.offsetHeight;

          if (scrollProximity >= 0.2) {
            // If proximity is sufficient (>= 20%), smoothly scroll to the target section
            layoutNode.scrollTo({ top: nextSectionTop, behavior: "smooth" });
          } else {
            // If proximity is insufficient, reset to the current section's position
            const currentSectionTop =
              childrenCumulativeHeights[activeContainerIndex];
            layoutNode.scrollTo({
              top: currentSectionTop,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    }
  };

  // Effect triggered by scroll events and page changes to update the active coordinates
  useEffect(() => {
    const layoutNode = layoutRef.current;

    const activeChildIndex = containersPositions[activeContainerIndex] || 0;

    // Checks if the active coordinates have changed (container or section)
    const coordsHaveChanged =
      activeCoords[0] !== activeContainerIndex ||
      activeCoords[1] !== activeChildIndex;

    if (coordsHaveChanged)
      setActiveCoords([activeContainerIndex, activeChildIndex]);

    // On page change, resets state and clears bottom panel and modal
    if (pathname !== cachedPathname.current) {
      cachedPathname.current = pathname;
      const childrenArray = Array.from(layoutNode.children).filter(
        (child) => child.tagName !== "STYLE"
      );

      layoutNode.scrollTo({ top: 0, behavior: "instant" });

      setContainersPositions(() => childrenArray.map(() => 0));
      setEndScrollValue(0);
      setModaleContent(null);
    }
  }, [activeCoords, activeContainerIndex, containersPositions, pathname]);

  // Provides context values to children components for managing layout, scroll, and popup states
  const contextValues = {
    activeCoords,
    layoutScrollPos: scrollPosition,
    layoutNode: layoutRef.current,
    showModale: modaleContent ? true : false, // Boolean to determine if modal is active
    updateContainerPos,
    getSectionCoords,
    endScrollValue,
    setEndScrollValue,
    showEndScrollPanel,
    setShowEndScrollPanel,
    modaleContent,
    setModaleContent,
  };

  return (
    <LayoutContext.Provider value={contextValues}>
      <div id="layout-container">
        <div
          className={styles.layoutContainer}
          ref={layoutRef}
          onScroll={scrollTrack}
          onWheel={handleOnWheel}
          onTouchStart={handleTouchEvents}
          onTouchMove={handleTouchEvents}
        >
          {children}
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

// Helper function to get the container and section indices for a given node
const getSectionCoords = (sectionNode) => {
  const findIndexInParent = (parent, targetChild) =>
    Array.from(parent.children).findIndex((child) => child === targetChild);

  const container = sectionNode.parentNode;

  // Finds the index of the container in its parent node
  const containerIndex = findIndexInParent(container.parentNode, container);

  // Finds the index of the section (child) in the container
  const sectionIndex = findIndexInParent(container, sectionNode);

  return [containerIndex, sectionIndex];
};

export default LayoutWrapper;
