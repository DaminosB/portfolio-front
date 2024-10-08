import axios from "axios";
import { Suspense } from "react";

import SnapScrollWrapper from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";
import Module_Fullpage from "@/modules/Module_Fullpage/Module_Fullpage";
import Module_MultiImagesColumn from "@/modules/Module_MultiImagesColumn/Module_MultiImagesColumn";
import Module_Container from "@/modules/Module_Container/Module_Container";
import Modale from "@/components/Modale/Modale";
import SidePanelNavigation from "@/components/SidePanelNavigation/SidePanelNavigation";

export default async function ProjectsIdPage() {
  const { logos, customStyle } = await fetchData();

  const customColors = {
    mainColor: customStyle.mainColor,
    secondaryColor: customStyle.secondaryColor,
  };

  return (
    <>
      <SnapScrollWrapper>
        {logos.modules.map((module, index) => {
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
      <Modale customColors={customColors} />
      <SidePanelNavigation content={logos} customStyle={customColors} />
    </>
  );
}

const fetchData = async () => {
  const response = { logos: {}, customStyle: {} };
  try {
    const logos = await axios.get(
      `${process.env.API_URL}/logo?populate=thumbnail,modules.medias`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    response.logos = { ...logos.data.data.attributes };
  } catch (error) {
    console.log(error);
  }

  try {
    const customStyle = await axios.get(`${process.env.API_URL}/style`, {
      headers: { Authorization: `Bearer ${process.env.API_TOKEN}` },
    });

    response.customStyle = { ...customStyle.data.data.attributes };
  } catch (error) {
    console.log(error);
  }

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
};
