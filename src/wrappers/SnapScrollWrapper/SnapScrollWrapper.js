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
    displayIndex: activeChildIndex,
    scrollPosition,
  } = useScrollTracker();

  // At every activeChildIndex change, updates the container position
  useEffect(() => {
    const slider = containerRef.current;
    updateContainerPos(slider, activeChildIndex);
  }, [activeChildIndex, updateContainerPos]);

  const previousTouchYRef = useRef(null);

  // If the user scrolls down while at the bottom of the element, updates the endScrollValue
  const handleOnWheel = (e) => {
    const container = containerRef.current;

    const isAtBottom =
      Math.abs(
        scrollPosition - (container.scrollHeight - container.offsetHeight)
      ) <= 1;

    // If the container is not at the bottom, stop the function
    if (!isAtBottom) return;

    // Accumulates the downward scroll offset
    const { deltaY } = e;
    const newEndScrollValue = endScrollValue + deltaY;

    // If the accumulated scroll doesn't exceed the container's height, update the state
    if (newEndScrollValue <= container.offsetHeight && newEndScrollValue >= 0) {
      setEndScrollValue(newEndScrollValue);

      // Cache the current scroll value
      cachedScrollUpValue.current = endScrollValue;

      // If no further scrolling occurs, reset the scroll value after 500ms
      setTimeout(() => {
        if (cachedScrollUpValue.current === endScrollValue)
          setEndScrollValue(0);
      }, 500);
    }
  };

  const cachedScrollUpValue = useRef(0);

  // If the user scrolls on touch down while at the bottom of the element, updates the endScrollValue
  const handleTouchMove = (e) => {
    const { clientY } = e.changedTouches[0];
    const previousTouchY = previousTouchYRef.current;

    const container = containerRef.current;

    const isAtBottom =
      Math.abs(
        scrollPosition - (container.scrollHeight - container.offsetHeight)
      ) <= 1;

    // If the container is not at the bottom, stop the function
    if (!isAtBottom) return;

    // If it's the first touch, skip this part
    if (previousTouchY) {
      const deltaY = previousTouchY - clientY;

      // Accumulates the downward scroll offset with a multiplier to facilitate the movement
      const newEndScrollValue = (endScrollValue + deltaY) * 1.25;

      // If the accumulated scroll doesn't exceed the container's height, update the state
      if (newEndScrollValue <= container.offsetHeight && newEndScrollValue >= 0)
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
