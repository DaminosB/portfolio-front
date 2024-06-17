import styles from "./ProjectsContainer.module.css";

// Components imports
import ProjectCard from "../ProjectCard/ProjectCard";
import ProjectCardsWrapper from "../ProjectCardsWrapper/ProjectCardsWrapper";

const ProjectsContainer = ({ projects, customStyle, logos }) => {
  const totalGapWidth = (customStyle.thumbnailsPerRow - 1) * customStyle.gap;

  const projectCardWidthStr = `calc((100% - ${totalGapWidth}px) / ${customStyle.thumbnailsPerRow})`;

  const cardsToDisplay = projects.map((project) => ({
    id: project.id,
    thumbnail: project.thumbnail,
    tags: project.tags,
    link: `/projects/${project.id}`,
    customStyles: {
      width: projectCardWidthStr,
      aspectRatio: "4/5",
    },
  }));

  if (logos.isVisible)
    cardsToDisplay.push({
      id: "logos-card",
      thumbnail: logos.thumbnail,
      tags: [],
      link: "/logos",
      customStyles: {
        backgroundColor: logos.thumbnailColor,
        right: "0px",
        bottom: "0px",
      },
    });

  const wrapperStyle = {
    backgroundColor: customStyle.defaultBackgroundColor,
    color: customStyle.defaultFontColor,
    gap: customStyle.gap,
    thumbnailsPerRow: customStyle.thumbnailsPerRow,
  };

  return (
    <section className={styles.projectsContainer} id="projects-container">
      <ProjectCardsWrapper
        customStyle={wrapperStyle}
        cardsToDisplay={cardsToDisplay}
      >
        {cardsToDisplay.map((card) => {
          return <ProjectCard key={card.id} cardData={card} />;
        })}
      </ProjectCardsWrapper>
    </section>
  );
};

export default ProjectsContainer;
