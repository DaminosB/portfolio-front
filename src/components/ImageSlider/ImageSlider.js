"use client";

import styles from "./ImageSlider.module.css";

// ResizeObserver API. Will be used tto check if the image is wider than its parent
import ResizeObserver from "resize-observer-polyfill";

// React hooks imports
import { useState, useEffect, useRef } from "react";

import {
  applyButtonPos,
  moveButton,
  calcSliderMov,
} from "@/utils/imageSliderUtils";

// This component displays a sliding button that can be used to translate an image and let the viewer see it fully
const ImageSlider = ({ stylingObject, imageId }) => {
  // This stats marks if the button is being clicked or pressed
  const [isDragging, setIsDragging] = useState(false);

  // This states stores the current position of the button on its axis. 0 is left, 100 is right.
  const [buttonPosition, setButtonPosition] = useState(50);

  // These refs will be associated with the button annd the div used as an axis
  const imageSliderRef = useRef(null);

  // We store the current width of the image so we act only when it has changed
  const imageWidth = useRef(null);

  // This is a value we will update to throttle iur ResizeObserver function
  let resizeTimeout;

  //   This func is called anytime the image changes dimensions
  const resizeObserver = new ResizeObserver((entries) => {
    // It's triggered at evry pixel change so we need to put this security

    clearTimeout(resizeTimeout);

    if (imageSliderRef.current) {
      const element = imageSliderRef.current;
      resizeTimeout = setTimeout(() => {
        // This is the image we are monitoring
        const image = entries[0].target;

        // This is its parent
        const imageContainer = image.parentNode;

        // We check if the image is wider than its parent
        const isImageTooWide = image.scrollWidth > imageContainer.offsetWidth;

        if (isImageTooWide) {
          // If so, we display the component
          element.style.display = "unset";
          requestAnimationFrame(() => element.classList.remove("hidden"));

          //   We check if the function was triggered by a change on the dimensions
          const sizeHasChanged = image.scrollWidth !== imageWidth.current;
          if (sizeHasChanged) {
            // If so we have two funcs to call
            calcSliderMov([image], buttonPosition);
            applyButtonPos(element, buttonPosition);
            imageWidth.current = image.scrollWidth;
          }
        } else {
          // If the image is not wider, no need to displauy this component
          element.style.display = "none";
          requestAnimationFrame(() => element.classList.add("hidden"));
        }
      }, 750);
    }
  });

  const grabCursor = () => setIsDragging(true);
  const ungrabCursor = () => setIsDragging(false);
  const resetCursor = () => setButtonPosition(50);

  useEffect(() => {
    const image = document.getElementById(imageId);
    resizeObserver.observe(image);

    const imageContainer = image.parentNode;
    const isImageTooWide = image.scrollWidth > imageContainer.offsetWidth;
    if (isImageTooWide) {
      applyButtonPos(imageSliderRef.current, buttonPosition);
      calcSliderMov([image], buttonPosition);
    }

    return () => {
      resizeObserver.unobserve(image);
    };
  }, [buttonPosition]);

  const handleMoveButton = (e) => {
    if (isDragging)
      setButtonPosition(() => moveButton(e, imageSliderRef.current));
  };

  return (
    <div
      className={`${styles.imageSlider} hidden`}
      onMouseMove={handleMoveButton}
      onMouseLeave={ungrabCursor}
      ref={imageSliderRef}
    >
      <div className={styles.xAxis}></div>
      <button
        className={isDragging ? "grabbed" : "grabbable"}
        style={stylingObject}
        onMouseDown={grabCursor}
        onMouseUp={ungrabCursor}
        onMouseMove={handleMoveButton}
        onTouchStart={grabCursor}
        onTouchEnd={ungrabCursor}
        onTouchMove={handleMoveButton}
        onDoubleClick={resetCursor}
      ></button>
    </div>
  );
};

export default ImageSlider;
