"use client";

import styles from "./MediasWrapper.module.css";

// React hooks imports
import { useState, useRef, createContext } from "react";

export const MediasWrapperContext = createContext();

// Components imports
import ModaleWrapper from "../ModaleWrapper/ModaleWrapper";
import { createPortal } from "react-dom";

// This component wraps the medias of each displayed module. It is rendered client side to let the user interact with the content
const MediasWrapper = ({
  mediasWrapperStyle,
  customColors,
  parentStyle,
  children,
}) => {
  // On big screens, the wrapper is the same width than the section, so images are slidable in their parent to be viewed whole.
  // On small screens, the wrapper is the width of its content. So now we must slide the wrapper in its parent.

  // This state is changed when the viewer clicks the content
  // On false, none of the dragging effects are active
  const [modaleContent, setModaleContent] = useState({});

  const contextValues = { modaleContent, setModaleContent };

  const handleExitModale = () => setModaleContent({});

  const showModale = Object.keys(modaleContent).length > 0;

  return (
    <MediasWrapperContext.Provider value={contextValues}>
      <div
        className={`${styles.mediasWrapper} ${parentStyle.mediasWrapper}`}
        style={mediasWrapperStyle}
      >
        {/* <MediasNavigation /> */}
        {children}
      </div>
      {showModale &&
        createPortal(
          <ModaleWrapper
            customColors={customColors}
            exitFunction={handleExitModale}
          >
            <img src={modaleContent.url} alt={modaleContent.alternativeText} />
          </ModaleWrapper>,
          document.body
        )}
    </MediasWrapperContext.Provider>
  );
};

export default MediasWrapper;
