import styles from "./ProjectCard.module.css";

// React hooks imports
import { useEffect, useRef } from "react";

// Utils imports
import calcCoordinates from "@/utils/calcCoordinates";
import hideElement from "@/utils/hideElement";
import showElement from "@/utils/showElement";

const ProjectCard = ({ project, projectsToDisplay, styleInputs }) => {
  const cardRef = useRef(null);

  const customStyles = {
    width: `calc((100% - ${
      (styleInputs.elementsPerRow - 1) * styleInputs.gap
    }px) / ${styleInputs.elementsPerRow})`,
  };

  useEffect(() => {
    console.log(customStyles);
    // To determine our actions, we need to know the index of the card on the projectsToDisplay array
    const indexInProjectsToDisplay = projectsToDisplay.findIndex(
      (projectToDisplay) => project.id === projectToDisplay
    );

    // We check if the card is to be displayed
    if (indexInProjectsToDisplay !== -1) {
      // We calculte its coordinates
      calcCoordinates(indexInProjectsToDisplay, cardRef.current, styleInputs);
      //   And we make sure the element is visible
      showElement(cardRef.current);
    } else hideElement(cardRef.current); // Otherwise we hide it
  }, [projectsToDisplay]);

  return (
    <div
      key={project.id}
      ref={cardRef}
      className={styles.projectCard}
      style={customStyles}
    >
      <img
        src={project.thumbnail.url}
        alt={project.thumbnail.alternativeText}
      />
    </div>
  );
};

export default ProjectCard;
