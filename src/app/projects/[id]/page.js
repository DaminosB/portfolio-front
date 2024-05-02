import styles from "./page.module.css";

import axios from "axios";
import { Suspense } from "react";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import CoverContainer from "@/components/CoverContainer/CoverContainer";
import Module_Fullpage from "@/components/Module_Fullpage/Module_Fullpage";
import Module_MultiImagesColumn from "@/components/Module_MultiImagesColumn/Module_MultiImagesColumn";
import Module_Container from "@/components/Module_Container/Module_Container";

const fetchData = async (projectId) => {
  try {
    const project = await axios.get(
      `${process.env.API_URL}/projects/${projectId}?populate=cover,modules.medias,modules.backgroundImage,modules.text`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    const response = {
      project: {
        ...project.data.data.attributes,
        cover: project.data.data.attributes.cover.data.attributes,
      },
    };

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

    return response;
  } catch (error) {
    console.log(error);
  }
};

export default async function ProjectsIdPage({ params }) {
  const { project } = await fetchData(params.id);

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
      </ContentWrapper>
    </Suspense>
  );
}
