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
  toggleDisplay,
} from "@/utils/imageSliderUtils";

// This component displays a sliding button that can be used to translate an image and let the viewer see it fully
const ImageSlider = ({ stylingObject, imagesIdsArray }) => {
  // This stats marks if the button is being clicked or pressed
  const [isDragging, setIsDragging] = useState(false);

  // This states stores the current position of the button on its axis. 0 is left, 100 is right.
  const [buttonPosition, setButtonPosition] = useState(50);

  // These refs will be associated with the button annd the div used as an axis
  const imageSliderRef = useRef(null);

  // This is a value we will update to throttle iur ResizeObserver function
  let resizeTimeout;

  //   This func is called anytime the image changes dimensions
  const resizeObserver = new ResizeObserver((entries) => {
    // It's triggered at evry pixel change so we need to put this security

    clearTimeout(resizeTimeout);

    if (imageSliderRef.current) {
      resizeTimeout = setTimeout(() => {
        const element = imageSliderRef.current;
        // This is the image we are monitoring
        const image = entries[0].target;
        toggleDisplay(element, image);
      }, 750);
    }
  });

  const grabCursor = () => setIsDragging(true);
  const ungrabCursor = () => setIsDragging(false);
  const resetCursor = () => setButtonPosition(50);

  useEffect(() => {
    const imagesArray = imagesIdsArray.map((imageId) =>
      document.getElementById(imageId)
    );

    const referenceImage = imagesArray[0];

    resizeObserver.observe(referenceImage);

    applyButtonPos(imageSliderRef.current, buttonPosition);
    calcSliderMov(imagesArray, buttonPosition);

    return () => {
      resizeObserver.unobserve(referenceImage);
    };
  }, [buttonPosition]);

  const handleMoveButton = (e) => {
    if (isDragging) {
      const value = moveButton(e, imageSliderRef.current);
      setButtonPosition(value);
    }
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

// const toggleDisplay = (domElement, image) => {
//   // This is its parent
//   const imageContainer = image.parentNode;

//   // We check if the image is wider than its parent
//   const isImageTooWide = image.scrollWidth > imageContainer.offsetWidth;

//   if (isImageTooWide) {
//     // If so, we display the component
//     domElement.style.display = "unset";
//     requestAnimationFrame(() => domElement.classList.remove("hidden"));
//   } else {
//     // If the image is not wider, no need to displauy this component
//     domElement.style.display = "none";
//     requestAnimationFrame(() => domElement.classList.add("hidden"));
//   }
// };

export default ImageSlider;
