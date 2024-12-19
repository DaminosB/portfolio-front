import styles from "./Carousel.module.css";

import { useEffect, useRef } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";

import VideoPlayer from "@/constructors/VideoPlayer/VideoPlayer";
import useScrollTracker from "@/hooks/useScrollTracker";
import NavigationButton from "../NavigationButton/NavigationButton";

import generateRGBAString from "@/utils/generateRGBAString";
import Image from "next/image";

// Carousel component that displays a series of media (images or videos) with horizontal sliding navigation
const Carousel = ({ mediasToDisplay, indexStart, customColors }) => {
  // mediasToDisplay: Array. List of media objects (with URLs and alternative texts) to display.
  // indexStart: Number. The initial position of the carousel on mount.
  // customColors: Object. Custom color scheme applied to carousel elements.

  // Hook that tracks scroll position and provides the index of the currently visible media
  const { scrollTrack, displayIndex } = useScrollTracker(true);

  // Reference to the container holding the media elements
  const sliderRef = useRef(null);

  // Function to handle clicks on left/right navigation buttons
  const handleSideButtons = (moveStep) => {
    const slider = sliderRef.current;
    const maxIndex = mediasToDisplay.length - 1;
    const targetIndex = displayIndex + moveStep;

    let scrollTarget = 0;

    // Scroll to the appropriate child based on target index, handling edge cases
    if (targetIndex <= maxIndex && targetIndex >= 0) {
      // Scroll to the child at the target index
      scrollTarget = slider.children[targetIndex].offsetLeft;
    } else if (targetIndex > maxIndex) {
      // If target index exceeds the maximum, scroll to the first child
      scrollTarget = 0;
    } else if (targetIndex < 0) {
      // If target index is below 0, scroll to the last child
      scrollTarget = slider.children[maxIndex].offsetLeft;
    }

    slider.scrollTo({ left: scrollTarget, behavior: "smooth" });
  };

  // Effect to set the initial scroll position based on indexStart when the component mounts
  useEffect(() => {
    const slider = sliderRef.current;

    const scrollTarget = slider.children[indexStart || 0].offsetLeft;
    slider.scrollTo({ left: scrollTarget, behavior: "instant" });
  }, [indexStart]);

  // Inline styles for the side buttons and navigation dots
  const sideButtonsInlineStyle = {
    color: customColors.secondaryColor,
  };

  const navInlineStyle = {
    backgroundColor: generateRGBAString(customColors.mainColor, 0.75),
    color: customColors.secondaryColor,
  };

  // Check if there are multiple media items to display navigation controls
  const hasMultipleMedias = mediasToDisplay.length > 1;

  return (
    <div
      className={styles.carouselContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.slider} ref={sliderRef} onScroll={scrollTrack}>
        {mediasToDisplay.map((media, index) => {
          // Determine whether the current media is an image or a video
          const isImageFile = media.provider_metadata.resource_type === "image";

          // Only play the video for the currently visible media
          const shouldPlayVideo = index === displayIndex;

          return (
            <div key={media.id}>
              {isImageFile ? (
                <Image
                  width={media.width}
                  height={media.height}
                  src={media.url}
                  alt={media.alternativeText}
                  draggable={false}
                />
              ) : (
                <VideoPlayer
                  video={media}
                  shouldPlayVideo={shouldPlayVideo}
                  customColors={customColors}
                >
                  <source src={media.url} />
                </VideoPlayer>
              )}
            </div>
          );
        })}
      </div>
      {/* Navigation controls (left/right arrows and dots) displayed only if there are multiple media items */}
      {hasMultipleMedias && (
        <>
          {/* Left arrow */}
          <button
            style={sideButtonsInlineStyle}
            onClick={() => handleSideButtons(-1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>

          {/* Right arrow */}
          <button
            style={sideButtonsInlineStyle}
            onClick={() => handleSideButtons(1)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>

          {/* Navigation dots */}
          <nav style={navInlineStyle}>
            {mediasToDisplay.map((media, index) => {
              // Each media is represented by a dot, which becomes larger when the media is active
              const isActive = index === displayIndex;

              // Handles the click on a dot to jump to the corresponding media
              const handleJumpButtons = () => {
                const slider = sliderRef.current;
                const scrollTarget = slider.children[index].offsetLeft;
                slider.scrollTo({ left: scrollTarget, behavior: "smooth" });
              };

              return (
                <NavigationButton
                  key={media.id}
                  isActive={isActive}
                  icon={faCircle}
                  onClickFunction={handleJumpButtons}
                />
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
};

export default Carousel;
