"use client";

import styles from "./EndScrollPanel.module.css";

// Hooks import
import { useState, useEffect, useContext, useRef } from "react";
import { createPortal } from "react-dom";
import { LayoutContext } from "../LayoutWrapper/LayoutWrapper";

// Utils import
import generateRGBAString from "@/utils/generateRGBAString";

// This component serves as a wrapper for content that is revealed at the bottom of the page
// The content slides up when the user scrolls down after reaching the bottom of the page
const EndScrollPanel = ({ customColors, children }) => {
  // State to store the DOM target for the portal (which will be the <body>)
  const [targetDom, setTargetDom] = useState(null);

  // Inline styles for the container, with a semi-transparent background color
  const containerInlineStyle = {
    backgroundColor: generateRGBAString(customColors.mainColor, 0.5),
  };

  // Ref to store the container DOM element
  const containerRef = useRef(null);

  // Retrieves scroll-related values from the LayoutContext
  const { endScrollValue, setEndScrollValue } = useContext(LayoutContext);

  // Ref to store the previous touch position, used to detect deltaY touch positions
  const previousTouchYRef = useRef(null);

  // Ref to store the previous endScrollValue, used to detect changes
  const cachedScrollUpValue = useRef(0);

  // Handles the scroll wheel event, resetting the scroll position if the user scrolls up while the component is fully visible
  const handleOnWheel = (e) => {
    const container = containerRef.current;
    const content = container.firstElementChild;
    const isAtTop = content.scrollTop === 0;

    // If the user scrolls up while the component is fully visible, reset the scroll value
    if (isAtTop && e.deltaY < 0) setEndScrollValue(0);
    else if (isAtTop) {
      const newEndScrollValue = endScrollValue + e.deltaY;

      // If the accumulated scroll doesn't exceed the container's height, update the state
      if (newEndScrollValue <= container.offsetHeight && newEndScrollValue >= 0)
        setEndScrollValue(newEndScrollValue);
    }
  };

  // Handles the touch scroll event, resetting the scroll position if the user scrolls up while the component is fully visible
  const handleOnTouchMove = (e) => {
    const { clientY } = e.changedTouches[0];
    const previousTouchY = previousTouchYRef.current;

    // If it's the first touch, skip this part
    if (previousTouchY) {
      const container = containerRef.current;
      const content = container.firstElementChild;

      const isAtTop = content.scrollTop === 0;
      const deltaY = previousTouchY - clientY;

      // If the user scrolls up while the component is fully visible, reset the scroll value
      if (isAtTop && deltaY < 0) setEndScrollValue(0);
      else if (isAtTop) {
        const newEndScrollValue = endScrollValue + e.deltaY;

        // If the accumulated scroll doesn't exceed the container's height, update the state
        if (
          newEndScrollValue <= container.offsetHeight &&
          newEndScrollValue >= 0
        )
          setEndScrollValue(newEndScrollValue);
      }

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

  // Sets the portal target and updates the position of the component based on endScrollValue
  useEffect(() => {
    // Initializes the portal target on first render
    if (!targetDom) setTargetDom(document.body);
    // Updates the component's position if endScrollValue changes
    else if (cachedScrollUpValue.current !== endScrollValue) {
      const container = containerRef.current;

      // If the component is scrolled less than halfway up and more than 0, move it accordingly
      if (endScrollValue < container.offsetHeight / 2 && endScrollValue !== 0) {
        // Disable transition for smooth movement based on scroll
        container.classList.remove(styles.transition);

        // Move the component by the corresponding scroll offset
        container.style.transform = `translateY(${-endScrollValue}px)`;

        // Cache the current scroll value
        cachedScrollUpValue.current = endScrollValue;

        // If no further scrolling occurs, reset the scroll value after 500ms
        setTimeout(() => {
          if (cachedScrollUpValue.current === endScrollValue)
            setEndScrollValue(0);
        }, 500);
      } else {
        // If scrolled more than halfway or no scroll, move the component fully up or reset
        container.classList.add(styles.transition);

        // Set the component's position based on scroll value
        const newTranslateValue =
          endScrollValue === 0 ? 0 : container.offsetHeight;

        container.style.transform = `translateY(${-newTranslateValue}px)`;
        cachedScrollUpValue.current = newTranslateValue;
        setEndScrollValue(newTranslateValue);
      }
    }
  }, [targetDom, endScrollValue, setEndScrollValue]);

  // Renders the component into a portal attached to <body>
  return (
    targetDom &&
    createPortal(
      <div
        className={styles.projectsPortal}
        ref={containerRef}
        style={containerInlineStyle}
        onWheel={handleOnWheel}
        onTouchMove={handleOnTouchMove}
      >
        {children}
      </div>,
      targetDom
    )
  );
};

export default EndScrollPanel;
