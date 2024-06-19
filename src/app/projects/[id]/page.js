import styles from "./page.module.css";

import { Suspense } from "react";

import axios from "axios";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import CoverContainer from "@/components/CoverContainer/CoverContainer";
import Module_Fullpage from "@/components/Module_Fullpage/Module_Fullpage";
import Module_MultiImagesColumn from "@/components/Module_MultiImagesColumn/Module_MultiImagesColumn";
import Module_Container from "@/components/Module_Container/Module_Container";
import SectionNavigation from "@/components/SectionNavigation/SectionNavigation";
import RelatedProjects from "@/components/RelatedProjects/RelatedProjects";
import Slider from "@/components/Slider/Slider";

export default async function ProjectsIdPage({ params }) {
  const { project, customStyle, tagsData } = await fetchData(params.id);

  const customColors = {
    themeColor: project.themeColor,
    fontColor: project.fontColor,
  };

  return (
    <Suspense>
      <ContentWrapper>
        {project.cover && (
          <Slider id={"cover"} hideOnInactive={true}>
            <CoverContainer
              coverUrl={project.cover.url}
              coverAltTxt={project.cover.alternativeText}
            />
          </Slider>
        )}
        <Slider id={"project-content"} hideHeader={true}>
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
        </Slider>
        <Slider
          id={"related-projects-slider"}
          hideHeader={true}
          hideOnInactive={true}
        >
          <RelatedProjects
            tagsData={tagsData}
            projectId={project.id}
            customStyle={customStyle}
            customColors={customColors}
          />
        </Slider>
        <SectionNavigation content={project} customStyle={customColors} />
      </ContentWrapper>
    </Suspense>
  );
}
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

// This func is called to provide the page and its component with data
const fetchData = async (projectId) => {
  // First we create the object we will return and its keys
  const response = {
    project: {},
    customStyle: {},
    tagsData: [],
  };

  try {
    // This request gives all the infos about the project currently displayed
    const project = await axios.get(
      `${process.env.API_URL}/projects/${projectId}?populate=cover,modules.medias,modules.backgroundImage,modules.text,tags`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    // We set the response object by cleaning the project object
    response.project = {
      ...project.data.data.attributes,
      id: project.data.data.id,
      cover: project.data.data.attributes.cover.data,
      tags: [...project.data.data.attributes.tags.data],
    };

    if (response.project.cover) {
      response.project.cover = {
        ...project.data.data.attributes.cover.data.attributes,
        id: project.data.data.attributes.cover.data.id,
      };
    } else {
      response.project.cover = null;
    }
  } catch (error) {
    console.log(error);
  }

  try {
    // This is the special customStyle the user has set in the back office
    const customStyle = await axios.get(
      `${process.env.API_URL}/style?populate=*`,
      {
        headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
      }
    );

    // Same with the customStyle object
    response.customStyle = { ...customStyle.data.data.attributes };
  } catch (error) {
    console.log(error);
  }

  // The modules array also need to be cleaned up
  response.project.modules.forEach((module, i) => {
    response.project.modules[i].backgroundImage = module.backgroundImage
      ?.data && {
      ...module.backgroundImage.data.attributes,
      id: module.backgroundImage.data.id,
    };
    response.project.modules[i].medias = [...module.medias.data];

    response.project.modules[i].medias.forEach((media, j) => {
      response.project.modules[i].medias[j] = {
        ...media.attributes,
        id: media.id,
      };
    });
  });

  // We want to invite the viewer to see other projects that share 1 or more tags with the currently displayed project
  const tagRequestPromises = response.project.tags.map((tag, index) => {
    // So we make as many requests as there are tags on the project to fetch all the related ones

    // We take advantage of the loop to clean up the tags array
    response.project.tags[index] = { ...tag.attributes, id: tag.id };

    // This function returns an array of promises
    return axios.get(
      `${process.env.API_URL}/tags/${tag.id}?populate=projects.thumbnail`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );
  });

  try {
    // We store the results of the promises in a new array
    const tagsResponseArray = await Promise.all(tagRequestPromises);

    tagsResponseArray.forEach((tagResponse) => {
      response.tagsData.push({
        ...tagResponse.data.data.attributes,
        id: tagResponse.data.data.id,
      });
    });
  } catch (error) {
    console.log(error);
  }

  return response;
};
