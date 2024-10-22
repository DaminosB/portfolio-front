import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";
import ProjectsContainer from "@/components/ProjectsContainer/ProjectsContainer";
import CoverContainer from "@/components/CoverContainer/CoverContainer";
import Modale from "@/components/Modale/Modale";

import handleFetch from "@/utils/handleFetch";

export default async function Home() {
  const data = await fetchData();

  if (!data) return <ErrorComponent type={"error"} />;
  else {
    const { profile, projects, customStyle, logos } = data;

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
}

const fetchData = async () => {
  let profilePath = "profile?populate=";
  profilePath += "logo";
  profilePath += ",cover";

  let stylePath = "style?populate=";
  stylePath += "*";

  let projectsPath = "projects?populate=";
  projectsPath += "thumbnail";
  projectsPath += ",tags";

  let logoPath = "logo?populate=";
  logoPath += "thumbnail";

  // Execute multiple API requests in parallel using Promise.all()
  const [
    profileResponse,
    customStyleResponse,
    projectsResponse,
    logosResponse,
  ] = await Promise.all([
    handleFetch(profilePath),
    handleFetch(stylePath),
    handleFetch(projectsPath),
    handleFetch(logoPath),
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
