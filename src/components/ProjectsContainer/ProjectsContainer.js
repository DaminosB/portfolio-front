"use client";

import styles from "./ProjectsContainer.module.css";

// React hooks imports
import { useState, useEffect, useRef } from "react";

// Components imports
import ProjectCard from "../ProjectCard/ProjectCard";
import TagsContainer from "../TagsContainer/TagsContainer";
import LogosCard from "../LogosCard/LogosCard";

// This func calculates the height of the cards container
const calcContainerHeight = (domElement, projectsToDisplay, styleInputs) => {
  // domElement. The ProjectCards whose coordinates are going to be calculates
  // projectsToDisplay: Array. The list of id's of project the viewer wants to display
  // styleInputs: Object. Contains 2 keys that will be destructured

  const { elementsPerRow, gap } = styleInputs;
  // elementsPerRow: Number. The number of thumbnails per row the user wants to display (set up in the backoffice)
  // gap: Number. The gap in px between thumbnails the user wants to display (set up in the backoffice)

  // We begin by getting the CardProjects dimensions (all CardProject's have the same)
  const referenceCard = domElement.children[0];

  const cardSize = {
    width: referenceCard.offsetWidth,
    height: referenceCard.offsetHeight,
  };

  //   Let's see how many projects need to be displayed
  const numberOfProjects = projectsToDisplay.length;

  //   And on how many rows they are displayed
  const numberOfRows = Math.ceil(numberOfProjects / elementsPerRow);

  //   We get the container's height by multiplying the number of rows by the height of a card. Let's not forget to add the gap.
  const containerHeight =
    numberOfRows * cardSize.height + (numberOfRows - 1) * gap;

  // And we apply it
  domElement.style.height = `${containerHeight}px`;
};

// This func returns the new content of the projectsToDisplay array
const filterProjects = (projects, activeFilter, showLogos) => {
  if (!activeFilter) {
    // If no active filter is filled in, we show all projects
    const response = projects.map((project) => project.id);
    showLogos && response.push("logos");
    return response;
  } else {
    // Otherwise, we show only projects that fit in the category
    const response = projects
      .filter((project) => project.tags.some((tag) => tag.id === activeFilter))
      .map((project) => project.id);
    return response;
  }
};

const ProjectsContainer = ({ projects, tags, style, logos }) => {
  // The active filter is the tag on which the viewer has clicked
  const [activeFilter, setActiveFilter] = useState(null);
  // When filled in, we only show projects that are paired with said tag

  // This state stores the tags of the project whose card is being hovered. It will be highlghted with the handles below
  const [filtersToHighlight, setFiltersToHighlight] = useState([]);

  // This state stores the id's of the projects we must display according to the activeFilter parameter
  const [projectsToDisplay, setProjectsToDisplay] = useState(() =>
    filterProjects(projects, activeFilter, logos.isVisible)
  );
  // It will be used by the ProjectCrd component to calculate its coordinates

  const cardsContainerRef = useRef(null);

  // We set the custom styles object
  const styleInputs = {
    gap: style.gap,
    elementsPerRow: style.thumbnailsPerRow,
  };

  // This func is called when a project card is hovered. It fades the unhovered card and displays the cover of the hovered project
  const handleOnMouseEnter = (index) => {
    // index : Number. It's the position of the card in its parent

    // We start by creating an array of all the cards container inactive children
    const inactiveCards = Array.from(cardsContainerRef.current.children).filter(
      (card, i) => i !== index
    );

    inactiveCards.map((card) => {
      card.classList.add("inactive");
    });

    // The last card is the logos card, so the cover image is found at a different adresse
    if (index !== projects.length) {
      // And we can can highlight the tags that are paired with the project
      const activeCardTagsIdsList = projects[index].tags.map((tag) => tag.id);

      setFiltersToHighlight(activeCardTagsIdsList);
    }
  };

  // When the card is not being hovered anymore, we go back to normal
  const handleMonMouseLeave = () => {
    const cards = Array.from(cardsContainerRef.current.children);

    cards.map((card) => {
      card.classList.remove("inactive");
    });

    setFiltersToHighlight([]);
  };

  useEffect(() => {
    // We change the content of the projectsToDisplay state everytime the activeFilter is modified
    setProjectsToDisplay(() =>
      filterProjects(projects, activeFilter, logos.isVisible)
    );

    calcContainerHeight(
      cardsContainerRef.current,
      filterProjects(projects, activeFilter, logos.isVisible),
      styleInputs
    );
  }, [activeFilter]);

  return (
    <section className={styles.projectsContainer} id="projects-container">
      <TagsContainer
        tags={tags}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        style={style}
        filtersToHighlight={filtersToHighlight}
      />
      <div
        className={`${styles.cardsContainer} container`}
        ref={cardsContainerRef}
      >
        {projects.map((project, index) => {
          return (
            <ProjectCard
              key={project.id}
              project={project}
              projectsToDisplay={projectsToDisplay}
              styleInputs={styleInputs}
              handleOnMouseEnter={handleOnMouseEnter}
              handleMonMouseLeave={handleMonMouseLeave}
              index={index}
            />
          );
        })}
        {logos.isVisible && (
          <LogosCard
            data={logos}
            projectsToDisplay={projectsToDisplay}
            styleInputs={styleInputs}
            handleOnMouseEnter={handleOnMouseEnter}
            handleMonMouseLeave={handleMonMouseLeave}
            indexInParent={projects.length}
          />
        )}
      </div>
    </section>
  );
};

export default ProjectsContainer;
