"use client";

import styles from "./SectionNavigation.module.css";

// React hooks imports
import { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";

// Context import
import { WrapperContext } from "../ContentWrapper/ContentWrapper";

// Packages imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faPanorama,
  faPaperclip,
} from "@fortawesome/free-solid-svg-icons";
import generateBgColorString from "@/utils/generateBgColorString";

// This component displays a vertical menu on the right of the page to jump from section to section
const SectionNavigation = ({ content, customStyle }) => {
  const [domTarget, setDomTarget] = useState(null);

  const { activeCoordinates, setActiveCoordinates } =
    useContext(WrapperContext);

  const [activeSliderIndex, activeSectionIndex] = activeCoordinates;

  const opacityValue = 0.33;

  // This array will be displayed with a .map function
  const navigationArray = populateNavigationArray(content);
  const inlineStyle = {
    backgroundColor: generateBgColorString(customStyle.mainColor, opacityValue),
    color: customStyle.secondaryColor,
  };

  useEffect(() => {
    // We create a portal so this comp will be a child of <body>
    setDomTarget(document.body);
  }, []);

  return (
    domTarget &&
    createPortal(
      <nav className={styles.sectionNavigation} style={inlineStyle}>
        {navigationArray.map((entry) => {
          const [currentSliderIndex, currentSectionIndex] = entry.sectionCoords;

          const isActiveSection =
            currentSliderIndex === activeSliderIndex &&
            currentSectionIndex === activeSectionIndex;

          const buttonClass = isActiveSection
            ? styles.activeButton
            : styles.inactiveButton;

          const handleOnClick = () => setActiveCoordinates(entry.sectionCoords);

          return (
            <button
              key={entry.id}
              className={buttonClass}
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

// This func takes the content prop and returns an array that we will display with a .map function
const populateNavigationArray = (content) => {
  const response = [];

  let sliderIndex = 0;
  let sectionIndex = 0;

  if (content.cover) {
    response.push({
      id: content.cover.id,
      icon: faPanorama,
      sectionCoords: [sliderIndex, sectionIndex],
    });

    sliderIndex++;
  }

  content.modules.forEach((module) => {
    if (module.__component === "module.colonne-multi-images") {
      module.medias.forEach((media) => {
        response.push({
          id: media.id,
          icon: faCircle,
          sectionCoords: [sliderIndex, sectionIndex],
        });

        sectionIndex++;
      });
    } else {
      response.push({
        id: module.id,
        icon: faCircle,
        sectionCoords: [sliderIndex, sectionIndex],
      });

      sectionIndex++;
    }
  });

  if (content.tags) {
    sliderIndex++;
    sectionIndex = 0;

    response.push({
      id: "related-projects",
      icon: faPaperclip,
      sectionCoords: [sliderIndex, sectionIndex],
    });
  }

  return response;
};

export default SectionNavigation;
