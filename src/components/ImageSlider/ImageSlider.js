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
const ImageSlider = ({ stylingObject, imagesIdsArray }) => {
  // This stats marks if the button is being clicked or pressed
  const [isDragging, setIsDragging] = useState(false);

  // This states stores the current position of the button on its axis. 0 is left, 100 is right.
  const [buttonPosition, setButtonPosition] = useState(50);

  // These refs will be associated with the button annd the div used as an axis
  const imageSliderRef = useRef(null);

  // This is a value we will update to throttle iur ResizeObserver function
  let resizeTimeout;

  const toggleDisplay = (domElement, image) => {
    // This is its parent
    const imageContainer = image.parentNode;

    // We put a condition on whether or not the slider must be displayed
    let displayImageSlider = false;

    // We check if the image is wider than its parent
    const isImageTooWide = image.scrollWidth > imageContainer.offsetWidth;

    // First scenario : if the imageSlider has multiple images to slide
    if (imagesIdsArray.length > 1) {
      // In that case, the image slider is put through a portal and is a child of <main>
      // So the image slider may appear even on the cover
      const headerNode = document.getElementsByTagName("HEADER")[0];

      // So we check if we currently are on the cover. The indicator is the presence of "hidden" class on the header
      const headerIsHidden = Array.from(headerNode.classList).includes(
        "hidden"
      );

      // If the image is too wide, and we are not on the cover, the slider may appear
      displayImageSlider = headerIsHidden && isImageTooWide;
    } else if (imagesIdsArray.length === 1) {
      // Second scenario : if the imageSlider has one image to slide

      // We just check if the image is too wide. if so, the slider may appear
      displayImageSlider = isImageTooWide;
    }

    if (displayImageSlider) {
      // If so, we display the component
      domElement.style.display = "unset";
      requestAnimationFrame(() => domElement.classList.remove("hidden"));

      calcSliderMov([image], buttonPosition);
      applyButtonPos(domElement, buttonPosition);
    } else {
      // If the image is not wider, no need to displauy this component
      domElement.style.display = "none";
      requestAnimationFrame(() => domElement.classList.add("hidden"));
    }
  };

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

    const imageContainer = referenceImage.parentNode;
    const isImageTooWide =
      referenceImage.scrollWidth > imageContainer.offsetWidth;
    if (isImageTooWide) {
      applyButtonPos(imageSliderRef.current, buttonPosition);
      calcSliderMov(imagesArray, buttonPosition);
    }

    return () => {
      resizeObserver.unobserve(referenceImage);
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
