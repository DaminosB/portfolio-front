import axios from "axios";
import { Suspense } from "react";

import ContentWrapper from "@/components/ContentWrapper/ContentWrapper";
import Module_Fullpage from "@/components/Module_Fullpage/Module_Fullpage";
import Module_MultiImagesColumn from "@/components/Module_MultiImagesColumn/Module_MultiImagesColumn";
import Module_Container from "@/components/Module_Container/Module_Container";

const fetchData = async () => {
  try {
    const logos = await axios.get(
      `${process.env.API_URL}/logo?populate=thumbnail,modules.medias`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    const response = {
      logos: {
        ...logos.data.data.attributes,
      },
    };

    response.logos.modules.forEach((module, i) => {
      response.logos.modules[i] = { ...module };
      response.logos.modules[i].medias = [...module.medias.data];
      response.logos.modules[i].medias.forEach((media, j) => {
        response.logos.modules[i].medias[j] = {
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

export default async function ProjectsIdPage() {
  const { logos } = await fetchData();

  return (
    <Suspense>
      <ContentWrapper>
        {logos.modules.map((module, index) => {
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
