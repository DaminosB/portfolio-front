import generateRGBAString from "@/utils/generateRGBAString";
import styles from "./InteractiveHint.module.css";

import { useMemo, useRef, useEffect } from "react";

const InteractiveHint = ({ isActive, customColors }) => {
  const inlineStyle = useMemo(
    () => ({
      backgroundColor: generateRGBAString(customColors.mainColor, 0.5),
      color: customColors.secondaryColor,
    }),
    [customColors]
  );
  const markerInlineStyle = useMemo(
    () => ({ backgroundColor: customColors.secondaryColor }),
    [customColors]
  );

  const interactiveHintRef = useRef(null);

  const lastShowTime = useRef(0);

  useEffect(() => {
    const interactiveHint = interactiveHintRef.current;

    const hasEnoughTimePassed = Date.now() - lastShowTime.current > 10000;

    if (isActive && hasEnoughTimePassed) {
      toggleHint(interactiveHint, true);
      lastShowTime.current = Date.now();

      setTimeout(() => {
        toggleHint(interactiveHint, false);
      }, 3000);
    } else if (!isActive) {
      toggleHint(interactiveHint, false);
    }
  }, [isActive]);

  const toggleHint = (domElem, showElem) => {
    if (showElem) domElem.classList.remove("hidden");
    else domElem.classList.add("hidden");
  };

  const handleOnPointerDown = () => {
    toggleHint(interactiveHintRef.current, false);
  };

  return (
    <div
      className={`hidden ${styles.interactiveHint}`}
      style={inlineStyle}
      ref={interactiveHintRef}
      onPointerDown={handleOnPointerDown}
    >
      <div>
        <div className={styles.frame}>
          <div style={markerInlineStyle}></div>
        </div>
        <span>Faire défiler</span>
      </div>
    </div>
  );
};

export default InteractiveHint;
