import generateRGBAString from "@/utils/generateRGBAString";
import styles from "./ModalePortal.module.css";

import { useEffect, useState, useRef } from "react";

import { createPortal } from "react-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const ModalePortal = ({
  children,
  showModale,
  closeFunc,
  resetContent,
  customColors,
}) => {
  const [targetDom, setTargetDom] = useState(null);

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

    requestAnimationFrame(() => {
      if (showModale) {
        modale.classList.remove("hidden");
      } else if (modale) {
        modale.classList.add("hidden");
      }
    });
  }, [showModale]);

  const handleResetContent = () => {
    if (!showModale) resetContent();
  };

  return (
    targetDom &&
    createPortal(
      <div
        className={`${styles.modaleWrapper} hidden`}
        style={modaleInlineStyle}
        ref={modaleRef}
        onClick={closeFunc}
        onTransitionEnd={handleResetContent}
      >
        <button style={closeButtonInlineStyle} onClick={closeFunc}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
        {children}
      </div>,
      targetDom
    )
  );
};

export default ModalePortal;
