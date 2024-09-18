"use client";

import styles from "./MediaCardWrapper.module.css";

// React hooks import
import { useState, useEffect, useContext, useRef } from "react";

// Custom hooks import
import useGrabAndMove from "@/hooks/useGrabAndMove";

// Context import
import { ModuleContext } from "../ModuleWrapper/ModuleWrapper";
import { LayoutContext } from "../LayoutWrapper/LayoutWrapper";

// Components import
import SpotlightMarker from "@/components/SpotlightMarker/SpotlightMarker";
import ZoomButton from "@/components/ZoomButton/ZoomButton";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";

// This component wraps the displayed media in a standardized visualization
const MediaCardWrapper = ({
  customColors,
  media,
  relatedSiblings,
  id,
  preventContainedView,
  children,
}) => {
  // Stores the wrapper's DOM element
  const mediaCardWrapperRef = useRef(null);

  const isFirstRender = useRef(true);

  // The wrapper can display the media in its full width (making it grabbable and movable),
  // or contain its width to 100% of the parent.
  const [isContainedView, setIsContainedView] = useState(false);

  const [shouldPlayVideo, setShouldPlayVideo] = useState(true);

  // The media will be grabbable and movable in its parent if it overflows
  const {
    startGrab,
    grabbing,
    stopGrab,
    initGrabAndMove,
    isWorking,
    isResizing,
    metrics,
  } = useGrabAndMove();
  const { currentTranslateValue, containerWidth, childWidth } = metrics;

  // The overflow constant checks if the container is smaller than its child
  const contentOverflows = containerWidth < childWidth;
  const contentUnderflows = childWidth < containerWidth;

  // If in contained view or content doesn't overflow, show a button to zoom in the media
  const showZoomButton = isContainedView;

  const { isActiveSection, openCarousel } = useContext(ModuleContext);
  const { isModaleDisplayed } = useContext(LayoutContext);

  // This function switches the views of the media
  const toggleViews = () => {
    if (preventContainedView) return;

    // If the hook is working or if the wrapper is in normal view with no overflow, nothing happens
    if (isWorking || (!isContainedView && !contentOverflows)) return;

    const container = mediaCardWrapperRef.current.firstElementChild;
    const child = container.firstElementChild;

    // If the wrapper is not in contained view, switch to contained view
    if (!isContainedView) {
      setIsContainedView(true);

      // The media's height is by default 100% of its parent.
      // So to contain its width in its container, adjust its height accordingly.
      const newHeightPercent = 100 / (childWidth / containerWidth);
      container.style.height = `${newHeightPercent}%`;

      // To center the media in contained view, compensate for the translate value.
      child.style.left = `${-currentTranslateValue}px`;
    } else {
      // Otherwise, switch back to normal view and reset the style properties.
      setIsContainedView(false);

      container.style.height = "";
      child.style.left = "";
    }
  };

  // This function opens the media carousel modal
  const handleOpenCarousel = () => {
    setShouldPlayVideo(false);
    openCarousel(media.id);
  };

  // These events trigger the associated functions
  const eventHandlers = {
    touchstart: startGrab,
    mousedown: startGrab,
    touchmove: grabbing,
    mousemove: grabbing,
    touchend: stopGrab,
    mouseup: stopGrab,
    mouseleave: stopGrab,
    click: preventContainedView ? handleOpenCarousel : toggleViews,
  };

  // Handle event dispatching based on current interaction
  const handleEvents = (e) => {
    // If a resizing action is ongoing, ignore the event
    if (isResizing) return;

    const handler = eventHandlers[e.type];
    if (handler) handler(e);

    // If related siblings exist, dispatch the event to them
    if (relatedSiblings) dispatchEventToSiblings(e, relatedSiblings);
  };

  // Initialize the grab-and-move hook and check for overflow on mount
  useEffect(() => {
    const element = mediaCardWrapperRef.current.firstElementChild;
    if (isFirstRender.current) initGrabAndMove(element);

    // If the child's width is more than twice its parent's width,
    // automatically switch to contained view.
    const overflowExcess = childWidth / containerWidth > 2;
    if (overflowExcess && isFirstRender.current) {
      isFirstRender.current = false;
      toggleViews();
    }

    if (childWidth < containerWidth) {
      setIsContainedView(true);
    }

    if (isActiveSection && !isModaleDisplayed) setShouldPlayVideo(true);
    else setShouldPlayVideo(false);
  }, [childWidth, containerWidth, isActiveSection, isModaleDisplayed]);

  const cardBackgroundInlineStyle = {
    backgroundImage: `url(${media.url})`,
  };

  const cardContainerInlineStyle = {
    color: customColors.secondaryColor,
  };

  const isImageFile = media.provider_metadata.resource_type === "image";

  const expandButtonInlineStyle = {
    color: customColors.secondaryColor,
    backgroundColor: customColors.mainColor,
  };

  return (
    <div
      id={id}
      className={`${styles.mediaCardWrapper} ${
        isContainedView ? styles.contained : ""
      } ${contentUnderflows ? styles.underflow : ""}`}
      ref={mediaCardWrapperRef}
    >
      <div
        className={contentOverflows ? "grabbable" : ""}
        style={cardContainerInlineStyle}
        onTouchStart={handleEvents}
        onMouseDown={handleEvents}
        onMouseMove={handleEvents}
        onTouchMove={handleEvents}
        onMouseUp={handleEvents}
        onMouseLeave={handleEvents}
        onTouchEnd={handleEvents}
        onClick={isImageFile ? handleEvents : null}
      >
        {isImageFile ? (
          children
        ) : (
          <VideoPlayer
            video={media}
            shouldPlayVideo={shouldPlayVideo}
            customColors={customColors}
          >
            {children}
          </VideoPlayer>
        )}
        {/* --------------------------------------------------- */}
        {/* --------------------- BUTTONS --------------------- */}
        {/* --------------------------------------------------- */}
        {!preventContainedView && isImageFile && !contentUnderflows && (
          <div
            className={styles.buttonsContainer}
            onTouchStart={handleStopPropagation}
            onMouseDown={handleStopPropagation}
            onMouseMove={handleStopPropagation}
            onTouchMove={handleStopPropagation}
            onMouseUp={handleStopPropagation}
            onMouseLeave={handleStopPropagation}
            onTouchEnd={handleStopPropagation}
            onClick={handleStopPropagation}
          >
            <div className={!showZoomButton ? styles.active : "hidden"}>
              <SpotlightMarker
                customColors={customColors}
                onClickFunction={toggleViews}
                metrics={metrics}
              />
            </div>
            <div className={showZoomButton ? styles.active : "hidden"}>
              <ZoomButton
                customColors={customColors}
                onClickFunction={toggleViews}
              />
            </div>
          </div>
        )}
        <div
          className={styles.buttonsContainer}
          onTouchStart={handleStopPropagation}
          onMouseDown={handleStopPropagation}
          onMouseMove={handleStopPropagation}
          onTouchMove={handleStopPropagation}
          onMouseUp={handleStopPropagation}
          onMouseLeave={handleStopPropagation}
          onTouchEnd={handleStopPropagation}
          onClick={handleStopPropagation}
        >
          <button style={expandButtonInlineStyle} onClick={handleOpenCarousel}>
            <FontAwesomeIcon icon={faExpand} />
          </button>
        </div>
      </div>
      {/* --------------------------------------------------- */}
      {/* ------------------- BACKGROUND -------------------- */}
      {/* --------------------------------------------------- */}
      {!preventContainedView && (
        <div
          className={styles.cardBackground}
          style={cardBackgroundInlineStyle}
        ></div>
      )}
    </div>
  );
};

// Dispatch the event to all related sibling elements
const dispatchEventToSiblings = (originalEvent, relatedSiblings) => {
  // originalEvent: Object. The event object received when an event is triggered
  // relatedSiblings: Array. Ids of all the siblings that must receive the cloned event

  // Only proceed if the event was triggered by the user (not programmatically)
  if (originalEvent.isTrusted) {
    // Dynamically retrieve the constructor of the original event (e.g., MouseEvent, TouchEvent)
    const eventConstructorName = originalEvent.nativeEvent.constructor.name;
    const EventConstructor = window[eventConstructorName];

    // Create a new event using the same constructor and properties
    const clonedEvent = new EventConstructor(originalEvent.type, {
      ...originalEvent,
    });

    // Dispatch the new event to each related sibling element
    relatedSiblings.forEach((siblingId) => {
      const siblingTarget =
        document.getElementById(siblingId).firstElementChild;
      siblingTarget.dispatchEvent(clonedEvent);
    });
  }
};

// Function to stop event propagation
const handleStopPropagation = (e) => e.stopPropagation();

export default MediaCardWrapper;
