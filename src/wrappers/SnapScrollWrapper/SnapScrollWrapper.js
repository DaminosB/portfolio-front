"use client";

import styles from "./SnapScrollWrapper.module.css";

// React hooks imports
import { useEffect, useContext, useRef } from "react";
import { LayoutContext } from "../LayoutWrapper/LayoutWrapper";

import useScrollTracker from "@/hooks/useScrollTracker";

// This wrapper is the parent of 1 or many sliders. It will handle the coordinates of the section that is to be displayed to the viewer
const SnapScrollWrapper = ({ children }) => {
  // The content is shown one section at a time. This state stores the coordinates of the active one (the one currently displayed)

  const { updateContainerPos, endScrollValue, setEndScrollValue } =
    useContext(LayoutContext);
  const containerRef = useRef(null);

  const {
    scrollTrack,
    scrollPosition,
    displayIndex: activeChildIndex,
  } = useScrollTracker();

  // At every activeChildIndex change, updates the container position
  useEffect(() => {
    const slider = containerRef.current;
    updateContainerPos(slider, activeChildIndex);
  }, [activeChildIndex, updateContainerPos]);

  // If the user scrolls down while at the bottom of the element, updates the endScrollValue
  const handleOnWheel = (e) => {
    const { deltaY } = e;
    const container = containerRef.current;

    // Determines if the container is scrolled to the bottom
    const isAtBottom =
      scrollPosition === container.scrollHeight - container.offsetHeight;

    // If the container is at the bottom and the scroll event is going downward
    if (isAtBottom && deltaY > 0) {
      // Accumulates the downward scroll offset
      const newEndScrollValue = endScrollValue + deltaY;

      // If the accumulated scroll doesn't exceed the container's height, update the state
      if (newEndScrollValue <= container.offsetHeight)
        setEndScrollValue(newEndScrollValue);
    }
  };

  return (
    // This wrapper acts as a window to display the content. It should not overflow the client's screen
    <div
      className={styles.slider}
      ref={containerRef}
      onScroll={scrollTrack}
      onWheel={handleOnWheel}
      onTouchMove={(e) => console.log(e)}
    >
      {children}
    </div>
  );
};

export default SnapScrollWrapper;
