"use client";

import styles from "./Modale.module.css";

import { useEffect, useState, useRef, useContext } from "react";
import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

import { createPortal } from "react-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import generateRGBAString from "@/utils/generateRGBAString";

const Modale = ({ customColors }) => {
  const [targetDom, setTargetDom] = useState(null);

  const { modaleContent, setModaleContent } = useContext(LayoutContext);

  const modaleRef = useRef(null);

  const modaleInlineStyle = {
    backgroundColor: generateRGBAString(customColors.mainColor, 0.75),
  };

  const closeButtonInlineStyle = {
    color: customColors.secondaryColor,
  };

  useEffect(() => {
    const modale = modaleRef.current;
    setTargetDom(document.body);

    if (modale && modaleContent)
      requestAnimationFrame(() => modale.classList.remove("hidden"));
  }, [modaleContent]);

  const handleResetContent = () => {
    const modale = modaleRef.current;
    const modaleIsHidden = Array.from(modale.classList).includes("hidden");
    if (modaleIsHidden) setModaleContent(null);
  };

  const closeModale = () => {
    const modale = modaleRef.current;
    modale.classList.add("hidden");
  };

  return (
    targetDom &&
    modaleContent &&
    createPortal(
      <div
        className={`${styles.modaleWrapper} hidden`}
        style={modaleInlineStyle}
        ref={modaleRef}
        onClick={closeModale}
        onTransitionEnd={handleResetContent}
      >
        <button style={closeButtonInlineStyle} onClick={closeModale}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {modaleContent}
      </div>,
      targetDom
    )
  );
};

export default Modale;
