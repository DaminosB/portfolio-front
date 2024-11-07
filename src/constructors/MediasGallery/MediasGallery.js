"use client";

import styles from "./MediasGallery.module.css";

import { useContext, useRef, useEffect } from "react";
import { ModuleContext } from "../ModuleWrapper/ModuleWrapper";

const MediasGallery = ({ customColors, mediaBlock, children }) => {
  const sliderRef = useRef(null);

  const { galleryIndex } = useContext(ModuleContext);

  const labelBlockInlineStyle = {
    color: mediaBlock.labelColor
      ? mediaBlock.labelColor
      : customColors.secondaryColor,
  };

  useEffect(() => {
    const slider = sliderRef.current;
    const maxIndex = Array.from(slider.children).length - 1;

    if (galleryIndex <= maxIndex) {
      const translatePercentage = galleryIndex * 100;

      slider.style.transform = `translateX(${-translatePercentage}%)`;
    }
  }, [galleryIndex]);

  return (
    <div className={styles.mediasGallery}>
      <div>
        <div ref={sliderRef} className={styles.slider}>
          {children}
        </div>
      </div>
      {mediaBlock.label && (
        <div className={styles.labelBlock} style={labelBlockInlineStyle}>
          {mediaBlock.link ? (
            <a href={mediaBlock.link} target="_blank" rel="noopener noreferrer">
              {mediaBlock.label}
            </a>
          ) : (
            <span>{mediaBlock.label}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default MediasGallery;
