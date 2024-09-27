"use client";

import styles from "./CoverContainer.module.css";

import { useContext, useRef, useEffect } from "react";

import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

const CoverContainer = ({ coverUrl, coverAltTxt, customColors }) => {
  const { layoutScrollPos } = useContext(LayoutContext);

  const coverRef = useRef(null);

  useEffect(() => {
    const coverElem = coverRef.current;
    const nextSibling = coverElem.nextSibling;

    const offsetRatio = coverElem.offsetTop / nextSibling.offsetTop;

    const newOpacity = 1 - offsetRatio;

    coverElem.style.opacity = newOpacity;
  }, [layoutScrollPos]);

  const containerInlineStyle = {
    color: customColors.secondaryColor,
  };

  const backgroundInlineStyle = {
    backgroundImage: `url(${coverUrl})`,
  };

  const title = useRef(null);

  return (
    <div
      className={styles.coverContainer}
      ref={coverRef}
      style={containerInlineStyle}
    >
      <div style={backgroundInlineStyle} ref={title}></div>
      <img src={coverUrl} alt={coverAltTxt} />
    </div>
  );
};

export default CoverContainer;
