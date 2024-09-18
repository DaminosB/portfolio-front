"use client";

import styles from "./LayoutWrapper.module.css";

import useScrollSticky from "@/hooks/useScrollSticky";
import { createContext, useEffect, useState, useRef } from "react";

import { usePathname } from "next/navigation";
import ModalePortal from "../ModalePortal/ModalePortal";

export const LayoutContext = createContext();

const LayoutWrapper = ({ children }) => {
  const [activeCoordinates, setActiveCoordinates] = useState([0, 0]);
  const [isModaleDisplayed, setIsModaleDisplayed] = useState(false);

  const [modaleContent, setModaleContent] = useState({
    customColors: { mainColor: "", secondaryColor: "" },
    domElement: null,
  });

  const { scrollOverlapChildren, jumpTo, notifyHeightChange, scrollPosition } =
    useScrollSticky();

  const layoutRef = useRef(null);

  const pathname = usePathname();
  const cachedPathname = useRef(pathname);

  // This function is passed to the children to update the activeCoordinates state when their scroll position changes
  const notifyScrollChange = (container, scrollValue) => {
    const layoutNode = layoutRef.current;

    // Determine if the container is currently active (displayed)
    const isActive = scrollPosition === container.offsetTop;

    if (isActive) {
      // Find the index of the container within the layoutNode
      const containerIndex = Array.from(
        layoutNode.firstElementChild.children
      ).indexOf(container);

      // Find the index of the active child within the container
      const activeChildIndex = Array.from(
        container.firstElementChild.children
      ).findIndex((child) => child.offsetTop === scrollValue);

      // Update the activeCoordinates state with the container and child indices
      setActiveCoordinates([containerIndex, activeChildIndex]);
    }
  };

  useEffect(() => {
    const layoutNode = layoutRef.current;
    const containers = Array.from(layoutNode.firstElementChild.children);

    //  Find the active container's index by the scroll position
    const activeContainerIndex = containers.findIndex(
      (container) => container.offsetTop === scrollPosition
    );

    // If an active container is found
    if (activeContainerIndex !== -1) {
      const activeContainer = containers[activeContainerIndex];
      const children = Array.from(activeContainer.firstElementChild.children);

      // Find the active child in the active container
      const activeChildIndex = children.findIndex(
        (child) => child.offsetTop === activeContainer.scrollTop
      );

      // Update the active coordinates (if no active child is found, default is 0)
      setActiveCoordinates([
        activeContainerIndex,
        activeChildIndex !== -1 ? activeChildIndex : 0,
      ]);
    }

    if (pathname !== cachedPathname.current) {
      jumpTo(layoutNode, 0);
      notifyHeightChange(layoutNode);
      cachedPathname.current = pathname;
    }
  }, [scrollPosition, pathname]);

  const [showModale, setShowModale] = useState(false);

  const openModale = (customColors, domElement) => {
    setModaleContent({ customColors, domElement });

    setShowModale(true);
    setIsModaleDisplayed(true);
  };

  const closeModale = () => {
    setShowModale(false);
    setIsModaleDisplayed(false);
  };

  const resetModaleContent = () => {
    setModaleContent({
      customColors: { mainColor: "", secondaryColor: "" },
      domElement: null,
    });
  };

  const contextValues = {
    activeCoordinates,
    layoutScrollPos: scrollPosition,
    layoutJumpFunc: jumpTo,
    notifyScrollChange,
    layoutNode: layoutRef.current,
    isModaleDisplayed,
    setIsModaleDisplayed,
    openModale,
  };

  return (
    <LayoutContext.Provider value={contextValues}>
      <div
        className={styles.scrollOverlapWrapper}
        ref={layoutRef}
        onScroll={scrollOverlapChildren}
      >
        <div className={styles.innerContainer}>{children}</div>
      </div>
      <ModalePortal
        showModale={showModale}
        closeFunc={closeModale}
        resetContent={resetModaleContent}
        customColors={modaleContent.customColors}
      >
        {modaleContent.domElement}
      </ModalePortal>
    </LayoutContext.Provider>
  );
};

export default LayoutWrapper;
