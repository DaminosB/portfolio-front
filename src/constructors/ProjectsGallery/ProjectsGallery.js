"use client";

import styles from "./ProjectsGallery.module.css";

// React hooks import
import { useEffect, useRef, useState, createContext } from "react";

export const ProjectsGalleryContext = createContext();

// Components import
import TagsContainer from "@/components/TagsContainer/TagsContainer";

// This component wraps the project cards and handles the filtering logic
const ProjectsGallery = ({ customStyle, projectsCards, children }) => {
  // The active filter represents the tag selected by the user
  const [activeFilter, setActiveFilter] = useState(null);

  // Stores the filtered project cards based on the active filter
  const [filteredProjects, setFilteredProjects] = useState(projectsCards);

  // The activeCard is the card currently being hovered
  const [activeCard, setActiveCard] = useState(null);

  // Reference to the DOM element that contains all the project cards
  const cardsContainerRef = useRef(null);

  // Generate the list of tags to be passed to the TagsContainer component
  const tagsList = populateTagsList(projectsCards);

  // Filters the projects and adjusts the height of the cards container
  useEffect(() => {
    const cardsContainer = cardsContainerRef.current;

    // Apply the active filter to the project cards
    if (activeFilter) {
      setFilteredProjects(
        projectsCards.filter((project) =>
          project.tags.some((projectTag) => projectTag.id === activeFilter)
        )
      );
    } else {
      setFilteredProjects(projectsCards); // Reset to all projects if no filter is selected
    }

    // Adjust the height of the cards container based on the number of rows
    const cardHeight = cardsContainer.firstElementChild.offsetHeight;
    const numberOfChildren = Array.from(cardsContainer.children).length;
    const numberOfRows = Math.ceil(
      numberOfChildren / customStyle.thumbnailsPerRow
    );
    const totalGapWidth = (numberOfRows - 1) * customStyle.gap;
    const cardsContainerHeight = cardHeight * numberOfRows + totalGapWidth;

    cardsContainer.style.height = `${cardsContainerHeight}px`;
  }, [activeCard, activeFilter, customStyle, projectsCards]);

  const contextValues = {
    activeFilter,
    activeCard,
    filteredProjects,
    setActiveCard,
  };

  return (
    <ProjectsGalleryContext.Provider value={contextValues}>
      <div className={styles.projectCardsWrapper} id="thumbnails-wrapper">
        <TagsContainer
          tags={tagsList}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          customStyle={customStyle}
          activeCard={activeCard}
        />
        <div className="container">
          <div
            className={styles.cardsContainer}
            id="cards-container"
            ref={cardsContainerRef}
          >
            {children}
          </div>
        </div>
      </div>
    </ProjectsGalleryContext.Provider>
  );
};

// This function creates the list of unique tags to be passed to the TagsContainer component
const populateTagsList = (projectsCards) => {
  const response = [];

  // Loop through each project's tags and add unique tags to the response array
  projectsCards.forEach((card) => {
    if (card.tags.length > 0) {
      // For each tag, check if it's already in the response array
      card.tags.forEach((tag) => {
        const isAlreadyInResponse = response.some(
          (entry) => entry.id === tag.id
        );

        // If the tag is not already in the array, add it
        if (!isAlreadyInResponse) response.push(tag);
      });
    }
  });

  return response;
};

export default ProjectsGallery;
