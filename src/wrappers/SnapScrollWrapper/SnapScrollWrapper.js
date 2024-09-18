"use client";

import styles from "./SnapScrollWrapper.module.css";

// React hooks imports
import { createContext, useEffect, useContext, useRef } from "react";
import { LayoutContext } from "../LayoutWrapper/LayoutWrapper";

import useScrollSticky from "@/hooks/useScrollSticky";

export const SnapScrollerContext = createContext();

// This wrapper is the parent of 1 or many sliders. It will handle the coordinates of the section that is to be displayed to the viewer
const SnapScrollWrapper = ({ children }) => {
  // The content is shown one section at a time. This state stores the coordinates of the active one (the one currently displayed)

  const { scrollSnap, jumpTo, scrollPosition } = useScrollSticky();
  const { notifyScrollChange } = useContext(LayoutContext);
  const containerRef = useRef(null);

  const getSectionCoords = (sectionId) => {
    const container = containerRef.current;

    const containerIndex = Array.from(container.parentNode.children).findIndex(
      (node) => node === container
    );

    const sectionIndex = Array.from(
      container.getElementsByTagName("SECTION")
    ).findIndex((section) => section.id === sectionId);

    return [containerIndex, sectionIndex];
  };

  const contextValues = {
    snapScrollerJumpFunc: jumpTo,
    snapScrollerPos: scrollPosition,
    getSectionCoords,
  };

  useEffect(() => {
    const container = containerRef.current;
    notifyScrollChange(container, scrollPosition);
  }, [scrollPosition]);

  return (
    // This wrapper acts as a window to display the content. It should not overflow the client's screen
    <SnapScrollerContext.Provider value={contextValues}>
      <div
        className={styles.snapScrollWrapper}
        onScroll={scrollSnap}
        ref={containerRef}
      >
        <div className={styles.slider}>{children}</div>
      </div>
    </SnapScrollerContext.Provider>
  );
};

export default SnapScrollWrapper;
