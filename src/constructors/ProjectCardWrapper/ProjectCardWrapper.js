"use client";

import styles from "./ProjectCardWrapper.module.css";

// React hooks import
import { useContext, useRef, useEffect } from "react";

// Context import
import { ProjectsGalleryContext } from "../ProjectsGallery/ProjectsGallery";
import { LayoutContext } from "@/wrappers/LayoutWrapper/LayoutWrapper";

import Link from "next/link";

// This component wraps a project's thumbnail and manages its position and interactions
const ProjectCardWrapper = ({ cardData, children }) => {
  const { id, customStyles, gridConfig, link } = cardData;
  const { thumbnailsPerRow, gap } = gridConfig;

  // Retrieve context values for active card state and filtered projects
  const { activeCard, setActiveCard, filteredProjects } = useContext(
    ProjectsGalleryContext
  );

  // Reference to the DOM element of the card wrapper
  const cardsRef = useRef(null);

  // Cache the card's index to avoid recalculating when unnecessary
  const cachedCardIndex = useRef(null);

  // Calculate the position of the card in the grid based on its index
  useEffect(() => {
    const cardDiv = cardsRef.current;
    const cardIndex = filteredProjects.findIndex(
      (project) => project.id === id
    );

    // If the card should be displayed and its index has changed
    if (cardIndex !== -1 && cachedCardIndex.current !== cardIndex) {
      cachedCardIndex.current = cardIndex;

      // Make the card visible
      cardDiv.classList.remove("hidden");

      // Use the first card in the parent container as a reference for size
      const referenceCard = cardDiv.parentNode.firstElementChild;
      const cardSize = {
        width: referenceCard.offsetWidth,
        height: referenceCard.offsetHeight,
      };

      // Calculate the row and column position of the card in the grid
      const rowIndex = Math.floor(cardIndex / thumbnailsPerRow);
      const columnIndex = cardIndex % thumbnailsPerRow;

      // Calculate the top and left positions based on card size and gap
      const topPosition = rowIndex * cardSize.height + rowIndex * gap;
      const leftPosition = columnIndex * cardSize.width + columnIndex * gap;

      // Apply the calculated position using CSS transform
      cardDiv.style.transform = `translate(${leftPosition}px, ${topPosition}px)`;
    } else if (cardIndex === -1) {
      // If the card is not found, hide it
      cachedCardIndex.current = null;
      cardDiv.classList.add("hidden");
    }

    // If an active card exists, make non-active cards transparent for hover effect
    if (activeCard && activeCard.id !== id) {
      cardDiv.classList.add(styles.transparent);
    } else {
      cardDiv.classList.remove(styles.transparent);
    }
  }, [activeCard, filteredProjects, gap, id, thumbnailsPerRow]);

  return (
    <div
      className={styles.projectCard}
      style={customStyles}
      ref={cardsRef}
      onMouseEnter={() => setActiveCard(cardData)}
      onMouseLeave={() => setActiveCard(null)}
    >
      <Link href={link}>{children}</Link>
    </div>
  );
};

export default ProjectCardWrapper;
