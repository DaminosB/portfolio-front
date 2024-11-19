import styles from "./ScrollBar.module.css";

import { useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

// Displays a custom scroll bar when the module's content overflows vertically
const ScrollBar = ({
  customColors,
  metrics,
  arrowsFunction,
  grabbingFunction,
  scrollToClickPosition,
}) => {
  // References to the scroll bar's DOM elements
  const scrollBarContainerRef = useRef(null); // The container of the scroll bar
  const thumbRef = useRef(null); // The draggable thumb

  // Caches the Y-coordinate of the last click
  const previousClickYPositionRef = useRef(null);

  // Inline styles for custom colors
  const containerInlineStyle = { color: customColors.secondaryColor };
  const markerInlineStyle = { backgroundColor: customColors.secondaryColor };

  // Manages mouse events on the thumb for grabbing and dragging
  const handleThumbEvents = (e) => {
    const clientY = e.clientY || e.changedTouches[0].clientY;
    switch (e.type) {
      case "touchstart":
      case "mousedown":
        // Store the Y-coordinate of the initial click
        previousClickYPositionRef.current = clientY;
        break;

      case "touchmove":
      case "mousemove":
        // Only proceed if the thumb is being dragged (mousedown was triggered)
        const previousClickYPosition = previousClickYPositionRef.current;
        if (previousClickYPosition === null) return;

        const thumb = thumbRef.current;
        const track = thumb.parentNode;

        // Calculate the movement of the mouse relative to its last position
        const deltaY = clientY - previousClickYPosition;

        // Scale the movement to match the scroll ratio
        const multiplier = track.offsetHeight / thumb.offsetHeight;
        grabbingFunction(multiplier * deltaY);

        // Update the cached mouse position
        previousClickYPositionRef.current = clientY;
        break;

      case "touchend":
      case "mouseup":
      case "mouseleave":
        // Reset the cached position on click release
        previousClickYPositionRef.current = null;
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

    // Calculate the position of the click on the track, centering the thumb
    const trackTop = track.getBoundingClientRect().top;
    const clickPosition = e.clientY - trackTop - thumb.offsetHeight / 2;

    // Convert the click position into a ratio of the track's height
    const clickRatio = clickPosition / track.offsetHeight;
    scrollToClickPosition(clickRatio);
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
      (track.offsetHeight - thumb.offsetHeight) * metrics.scrollRatio;
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
        <button onClick={() => arrowsFunction(-1)}>
          <FontAwesomeIcon icon={faChevronUp} />
        </button>

        {/* Scroll track */}
        <div className={styles.track} onClick={handleTrackClick}>
          {/* Draggable thumb */}
          <div
            className={`${styles.thumb} grabbable`}
            onMouseDown={handleThumbEvents}
            onMouseMove={handleThumbEvents}
            onMouseUp={handleThumbEvents}
            onMouseLeave={handleThumbEvents}
            onTouchStart={handleThumbEvents}
            onTouchMove={handleThumbEvents}
            onTouchEnd={handleThumbEvents}
            onClick={handleThumbEvents}
            ref={thumbRef}
          >
            {/* Visual marker for the thumb */}
            <div className={styles.marker} style={markerInlineStyle}></div>
          </div>
        </div>

        {/* Scroll down button */}
        <button onClick={() => arrowsFunction(1)}>
          <FontAwesomeIcon icon={faChevronDown} />
        </button>
      </div>
    </div>
  );
};

export default ScrollBar;
