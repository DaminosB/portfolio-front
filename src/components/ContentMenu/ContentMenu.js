"use client";

import styles from "./ContentMenu.module.css";

// Import React hooks
import { useEffect, useState, useRef, useContext, useMemo } from "react";
import { createPortal } from "react-dom";

// Import Contexts
import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

// Import font-awesome icons
import {
  faCircle,
  faCircleInfo,
  faCirclePlus,
  faCircleUp,
} from "@fortawesome/free-solid-svg-icons";

// Utility function import
import generateRGBAString from "@/utils/generateRGBAString";
import NavigationButton from "../NavigationButton/NavigationButton";
import ContentMeta from "../ContentMeta/ContentMeta";

// This component displays a vertical side navigation panel to jump between sections of the page
const ContentMenu = ({ content, customColors }) => {
  const [domTarget, setDomTarget] = useState(null); // Holds the target DOM node for the portal

  const [showContentMeta, setShowContentMeta] = useState(false);
  // Get the current active coordinates from context (active container and child section)
  const { activeCoords, layoutScroller } = useContext(LayoutContext);
  const [activeContainerIndex, activeChildIndex] = activeCoords;

  const contentMenuRef = useRef();

  // Prepare the navigation array using the content prop
  const navigationItems = useMemo(
    () => createNavigationItems(content),
    [content]
  );

  // Set the inline style for the panel background and text color
  const panelStyle = {
    color: customColors.secondaryColor,
  };

  // Create a portal to attach this component to the body element on mount
  useEffect(() => {
    const layoutContainer = document.getElementById("layout-container");

    setDomTarget(layoutContainer);

    const contentMenu = contentMenuRef.current;

    if (contentMenu) contentMenu.classList.remove("hidden");
  }, [domTarget]);

  const navigationButtonStyle = {
    backgroundColor: customColors.mainColor,
  };

  const metaData = {
    title: content.title,
    description: content.description,
    tags: content.tags,
  };

  const toggleShowMetaDetails = () => setShowContentMeta((prev) => !prev);
  return (
    domTarget &&
    createPortal(
      <>
        <ContentMeta
          metaData={metaData}
          showContentMeta={showContentMeta}
          setShowContentMeta={setShowContentMeta}
          customColors={customColors}
        />
        <nav
          className={`hidden ${styles.sectionNavigation}`}
          style={panelStyle}
          ref={contentMenuRef}
        >
          <div>
            <NavigationButton
              icon={faCircleInfo}
              onClickFunction={toggleShowMetaDetails}
              isActive={showContentMeta}
              inlineStyle={navigationButtonStyle}
            />
          </div>

          <div>
            {/* Render each navigation button */}
            {navigationItems.map((navItem) => {
              const [containerIndex, childIndex] = navItem.coords;
              const isActiveSection =
                containerIndex === activeContainerIndex &&
                childIndex === activeChildIndex;

              // Function to handle clicks and scroll to the appropriate section
              const scrollToSection = () => {
                requestAnimationFrame(() => setShowContentMeta(false));
                const containers = Array.from(
                  layoutScroller.firstElementChild.children
                );
                const targetContainer = containers[containerIndex];

                // Calculate the total height to scroll to the target container
                const cumulativeHeight = containers
                  .slice(0, containerIndex)
                  .reduce((acc, container) => acc + container.offsetHeight, 0);

                // Scroll to the target container in the layout
                layoutScroller.scrollTo({
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
                <NavigationButton
                  key={navItem.id}
                  isActive={isActiveSection}
                  onClickFunction={scrollToSection}
                  icon={navItem.icon}
                  inlineStyle={navigationButtonStyle}
                />
              );
            })}
          </div>
        </nav>
      </>,
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
      icon: faCircleUp,
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
        icon: faCirclePlus,
        coords: [containerIndex, childIndex],
        scrollToChild: false,
      });
    }
  }
  return navigationItems;
};

export default ContentMenu;
