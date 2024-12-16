"use client";

import styles from "./MediaCardWrapper.module.css";

// Import React hooks
import { useState, useEffect, useContext, useRef, useMemo } from "react";

// Import custom hooks
import useGrabAndMove from "@/hooks/useGrabAndMove";

// Import context providers
import { ModuleContext } from "../ModuleWrapper/ModuleWrapper";

// Import FontAwesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

// Import components
import SpotlightMarker from "@/components/SpotlightMarker/SpotlightMarker";
import VideoPlayer from "@/constructors/VideoPlayer/VideoPlayer";

import generateRGBAString from "@/utils/generateRGBAString";

// MediaCardWrapper component manages how media (image or video) is displayed
const MediaCardWrapper = ({
  customColors,
  media,
  cardId,
  relatedSiblings,
  children,
}) => {
  // Reference to the media card wrapper element
  const mediaCardWrapperRef = useRef(null);

  // Determines if the media should be displayed in a contained view
  const [isContainedView, setIsContainedView] = useState(false);

  // Use custom hook for handling grab-and-move functionality
  const { startGrab, grabbing, stopGrab, initGrabAndMove, isWorking, metrics } =
    useGrabAndMove();
  const { containerWidth, childWidth } = metrics;

  // Access context values
  const { isActiveSection, openCarousel, showModale } =
    useContext(ModuleContext);

  // Controls whether the video should play or not
  const shouldPlayVideo = useMemo(
    () => isActiveSection && !showModale,
    [isActiveSection, showModale]
  );

  // Function to open the media carousel modal
  const handleOpenCarousel = () => {
    openCarousel(media.id);
  };

  // Handle user interactions and propagate events if necessary
  const handleEvents = (e) => {
    // Event handlers for various user interactions (mouse/touch)
    const events = {
      pointerdown: grabbable ? startGrab : null,
      pointermove: grabbable ? grabbing : null,
      pointerup: grabbable ? stopGrab : null,
      click: onClick,
    };

    const handler = events[e.type];
    if (handler) handler(e);

    // Propagate the event to related sibling elements, if any
    if (relatedSiblings) dispatchEventToSiblings(e, relatedSiblings);
  };

  // Toggle between normal and contained views
  const toggleViews = () => {
    if (isWorking || !isActiveSection) return; // Prevent toggling if the grab-and-move hook is active or if the section is not displayed
    setIsContainedView((prev) => !prev);
  };

  // Display mode configuration based on the calculated mode
  const displayModeSettings = {
    excess: {
      defaultContained: true, // Contained view by default
      onClick: toggleViews, // Switch between contained and normal views
      grabbable: true, // Enable grab-and-move functionality
      display: {
        allowContainedView: true,
        background: false,
      },
    },
    overflow: {
      defaultContained: false, // Normal view by default
      onClick: toggleViews,
      grabbable: true,
      display: {
        allowContainedView: true,
        background: false,
      },
    },
    fit: {
      defaultContained: false, // No need for contained view
      onClick: media.addToCarousel ? handleOpenCarousel : null, // Open the carousel for media
      grabbable: false, // No grab-and-move required
      display: {
        allowContainedView: false, // The media is already contained
        background: false,
      },
    },
    underflow: {
      defaultContained: false,
      onClick: media.addToCarousel ? handleOpenCarousel : null,
      grabbable: false,
      display: {
        allowContainedView: false,
        background: true, // Background is needed for smaller media
      },
    },
  };

  // Manages the current display mode of the media ("overflow", "underflow", etc.)
  const displayMode = useMemo(() => {
    if (childWidth < containerWidth) return "underflow";
    else if (childWidth === containerWidth) return "fit";
    else if (childWidth / containerWidth > 2) return "excess";
    else return "overflow";
  }, [containerWidth, childWidth]);

  // Destructure the settings for the current display mode
  const { defaultContained, onClick, grabbable, display } =
    displayModeSettings[displayMode];

  // Initialize grab-and-move functionality and determine display mode on component mount
  useEffect(() => {
    initGrabAndMove(mediaCardWrapperRef.current.firstElementChild);

    // Set default view based on the display mode
    setIsContainedView(defaultContained);
  }, [initGrabAndMove, defaultContained]);

  // Check if the media is an image file
  const isImageFile = media.provider_metadata.resource_type === "image";

  // Inline styles
  const containerInlineStyle = {
    color: customColors.secondaryColor,
  };
  const mainColorBackground = {
    backgroundColor: customColors.mainColor,
  };
  const captionInlineStyle = {
    backgroundColor: generateRGBAString(customColors.mainColor, 0.5),
  };

  return (
    <div
      className={`${styles.mediaCardWrapper} ${
        isContainedView ? styles.contained : ""
      }`}
      style={containerInlineStyle}
      ref={mediaCardWrapperRef}
      id={cardId ? cardId : `media-card-${media.id}`}
    >
      <div
        className={`${styles.mediaWindow} ${grabbable ? "grabbable" : ""}`}
        onPointerDown={handleEvents}
        onPointerMove={handleEvents}
        onPointerUp={handleEvents}
        onClick={handleEvents}
      >
        {isImageFile ? (
          <>
            {children}
            {media.caption && (
              <div
                style={captionInlineStyle}
                onPointerDown={handleStopPropagation}
                onPointerMove={handleStopPropagation}
                onPointerUp={handleStopPropagation}
              >
                <span>{media.caption}</span>
              </div>
            )}
          </>
        ) : (
          <VideoPlayer
            video={media}
            shouldPlayVideo={shouldPlayVideo}
            customColors={customColors}
          >
            {children}
          </VideoPlayer>
        )}
      </div>

      {/* --------------------------------------------------- */}
      {/* --------------------- BUTTONS --------------------- */}
      {/* --------------------------------------------------- */}
      {/* Display buttons (SpotlightMarker, ZoomButton, and Expand Button) */}
      {isImageFile && display.allowContainedView && (
        <div className={styles.buttonsContainer}>
          <div className={!isContainedView ? styles.active : "hidden"}>
            <SpotlightMarker
              customColors={customColors}
              onClickFunction={toggleViews}
              metrics={metrics}
            />
          </div>
          <div className={isContainedView ? styles.active : "hidden"}>
            <button style={mainColorBackground} onClick={toggleViews}>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </button>
          </div>
        </div>
      )}
      {media.addToCarousel && (
        <div className={styles.buttonsContainer}>
          <button style={mainColorBackground} onClick={handleOpenCarousel}>
            <FontAwesomeIcon icon={faExpand} />
          </button>
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* ------------------- ALT DISPLAY ------------------- */}
      {/* --------------------------------------------------- */}
      {/* Alternative display for contained view */}
      {isImageFile && display.allowContainedView && (
        <div className={styles.altDisplay} onClick={toggleViews}>
          {children}
        </div>
      )}

      {/* --------------------------------------------------- */}
      {/* -------------------- BACKGROUND ------------------- */}
      {/* --------------------------------------------------- */}
      {/* Background for underflow display mode */}
      {isImageFile && display.background && (
        <div className={styles.background} onClick={handleOpenCarousel}>
          {children}
        </div>
      )}
    </div>
  );
};

export default MediaCardWrapper;

// Dispatch event to related sibling elements
const dispatchEventToSiblings = (originalEvent, relatedSiblings) => {
  if (originalEvent.isTrusted) {
    // Clone the original event to be dispatched to sibling elements
    const eventConstructorName = originalEvent.nativeEvent.constructor.name;
    const EventConstructor = window[eventConstructorName];
    const clonedEvent = new EventConstructor(originalEvent.type, {
      ...originalEvent,
    });

    // Dispatch the cloned event to each sibling
    relatedSiblings.forEach((siblingId) => {
      const siblingElement = document.getElementById(siblingId);

      // Vérifie que l'élément et son firstElementChild existent
      if (siblingElement && siblingElement.firstElementChild) {
        const siblingTarget = siblingElement.firstElementChild;
        siblingTarget.dispatchEvent(clonedEvent);
      }
    });
  }
};

// Prevent event propagation
const handleStopPropagation = (e) => e.stopPropagation();
