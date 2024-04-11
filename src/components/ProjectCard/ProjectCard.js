"use client";

import styles from "./ProjectCard.module.css";

// React hooks imports
import { useEffect, useRef } from "react";

// When this func is called, it calculates the coordinates of the ProjectCard in the ProjectsContainer
const calcCoordinates = (index, domElement) => {
  // index: Number. The position of the element in the projectsToDisplay array
  // domElement. The ProjectCards whose coordinates are going to be calculates

  // We begin by getting the CardProjects dimensions (all CardProject's have the same)
  const cardSize = {
    width: domElement.offsetWidth,
    height: domElement.offsetHeight,
  };

  // We need to find the parent's width
  const parentWidth = domElement.parentNode.offsetWidth;

  // With card's width, we get the number of elemennts per row
  const elementsPerRow = Math.floor(parentWidth / cardSize.width);

  // Knowing this, we can determine on which Row the card is displayed
  const rowIndex = Math.floor(index / elementsPerRow);

  // To get the columnIndex, we need to remove all the elements displayed on the previous rows from the current index
  const columnIndex = index - rowIndex * elementsPerRow;

  // This lets us calculte the coordinates of the card
  const topPosition = rowIndex * cardSize.height + rowIndex * 20;
  const leftPosition = columnIndex * cardSize.width + columnIndex * 20;

  // We apply them the card
  domElement.style.top = `${topPosition}px`;
  domElement.style.left = `${leftPosition}px`;
};

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
    <div key={project.id} className={styles.projectCard} ref={cardRef}>
      <img
        src={project.thumbnail.url}
        alt={project.thumbnail.alternativeText}
      />
    </div>
  );
};

export default ProjectCard;
