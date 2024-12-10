import styles from "./ContentMeta.module.css";

import { useRef, useState, useEffect } from "react";

import generateRGBAString from "@/utils/generateRGBAString";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ScrollBar from "../ScrollBar/ScrollBar";
import populateScrollbarMetrics from "@/utils/populateScrollBarMetrics";

const MetaDetails = ({
  metaData,
  showContentMeta,
  setShowContentMeta,
  customColors,
}) => {
  const { title, description, tags } = metaData;
  const { mainColor, secondaryColor } = customColors;

  const [scrollBarMetrics, setScrollBarMetrics] = useState({
    thumbheight: 0,
    scrollProgress: 0,
  });

  const backgroundColor = generateRGBAString(mainColor, 0.5);

  const inLineStyle = {
    backgroundColor,
    color: secondaryColor,
  };

  const tagsInlineStyle = { backgroundColor };

  const containerRef = useRef(null);
  const yScrollerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const scrollTarget = showContentMeta ? container.offsetWidth : 0;
    container.scrollTo({ left: scrollTarget, behavior: "smooth" });

    const yScroller = yScrollerRef.current;
    setScrollBarMetrics(() => populateScrollbarMetrics(yScroller));
  }, [showContentMeta]);

  const displayMetaDetails = (e) => {
    const container = containerRef.current;
    const scrollPercentage =
      (container.scrollLeft / container.offsetWidth) * 100;

    const displayValue = 100 - scrollPercentage;

    container.style.transform = `translateX(${displayValue}%)`;
    container.style.opacity = `${scrollPercentage}%`;

    if (scrollPercentage === 0) setShowContentMeta(false);
  };

  const closeMetaDetails = () => setShowContentMeta(false);
  const handleScrollContent = (e) =>
    setScrollBarMetrics(() => populateScrollbarMetrics(e.target));

  return (
    <div
      className={`${styles.metaDetails} ${showContentMeta ? styles.open : ""}`}
      style={inLineStyle}
      ref={containerRef}
      onScroll={displayMetaDetails}
    >
      <div>
        <div
          data-role="scroller"
          className={styles.yScroller}
          ref={yScrollerRef}
          onScroll={handleScrollContent}
        >
          <h1>{title}</h1>
          <div className={styles.tags}>
            {tags &&
              tags.map((tag) => {
                return (
                  <span key={tag.id} style={tagsInlineStyle}>
                    {tag.name}
                  </span>
                );
              })}
          </div>
          <div>
            {description &&
              description.split("\n").map((line, index) => {
                return <p key={index}>{line}</p>;
              })}
          </div>
        </div>

        <button className="close-button" onClick={closeMetaDetails}>
          <FontAwesomeIcon icon={faXmark} />
        </button>

        <ScrollBar customColors={customColors} metrics={scrollBarMetrics} />
      </div>
      <div className={styles.ghost}>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default MetaDetails;
