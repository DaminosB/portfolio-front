import styles from "./ProjectCard.module.css";

// React hooks imports
import { useEffect, useRef } from "react";

import Link from "next/link";

// Utils imports
import calcCoordinates from "@/utils/calcCoordinates";

const ProjectCard = ({
  project,
  projectsToDisplay,
  styleInputs,
  handleOnMouseEnter,
  handleMonMouseLeave,
  index,
}) => {
  const cardRef = useRef(null);

  const customStyles = {
    width: `calc((100% - ${
      (styleInputs.elementsPerRow - 1) * styleInputs.gap
    }px) / ${styleInputs.elementsPerRow})`,
  };

  useEffect(() => {
    // To determine our actions, we need to know the index of the card on the projectsToDisplay array
    const indexInProjectsToDisplay = projectsToDisplay.findIndex(
      (projectToDisplay) => project.id === projectToDisplay
    );

    // We check if the card is to be displayed
    if (indexInProjectsToDisplay !== -1) {
      // We calculte its coordinates
      calcCoordinates(indexInProjectsToDisplay, cardRef.current, styleInputs);
      //   And we make sure the element is visible
      cardRef.current.classList.remove("hidden");
    } else cardRef.current.classList.add("hidden"); // Otherwise we hide it
  }, [projectsToDisplay]);

  return (
    <div
      ref={cardRef}
      className={styles.projectCard}
      style={customStyles}
      onMouseEnter={() => handleOnMouseEnter(index)}
      onMouseLeave={handleMonMouseLeave}
    >
      <Link href={`/projects/${project.id}`}>
        <img
          src={project.thumbnail.url}
          alt={project.thumbnail.alternativeText}
        />
      </Link>
    </div>
  );
};

export default ProjectCard;
