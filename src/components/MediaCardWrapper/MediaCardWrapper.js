"use client";

import styles from "./MediaCardWrapper.module.css";

import { useState, useContext, useEffect, useRef } from "react";

import { MediasWrapperContext } from "../MediasWrapper/MediasWrapper";
import { WrapperContext } from "../ContentWrapper/ContentWrapper";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand } from "@fortawesome/free-solid-svg-icons";
import useDragAndMove from "@/hooks/useDragAndMove";
import { SliderContext } from "../Slider/Slider";

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
  const { startDrag, onDrag, stopDrag } = useDragAndMove(id, relatedSiblings);

  const inlineStyle = {
    backgroundColor: customColors.mainColor,
    color: customColors.secondaryColor,
  };

  const handleOnClick = (e) => {
    handleStopPropagation(e);
    setModaleContent(media);
  };

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
      //   id={cardId}
      id={id}
      className={classList}
      onTouchStart={contentOverflows ? startDrag : null}
      onMouseDown={contentOverflows ? startDrag : null}
      onMouseMove={contentOverflows ? onDrag : null}
      onTouchMove={contentOverflows ? onDrag : null}
      onMouseUp={contentOverflows ? stopDrag : null}
      onTouchEnd={contentOverflows ? stopDrag : null}
      onMouseLeave={contentOverflows ? stopDrag : null}
      onDrag={() => console.log("drag")}
      onDragStart={() => console.log("dragstart")}
      onTransitionEnd={() => console.log("transitionend")}
      onAnimationEnd={() => console.log("animation")}
      onResize={() => console.log("resize")}
    >
      {children}
      {/* --------------------------------------------------- */}
      {/* ------------------ EXPAND BUTTON ------------------ */}
      {/* --------------------------------------------------- */}
      {contentOverflows && (
        <button
          className={styles.expandButton}
          style={inlineStyle}
          onClick={handleOnClick}
          onMouseMove={handleStopPropagation}
        >
          <FontAwesomeIcon icon={faExpand} />
        </button>
      )}
    </div>
  );
};

const handleStopPropagation = (e) => {
  e.stopPropagation();
};

export default MediaCardWrapper;
