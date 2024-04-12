"use client";

import styles from "./ProjectCard.module.css";

// React hooks imports
import { useEffect, useRef } from "react";

// When this func is called, it calculates the coordinates of the ProjectCard in the ProjectsContainer
import calcCoordinates from "@/utils/calcCoordinates";

const showElement = (domElement) => {
  domElement.style.visibility = "visible";
  domElement.style.opacity = "1";
};

const hideElement = (domElement) => {
  domElement.style.visibility = "hidden";
  domElement.style.opacity = "0";
};

const ProjectCard = ({ project, filterArray, projectsToDisplay }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    // To determine our actions, we need to know the index of the card on the projectsToDisplay array
    const indexInProjectsToDisplay = projectsToDisplay.findIndex(
      (projectToDisplay) => project.id === projectToDisplay
    );

    // We check if the card is to be displayed
    if (indexInProjectsToDisplay !== -1) {
      // We calculte its coordinates
      calcCoordinates(indexInProjectsToDisplay, cardRef.current);
      //   And we make sure the element is visible
      showElement(cardRef.current);
    } else hideElement(cardRef.current); // Otherwise we hide it
  }, [projectsToDisplay]);

  return (
    <div key={project.id} ref={cardRef} className={styles.projectCard}>
      <img
        src={project.thumbnail.url}
        alt={project.thumbnail.alternativeText}
      />
    </div>
  );
};

export default ProjectCard;
