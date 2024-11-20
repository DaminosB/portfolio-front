"use client";

import styles from "./SidePanelNavigation.module.css";

// Import React hooks
import { useEffect, useState, useContext, useMemo } from "react";
import { createPortal } from "react-dom";

// Import Contexts
import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

// Import font-awesome icons
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronRight,
  faCircle,
  faPanorama,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";

// Utility function import
import generateRGBAString from "@/utils/generateRGBAString";

// This component displays a vertical side navigation panel to jump between sections of the page
const SidePanelNavigation = ({ content, customColors }) => {
  const [domTarget, setDomTarget] = useState(null); // Holds the target DOM node for the portal
  const [isMouseOver, setIsMouseOver] = useState(false); // Tracks if the mouse is over the side panel
  const [isPanelOpen, setIsPanelOpen] = useState(true); // Controls whether the panel is open or collapsed

  // Get the current active coordinates from context (active container and child section)
  const { activeCoords, layoutNode, showEndScrollPanel, setEndScrollValue } =
    useContext(LayoutContext);
  const [activeContainerIndex, activeChildIndex] = activeCoords;

  // Set opacity based on whether the mouse is hovering over the panel
  const panelOpacity = isMouseOver ? 0.66 : 0.33;

  // Prepare the navigation array using the content prop
  const navigationItems = useMemo(
    () => createNavigationItems(content),
    [content]
  );

  // Set the inline style for the panel background and text color
  const panelStyle = {
    backgroundColor: generateRGBAString(customColors.mainColor, panelOpacity),
    color: customColors.secondaryColor,
  };

  // Create a portal to attach this component to the body element on mount
  useEffect(() => {
    const layoutContainer = document.getElementById("layout-container");

    setDomTarget(layoutContainer);
  }, []);

  // Inline style for the panel toggle button
  const toggleButtonStyle = {
    borderColor: customColors.mainColor,
    color: customColors.mainColor,
    backgroundColor: generateRGBAString(
      customColors.secondaryColor,
      panelOpacity
    ),
  };

  // Render the side navigation panel
  return (
    domTarget &&
    createPortal(
      <nav
        className={`${styles.sectionNavigation} ${
          !isPanelOpen ? styles.close : ""
        }`}
        style={panelStyle}
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        {/* Button to toggle the side panel */}
        <button
          style={toggleButtonStyle}
          onClick={() => setIsPanelOpen((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faChevronRight} />
          {/* <FontAwesomeIcon icon={faChevronLeft} /> */}
        </button>

        {/* Render each navigation button */}
        {navigationItems.map((navItem) => {
          const [containerIndex, childIndex] = navItem.coords;
          const isActiveSection =
            containerIndex === activeContainerIndex &&
            childIndex === activeChildIndex &&
            !showEndScrollPanel;

          // Function to handle clicks and scroll to the appropriate section
          const handleScrollToSection = () => {
            setEndScrollValue(0);
            const containers = Array.from(layoutNode.children);
            const targetContainer = containers[containerIndex];

            // Calculate the total height to scroll to the target container
            const cumulativeHeight = containers
              .slice(0, containerIndex)
              .reduce((acc, container) => acc + container.offsetHeight, 0);

            // Scroll to the target container in the layout
            layoutNode.scrollTo({
              top: cumulativeHeight,
              behavior: "smooth",
            });

            // If necessary, scroll within the container to a specific child element
            if (navItem.scrollToChild) {
              const targetChildPosition =
                targetContainer.children[childIndex].offsetTop;

              targetContainer.scrollTo({
                top: targetChildPosition,
                behavior: "smooth",
              });
            }
          };

          return (
            <button
              key={navItem.id}
              className={
                isActiveSection ? styles.activeButton : styles.inactiveButton
              }
              onClick={handleScrollToSection}
            >
              <FontAwesomeIcon icon={navItem.icon} />
            </button>
          );
        })}
      </nav>,
      domTarget
    )
  );
};

// This function transforms the content into an array of navigation items
const createNavigationItems = (content) => {
  const navigationItems = [];

  let containerIndex = 0; // Tracks the container (or section) index
  let childIndex = 0; // Tracks the child (or subsection) index

  // If a cover exists, add it to the navigation array
  if (content.cover) {
    navigationItems.push({
      id: content.cover.id,
      icon: faPanorama,
      coords: [containerIndex, childIndex],
      scrollToChild: false, // No need to scroll inside container for the cover
    });
    containerIndex++;
  }

  // Loop through each module in the content
  content.modules.forEach((module) => {
    // For multi-image columns, add each image as a separate item
    if (module.__component === "module.colonne-multi-images") {
      module.mediaBlocks.forEach((mediaBlock) => {
        navigationItems.push({
          id: `section-${module.__component}-${mediaBlock.id}`,
          icon: faCircle,
          coords: [containerIndex, childIndex],
          scrollToChild: true, // Scroll inside the container to the specific media
        });

        childIndex++;
      });
    } else {
      // For other modules, add them directly
      navigationItems.push({
        id: `section-${module.__component}-${module.id}`,
        // id: module.id,
        icon: faCircle,
        coords: [containerIndex, childIndex],
        scrollToChild: true, // Scroll inside the container to the module
      });
      childIndex++;
    }
  });

  if (content.tags) {
    const hasRelatedProjects = content.tags.some((tag) =>
      tag.projects.some((project) => project.id !== content.id)
    );

    if (hasRelatedProjects) {
      containerIndex++;
      childIndex = 0;

      navigationItems.push({
        id: "related-projects",
        icon: faPaperclip,
        coords: [containerIndex, childIndex],
        scrollToChild: false,
      });
    }
  }
  return navigationItems;
};

export default SidePanelNavigation;
