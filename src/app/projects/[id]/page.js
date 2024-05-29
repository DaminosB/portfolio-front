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

export default async function ProjectsIdPage({ params }) {
  const { project, relatedProjects, style } = await fetchData(params.id);

  return (
    <Suspense>
      <ContentWrapper>
        <CoverContainer
          coverUrl={project.cover.url}
          coverAltTxt={project.cover.alternativeText}
        />
        {project.modules.map((module, index) => {
          switch (module.__component) {
            case "module.pleine-page":
              return <Module_Fullpage key={module.id} module={module} />;

            case "module.colonne-multi-images":
              return (
                <Module_MultiImagesColumn key={module.id} module={module} />
              );

            case "module.container":
              return <Module_Container key={module.id} module={module} />;

            default:
              break;
          }
        })}
        <RelatedProjects relatedProjects={relatedProjects} style={style} />
        <SectionNavigation content={project} />
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
    style: {},
    relatedProjects: {},
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
      cover: {
        ...project.data.data.attributes.cover.data.attributes,
        id: project.data.data.attributes.cover.data.id,
      },
      tags: [...project.data.data.attributes.tags.data],
    };
  } catch (error) {
    console.log(error);
  }

  try {
    // This is the special style the user has set in the back office
    const style = await axios.get(`${process.env.API_URL}/style?populate=*`, {
      headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
    });

    // Same with the style object
    response.style = { ...style.data.data.attributes };
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

  // This is the constant that will store the definitive related projects that will be displayed by the RelatedProjects component
  const relatedProjects = [];

  // We want to invite the viewer to see other projects that share 1 or more tags with the currently displayed project
  const tagRequestPromises = response.project.tags.map((tag, index) => {
    // So we make as many requests as there are tags on the project to fetch all the related ones

    // We take advantage of the loop to clean up the tags array
    response.project.tags[index] = { ...tag.attributes, id: tag.id };

    // This function returns an array of promises
    try {
      return axios.get(
        `${process.env.API_URL}/tags/${tag.id}?populate=projects.thumbnail,projects.tags`,
        { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
      );
    } catch (error) {
      console.log(error);
    }
  });

  // We store the results of the promises in a new array
  const tagsResponseArray = await Promise.all(tagRequestPromises);

  // We loop through the array that stores the results of the requests
  tagsResponseArray.forEach((tagResponse) => {
    // The projects that share the given tag are stored at this address
    const projectsWithTag = tagResponse.data.data.attributes.projects.data;

    // For each of them, we will check if we should push them in the relatedProjects array
    projectsWithTag.forEach((relatedProject) => {
      // If the relatedProject is the same as the one currently displayed, we don't want to put it in the relatedProjects array
      const isCurrentProject = response.project.id === relatedProject.id;

      // We check for the relatedProject index in the relatedProjects array
      const relatedProjectIndex = relatedProjects.findIndex(
        (project) => project.id === relatedProject.id
      );

      if (relatedProjectIndex === -1 && !isCurrentProject) {
        // If the project is not in the relatedProjects array, we create a new entry
        relatedProjects.push({
          ...relatedProject.attributes,
          id: relatedProject.id,
          tags: [
            {
              ...tagResponse.data.data.attributes,
              id: tagResponse.data.data.id,
            },
          ],
          thumbnail: {
            ...relatedProject.attributes.thumbnail.data.attributes,
            id: relatedProject.attributes.thumbnail.data.id,
          },
        });
      } else if (relatedProjectIndex !== -1) {
        // Otherwise, we just push a new tag in the related project tags key
        relatedProjects[relatedProjectIndex].tags.push({
          ...tagResponse.data.data.attributes,
          id: tagResponse.data.data.id,
        });
      }
    });
  });

  // The relatedProjectsArray is now given to the response object
  response.relatedProjects = relatedProjects;

  return response;
};

// // This func is called to provide the page and its component with data
// const fetchData = async (projectId) => {
//   try {
//     // First we create the object we will return and its keys
//     const response = {
//       project: {},
//       style: {},
//       relatedProjects: {},
//     };

//     // This request gives all the infos about the project currently displayed
//     const project = await axios.get(
//       `${process.env.API_URL}/projects/${projectId}?populate=cover,modules.medias,modules.backgroundImage,modules.text,tags`,
//       { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
//     );

//     // This is the special style the user has set in the back office
//     const style = await axios.get(`${process.env.API_URL}/style?populate=*`, {
//       headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
//     });

//     // We set the response object by cleaning the project object
//     response.project = {
//       ...project.data.data.attributes,
//       id: project.data.data.id,
//       cover: {
//         ...project.data.data.attributes.cover.data.attributes,
//         id: project.data.data.attributes.cover.data.id,
//       },
//       tags: [...project.data.data.attributes.tags.data],
//     };

//     // Same with the style object
//     response.style = { ...style.data.data.attributes };

//     // The modules array also need to be cleaned up
//     response.project.modules.forEach((module, i) => {
//       response.project.modules[i].backgroundImage = module.backgroundImage
//         ?.data && {
//         ...module.backgroundImage.data.attributes,
//         id: module.backgroundImage.data.id,
//       };
//       response.project.modules[i].medias = [...module.medias.data];

//       response.project.modules[i].medias.forEach((media, j) => {
//         response.project.modules[i].medias[j] = {
//           ...media.attributes,
//           id: media.id,
//         };
//       });
//     });

//     // We want to invite the viewer to see other projects that share 1 or more tags with the currently displayed project
//     const tagRequestPromises = response.project.tags.map((tag, index) => {
//       // So we make as many requests as there are tags on the project to fetch all the related ones

//       // We take advantage of the loop to clean up the tags array
//       response.project.tags[index] = { ...tag.attributes, id: tag.id };

//       // This function returns an array of promises
//       return axios.get(
//         `${process.env.API_URL}/tags/${tag.id}?populate=projects.thumbnail,projects.tags`,
//         { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
//       );
//     });

//     // We store the results of the promises in a new array
//     const tagsResponseArray = await Promise.all(tagRequestPromises);

//     // This is the constant that will store the definitive related projects that will be displayed by the RelatedProjects component
//     const relatedProjects = [];

//     // We loop through the array that stores the results of the requests
//     tagsResponseArray.forEach((tagResponse) => {
//       // The projects that share the given tag are stored at this address
//       const projectsWithTag = tagResponse.data.data.attributes.projects.data;

//       // For each of them, we will check if we should push them in the relatedProjects array
//       projectsWithTag.forEach((relatedProject) => {
//         // If the relatedProject is the same as the one currently displayed, we don't want to put it in the relatedProjects array
//         const isCurrentProject = response.project.id === relatedProject.id;

//         // We check for the relatedProject index in the relatedProjects array
//         const relatedProjectIndex = relatedProjects.findIndex(
//           (project) => project.id === relatedProject.id
//         );

//         if (relatedProjectIndex === -1 && !isCurrentProject) {
//           // If the project is not in the relatedProjects array, we create a new entry
//           relatedProjects.push({
//             ...relatedProject.attributes,
//             id: relatedProject.id,
//             tags: [
//               {
//                 ...tagResponse.data.data.attributes,
//                 id: tagResponse.data.data.id,
//               },
//             ],
//             thumbnail: {
//               ...relatedProject.attributes.thumbnail.data.attributes,
//               id: relatedProject.attributes.thumbnail.data.id,
//             },
//           });
//         } else if (relatedProjectIndex !== -1) {
//           // Otherwise, we just push a new tag in the related project tags key
//           relatedProjects[relatedProjectIndex].tags.push({
//             ...tagResponse.data.data.attributes,
//             id: tagResponse.data.data.id,
//           });
//         }
//       });
//     });

//     // The relatedProjectsArray is now given to the response object
//     response.relatedProjects = relatedProjects;

//     return response;
//   } catch (error) {
//     console.log(error);
//   }
// };
