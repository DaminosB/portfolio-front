import styles from "./page.module.css";

import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";
import SnapScrollWrapper from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";
import ModulesDisplayer from "@/constructors/ModulesDisplayer/ModulesDisplayer";
import CoverContainer from "@/components/CoverContainer/CoverContainer";
import ContentMenu from "@/components/ContentMenu/ContentMenu";
import ProjectsContainer from "@/components/ProjectsContainer/ProjectsContainer";
import Modale from "@/components/Modale/Modale";
import generateDynamicStyle from "@/utils/generateDynamicStyle";
import generateRGBAString from "@/utils/generateRGBAString";

import handleFetch from "@/utils/handleFetch";

export default async function ProjectsIdPage({ params }) {
  const data = await fetchData(params.id);

  if (!data) return <ErrorComponent type={"notFound"} />;
  else {
    const { project, customStyle, relatedProjects } = data;

    const customColors = {
      mainColor: project.mainColor,
      secondaryColor: project.secondaryColor,
    };

    const inlineStyle = {
      backgroundColor: generateRGBAString(customColors.mainColor, 0.5),
    };

    return (
      <>
        {project.cover && (
          <CoverContainer
            coverUrl={project.cover.url}
            coverAltTxt={project.cover.alternativeText}
            customColors={customColors}
          />
        )}
        <SnapScrollWrapper>
          <ModulesDisplayer
            modules={project.modules}
            customColors={customColors}
          />
        </SnapScrollWrapper>
        {relatedProjects.length > 0 && (
          <div className={styles.relatedProjects} style={inlineStyle}>
            <ProjectsContainer
              projects={relatedProjects}
              customStyle={customStyle}
              logos={false}
            />
          </div>
        )}
        <Modale customColors={customColors} />
        <ContentMenu content={project} customColors={customColors} />
        <style>{generateDynamicStyle(customColors)}</style>
      </>
    );
  }
}

export async function generateMetadata({ params }) {
  const [projectResponse, siteParametersResponse] = await Promise.all([
    handleFetch(`projects/${params.id}?populate=tags`),
    handleFetch("site-parameter"),
  ]);

  if (!projectResponse.data) return;
  const defaultTitle = siteParametersResponse.data.attributes.pageTitle;
  const projectTitle = projectResponse.data.attributes.title;
  const titleStr = `${defaultTitle} || ${projectTitle}`;

  const tagsArray = projectResponse.data.attributes.tags.data;
  const tagsStr = tagsArray.map((tag) => tag.attributes.name).join(" | ");
  const projectDescription = projectResponse.data.attributes.description;

  const desciptionStr = projectDescription
    ? `${projectDescription}\n${tagsStr}`
    : tagsStr;

  return {
    title: titleStr,
    description: desciptionStr,
  };
}

const fetchData = async (projectId) => {
  // Construction of the project's path string
  let projectPath = `projects/${projectId}?populate=`;
  projectPath += "cover";
  projectPath += ",modules.titleBlock";
  projectPath += ",modules.mediaBlocks.mediaAssets";
  projectPath += ",modules.backgroundImage";
  projectPath += ",modules.text";
  projectPath += ",tags.projects.thumbnail";

  // Construction of the style's path string
  let stylePath = "style?populate=";
  stylePath += "*";

  const [projectResponse, customStyleResponse] = await Promise.all([
    handleFetch(projectPath),
    handleFetch(stylePath),
  ]);

  if (!projectResponse.data) return;

  const response = {
    project: {
      ...projectResponse.data.attributes,
      id: projectResponse.data.id,
      cover: projectResponse.data.attributes.cover.data
        ? {
            ...projectResponse.data.attributes.cover.data.attributes,
            id: projectResponse.data.attributes.cover.data.id,
          }
        : null,
      tags: projectResponse.data.attributes.tags.data.map((tag) => ({
        ...tag.attributes,
        id: tag.id,
      })),
      modules: projectResponse.data.attributes.modules.map((module) => ({
        ...module,
        backgroundImage: module.backgroundImage?.data
          ? {
              ...module.backgroundImage.data.attributes,
              id: module.backgroundImage.data.id,
            }
          : null,
        mediaBlocks: module.mediaBlocks
          ? module.mediaBlocks.map((mediaBlock) => ({
              ...mediaBlock,
              mediaAssets: mediaBlock.mediaAssets.data.map((mediaAsset) => ({
                ...mediaAsset.attributes,
                addToCarousel: mediaBlock.addToCarousel,
                id: mediaAsset.id,
              })),
            }))
          : [],
      })),
    },
    customStyle: { ...customStyleResponse.data.attributes },
  };

  if (response.project.tags.length > 0) {
    response.relatedProjects = [];

    response.project.tags.forEach((tag) => {
      tag.projects.data.forEach((relatedProject) => {
        const isCurrentProject = response.project.id === relatedProject.id;

        // Check if the related project is already in the relatedProjects array
        const relatedProjectIndex = response.relatedProjects.findIndex(
          (project) => project.id === relatedProject.id
        );

        // If the related project is not the current project, process it
        if (!isCurrentProject) {
          if (relatedProjectIndex === -1) {
            // Add new related project entry
            response.relatedProjects.push({
              ...relatedProject.attributes,
              id: relatedProject.id,
              tags: [{ ...tag }],
              thumbnail: {
                ...relatedProject.attributes.thumbnail.data.attributes,
                id: relatedProject.attributes.thumbnail.data.id,
              },
            });
          } else {
            // If project already exists, add the new tag to its tags array
            response.relatedProjects[relatedProjectIndex].tags.push({ ...tag });
          }
        }
      });

      // Preserve the original list of projects under each tag
      tag.projects = [...tag.projects.data];
    });
  } else {
    response.relatedProjects = null;
  }

  return response;
};
