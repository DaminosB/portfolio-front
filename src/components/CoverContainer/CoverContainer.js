"use client";

import styles from "./CoverContainer.module.css";

import { useContext, useRef, useEffect, useState } from "react";

import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

const CoverContainer = ({ coverUrl, coverAltTxt, customColors }) => {
  const { layoutScrollPos } = useContext(LayoutContext);

  const [hideCover, setHideCover] = useState(false);

  const coverRef = useRef(null);

  useEffect(() => {
    const coverElem = coverRef.current;

    const isDisplayed = coverElem.offsetTop === layoutScrollPos;

    if (isDisplayed) setHideCover(false);
    else setHideCover(true);
  }, [layoutScrollPos]);

  const containerInlineStyle = {
    color: customColors.secondaryColor,
  };

  const backgroundInlineStyle = {
    background: `url(${coverUrl}) no-repeat center / auto 100%`,
  };

  return (
    <div
      className={`${styles.coverContainer} ${hideCover && "hidden"}`}
      ref={coverRef}
      style={containerInlineStyle}
    >
      <div style={backgroundInlineStyle}></div>
      <img src={coverUrl} alt={coverAltTxt} />
    </div>
  );
};

export default CoverContainer;
