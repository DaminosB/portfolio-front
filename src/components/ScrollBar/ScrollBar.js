import styles from "./ScrollBar.module.css";

import { useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import runRecursiveAction from "@/utils/runRecursiveAction";

// Displays a custom scroll bar when the module's content overflows vertically
const ScrollBar = ({ customColors, metrics }) => {
  // References to the scroll bar's DOM elements
  const scrollBarContainerRef = useRef(null); // The container of the scroll bar
  const thumbRef = useRef(null); // The draggable thumb

  // Caches the Y-coordinate of the last click
  const previousClickYPositionRef = useRef(null);
  const previousDeltaYRef = useRef(null);

  // Inline styles for custom colors
  const containerInlineStyle = { color: customColors.secondaryColor };
  const markerInlineStyle = {
    backgroundColor: customColors.secondaryColor,
    borderColor: customColors.mainColor,
  };

  // Scrolls by a portion of the visible height when arrows are clicked
  const scrollByArrows = (multiplyer) => {
    const scrollBarParent = scrollBarContainerRef.current.parentNode;
    const scroller = scrollBarParent.querySelector('[data-role="scroller"');

    const scrollValue = multiplyer * (scroller.offsetHeight / 3);
    scroller.scrollBy({ top: scrollValue, behavior: "smooth" });
  };

  // Manages mouse events on the thumb for grabbing and dragging
  const handleThumbEvents = (e) => {
    // Scrolls instantly by a given deltaY when the thumb is dragged
    const scrollByDragging = (deltaY) => {
      const scrollBarParent = scrollBarContainerRef.current.parentNode;
      const scroller = scrollBarParent.querySelector('[data-role="scroller"');

      scroller.scrollBy({ top: deltaY, behavior: "instant" });
    };

    switch (e.type) {
      case "pointerdown":
        // Store the Y-coordinate of the initial click
        previousClickYPositionRef.current = e.clientY;
        break;

      case "pointermove":
        // Only proceed if the thumb is being dragged (mousedown was triggered)
        const previousClickYPosition = previousClickYPositionRef.current;
        if (previousClickYPosition === null || e.buttons === 0) return;

        const thumb = thumbRef.current;
        const track = thumb.parentNode;

        // Calculate the movement of the mouse relative to its last position
        const deltaY = e.clientY - previousClickYPosition;

        // Scale the movement to match the scroll ratio
        const multiplier = track.offsetHeight / thumb.offsetHeight;
        scrollByDragging(multiplier * deltaY);

        // Update the cached mouse position
        previousClickYPositionRef.current = e.clientY;
        previousDeltaYRef.current = deltaY;
        break;

      case "pointerup":
      case "pointerleave":
        if (
          previousClickYPositionRef.current === null ||
          previousDeltaYRef.current === null
        ) {
          return;
        }
        runRecursiveAction(scrollByDragging, previousDeltaYRef.current, 0.95);

        // Reset the cached click position and deltaX values
        previousClickYPositionRef.current = null;
        previousDeltaYRef.current = null;
        break;

      case "click":
        // Prevent the click event from bubbling up to the track
        e.stopPropagation();
        break;

      default:
        break;
    }
  };

  // Handles clicks on the scroll bar track to jump to a specific position
  const handleTrackClick = (e) => {
    const thumb = thumbRef.current;
    const track = thumb.parentNode;

    const scrollBarParent = scrollBarContainerRef.current.parentNode;
    const scroller = scrollBarParent.querySelector('[data-role="scroller"');

    // Calculate the position of the click on the track, centering the thumb
    const trackTop = track.getBoundingClientRect().top;
    const clickPosition = e.clientY - trackTop - thumb.offsetHeight / 2;

    // Convert the click position into a ratio of the track's height
    const clickRatio = clickPosition / track.offsetHeight;

    const scrollTarget = scroller.scrollHeight * clickRatio;
    scroller.scrollTo({ top: scrollTarget, behavior: "smooth" });
  };

  // Adjusts the thumb's size and position whenever metrics are updated
  useEffect(() => {
    const scrollBarContainer = scrollBarContainerRef.current;

    // Hide the scroll bar if no scrolling is needed
    if (metrics.thumbHeight >= 100) {
      scrollBarContainer.classList.add("hidden");
      return;
    } else {
      scrollBarContainer.classList.remove("hidden");
    }

    const thumb = thumbRef.current;
    const track = thumb.parentNode;

    // Set the thumb's height based on the metrics
    thumb.style.height = `${metrics.thumbHeight}%`;

    // Calculate and apply the thumb's vertical position
    const thumbPosition =
      (track.offsetHeight - thumb.offsetHeight) * metrics.scrollProgress;
    thumb.style.transform = `translateY(${thumbPosition}px)`;
  }, [metrics]);

  return (
    <div
      className={`${styles.scrollBarContainer} hidden`}
      ref={scrollBarContainerRef}
      style={containerInlineStyle}
    >
      <div>
        {/* Scroll up button */}
        <button onClick={() => scrollByArrows(-1)}>
          <FontAwesomeIcon icon={faChevronUp} />
        </button>

        {/* Scroll track */}
        <div className={styles.track} onClick={handleTrackClick}>
          {/* Draggable thumb */}
          <div
            className={`${styles.thumb} grabbable`}
            onPointerDown={handleThumbEvents}
            onPointerMove={handleThumbEvents}
            onPointerUp={handleThumbEvents}
            onPointerLeave={handleThumbEvents}
            onClick={handleThumbEvents}
            ref={thumbRef}
          >
            {/* Visual marker for the thumb */}
            <div className={styles.marker} style={markerInlineStyle}></div>
          </div>
        </div>

        {/* Scroll down button */}
        <button onClick={() => scrollByArrows(1)}>
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </div>
    </div>
  );
};

export default ScrollBar;
