"use client";

import styles from "./SnapScrollWrapper.module.css";

// React hooks imports
import { useEffect, useContext, useRef } from "react";
import { LayoutContext } from "../LayoutWrapper/LayoutWrapper";

import useScrollTracker from "@/hooks/useScrollTracker";

// This wrapper is the parent of 1 or many sliders. It will handle the coordinates of the section that is to be displayed to the viewer
const SnapScrollWrapper = ({ children }) => {
  // The content is shown one section at a time. This state stores the coordinates of the active one (the one currently displayed)

  const { updateContainerPos } = useContext(LayoutContext);
  const containerRef = useRef(null);

  const { scrollTrack, displayIndex: activeChildIndex } = useScrollTracker();

  // At every activeChildIndex change, updates the container position
  useEffect(() => {
    const slider = containerRef.current;
    updateContainerPos(slider, activeChildIndex);
  }, [activeChildIndex, updateContainerPos]);

  return (
    // This wrapper acts as a window to display the content. It should not overflow the client's screen
    <div className={styles.slider} ref={containerRef} onScroll={scrollTrack}>
      {children}
    </div>
  );
};

export default SnapScrollWrapper;
