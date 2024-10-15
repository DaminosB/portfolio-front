// Packages imports
// import axios from "axios";

// Components import
import ProjectsContainer from "@/components/ProjectsContainer/ProjectsContainer";
import CoverContainer from "@/components/CoverContainer/CoverContainer";
import Modale from "@/components/Modale/Modale";

import handleFetch from "@/utils/handleFetch";

export default async function Home() {
  const { profile, projects, customStyle, logos } = await fetchData();

  const customColors = {
    mainColor: customStyle.mainColor,
    secondaryColor: customStyle.secondaryColor,
  };

  return (
    <>
      <CoverContainer
        coverUrl={profile.cover.url}
        coverAltTxt={profile.cover.alternativeText}
        customColors={customColors}
      />
      <ProjectsContainer
        projects={projects}
        customStyle={customStyle}
        logos={logos}
      />

      <Modale customColors={customColors} />
    </>
  );
}

const fetchData = async () => {
  // Execute multiple API requests in parallel using Promise.all()
  const [
    profileResponse,
    customStyleResponse,
    projectsResponse,
    logosResponse,
  ] = await Promise.all([
    handleFetch("profile?populate=logo,cover"),
    handleFetch("style?populate=*"),
    handleFetch("projects?populate=thumbnail,tags"),
    handleFetch("logo?populate=thumbnail"),
  ]);

  // Structure the response object based on the fetched data
  const response = {
    // Process profile data, extracting logo and cover attributes
    profile: {
      ...profileResponse.data.attributes,
      logo: profileResponse.data.attributes.logo.data.attributes,
      cover: profileResponse.data.attributes.cover.data.attributes,
    },
    // Process customStyle data
    customStyle: { ...customStyleResponse.data.attributes },
    // Process projects, map over each project to extract relevant attributes, including thumbnails and tags
    projects: projectsResponse.data.map((project) => ({
      ...project.attributes,
      id: project.id,
      thumbnail: project.attributes.thumbnail.data.attributes,
      tags: project.attributes.tags.data.map((tag) => ({
        ...tag.attributes,
        id: tag.id,
      })),
    })),
    // Process logos data, extracting thumbnail attributes
    logos: {
      ...logosResponse.data.attributes,
      thumbnail: logosResponse.data.attributes.thumbnail.data.attributes,
    },
  };

  // Return the structured response object
  return response;
};

// const fetchData = async () => {
//   try {
//     // First we make the needed requests
//     const profile = await axios.get(
//       `${process.env.API_URL}/profile?populate=logo,cover`,
//       { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
//     );

//     const customStyle = await axios.get(
//       `${process.env.API_URL}/style?populate=*`,
//       {
//         headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
//       }
//     );

//     const projects = await axios.get(
//       `${process.env.API_URL}/projects?populate=thumbnail,tags`,
//       { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
//     );

//     const logos = await axios.get(
//       `${process.env.API_URL}/logo?populate=thumbnail`,
//       { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
//     );

//     // Then we prepare the object that will contain the needed informations
//     const responses = {
//       profile: {
//         ...profile.data.data.attributes,
//         logo: profile.data.data.attributes.logo.data.attributes,
//         cover: profile.data.data.attributes.cover.data.attributes,
//       },
//       customStyle: { ...customStyle.data.data.attributes },
//       projects: projects.data.data,
//       // tags: tags.data.data,
//       logos: {
//         ...logos.data.data.attributes,
//         thumbnail: logos.data.data.attributes.thumbnail.data.attributes,
//       },
//     };

//     // Let's clean up projects key
//     responses.projects.forEach((project, i) => {
//       responses.projects[i] = {
//         ...project.attributes,
//         id: project.id,
//         thumbnail: project.attributes.thumbnail.data.attributes,
//         tags: project.attributes.tags.data,
//       };
//       // Finally, let's clean up the tags key inside each entry of the project
//       responses.projects[i].tags.forEach((tag, j) => {
//         responses.projects[i].tags[j] = { ...tag.attributes, id: tag.id };
//       });
//     });

//     return responses;
//   } catch (error) {
//     console.log(error);
//   }
// };
