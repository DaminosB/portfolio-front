import axios from "axios";

import CoverContainer from "@/components/CoverContainer/CoverContainer";
import Module_Fullpage from "@/modules/Module_Fullpage/Module_Fullpage";
import Module_MultiImagesColumn from "@/modules/Module_MultiImagesColumn/Module_MultiImagesColumn";
import Module_Container from "@/modules/Module_Container/Module_Container";
import SidePanelNavigation from "@/components/SidePanelNavigation/SidePanelNavigation";
import SnapScrollWrapper from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";
import ProjectsContainer from "@/components/ProjectsContainer/ProjectsContainer";
import EndScrollPanel from "@/wrappers/EndScrollPanel/EndScrollPanel";
import Modale from "@/components/Modale/Modale";

export default async function ProjectsIdPage({ params }) {
  const { project, customStyle, relatedProjects } = await fetchData(params.id);

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
      <SidePanelNavigation content={project} customStyle={customColors} />
    </>
  );
}

// This function fetches data for a project page and its components
const fetchData = async (projectId) => {
  // Initialize the response object with default structure
  const response = {
    project: {},
    customStyle: {},
    tagsData: [],
    relatedProjects: [],
  };

  try {
    // Fetch project data, including related entities (cover, tags, modules, etc.)
    const projectResponse = await axios.get(
      `${process.env.API_URL}/projects/${projectId}?populate=cover,modules.medias,modules.backgroundImage,modules.text,tags.projects.thumbnail`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    const projectData = projectResponse.data.data;

    // Clean the project data and prepare the structure
    response.project = {
      ...projectData.attributes,
      id: projectData.id,
      cover: projectData.attributes.cover?.data
        ? {
            ...projectData.attributes.cover.data.attributes,
            id: projectData.attributes.cover.data.id,
          }
        : null,
      tags: projectData.attributes.tags.data.map((tag) => ({
        ...tag.attributes,
        id: tag.id,
      })),
    };

    // Clean and format the modules array (medias and background images)
    response.project.modules = projectData.attributes.modules.map((module) => ({
      ...module,
      backgroundImage: module.backgroundImage?.data
        ? {
            ...module.backgroundImage.data.attributes,
            id: module.backgroundImage.data.id,
          }
        : null,
      medias: module.medias.data.map((media) => ({
        ...media.attributes,
        id: media.id,
      })),
    }));
  } catch (error) {
    console.log(error);
  }

  try {
    // Fetch custom styles defined in the back office
    const customStyleResponse = await axios.get(
      `${process.env.API_URL}/style?populate=*`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    // Extract and assign the custom style data
    response.customStyle = { ...customStyleResponse.data.data.attributes };
  } catch (error) {
    console.log(error);
  }

  // If the project has tags, process related projects linked to those tags
  if (response.project.tags.length > 0) {
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

export async function generateMetadata({ params }) {
  try {
    const project = await axios.get(
      `${process.env.API_URL}/projects/${params.id}?populate=tags`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    const siteParameters = await axios.get(
      `${process.env.API_URL}/site-parameter`,
      {
        headers: { authorization: `Bearer ${process.env.API_TOKEN}` },
      }
    );

    const defaultTitle = siteParameters.data.data.attributes.pageTitle;
    const projectTitle = project.data.data.attributes.title;
    const titleStr = `${defaultTitle} || ${projectTitle}`;

    const tagsArray = project.data.data.attributes.tags.data;
    const tagsStr = tagsArray.map((tag) => tag.attributes.name).join(" | ");
    const projectDescription = project.data.data.attributes.description;

    const desciptionStr = projectDescription
      ? `${projectDescription}\n${tagsStr}`
      : tagsStr;

    return {
      title: titleStr,
      description: desciptionStr,
    };
  } catch (error) {
    console.log(error);
  }
}
