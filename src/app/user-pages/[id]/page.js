import axios from "axios";

import CoverContainer from "@/components/CoverContainer/CoverContainer";
import Module_Fullpage from "@/components/Module_Fullpage/Module_Fullpage";
import Module_MultiImagesColumn from "@/components/Module_MultiImagesColumn/Module_MultiImagesColumn";
import Module_Container from "@/components/Module_Container/Module_Container";
import SectionNavigation from "@/components/SectionNavigation/SectionNavigation";
import Slider from "@/components/Slider/Slider";

export default async function ProjectsIdPage({ params }) {
  const { page } = await fetchData(params.id);

  const customColors = {
    mainColor: page.mainColor,
    secondaryColor: page.secondaryColor,
  };

  return (
    <>
      {page.cover && (
        <Slider id={"cover"} hideOnInactive={true}>
          <CoverContainer
            coverUrl={page.cover.url}
            coverAltTxt={page.cover.alternativeText}
            customColors={customColors}
          />
        </Slider>
      )}
      <Slider id={"page-content"} hideHeader={true}>
        {page.modules.map((module, index) => {
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
      <SectionNavigation content={page} customStyle={customColors} />
    </>
  );
}

const fetchData = async (pageId) => {
  try {
    const page = await axios.get(
      `${process.env.API_URL}/pages/${pageId}?populate=cover,modules.medias,modules.backgroundImage,modules.text`,
      { headers: { Authorization: `Bearer ${process.env.API_TOKEN}` } }
    );

    const response = {
      page: {
        ...page.data.data.attributes,
        cover: page.data.data.attributes.cover.data,
      },
    };

    response.page.modules.forEach((module, i) => {
      response.page.modules[i].backgroundImage = module.backgroundImage
        ?.data && {
        ...module.backgroundImage.data.attributes,
        id: module.backgroundImage.data.id,
      };
      response.page.modules[i].medias = [...module.medias.data];

      response.page.modules[i].medias.forEach((media, j) => {
        response.page.modules[i].medias[j] = {
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
