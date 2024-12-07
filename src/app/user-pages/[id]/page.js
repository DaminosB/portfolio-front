import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";
import SnapScrollWrapper from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";
import ModulesDisplayer from "@/constructors/ModulesDisplayer/ModulesDisplayer";
import CoverContainer from "@/components/CoverContainer/CoverContainer";
import SidePanelNavigation from "@/components/SidePanelNavigation/SidePanelNavigation";
import Modale from "@/components/Modale/Modale";
import generateDynamicStyle from "@/utils/generateDynamicStyle";
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

    // return <ModulesDisplayer content={page} />;
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
          <ModulesDisplayer
            modules={page.modules}
            customColors={customColors}
          />
        </SnapScrollWrapper>
        <Modale customColors={customColors} />
        <SidePanelNavigation
          content={page}
          customColors={customColors}
          showRelatedProject={false}
        />
        <style>{generateDynamicStyle(customColors)}</style>
      </>
    );
  }
}

const fetchData = async (pageId) => {
  let pagePath = `pages/${pageId}?populate=`;
  pagePath += "cover";
  pagePath += ",modules.titleBlock";
  pagePath += ",modules.mediaBlocks.mediaAssets";
  pagePath += ",modules.backgroundImage";
  pagePath += ",modules.text";

  const pageResponse = await handleFetch(pagePath);

  if (!pageResponse.data) return;

  const response = {
    page: {
      ...pageResponse.data.attributes,
      cover: pageResponse.data.attributes.cover.data
        ? {
            ...pageResponse.data.attributes.cover.data.attributes,
            id: pageResponse.data.attributes.cover.data.id,
          }
        : null,
      modules: pageResponse.data.attributes.modules.map((module) => ({
        ...module,
        backgroundImage: module.backgroundImage.data && {
          ...module.backgroundImage.data.attributes,
          id: module.backgroundImage.data.id,
        },
        mediaBlocks: module.mediaBlocks
          ? module.mediaBlocks.map((mediaBlock) => ({
              ...mediaBlock,
              mediaAssets: mediaBlock.mediaAssets.data.map((mediaAsset) => ({
                ...mediaAsset.attributes,
                addToCarousel: mediaBlock.addToCarousel,
                id: mediaAsset.id,
              })),
            }))
          : [],
      })),
    },
  };

  return response;
};
