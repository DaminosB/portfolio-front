import Module_Fullpage from "@/modules/Module_Fullpage/Module_Fullpage";
import Module_MultiImagesColumn from "@/modules/Module_MultiImagesColumn/Module_MultiImagesColumn";
import Module_Container from "@/modules/Module_Container/Module_Container";
import Module_Text from "@/modules/Module_Text/Module_Text";

import CoverContainer from "@/components/CoverContainer/CoverContainer";
import SidePanelNavigation from "@/components/SidePanelNavigation/SidePanelNavigation";
import SnapScrollWrapper from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";
import ProjectsContainer from "@/components/ProjectsContainer/ProjectsContainer";
import EndScrollPanel from "@/wrappers/EndScrollPanel/EndScrollPanel";
import Modale from "@/components/Modale/Modale";
import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";

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
          {project.modules.map((module, index) => {
            switch (module.__component) {
              case "module.pleine-page":
                return (
                  <Module_Fullpage
                    key={module.id}
                    module={module}
                    customColors={customColors}
                  />
                );

              case "module.colonne-multi-images":
                return (
                  <Module_MultiImagesColumn
                    key={module.id}
                    module={module}
                    customColors={customColors}
                  />
                );

              case "module.container":
                return (
                  <Module_Container
                    key={module.id}
                    module={module}
                    customColors={customColors}
                  />
                );

              case "module.texte":
                return (
                  <Module_Text
                    key={module.id}
                    module={module}
                    customColors={customColors}
                  />
                );

              default:
                break;
            }
          })}
        </SnapScrollWrapper>
        {relatedProjects && (
          <EndScrollPanel customColors={customColors}>
            <ProjectsContainer
              projects={relatedProjects}
              customStyle={customStyle}
              logos={false}
            />
          </EndScrollPanel>
        )}
        <Modale customColors={customColors} />
        <SidePanelNavigation
          content={project}
          customStyle={customColors}
          showRelatedProject={relatedProjects ? true : false}
        />
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
  const [projectResponse, customStyleResponse] = await Promise.all([
    handleFetch(
      `projects/${projectId}?populate=cover,modules.medias,modules.backgroundImage,modules.text,tags.projects.thumbnail`
    ),
    handleFetch("style?populate=*"),
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
        medias: module.medias
          ? module.medias.data.map((media) => ({
              ...media.attributes,
              id: media.id,
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
