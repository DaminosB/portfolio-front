"use client";
import styles from "./ModuleWrapper.module.css";

// React hooks imports
import { useState, useContext, useEffect, createContext } from "react";
import { LayoutContext } from "../LayoutWrapper/LayoutWrapper";
import { SnapScrollerContext } from "../SnapScrollWrapper/SnapScrollWrapper";

export const ModuleContext = createContext();

// Components imports
import Carousel from "@/components/Carousel/Carousel";

import useScrollSticky from "@/hooks/useScrollSticky";

const ModuleWrapper = ({
  medias,
  inlineStyle,
  customColors,
  sectionId,
  children,
}) => {
  // This state is changed when the viewer clicks the content
  // On false, none of the dragging effects are active
  const [isActiveSection, setIsActiveSection] = useState(false);
  const { activeCoordinates, openModale } = useContext(LayoutContext);

  const openCarousel = (mediaId) => {
    const mediaIndex = medias.findIndex((media) => media.id === mediaId);

    openModale(
      customColors,
      <Carousel
        medias={medias}
        indexStart={mediaIndex}
        customColors={customColors}
      />
    );
  };

  const { scrollBoundedChildSync } = useScrollSticky();

  const [activeContainerIndex, activeChildIndex] = activeCoordinates;

  const { getSectionCoords } = useContext(SnapScrollerContext);

  const contextValues = { isActiveSection, openCarousel };

  useEffect(() => {
    const sectionCoords = getSectionCoords(sectionId);
    const [containerIndex, sectionIndex] = sectionCoords;

    const activeStatus =
      activeContainerIndex === containerIndex &&
      activeChildIndex === sectionIndex;

    setIsActiveSection(activeStatus);
  }, [
    activeCoordinates,
    activeChildIndex,
    activeContainerIndex,
    getSectionCoords,
    sectionId,
  ]);

  return (
    <ModuleContext.Provider value={contextValues}>
      <section
        style={inlineStyle}
        id={sectionId}
        onScroll={scrollBoundedChildSync}
      >
        {children}
        {/* {showModale &&
          createPortal(
            <ModaleWrapper
              customColors={customColors}
              exitFunction={handleExitModale}
            >
              <img
                src={modaleContent.url}
                alt={modaleContent.alternativeText}
              />
            </ModaleWrapper>,
            document.body
          )} */}
      </section>
    </ModuleContext.Provider>
  );
};

export default ModuleWrapper;
