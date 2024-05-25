"use client";

import styles from "./SectionNavigation.module.css";

// React hooks imports
import { useEffect, useState, useContext } from "react";
import { createPortal } from "react-dom";

// Context import
import { WrapperContext } from "../ContentWrapper/ContentWrapper";

// Packages imports
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faPanorama } from "@fortawesome/free-solid-svg-icons";

// This component displays a vertical menu on the right of the page to jump from section to section
const SectionNavigation = ({ project }) => {
  const [domTarget, setDomTarget] = useState(null);

  const { activeIndex, setActiveIndex } = useContext(WrapperContext);

  // This array will be displayed with a .map function
  const navigationArray = populateNavigationArray(project);

  useEffect(() => {
    // We create a portal so this comp will be a child of <body>
    setDomTarget(document.body);
  }, []);

  const handleOnClick = (index) => {
    setActiveIndex(index);
  };

  return (
    domTarget &&
    createPortal(
      <nav className={styles.sectionNavigation}>
        {navigationArray.map((entry, index) => {
          const buttonClass =
            activeIndex === index ? styles.activeButton : "inactive";
          return (
            <button
              key={entry.id}
              className={buttonClass}
              onClick={() => handleOnClick(index)}
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

// This func takes the project prop and returns an array that we will display with a .map function
const populateNavigationArray = (project) => {
  const response = [];

  if (project.cover) {
    response.push({ id: project.cover.id, icon: faPanorama });
  }

  project.modules.forEach((module) => {
    if (module.__component === "module.colonne-multi-images") {
      module.medias.forEach((media) => {
        response.push({ id: media.id, icon: faCircle });
      });
    } else {
      response.push({ id: module.id, icon: faCircle });
    }
  });

  return response;
};

export default SectionNavigation;
