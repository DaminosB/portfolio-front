"use client";

import styles from "./SidePanelNavigation.module.css";

// React hooks imports
import { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";

// Context import
import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";
import { SnapScrollerContext } from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";

// Packages imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faCircle,
  faPanorama,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";

import generateRGBAString from "@/utils/generateRGBAString";

// This component displays a vertical menu on the right of the page to jump from section to section
const SidePanelNavigation = ({ content, customStyle }) => {
  const [domTarget, setDomTarget] = useState(null);
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const { activeCoordinates, layoutNode, layoutJumpFunc } =
    useContext(LayoutContext);

  const { snapScrollerJumpFunc } = useContext(SnapScrollerContext);

  const [activeContainerIndex, activeChildIndex] = activeCoordinates;

  const opacityValue = isMouseOver ? 0.66 : 0.33;

  // This array will be displayed with a .map function
  const navigationArray = populateNavigationArray(content);
  const inlineStyle = {
    backgroundColor: generateRGBAString(customStyle.mainColor, opacityValue),
    color: customStyle.secondaryColor,
  };

  useEffect(() => {
    // We create a portal so this comp will be a child of <body>
    setDomTarget(document.body);
  }, []);

  const openButtonInlineStyle = {
    borderColor: customStyle.mainColor,
    color: customStyle.mainColor,
    backgroundColor: generateRGBAString(
      customStyle.secondaryColor,
      opacityValue
    ),
  };

  return (
    domTarget &&
    createPortal(
      <nav
        className={`${styles.sectionNavigation} ${isOpen ? styles.open : ""}`}
        style={inlineStyle}
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <button
          style={openButtonInlineStyle}
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        {navigationArray.map((entry) => {
          const [containerIndex, childIndex] = entry.coords;

          const isActiveSection =
            containerIndex === activeContainerIndex &&
            childIndex === activeChildIndex;

          // On click, the user jumps to the targeted element
          const handleOnClick = () => {
            // Retrieve the container element corresponding to the specified index
            const container =
              layoutNode.firstElementChild.children[containerIndex];

            // Scroll the main layout to the correct container
            layoutJumpFunc(layoutNode, containerIndex);

            // If necessary, scroll within the container to display the targeted child element
            if (entry.scrollToChild) {
              snapScrollerJumpFunc(container, childIndex);
            }
          };

          return (
            <button
              key={entry.id}
              className={
                isActiveSection ? styles.activeButton : styles.inactiveButton
              }
              onClick={handleOnClick}
            >
              <FontAwesomeIcon icon={entry.icon} />
            </button>
          );
        })}
      </nav>,
      domTarget
    )
  );
};

// This function takes the content prop and returns an array to be rendered with a .map function
const populateNavigationArray = (content) => {
  const response = [];

  let sliderIndex = 0;
  let sectionIndex = 0;

  // If a cover exists, add it to the navigation array
  if (content.cover) {
    response.push({
      id: content.cover.id,
      icon: faPanorama,
      coords: [sliderIndex, sectionIndex],
      scrollToChild: false, // No parent action needed for the cover
    });

    sliderIndex++;
  }

  // Iterate through each module in the content
  content.modules.forEach((module) => {
    // If the module is a multi-image column, iterate through its media items
    if (module.__component === "module.colonne-multi-images") {
      module.medias.forEach((media) => {
        response.push({
          id: media.id,
          icon: faCircle,
          coords: [sliderIndex, sectionIndex],
          scrollToChild: true, // Action on parent required for each media
        });

        sectionIndex++;
      });
    } else {
      // Add other modules directly to the navigation array
      response.push({
        id: module.id,
        icon: faCircle,
        coords: [sliderIndex, sectionIndex],
        scrollToChild: true, // Action on parent required for other modules
      });

      sectionIndex++;
    }
  });

  // If tags are present, add them to the navigation array
  if (content.tags) {
    sliderIndex++;
    sectionIndex = 0;

    response.push({
      id: "related-projects",
      icon: faPaperclip,
      coords: [sliderIndex, sectionIndex],
      scrollToChild: false, // No parent action needed for tags
    });
  }

  return response;
};

export default SidePanelNavigation;
