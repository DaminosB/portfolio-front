"use client";

import styles from "./ProjectsContainer.module.css";

// React hooks imports
import { useState, useEffect, useRef } from "react";

// Components imports
import ProjectCard from "../ProjectCard/ProjectCard";
import TagsContainer from "../TagsContainer/TagsContainer";
import LogosCard from "../LogosCard/LogosCard";

const calcContainerHeight = (domElement, projectsToDisplay) => {
  const elementWidth = domElement.offsetWidth;

  const referenceCard = domElement.children[0];

  const cardSize = {
    width: referenceCard.offsetWidth,
    height: referenceCard.offsetHeight,
  };

  const elementsPerRow = Math.floor(elementWidth / cardSize.width);

  const numberOfProjects = projectsToDisplay.length;

  const numberOfRows = Math.ceil(numberOfProjects / elementsPerRow);

  const containerHeight =
    numberOfRows * cardSize.height + (numberOfRows - 1) * 20;

  const minHeight = 2 * cardSize.height + 20;

  if (containerHeight < minHeight) domElement.style.height = `${minHeight}px`;
  else domElement.style.height = `${containerHeight}px`;
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

  // This state stores the id's of the projects we must display according to the activeFilter parameter
  const [projectsToDisplay, setProjectsToDisplay] = useState(() =>
    filterProjects(projects, activeFilter, logos.visible)
  );
  // It will be used by the ProjectCrd component to calculate its coordinates

  const cardsContainer = useRef(null);

  useEffect(() => {
    // console.log(projectsToDisplay[projects.length - 1]);
    // We change the content of the projectsToDisplay state everytime the activeFilter is modified
    setProjectsToDisplay(() =>
      filterProjects(projects, activeFilter, logos.visible)
    );

    calcContainerHeight(
      cardsContainer.current,
      filterProjects(projects, activeFilter, logos.visible)
    );
  }, [activeFilter]);

  return (
    <div className={styles.projectsContainer}>
      <div className="container">
        <TagsContainer
          tags={tags}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          style={style}
        />
      </div>
      <div className="container" ref={cardsContainer}>
        {projects.map((project, index) => {
          return (
            <ProjectCard
              key={project.id}
              project={project}
              projectsToDisplay={projectsToDisplay}
            />
          );
        })}
        {logos.visible && (
          <LogosCard data={logos} projectsToDisplay={projectsToDisplay} />
        )}
      </div>
    </div>
  );
};

export default ProjectsContainer;
