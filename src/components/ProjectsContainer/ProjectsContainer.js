"use client";

import styles from "./ProjectsContainer.module.css";

// React hooks imports
import { useState, useEffect } from "react";

// Components imports
import ProjectCard from "../ProjectCard/ProjectCard";
import TagsContainer from "../TagsContainer/TagsContainer";

// This func returns the new content of the projectsToDisplay array
const filterProjects = (projects, activeFilter) => {
  if (!activeFilter) {
    // If no active filter is filled in, we show all projects
    const response = projects.map((project) => project.id);
    return response;
  } else {
    // Otherwise, we show only projects that fit in the category
    const response = projects
      .filter((project) => project.tags.some((tag) => tag.id === activeFilter))
      .map((project) => project.id);
    return response;
  }
};

const ProjectsContainer = ({ projects, tags, style }) => {
  // The active filter is the tag on which the viewer has clicked
  const [activeFilter, setActiveFilter] = useState(null);
  // When filled in, we only show projects that are paired with said tag

  // This state stores the id's of the projects we must display according to the activeFilter parameter
  const [projectsToDisplay, setProjectsToDisplay] = useState(() =>
    filterProjects(projects, activeFilter)
  );
  // It will be used by the ProjectCrd component to calculate its coordinates

  useEffect(() => {
    // We change the content of the projectsToDisplay state everytime the activeFilter is modified
    setProjectsToDisplay(() => filterProjects(projects, activeFilter));
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
      <div className="container">
        {projects.map((project, index) => {
          return (
            <ProjectCard
              key={project.id}
              project={project}
              activeFilter={activeFilter}
              projectsToDisplay={projectsToDisplay}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProjectsContainer;
