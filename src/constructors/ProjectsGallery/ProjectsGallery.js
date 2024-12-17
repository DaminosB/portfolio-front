"use client";

import styles from "./ProjectsGallery.module.css";

// React hooks import
import { useEffect, useRef, useState, createContext, useMemo } from "react";

export const ProjectsGalleryContext = createContext();

// Components import
import TagsContainer from "@/components/TagsContainer/TagsContainer";
import ScrollBar from "@/components/ScrollBar/ScrollBar";
import populateScrollbarMetrics from "@/utils/populateScrollBarMetrics";

// This component wraps the project cards and handles the filtering logic
const ProjectsGallery = ({ customStyle, projectsCards, children }) => {
  // The active filter represents the tag selected by the user
  const [activeFilter, setActiveFilter] = useState(null);

  const [scrollBarMetrics, setScrollBarMetrics] = useState({
    thumbheight: 0,
    scrollProgress: 0,
  });

  // Apply the active filter to the project cards
  const filteredProjects = useMemo(() => {
    if (activeFilter) {
      return projectsCards.filter((project) =>
        project.tags.some((projectTag) => projectTag.id === activeFilter)
      );
    } else return projectsCards; // Reset to all projects if no filter is selected
  }, [activeFilter, projectsCards]);

  // The activeCard is the card currently being hovered
  const [activeCard, setActiveCard] = useState(null);

  // Reference to the DOM element that contains all the project cards
  const cardsContainerRef = useRef(null);

  const scrollerRef = useRef(null);

  // Generate the list of tags to be passed to the TagsContainer component
  const tagsList = populateTagsList(projectsCards);

  // Filters the projects and adjusts the height of the cards container
  useEffect(() => {
    const cardsContainer = cardsContainerRef.current;

    // Adjust the height of the cards container based on the number of rows
    const cardHeight = cardsContainer.firstElementChild.offsetHeight;
    const numberOfChildren = Array.from(cardsContainer.children).length;
    const numberOfRows = Math.ceil(
      numberOfChildren / customStyle.thumbnailsPerRow
    );
    const totalGapWidth = (numberOfRows - 1) * customStyle.gap;
    const cardsContainerHeight = cardHeight * numberOfRows + totalGapWidth;

    cardsContainer.style.height = `${cardsContainerHeight}px`;

    setScrollBarMetrics(() => populateScrollbarMetrics(scrollerRef.current));
  }, [customStyle]);

  const contextValues = {
    activeFilter,
    activeCard,
    filteredProjects,
    setActiveCard,
  };

  const customColors = {
    mainColor: customStyle.mainColor,
    secondaryColor: customStyle.secondaryColor,
  };

  const handleOnScroll = (e) => {
    const scroller = e.target;

    setScrollBarMetrics(() => populateScrollbarMetrics(scroller));
  };

  return (
    <ProjectsGalleryContext.Provider value={contextValues}>
      <div className={styles.projectCardsWrapper}>
        <div data-role="scroller" ref={scrollerRef} onScroll={handleOnScroll}>
          <TagsContainer
            tags={tagsList}
            activeFilter={activeFilter}
            setActiveFilter={setActiveFilter}
            customStyle={customStyle}
            customColors={customColors}
            activeCard={activeCard}
          />
          <div className="container">
            <div className={styles.cardsContainer} ref={cardsContainerRef}>
              {children}
            </div>
          </div>
        </div>
        <ScrollBar customColors={customColors} metrics={scrollBarMetrics} />
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
