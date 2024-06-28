import styles from "./TranslationOverview.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPanorama } from "@fortawesome/free-solid-svg-icons";

import { useContext, useEffect, useRef } from "react";
import { MediasWrapperContext } from "../MediasWrapper/MediasWrapper";

// This component displays an image with a spotlight that moves in sync with the draggable image, highlighting the visible part and showing a modal with the image details when clicked
const TranslationOverview = ({
  customColors,
  media,
  currentTranslateValue,
  containerId,
}) => {
  const { setModaleContent } = useContext(MediasWrapperContext);

  // Style for the button. Font and background colors are the same to hide the icon
  const buttonInlineStyle = {
    backgroundColor: customColors.mainColor,
    color: customColors.mainColor,
  };

  // Style for the spotlight div, which highlights the visible part of the icon
  const spotlightStyle = {
    backgroundColor: customColors.secondaryColor,
  };

  const spotlightRef = useRef(null);

  // References for the spotlight's position and width
  const spotlightLeftPos = useRef(null);
  const spotlightWidthRef = useRef(null);

  // References for the maximum translation values
  const spotlightMaxTransValueRef = useRef(null);
  const imageMaxTranslateValueRef = useRef(null);

  // Function called whenever the translation changes to move the spotlight accordingly
  useEffect(() => {
    const spotlight = spotlightRef.current;
    const spotlightMaxTransValue = spotlightMaxTransValueRef.current;
    const imageMaxTranslateValue = imageMaxTranslateValueRef.current;

    // These values are needed to calculate the new spotlight div position. If they are not known we must calculate them
    if (
      !spotlightMaxTransValue ||
      !imageMaxTranslateValue ||
      !spotlightWidthRef
    ) {
      const imageCard = document.getElementById(containerId);

      // These are the dimensions of the image's parent
      const imageCardWidth = imageCard.offsetWidth;
      const imageCardHeight = imageCard.offsetHeight;

      // These are the dimensions of the image file
      const imageFileHeight = media.height;
      const imageFileWidth = media.width;

      // It lets us calculate the width of the image in the DOM
      const imageOnScreenWidth = Math.floor(
        (imageCardHeight / imageFileHeight) * imageFileWidth
      );

      // With that, we can calculate the width ratio of the spotlight div in its parent
      const spotlightWidth = (imageCardWidth / imageOnScreenWidth) * 100;
      spotlight.style.width = `${spotlightWidth}%`;

      const spotlightParentWidth = spotlight.parentNode.offsetWidth;

      // Then we calculate the max translation value of each element
      //   These values are not supposed to change, so we store them as we will use them in other functions
      spotlightMaxTransValueRef.current =
        (spotlightParentWidth - spotlight.offsetWidth) / 2;

      imageMaxTranslateValueRef.current =
        (imageOnScreenWidth - imageCardWidth) / 2;

      spotlightWidthRef.current = spotlightWidth;
    }

    // From the current translation value, we can calculate the spotlight's new position
    const multiplier = 1 - currentTranslateValue / imageMaxTranslateValue;
    const positionValue = multiplier * spotlightMaxTransValue;
    spotlight.style.left = `${positionValue}px`;

    // We store this value as we will need it later
    spotlightLeftPos.current = positionValue;
  }, [currentTranslateValue, containerId, media]);

  // On click, a modale is displayed
  const handleOnClick = (e) => {
    handleStopPropagation(e);
    setModaleContent(media);
  };

  // Expand spotlight on mouse enter
  const handleOnMouseEnter = () => {
    const spotlight = spotlightRef.current;

    // A nice transition effect
    spotlight.classList.add(styles.transition);

    spotlight.style.left = "0px";
    spotlight.style.width = "100%";
  };

  // Restore spotlight size and position on mouse leave
  const handleOnMouseLeave = () => {
    const spotlight = spotlightRef.current;

    // A nice transition effect
    spotlight.classList.add(styles.transition);

    spotlight.style.left = `${spotlightLeftPos.current}px`;
    spotlight.style.width = `${spotlightWidthRef.current}%`;
  };

  // Remove transition effect after it ends
  const handleTransitionEnd = () => {
    spotlightRef.current.classList.remove(styles.transition);
  };

  return (
    <button
      className={styles.translationOverview}
      style={buttonInlineStyle}
      onClick={handleOnClick}
      onMouseMove={handleStopPropagation}
      onMouseEnter={handleOnMouseEnter}
      onMouseLeave={handleOnMouseLeave}
      onTransitionEnd={handleTransitionEnd}
    >
      <div style={spotlightStyle} ref={spotlightRef}></div>
      <FontAwesomeIcon icon={faPanorama} />
    </button>
  );
};

const handleStopPropagation = (e) => {
  e.stopPropagation();
};

export default TranslationOverview;
