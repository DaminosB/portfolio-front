import CoverContainer from "@/components/CoverContainer/CoverContainer";
import styles from "./page.module.css";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import { Suspense } from "react";
import axios from "axios";
import Module_Fullpage from "@/components/Module_Fullpage/Module_Fullpage";

const fetchData = async (projectId) => {
  try {
    const project = await axios.get(
      `${process.env.API_URL}/projects/${projectId}?populate=cover,modules`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    const response = {
      project: {
        ...project.data.data.attributes,
        cover: project.data.data.attributes.cover.data.attributes,
      },
    };

    return response;
  } catch (error) {
    console.log(error);
  }
};

export default async function ProjectsIdPage({ params }) {
  const { project } = await fetchData(params.id);

  console.log(project);

  return (
    <Suspense>
      <ContentWrapper>
        <CoverContainer
          coverUrl={project.cover.url}
          coverAltTxt={project.cover.alternativeText}
        />
        <Module_Fullpage />
      </ContentWrapper>
    </Suspense>
  );
}
