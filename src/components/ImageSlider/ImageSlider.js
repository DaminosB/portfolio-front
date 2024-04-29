"use client";

import styles from "./ImageSlider.module.css";

// ResizeObserver API. Will be used tto check if the image is wider than its parent
import ResizeObserver from "resize-observer-polyfill";

// React hooks imports
import { useState, useEffect, useRef } from "react";

// This component displays a sliding button that can be used to translate an image and let the viewer see it fully
const ImageSlider = ({ stylingObject, imageId }) => {
  // This stats marks if the button is being clicked or pressed
  const [isDragging, setIsDragging] = useState(false);

  // This states stores the current position of the button on its axis. 0 is left, 100 is right.
  const [buttonPosition, setButtonPosition] = useState(50);

  // These refs will be associated with the button annd the div used as an axis
  const buttonRef = useRef(null);
  const xAxisRef = useRef(null);

  // We store the current width of the image so we act only when it has changed
  const imageWidth = useRef(null);

  // This func is called anytime the visitor moves over the button with their mouse or finger
  const moveButton = (e) => {
    // First we check if the button is clicked
    if (isDragging) {
      // If so we need te determine where the contact has taken place
      let contactPosition;

      // It depennds on the event that is the source of triggering
      if (e._reactName === "onTouchMove") {
        contactPosition = e.changedTouches[0].pageX;
      } else if (e._reactName === "onMouseMove") {
        contactPosition = e.clientX;
      }

      // To calculate the position of the cursor, we need to know the position of the left of the axis
      const axisRectLeft = xAxisRef.current.getBoundingClientRect().left;

      // And the radius of the button (in order to take the center into account)
      const buttonRadius = buttonRef.current.offsetWidth / 2;

      const cursorPosition = contactPosition - axisRectLeft - buttonRadius;

      // We give the value we found to the calc func
      calcButtonPos(cursorPosition);
    }
  };

  // This func applies the button's position on its axis from the position of the cursor
  const calcButtonPos = (cursorPosition) => {
    // The image can't move more to the right than the axis can reach
    const maxPosition =
      xAxisRef.current.offsetWidth - buttonRef.current.offsetWidth;

    // The value of the button's position on its axis is calculed here
    const value = (cursorPosition / maxPosition) * 100;

    // We had an extra security to ensure the min and max positions are 0 and 100
    if (value < 0) setButtonPosition(0);
    else if (value > 100) setButtonPosition(100);
    else setButtonPosition(value);
  };

  // This func applies the button's position to its CSS properties
  const applyButtonPos = () => {
    // This is the max value we can give to the button's CSS properties
    const maxPosition =
      xAxisRef.current.offsetWidth - buttonRef.current.offsetWidth;

    // We get the cursorPosition
    const cursorPosition = buttonPosition * (maxPosition / 100);

    // This is the position we will give to the button
    let finalPosition;

    // We had an extra security to ensure the min and max value are 0 and 100
    if (cursorPosition < 0) {
      finalPosition = 0;
    } else if (cursorPosition > maxPosition) {
      finalPosition = maxPosition;
    } else {
      finalPosition = cursorPosition;
    }

    // And we apply it
    buttonRef.current.style.left = `${finalPosition}px`;

    // Now lets make the axis disapear behind the button
    const buttonRightPos = finalPosition + buttonRef.current.offsetWidth;

    // From left af the axis to left of the button, the axis is black
    // Between the left and right of the button, the axis is transparent
    // From the right of the button to the right of the axis, the axis is black
    const xAxisColor = stylingObject.borderColor; // We want the button and the axis to be the same color
    xAxisRef.current.style.background = `linear-gradient(to right, ${xAxisColor} ${finalPosition}px, transparent ${finalPosition}px, transparent ${buttonRightPos}px, ${xAxisColor} ${buttonRightPos}px)`;
  };

  // This is a value we will update to throttle iur ResizeObserver function
  let resizeTimeout;

  //   This func is called anytime the image changes dimensions
  const resizeObserver = new ResizeObserver((entries) => {
    // It's triggered at evry pixel change so we need to put this security

    clearTimeout(resizeTimeout);

    if (buttonRef.current) {
      resizeTimeout = setTimeout(() => {
        // This is the image we are monitoring
        const image = entries[0].target;

        // This is its parent
        const imageContainer = image.parentNode;

        // We check if the image is wider than its parent
        const isImageTooWide = image.scrollWidth > imageContainer.offsetWidth;

        const imageSlider = buttonRef.current.parentNode;
        if (isImageTooWide) {
          // If so, we display the component
          imageSlider.style.display = "unset";
          requestAnimationFrame(() => imageSlider.classList.remove("hidden"));

          //   We check if the function was triggered by a change on the dimensions
          const sizeHasChanged = image.scrollWidth !== imageWidth.current;
          if (sizeHasChanged) {
            // If so we have two funcs to call
            calcSliderMov(image);
            applyButtonPos();
            imageWidth.current = image.scrollWidth;
          }
        } else {
          // If the image is not wider, no need to displauy this component
          imageSlider.style.display = "none";
          requestAnimationFrame(() => imageSlider.classList.add("hidden"));
        }
      }, 750);
    }
  });

  // When the sliding button is activated, the image moves accordingly
  const calcSliderMov = (image) => {
    // First we get the container's width
    const containerWidth = image.parentNode.offsetWidth;

    // Then we deduct the left max and min positions
    const sliderMinLeftPos = (containerWidth - image.scrollWidth) / 2;
    const sliderMaxLeftPos = -sliderMinLeftPos;

    // We multiply it by the value of buttonPosition to determine how much the slider needs to be translated
    const sliderTranslateValue =
      sliderMinLeftPos +
      (sliderMaxLeftPos - sliderMinLeftPos) * (buttonPosition / 100);

    // We apply the result
    image.style.transform = `translateX(${sliderTranslateValue}px)`;
  };

  const grabCursor = () => setIsDragging(true);
  const ungrabCursor = () => setIsDragging(false);
  const resetCursor = () => setButtonPosition(50);

  useEffect(() => {
    console.log(imageId, stylingObject);
    const image = document.getElementById(imageId);
    resizeObserver.observe(image);

    const imageContainer = image.parentNode;
    const isImageTooWide = image.scrollWidth > imageContainer.offsetWidth;
    if (isImageTooWide) {
      applyButtonPos();
      calcSliderMov(image);
    }

    return () => {
      resizeObserver.unobserve(image);
    };
  }, [buttonPosition]);

  return (
    <div
      className={`${styles.imageSlider} hidden`}
      onMouseMove={moveButton}
      onMouseLeave={ungrabCursor}
    >
      <div className={styles.xAxis} ref={xAxisRef}></div>
      <button
        ref={buttonRef}
        className={isDragging ? "grabbed" : "grabbable"}
        style={stylingObject}
        onMouseDown={grabCursor}
        onMouseUp={ungrabCursor}
        onMouseMove={moveButton}
        onTouchStart={grabCursor}
        onTouchEnd={ungrabCursor}
        onTouchMove={moveButton}
        onDoubleClick={resetCursor}
      ></button>
    </div>
  );
};

export default ImageSlider;
