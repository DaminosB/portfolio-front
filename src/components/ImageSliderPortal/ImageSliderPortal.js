"use client";

import styles from "./ImageSliderPortal.module.css";

import { useEffect, useState, useContext, useRef } from "react";
import { WrapperContext } from "../ContentWrapper/ContentWrapper";

import { createPortal } from "react-dom";

const ImageSliderPortal = ({ children, imagesIdsArray }) => {
  const { activeSectionId } = useContext(WrapperContext);

  const [isVisible, setIsVisible] = useState(false);
  // const [domTarget, setDomTarget] = useState(null);

  // let domTarget;
  const domTarget = useRef(null);

  useEffect(() => {
    // setDomTarget(() => document.getElementsByTagName("MAIN")[0]);
    domTarget.current = document.getElementsByTagName("MAIN")[0];
    const isActiveSection = imagesIdsArray.some(
      (imageId) =>
        imageId.replace("media-content", "section") === activeSectionId
    );

    setIsVisible(isActiveSection && domTarget.current);
  }, [activeSectionId]);

  return isVisible && createPortal(children, domTarget.current);
};

export default ImageSliderPortal;
