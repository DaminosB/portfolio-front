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

  const { scrollTrack, displayIndex: activeChildIndex } = useScrollTracker();

  // At every activeChildIndex change, updates the container position
  useEffect(() => {
    const slider = containerRef.current;
    updateContainerPos(slider, activeChildIndex);
  }, [activeChildIndex, updateContainerPos]);

  const previousTouchYRef = useRef(null);

  // If the user scrolls down while at the bottom of the element, updates the endScrollValue
  const handleOnWheel = (e) => {
    const container = containerRef.current;

    const { deltaY } = e;

    // If the container is at the bottom and the scroll event is going downward
    if (deltaY > 0) {
      // Accumulates the downward scroll offset
      const newEndScrollValue = endScrollValue + deltaY;

      // If the accumulated scroll doesn't exceed the container's height, update the state
      if (newEndScrollValue <= container.offsetHeight)
        setEndScrollValue(newEndScrollValue);
    }
  };

  // If the user scrolls on touch down while at the bottom of the element, updates the endScrollValue
  const handleTouchMove = (e) => {
    const { clientY } = e.changedTouches[0];
    const previousTouchY = previousTouchYRef.current;

    // If it's the first touch, skip this part
    if (previousTouchY) {
      const container = containerRef.current;

      const deltaY = previousTouchY - clientY;

      // Accumulates the downward scroll offset
      const newEndScrollValue = endScrollValue + deltaY;

      // If the accumulated scroll doesn't exceed the container's height, update the state
      if (newEndScrollValue <= container.offsetHeight)
        setEndScrollValue(newEndScrollValue);

      // Reset previousTouchYRef if it's last touch
      setTimeout(() => {
        if (clientY === previousTouchYRef.current) {
          previousTouchYRef.current = null;
        }
      }, 500);
    }

    // Update the ref
    previousTouchYRef.current = clientY;
  };

  return (
    // This wrapper acts as a window to display the content. It should not overflow the client's screen
    <div
      className={styles.slider}
      ref={containerRef}
      onScroll={scrollTrack}
      onWheel={handleOnWheel}
      onTouchMove={handleTouchMove}
    >
      {children}
    </div>
  );
};

export default SnapScrollWrapper;
