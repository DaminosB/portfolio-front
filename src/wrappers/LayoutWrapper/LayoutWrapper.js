"use client";

import styles from "./LayoutWrapper.module.css";

import { createContext, useEffect, useState, useCallback, useRef } from "react";

import { usePathname, useRouter } from "next/navigation";

import useScrollTracker from "@/hooks/useScrollTracker";

import ModalePortal from "../ModalePortal/ModalePortal";

export const LayoutContext = createContext();

const LayoutWrapper = ({ children }) => {
  const [activeCoordinates, setActiveCoordinates] = useState([0, 0]);
  const [containersPositions, setContainersPositions] = useState([]);

  const [isModaleDisplayed, setIsModaleDisplayed] = useState(false);

  const router = useRouter();

  const [modaleContent, setModaleContent] = useState({
    customColors: { mainColor: "", secondaryColor: "" },
    domElement: null,
  });
  const {
    scrollTrack,
    activeChildIndex: activeContainerIndex,
    scrollPosition,
  } = useScrollTracker();

  const layoutRef = useRef(null);

  const pathname = usePathname();
  const cachedPathname = useRef(pathname);

  const updateContainerPos = useCallback((container, newIndex) => {
    const layoutNode = layoutRef.current;
    const containersArray = Array.from(layoutNode.children);

    const containerIndex = containersArray.findIndex(
      (child) => child === container
    );

    setContainersPositions((prev) => {
      const newTab = [...prev];
      newTab[containerIndex] = newIndex;
      return newTab;
    });
  }, []);

  useEffect(() => {
    const layoutNode = layoutRef.current;
    const activeChildIndex = containersPositions[activeContainerIndex] || 0;

    setActiveCoordinates([activeContainerIndex, activeChildIndex]);

    if (pathname !== cachedPathname.current) {
      cachedPathname.current = pathname;

      layoutNode.parentNode.style.opacity = 1;
      const childrenArray = Array.from(layoutNode.children);
      setContainersPositions(() => childrenArray.map(() => 0));
    }
  }, [activeContainerIndex, containersPositions, pathname]);

  const linkTo = (link) => {
    const layoutNode = layoutRef.current;

    layoutNode.parentNode.style.opacity = 0;
    setTimeout(() => {
      layoutNode.scrollTo({ top: 0, behavior: "instant" });
      router.push(link, { scroll: false });
    }, 150);
  };

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
    layoutNode: layoutRef.current,
    isModaleDisplayed,
    openModale,
    updateContainerPos,
    getSectionCoords,
    linkTo,
  };

  return (
    <LayoutContext.Provider value={contextValues}>
      <div
        className={styles.layoutContainer}
        ref={layoutRef}
        onScroll={scrollTrack}
      >
        {children}
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

const getSectionCoords = (sectionNode) => {
  const findIndexInParent = (parent, targetChild) =>
    Array.from(parent.children).findIndex((child) => child === targetChild);

  const container = sectionNode.parentNode;

  const containerIndex = findIndexInParent(container.parentNode, container);
  const sectionIndex = findIndexInParent(container, sectionNode);

  return [containerIndex, sectionIndex];
};

export default LayoutWrapper;
