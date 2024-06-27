"use client";

import styles from "./MediaCardWrapper.module.css";

import { useState, useContext, useEffect, useRef } from "react";

import { MediasWrapperContext } from "../MediasWrapper/MediasWrapper";
import { WrapperContext } from "../ContentWrapper/ContentWrapper";

import useGrabAndMove from "@/hooks/useGrabAndMove";
import { SliderContext } from "../Slider/Slider";
import TranslationOverview from "../TranslationOverview/TranslationOverview";

const MediaCardWrapper = ({
  parentStyle,
  customColors,
  media,
  id,
  relatedSiblings,
  children,
}) => {
  const [contentOverflows, setContentOverflows] = useState(undefined);

  const mediaCardWrapperRef = useRef(null);
  const { startGrab, grabbing, stopGrab, currentTranslateValue } =
    useGrabAndMove(id, relatedSiblings);

  useEffect(() => {
    const element = mediaCardWrapperRef.current;

    const elementWidth = element.offsetWidth;
    const elementHeight = element.offsetHeight;

    const mediaFileHeight = media.height;
    const mediaFileWidth = media.width;

    const mediaOnScreenWidth =
      (elementHeight / mediaFileHeight) * mediaFileWidth;

    setContentOverflows(() => mediaOnScreenWidth > elementWidth);
  }, []);

  const classList = `${styles.mediaCardWrapper} ${parentStyle.mediaCard} ${
    contentOverflows ? "grabbable" : ""
  }`;

  return (
    <div
      ref={mediaCardWrapperRef}
      id={id}
      className={classList}
      onTouchStart={contentOverflows ? startGrab : null}
      onMouseDown={contentOverflows ? startGrab : null}
      onMouseMove={contentOverflows ? grabbing : null}
      onTouchMove={contentOverflows ? grabbing : null}
      onMouseUp={contentOverflows ? stopGrab : null}
      onTouchEnd={contentOverflows ? stopGrab : null}
      onMouseLeave={contentOverflows ? stopGrab : null}
    >
      {children}
      {/* --------------------------------------------------- */}
      {/* ------------------ EXPAND BUTTON ------------------ */}
      {/* --------------------------------------------------- */}
      {contentOverflows && (
        <TranslationOverview
          customColors={customColors}
          media={media}
          currentTranslateValue={currentTranslateValue}
          containerId={id}
        />
      )}
    </div>
  );
};

export default MediaCardWrapper;
