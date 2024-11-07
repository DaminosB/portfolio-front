"use client";

import styles from "./CoverContainer.module.css";

import { useContext, useRef, useEffect } from "react";

import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

const CoverContainer = ({ coverUrl, coverAltTxt, customColors }) => {
  const { layoutScrollPos } = useContext(LayoutContext);

  const coverRef = useRef(null);

  useEffect(() => {
    const coverContainer = coverRef.current;

    const scrollRatio = layoutScrollPos / coverContainer.offsetHeight;

    if (scrollRatio >= 0 && scrollRatio <= 1)
      coverContainer.style.opacity = 1 - scrollRatio;
  }, [layoutScrollPos]);

  const containerInlineStyle = {
    color: customColors.secondaryColor,
  };

  const backgroundInlineStyle = {
    backgroundImage: `url(${coverUrl})`,
  };

  return (
    <div
      className={styles.coverContainer}
      ref={coverRef}
      style={containerInlineStyle}
    >
      <div style={backgroundInlineStyle}></div>
      <img src={coverUrl} alt={coverAltTxt} />
    </div>
  );
};

export default CoverContainer;
