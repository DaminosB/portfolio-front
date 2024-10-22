import Module_Fullpage from "@/modules/Module_Fullpage/Module_Fullpage";
import Module_MultiImagesColumn from "@/modules/Module_MultiImagesColumn/Module_MultiImagesColumn";
import Module_Container from "@/modules/Module_Container/Module_Container";
import Module_Text from "@/modules/Module_Text/Module_Text";

import CoverContainer from "@/components/CoverContainer/CoverContainer";
import SidePanelNavigation from "@/components/SidePanelNavigation/SidePanelNavigation";
import SnapScrollWrapper from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";
import Modale from "@/components/Modale/Modale";
import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";

import handleFetch from "@/utils/handleFetch";

export default async function ProjectsIdPage({ params }) {
  const data = await fetchData(params.id);

  if (!data) return <ErrorComponent type={"notFound"} />;
  else {
    const { page } = data;

    const customColors = {
      mainColor: page.mainColor,
      secondaryColor: page.secondaryColor,
    };

    return (
      <>
        {page.cover && (
          <CoverContainer
            coverUrl={page.cover.url}
            coverAltTxt={page.cover.alternativeText}
            customColors={customColors}
          />
        )}
        <SnapScrollWrapper>
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
        <SidePanelNavigation content={page} customStyle={customColors} />
      </>
    );
  }
}

const fetchData = async (pageId) => {
  let pagePath = `pages/${pageId}?populate=`;
  pagePath += "cover";
  pagePath += ",modules.medias";
  pagePath += ",modules.mediaBlocks.mediaAsset";
  pagePath += ",modules.backgroundImage";
  pagePath += ",modules.text";

  const page = await handleFetch(pagePath);

  if (!page.data) return;

  const response = {
    page: {
      ...page.data.attributes,
      cover: page.data.attributes.cover.data,
      modules: page.data.attributes.modules.map((module) => ({
        ...module,
        backgroundImage: module.backgroundImage.data && {
          ...module.backgroundImage.data.attributes,
          id: module.backgroundImage.data.id,
        },
        medias: module.medias
          ? module.medias.data.map((media) => ({
              ...media.attributes,
              id: media.id,
            }))
          : [],
        mediaBlocks: module.mediaBlocks
          ? module.mediaBlocks.map(({ mediaAsset, ...restOfMediaBlock }) => ({
              ...restOfMediaBlock,
              ...mediaAsset.data.attributes,
              mediaId: mediaAsset.data.id,
            }))
          : null,
      })),
    },
  };

  return response;
};
