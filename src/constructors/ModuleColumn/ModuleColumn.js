"use client";
import { ModuleContext } from "../ModuleWrapper/ModuleWrapper";
import styles from "./ModuleColumn.module.css";

import { useRef, useContext, useEffect } from "react";

const ModuleColumn = ({ children }) => {
  const columnRef = useRef(null);

  // Store the previous touch position and delta for touch events
  const previousTouchPositionsRef = useRef({ x: 0, y: 0 });
  const previousDeltaY = useRef(0);

  const { updateScrollMetrics } = useContext(ModuleContext);

  // Controls the scrolling behavior of sibling columns and the parent element
  const handleScrollControl = (column, deltaX, deltaY, e) => {
    if (Math.abs(deltaX) > Math.abs(deltaY)) return;

    // Retrieve all sibling columns in the parent container
    const siblingColumns = Array.from(column.parentNode.children);

    // Identify the closest parent element that can scroll vertically
    const parentScrollableContainer = column.closest("div:has(> section)");

    // Check if all sibling columns are fully scrolled to the top or bottom
    const allScrolledToTop = siblingColumns.every(
      (sibling) => sibling.scrollTop === 0
    );
    const allScrolledToBottom = siblingColumns.every(
      (sibling) =>
        sibling.scrollHeight - (sibling.scrollTop + sibling.offsetHeight) < 1
    );

    // Allow the parent to scroll if all siblings have reached their end in the current scroll direction
    const allowParentScroll =
      (deltaY > 0 && allScrolledToBottom) || (deltaY < 0 && allScrolledToTop);

    if (allowParentScroll) {
      parentScrollableContainer.style.overflowY = ""; // Enable parent scrolling
    } else {
      parentScrollableContainer.style.overflowY = "hidden"; // Disable parent scrolling

      // Prevent the event from bubbling up to the parent and scroll siblings
      e.stopPropagation();
      e.preventDefault();
      scrollSiblingColumns(siblingColumns, deltaY);
    }
  };

  // Scrolls all sibling columns in sync
  const scrollSiblingColumns = (siblingColumns, deltaY) => {
    siblingColumns.forEach((sibling) => {
      sibling.scrollBy({ top: deltaY, behavior: "auto" });
    });
  };

  // Handles wheel events for synchronized scrolling
  const handleWheelEvent = (e) => {
    handleScrollControl(e.currentTarget, e.deltaX, e.deltaY, e);
  };

  // Handles touch events for synchronized scrolling
  const handleTouchEvent = (e) => {
    const column = columnRef.current;

    switch (e.type) {
      case "touchstart":
        // Store the initial touch position
        previousTouchPositionsRef.current = {
          x: e.targetTouches[0].clientX,
          y: e.targetTouches[0].clientY,
        };
        break;

      case "touchmove":
        // Calculate the vertical scroll distance between the last touch and the current touch position

        const previousTouchPositions = previousTouchPositionsRef.current;

        const deltaX = previousTouchPositions.x - e.targetTouches[0].clientX;
        const deltaY = previousTouchPositions.y - e.targetTouches[0].clientY;

        handleScrollControl(column, deltaX, deltaY, e);

        previousTouchPositionsRef.current = {
          x: e.targetTouches[0].clientX,
          y: e.targetTouches[0].clientY,
        };
        previousDeltaY.current = deltaY;
        break;

      case "touchend":
        // After touch end, apply a decelerating scroll effect
        const siblingColumns = Array.from(column.parentNode.children);

        // Start with the last scroll distance and reduce gradually
        let animatedScrollDistance = previousDeltaY.current;

        // Continuously scroll siblings with diminishing distance for a smooth deceleration
        const step = () => {
          scrollSiblingColumns(siblingColumns, animatedScrollDistance);
          animatedScrollDistance /= 1.1;
          // animatedScrollDistance /= 1.15;
          if (Math.abs(animatedScrollDistance) > 0.1) {
            requestAnimationFrame(step);
          } else {
            previousDeltaY.current = 0;
          }
        };
        requestAnimationFrame(step);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    const column = columnRef.current;

    updateScrollMetrics(column, 0);

    column.addEventListener("wheel", handleWheelEvent, { passive: false });
    column.addEventListener("touchstart", handleTouchEvent, { passive: false });
    column.addEventListener("touchmove", handleTouchEvent, { passive: false });
    column.addEventListener("touchend", handleTouchEvent, { passive: false });

    return () => {
      column.removeEventListener("wheel", handleWheelEvent, { passive: false });
      column.removeEventListener("touchstart", handleTouchEvent, {
        passive: false,
      });
      column.removeEventListener("touchmove", handleTouchEvent, {
        passive: false,
      });
      column.removeEventListener("touchend", handleTouchEvent, {
        passive: false,
      });
    };
  }, []);

  const handleOnScroll = () => {
    const column = columnRef.current;
    updateScrollMetrics(column, column.scrollTop);
  };

  return (
    <div className={styles.column} ref={columnRef} onScroll={handleOnScroll}>
      {children}
    </div>
  );
};

export default ModuleColumn;
