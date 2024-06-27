"use client";

import generateBgColorString from "@/utils/generateBgColorString";
import styles from "./ModaleWrapper.module.css";

import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ModaleWrapper = ({ customColors, exitFunction, children }) => {
  const [shouldOpen, setShouldOpen] = useState(true);
  const modaleWrapperRef = useRef(null);

  const backgroundOpacity = 0.8;

  const inlineStyle = {
    backgroundColor: generateBgColorString(
      customColors.mainColor,
      backgroundOpacity
    ),
    color: customColors.secondaryColor,
  };

  useEffect(() => {
    const element = modaleWrapperRef.current;

    requestAnimationFrame(() => {
      if (shouldOpen) {
        element.classList.remove("hidden");
      } else {
        element.classList.add("hidden");
      }
    });
  }, [shouldOpen]);

  const handleCloseModale = () => {
    setShouldOpen(false);
  };

  const handleTransitionEnd = () => {
    if (!shouldOpen) exitFunction();
  };

  const handleStopPropagation = (e) => e.stopPropagation();

  return (
    <div
      className={`${styles.mediaModale} hidden`}
      style={inlineStyle}
      ref={modaleWrapperRef}
      onClick={handleCloseModale}
      onTransitionEnd={handleTransitionEnd}
    >
      <button onClick={handleCloseModale}>
        <FontAwesomeIcon icon={faXmark} />
      </button>
      <div className={styles.childrenContainer} onClick={handleStopPropagation}>
        {children}
      </div>
    </div>
  );
};

export default ModaleWrapper;
