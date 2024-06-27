import styles from "./RelatedProjects.module.css";

// Components import
import ProjectCardsWrapper from "../ProjectCardsWrapper/ProjectCardsWrapper";
import ProjectCard from "../ProjectCard/ProjectCard";

// Utils import
import generateBgColorString from "@/utils/generateBgColorString";

// This comp takes the tagsData request and displays projects that share 1 or more tag with the currently displayed one
const RelatedProjects = ({
  tagsData,
  projectId,
  customStyle,
  customColors,
}) => {
  const totalGapWidth = (customStyle.thumbnailsPerRow - 1) * customStyle.gap;
  const projectCardWidthStr = `calc((100% - ${totalGapWidth}px) / ${customStyle.thumbnailsPerRow})`;

  const wrapperStyle = {
    backgroundColor: customColors.mainColor,
    color: customColors.secondaryColor,
    gap: customStyle.gap,
    thumbnailsPerRow: customStyle.thumbnailsPerRow,
  };

  const opacityValue = 0.8;

  const inlineStyle = {
    backgroundColor: generateBgColorString(
      customColors.mainColor,
      opacityValue
    ),
    color: customColors.secondaryColor,
  };

  const relatedProjects = populateRelatedProjects(tagsData, projectId);

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
    <section className={styles.relatedProjects} style={inlineStyle}>
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

export default RelatedProjects;

const populateRelatedProjects = (tagsData, projectId) => {
  const response = [];
  // We loop through the the tagsData array
  tagsData.forEach((tagResponse) => {
    // The projects that share the given tag are stored at this address
    const projectsWithTag = tagResponse.projects.data;

    // For each of them, we will check if we should push them in the relatedProjects array
    projectsWithTag.forEach((relatedProject) => {
      // If the relatedProject is the same as the one currently displayed, we don't want to put it in the relatedProjects array
      const isCurrentProject = projectId === relatedProject.id;

      // We check for the relatedProject index in the relatedProjects array
      const relatedProjectIndex = response.findIndex(
        (project) => project.id === relatedProject.id
      );

      if (relatedProjectIndex === -1 && !isCurrentProject) {
        // If the project is not in the relatedProjects array, we create a new entry
        response.push({
          ...relatedProject.attributes,
          id: relatedProject.id,
          tags: [{ ...tagResponse }],
          thumbnail: {
            ...relatedProject.attributes.thumbnail.data.attributes,
            id: relatedProject.attributes.thumbnail.data.id,
          },
        });
      } else if (relatedProjectIndex !== -1) {
        // Otherwise, we just push a new tag in the related project tags key
        response[relatedProjectIndex].tags.push({ ...tagResponse });
      }
    });
  });

  return response;
};
