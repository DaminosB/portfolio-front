"use client";

import styles from "./CoverContainer.module.css";

import { useContext, useRef, useEffect } from "react";

import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";
import Image from "next/image";

const CoverContainer = ({ coverData, customColors }) => {
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
    backgroundImage: `url(${coverData.url})`,
  };

  return (
    <div
      className={styles.coverContainer}
      ref={coverRef}
      style={containerInlineStyle}
    >
      <div style={backgroundInlineStyle}></div>
      <Image
        width={coverData.width}
        height={coverData.height}
        src={coverData.url}
        alt={coverData.alternativeText}
        draggable={false}
        priority={true}
      />
    </div>
  );
};

export default CoverContainer;
