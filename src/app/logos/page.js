import Module_Fullpage from "@/modules/Module_Fullpage/Module_Fullpage";
import Module_MultiImagesColumn from "@/modules/Module_MultiImagesColumn/Module_MultiImagesColumn";
import Module_Container from "@/modules/Module_Container/Module_Container";
import Module_Text from "@/modules/Module_Text/Module_Text";

import SnapScrollWrapper from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";
import Modale from "@/components/Modale/Modale";
import SidePanelNavigation from "@/components/SidePanelNavigation/SidePanelNavigation";
import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";

import handleFetch from "@/utils/handleFetch";

export default async function ProjectsIdPage() {
  const data = await fetchData();

  if (!data) return <ErrorComponent type={"error"} />;
  else {
    const { logos, customStyle } = data;

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

              case "module.texte":
                return (
                  <Module_Text
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
}

const fetchData = async () => {
  let logoPath = "logo?populate=";
  logoPath += "thumbnail";
  logoPath += ",modules.medias";
  logoPath += ",modules.mediaBlocks.mediaAsset";
  const [logosResponse, customStyleResponse] = await Promise.all([
    handleFetch(logoPath),
    handleFetch("style"),
  ]);

  if (!logosResponse.data) return;

  const response = {
    logos: {
      ...logosResponse.data.attributes,
      modules: logosResponse.data.attributes.modules.map((module) => {
        return {
          ...module,
          medias: module.medias.data.map((media) => {
            return {
              ...media.attributes,
              id: media.id,
            };
          }),
          mediaBlocks: module.mediaBlocks
            ? module.mediaBlocks.map(({ mediaAsset, ...restOfMediaBlock }) => ({
                ...restOfMediaBlock,
                ...mediaAsset.data.attributes,
                mediaId: mediaAsset.data.id,
              }))
            : null,
        };
      }),
    },
    customStyle: { ...customStyleResponse.data.attributes },
  };

  return response;
};
