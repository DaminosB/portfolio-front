import styles from "./ProjectsContainer.module.css";

// Components imports
import ProjectsGallery from "@/constructors/ProjectsGallery/ProjectsGallery";
import ProjectCardWrapper from "@/constructors/ProjectCardWrapper/ProjectCardWrapper";

const ProjectsContainer = ({ projects, customStyle, logos }) => {
  const projectsCards = populateProjectsCards(projects, customStyle, logos);

  return (
    <div className={styles.projectsContainer}>
      <ProjectsGallery customStyle={customStyle} projectsCards={projectsCards}>
        {projectsCards.map((card) => {
          return (
            <ProjectCardWrapper key={card.id} cardData={card}>
              <img
                src={card.thumbnail.url}
                alt={card.thumbnail.alternativeText}
              />
            </ProjectCardWrapper>
          );
        })}
      </ProjectsGallery>
    </div>
  );
};

// This function populates the projectsCards array for display
const populateProjectsCards = (projects, customStyle, logos) => {
  const { gap, thumbnailsPerRow, thumbnailsRatio } = customStyle;

  // Calculate the total width of gaps in a row or column
  const totalGapWidth = (thumbnailsPerRow - 1) * gap;

  // Generate the CSS width string for each project card
  const projectCardWidthStr = `calc((100% - ${totalGapWidth}px) / ${thumbnailsPerRow})`;

  // Create an entry in the array for each project
  const response = projects.map((project) => ({
    id: `project-card-${project.id}`,
    thumbnail: project.thumbnail,
    tags: project.tags,
    link: `/projects/${project.id}`,
    gridConfig: { gap, thumbnailsPerRow },
    customStyles: {
      width: projectCardWidthStr,
      aspectRatio: thumbnailsRatio,
    },
  }));

  // Check if the logo card should be displayed
  if (logos.isVisible) {
    // Determine how much width is needed to complete the row
    const cardSpace = thumbnailsPerRow - (projects.length % thumbnailsPerRow);
    const gapFraction = gap / cardSpace;

    // Generate the CSS width string for the logo card
    const logoCardWidthStr = `calc(${cardSpace} * (100% - ${gapFraction}px) / ${thumbnailsPerRow})`;

    const [widthScale, heightScale] = thumbnailsRatio
      .split("/")
      .map(parseFloat);

    // Add the logo card entry to the array
    response.push({
      id: "logos-card",
      thumbnail: logos.thumbnail,
      tags: [],
      link: "/logos",
      gridConfig: { gap, thumbnailsPerRow },
      customStyles: {
        backgroundColor: logos.thumbnailColor,
        width: logoCardWidthStr,
        aspectRatio: `${widthScale * cardSpace}/${heightScale}`,
      },
    });
  }

  return response;
};

export default ProjectsContainer;
