import styles from "./page.module.css";

// Packages imports
import axios from "axios";

// React components imports
import { Suspense } from "react";

// Components import
import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import ProjectsContainer from "@/components/ProjectsContainer/ProjectsContainer";
import CoverContainer from "@/components/CoverContainer/CoverContainer";
import Slider from "@/components/Slider/Slider";

export default async function Home() {
  const { profile, projects, customStyle, logos } = await fetchData();

  return (
    <Suspense>
      <ContentWrapper>
        <Slider id={"homepage-cover"} hideOnInactive={true}>
          <CoverContainer
            coverUrl={profile.cover.url}
            coverAltTxt={profile.cover.alternativeText}
          />
        </Slider>
        <Slider id={"projects"} hideOnInactive={false} hideHeader={true}>
          <ProjectsContainer
            projects={projects}
            customStyle={customStyle}
            logos={logos}
          />
        </Slider>
      </ContentWrapper>
    </Suspense>
  );
}

const fetchData = async () => {
  try {
    // First we make the needed requests
    const profile = await axios.get(
      `${process.env.API_URL}/profile?populate=logo,cover`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    const customStyle = await axios.get(
      `${process.env.API_URL}/style?populate=*`,
      {
        headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
      }
    );

    const projects = await axios.get(
      `${process.env.API_URL}/projects?populate=thumbnail,tags`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    const logos = await axios.get(
      `${process.env.API_URL}/logo?populate=thumbnail`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    // Then we prepare the object that will contain the needed informations
    const responses = {
      profile: {
        ...profile.data.data.attributes,
        logo: profile.data.data.attributes.logo.data.attributes,
        cover: profile.data.data.attributes.cover.data.attributes,
      },
      customStyle: { ...customStyle.data.data.attributes },
      projects: projects.data.data,
      // tags: tags.data.data,
      logos: {
        ...logos.data.data.attributes,
        thumbnail: logos.data.data.attributes.thumbnail.data.attributes,
      },
    };

    // Let's clean up projects key
    responses.projects.forEach((project, i) => {
      responses.projects[i] = {
        ...project.attributes,
        id: project.id,
        thumbnail: project.attributes.thumbnail.data.attributes,
        tags: project.attributes.tags.data,
      };
      // Finally, let's clean up the tags key inside each entry of the project
      responses.projects[i].tags.forEach((tag, j) => {
        responses.projects[i].tags[j] = { ...tag.attributes, id: tag.id };
      });
    });

    return responses;
  } catch (error) {
    console.log(error);
  }
};
