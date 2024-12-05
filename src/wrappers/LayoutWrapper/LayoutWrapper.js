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
  const layoutScrollerRef = useRef(null);

  // Function to update the position of containers and the currently visible child within each container
  const updateContainerPos = useCallback((container, newIndex) => {
    const layoutScroller = layoutScrollerRef.current;
    const containersArray = Array.from(layoutScroller.children[0].children);

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

  // Effect triggered by scroll events and page changes to update the active coordinates
  useEffect(() => {
    const layoutScroller = layoutScrollerRef.current;

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
      const childrenArray = Array.from(
        layoutScroller.children[0].children
      ).filter((child) => child.tagName !== "STYLE");

      layoutScroller.scrollTo({ top: 0, behavior: "instant" });

      setContainersPositions(() => childrenArray.map(() => 0));
      setModaleContent(null);
    }

    layoutScroller.firstElementChild.scrollTo({
      top: scrollPosition,
      behavior: "instant",
    });
  }, [
    activeCoords,
    activeContainerIndex,
    containersPositions,
    pathname,
    scrollPosition,
  ]);

  // Provides context values to children components for managing layout, scroll, and popup states
  const contextValues = {
    activeCoords,
    layoutScrollPos: scrollPosition,
    layoutScroller: layoutScrollerRef.current,
    showModale: modaleContent ? true : false, // Boolean to determine if modal is active
    updateContainerPos,
    getSectionCoords,
    modaleContent,
    setModaleContent,
  };

  const handleOnScroll = (e) => {
    scrollTrack(e, [1]);
  };

  const ghostRef = useRef(null);

  const ghostInlineStyle = {
    height: `${containersPositions.length * 100}%`,
  };

  return (
    <LayoutContext.Provider value={contextValues}>
      <div id="layout-container">
        <div
          className={styles.layoutScroller}
          ref={layoutScrollerRef}
          onScroll={handleOnScroll}
        >
          <div className={styles.pageFrame}>{children}</div>

          <div className={styles.ghost} style={ghostInlineStyle} ref={ghostRef}>
            {Array.from({ length: containersPositions.length }).map(
              (_, index) => {
                return <div key={index}></div>;
              }
            )}
          </div>
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
