"use client";

import styles from "./TextWrapper.module.css";

import { useEffect, useRef } from "react";

const TextWrapper = ({ textModule, children }) => {
  const inlineStyle = generateTextStyle(textModule);

  const textWrapperRef = useRef(null);

  const spacerElementRef = useRef(null);

  // Ensures proper spacing between the text and the title to prevent overlap
  useEffect(() => {
    const textWrapper = textWrapperRef.current;

    // Finds the nearest scrolling container for the text wrapper
    const scroller = textWrapper.closest('[data-role="scroller"]');

    // Identifies the title block (assumed to be an <H2> element within the scroller's children)
    const titleBlock = Array.from(scroller.children).find(
      (child) => child.tagName === "H2"
    );

    // If no title block is found, exit early
    if (!titleBlock) return;

    // Selects the main content block inside the scroller
    const contentBlock = scroller.querySelector("div:first-of-type");

    // Reference to the spacer element used to adjust the spacing dynamically
    const spacerElement = spacerElementRef.current;

    // Calculates the amount of overlap between the title block and the text wrapper
    const titleOverflow =
      titleBlock.offsetTop +
      titleBlock.offsetHeight -
      (textWrapper.offsetTop + contentBlock.offsetTop);

    // Retrieves the current height of the spacer element
    const spacerHeight = spacerElement.offsetHeight;

    // If there is an overlap and it doesn't match the spacer's current height, update the spacer's height
    if (titleOverflow > 0 && titleOverflow !== spacerHeight) {
      spacerElement.style.height = `${titleOverflow}px`;
    }
  }, []);

  return (
    <div
      className={styles.textWrapper}
      ref={textWrapperRef}
      style={inlineStyle}
    >
      {/* <div> */}
      <div className={styles.spacer} ref={spacerElementRef}></div>
      {children}
      {/* </div> */}
    </div>
  );
};

export default TextWrapper;

const generateTextStyle = (textModule) => {
  const { alignment, font, textColor } = textModule;

  const response = {
    fontFamily: "",
    color: "",
    textAlign: "",
  };

  response.fontFamily = font.substring(0, font.indexOf("(")).trim();

  response.color = textColor;

  if (alignment === "Centré") response.textAlign = "center";
  else if (alignment === "Gauche") response.textAlign = "left";
  else if (alignment === "Droite") response.textAlign = "right";
  else if (alignment === "Justifié") response.textAlign = "justify";

  return response;
};
