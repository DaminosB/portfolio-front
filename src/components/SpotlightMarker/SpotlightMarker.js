import styles from "./SpotlightMarker.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPanorama, faSquareFull } from "@fortawesome/free-solid-svg-icons";

import { useEffect, useRef } from "react";

// This component displays an image with a spotlight that moves in sync with the draggable image, highlighting the visible part and showing a modal with the image details when clicked
const SpotlightMarker = ({ customColors, onClickFunction, metrics }) => {
  const { currentTranslateValue, containerWidth, childWidth } = metrics;
  const spotlightWidthRatio = containerWidth / childWidth;

  // Style for the button. Font and background colors are the same to hide the icon
  const buttonInlineStyle = {
    color: customColors.mainColor,
  };

  // Style for the spotlight div, which highlights the visible part of the icon
  const spotlightStyle = {
    borderColor: customColors.mainColor,
    backgroundColor: customColors.secondaryColor,
  };

  const spotlightRef = useRef(null);

  // Function called whenever the translation changes to move the spotlight accordingly
  useEffect(() => {
    const spotlight = spotlightRef.current;

    const buttonWidth = spotlight.parentNode.offsetWidth;
    const spotlightOffset = calcSpotlightOffset(
      buttonWidth,
      currentTranslateValue
    );

    spotlight.style.transform = `translateX(${spotlightOffset}px)`;
    spotlight.style.width = `${spotlightWidthRatio * 100}%`;
  }, [metrics]);

  // Calculates the new translation value for the spotlight div
  const calcSpotlightOffset = (buttonWidth, translateValue) => {
    // Determine the ratio of the translate value:
    // 100% = left edge of the image is visible, -100% = right edge is visible
    const maxOffset = (childWidth - containerWidth) / 2;
    const translateValueRatio = translateValue / maxOffset;

    // Calculate the maximum offset for the spotlight
    const spotlightWidthPx = buttonWidth * spotlightWidthRatio;
    const maxSpotlightOffset = (buttonWidth - spotlightWidthPx) / 2;

    // Move the spotlight in the opposite direction to the image
    return maxSpotlightOffset * -translateValueRatio;
  };

  return (
    <button
      className={styles.spotlightContainer}
      style={buttonInlineStyle}
      onClick={onClickFunction}
    >
      <div style={spotlightStyle} ref={spotlightRef}></div>
      <FontAwesomeIcon icon={faPanorama} mask={faSquareFull} />
    </button>
  );
};

export default SpotlightMarker;
