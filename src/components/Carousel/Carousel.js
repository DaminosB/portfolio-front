import useScrollSticky from "@/hooks/useScrollSticky";
import styles from "./Carousel.module.css";

import { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faCircle,
} from "@fortawesome/free-solid-svg-icons";
import generateRGBAString from "@/utils/generateRGBAString";

import VideoPlayer from "../VideoPlayer/VideoPlayer";

const Carousel = ({ medias, indexStart, customColors }) => {
  const { scrollSnap, jumpTo, scrollPosition } = useScrollSticky(true);
  const [activeIndex, setActiveIndex] = useState(indexStart || 0);

  const carouselRef = useRef();

  const isFirstRender = useRef(true);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (isFirstRender.current) {
      isFirstRender.current = false;

      carousel.firstElementChild.style.transition = "none";
      jumpTo(carousel, indexStart || 0);

      setTimeout(() => {
        carousel.firstElementChild.style.transition = "";
      });
    }

    const newActiveIndex = Array.from(
      carousel.firstElementChild.children
    ).findIndex((child) => child.offsetLeft === scrollPosition);

    setActiveIndex(newActiveIndex);
  }, [scrollPosition]);

  const sideButtonsInlineStyle = {
    color: customColors.secondaryColor,
  };

  const navInlineStyle = {
    backgroundColor: generateRGBAString(customColors.mainColor, 0.75),
    color: customColors.secondaryColor,
  };

  const handleSideButtons = (moveStep) => {
    const carousel = carouselRef.current;
    const maxIndex = medias.length - 1;

    const targetIndex = activeIndex + moveStep;

    if (targetIndex <= maxIndex && targetIndex >= 0)
      jumpTo(carousel, targetIndex);
    else if (targetIndex > maxIndex) jumpTo(carousel, 0);
    else if (targetIndex < 0) jumpTo(carousel, maxIndex);
  };

  const hasMultipleMedias = medias.length > 1;

  return (
    <div
      className={styles.carouselContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.carousel} ref={carouselRef} onScroll={scrollSnap}>
        <div className={styles.slider}>
          {medias.map((media, index) => {
            const isImageFile =
              media.provider_metadata.resource_type === "image";

            const shouldPlayVideo = index === activeIndex;

            return (
              <div key={media.id}>
                {isImageFile ? (
                  <img src={media.url} alt={media.alternativeText} />
                ) : (
                  <VideoPlayer
                    video={media}
                    shouldPlayVideo={shouldPlayVideo}
                    customColors={customColors}
                  >
                    <source src={media.url} />
                  </VideoPlayer>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* --------------------------------------------------- */}
      {/* --------------- NAVIGATION BUTTONS ---------------- */}
      {/* --------------------------------------------------- */}
      {hasMultipleMedias && (
        <>
          <button
            style={sideButtonsInlineStyle}
            onClick={() => handleSideButtons(-1)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <button
            style={sideButtonsInlineStyle}
            onClick={() => handleSideButtons(1)}
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
          <nav style={navInlineStyle}>
            {medias.map((media, index) => {
              const carousel = carouselRef.current;
              const isActive = index === activeIndex;

              const handleJumpButtons = () => {
                jumpTo(carousel, index);
              };

              return (
                <button
                  className={isActive ? styles.active : ""}
                  onClick={handleJumpButtons}
                >
                  <FontAwesomeIcon icon={faCircle} />
                </button>
              );
            })}
          </nav>
        </>
      )}
    </div>
  );
};

export default Carousel;
