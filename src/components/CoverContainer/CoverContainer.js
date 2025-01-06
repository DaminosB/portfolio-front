"use client";

import styles from "./CoverContainer.module.css";

import { useContext, useRef, useEffect, useMemo } from "react";
import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSortDown } from "@fortawesome/free-solid-svg-icons";

import Image from "next/image";

import useScrollTracker from "@/hooks/useScrollTracker";

const CoverContainer = ({
  actionText,
  coversBlockData,
  coverData,
  customColors,
}) => {
  const { layoutScrollPos, layoutScroller } = useContext(LayoutContext);

  const { scrollTrack, displayIndex } = useScrollTracker(true);

  const coverRef = useRef(null);

  // This effect handles the opacity of the component
  useEffect(() => {
    // Declares the component's DOM element
    const coverContainer = coverRef.current;

    // Calculates the scroll ratio with the scroll position of the parent
    const scrollRatio = layoutScrollPos / coverContainer.offsetHeight;

    // Calculates and applies the new opacity to the element
    if (scrollRatio >= 0 && scrollRatio <= 1)
      coverContainer.style.opacity = 1 - scrollRatio;
  }, [layoutScrollPos]);

  // Inline style for the container
  const containerInlineStyle = useMemo(
    () => ({
      color: customColors.secondaryColor,
    }),
    [customColors]
  );

  // Inline style for the ghost element
  const ghostInlineStyle = useMemo(
    () => ({
      width: `${coversBlockData.length * 100}%`,
    }),
    [coversBlockData]
  );

  // Scrolls to the next sibling
  const scrollToProjects = () => {
    const nextSibling = coverRef.current.nextSibling;
    const target = nextSibling.offsetTop;
    layoutScroller.scrollTo({ top: target, behavior: "smooth" });
  };

  // Scrolls through the different cover items
  const scrollCoversBlock = (event) => {
    // Call an external function to track scrolling events
    scrollTrack(event, [1]);

    // Get the scroller element and its visible boundaries
    const scroller = event.target;
    const visibleStart = scroller.scrollLeft;
    const visibleEnd = visibleStart + scroller.offsetWidth;

    // Get the container holding the items (covers) and its children
    const coverContainer = scroller.firstElementChild;
    const coverItems = Array.from(coverContainer.children);

    // Iterate over each cover item to calculate visibility and apply effects
    coverItems.forEach((cover, index) => {
      // Determine the cover's start and end positions within the scrollable area
      const coverStart = cover.offsetWidth * index;
      const coverEnd = coverStart + cover.offsetWidth;

      // Calculate the intersection between the cover and the visible area
      const overlapStart = Math.max(visibleStart, coverStart);
      const overlapEnd = Math.min(visibleEnd, coverEnd);
      const overlapWidth = Math.max(0, overlapEnd - overlapStart);

      // Calculate the visibility ratio (0 to 1)
      const visibilityRatio = overlapWidth / cover.offsetWidth;

      // Set the opacity of the cover based on its visibility
      cover.style.opacity = visibilityRatio.toFixed(2);

      // Animate child elements of the cover based on visibility
      const childElements = Array.from(cover.children);

      childElements.forEach((child, childIndex) => {
        const translationValue = -100 * (1 - visibilityRatio);
        if (childIndex % 2 === 0) {
          // Alternate translation direction for even-indexed children
          child.style.transform = `translateX(${translationValue}%)`;
        } else {
          // Alternate translation direction for odd-indexed children
          child.style.transform = `translateY(${translationValue}%)`;
        }
      });
    });
  };

  return (
    <div
      className={styles.coverContainer}
      ref={coverRef}
      style={containerInlineStyle}
    >
      <div className={styles.scroller} onScroll={scrollCoversBlock}>
        <div className={styles.coversBlock}>
          {coversBlockData.map((coverItem, index) => {
            // Calculate styles and classes
            let overlayDivClasses = `container ${styles.overlay}`;

            const isTextFirst = coverItem.disposition === "Texte | Image";

            // Determine the flex direction
            if (isTextFirst) overlayDivClasses += " flex-row-reverse";
            else overlayDivClasses += " flex-row";

            // If the coverItem's index equals the displayIndex, put it in the foreground
            const coverItemStyle = { zIndex: displayIndex === index ? 1 : 0 };

            // If there is a backgroundImage, it will be displayed normaly, and as a background of a blurred div
            const blurredBackgroundStyle = coverItem.backgroundImage
              ? { backgroundImage: `url(${coverItem.backgroundImage.url})` }
              : {};
            const backgroundImageStyle = coverItem.backgroundImage
              ? { color: customColors.secondaryColor }
              : {};

            return (
              <div
                key={coverItem.id}
                className={styles.coverItem}
                style={coverItemStyle}
              >
                {/* Background Section */}
                {coverItem.backgroundImage && (
                  <div className={styles.background}>
                    <div style={blurredBackgroundStyle}></div>
                    <div>
                      <Image
                        width={coverItem.backgroundImage.width}
                        height={coverItem.backgroundImage.height}
                        src={coverItem.backgroundImage.url}
                        alt={coverItem.backgroundImage.alternativeText}
                        draggable={false}
                        priority={true}
                        style={backgroundImageStyle}
                      />
                    </div>
                  </div>
                )}

                {/* Overlay Section */}
                {(coverItem.text || coverItem.overlayImage) && (
                  <div className={overlayDivClasses}>
                    {coverItem.overlayImage && (
                      <div>
                        <Image
                          width={coverItem.overlayImage.width}
                          height={coverItem.overlayImage.height}
                          src={coverItem.overlayImage.url}
                          alt={coverItem.overlayImage.alternativeText}
                          draggable={false}
                        />
                      </div>
                    )}
                    {coverItem.text && (
                      <div>
                        <span>{coverItem.text}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* --------------------------------------------------- */}
        {/* ------------------ ACTION BUTTON ------------------ */}
        {/* --------------------------------------------------- */}
        {actionText && (
          <button className={styles.shortcut} onClick={scrollToProjects}>
            <span>{actionText}</span>
            <FontAwesomeIcon icon={faSortDown} />
          </button>
        )}

        {/* --------------------------------------------------- */}
        {/* ---------------------- GHOST ---------------------- */}
        {/* --------------------------------------------------- */}
        {/* Simulates the scrolling to display the various cover items */}
        <div className={styles.ghost} style={ghostInlineStyle}>
          {Array.from({ length: coversBlockData.length }).map((_, index) => {
            const ghostChildStyle = {
              width: `${100 / coversBlockData.length}%`,
            };
            return <div key={index} style={ghostChildStyle}></div>;
          })}
        </div>
      </div>
    </div>
  );
};

export default CoverContainer;
