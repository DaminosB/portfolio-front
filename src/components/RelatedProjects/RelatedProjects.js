import axios from "axios";
import styles from "./RelatedProjects.module.css";
import ProjectCardsWrapper from "../ProjectCardsWrapper/ProjectCardsWrapper";
import ProjectCard from "../ProjectCard/ProjectCard";

const RelatedProjects = ({ relatedProjects, style }) => {
  const totalGapWidth = (style.thumbnailsPerRow - 1) * style.gap;
  const projectCardWidthStr = `calc((100% - ${totalGapWidth}px) / ${style.thumbnailsPerRow})`;

  const cardsToDisplay = relatedProjects.map((relatedProject) => ({
    id: relatedProject.id,
    thumbnail: relatedProject.thumbnail,
    tags: relatedProject.tags,
    link: `/projects/${relatedProject.id}`,
    customStyles: {
      width: projectCardWidthStr,
      aspectRatio: "4/5",
    },
  }));

  return (
    <section>
      <ProjectCardsWrapper style={style} cardsToDisplay={cardsToDisplay}>
        {cardsToDisplay.map((card) => {
          return <ProjectCard key={card.id} cardData={card} />;
        })}
      </ProjectCardsWrapper>
    </section>
  );
};

export default RelatedProjects;
