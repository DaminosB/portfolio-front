import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";
import SnapScrollWrapper from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";
import ModulesDisplayer from "@/constructors/ModulesDisplayer/ModulesDisplayer";
import CoverContainer from "@/components/CoverContainer/CoverContainer";
import ContentMenu from "@/components/ContentMenu/ContentMenu";
import Modale from "@/components/Modale/Modale";
import generateDynamicStyle from "@/utils/generateDynamicStyle";
import handleFetch from "@/utils/handleFetch";
import {
  populateCoversBlock,
  populateModulesKey,
} from "@/utils/fetchDataHelpers";

export default async function ProjectsIdPage({ params }) {
  const data = await fetchData(params.id);

  if (!data) return <ErrorComponent type={"notFound"} />;
  else {
    const { page } = data;

    const customColors = {
      mainColor: page.mainColor,
      secondaryColor: page.secondaryColor,
    };

    const modulesContainerIndex = page.cover ? 1 : 0;

    return (
      <>
        {page.cover && (
          <CoverContainer
            coverCoords={[0, 0]}
            coverData={page.cover}
            customColors={customColors}
          />
        )}
        <SnapScrollWrapper>
          <ModulesDisplayer
            modules={page.modules}
            customColors={customColors}
            modulesContainerIndex={modulesContainerIndex}
          />
        </SnapScrollWrapper>
        <Modale customColors={customColors} />
        <ContentMenu
          content={page}
          customColors={customColors}
          showRelatedProject={false}
        />
        <style>{generateDynamicStyle(customColors)}</style>
      </>
    );
  }
}

export async function generateMetadata({ params }) {
  const [pageResponse, siteParametersResponse] = await Promise.all([
    handleFetch(`pages/${params.id}`),
    handleFetch("site-parameter"),
  ]);

  if (!pageResponse.data) return;
  const defaultTitle = siteParametersResponse.data.attributes.pageTitle;
  const pageTitle = pageResponse.data.attributes.title;
  const titleStr = `${defaultTitle} || ${pageTitle}`;

  return {
    title: titleStr,
    description: pageResponse.data.attributes.description,
  };
}

const fetchData = async (pageId) => {
  let pagePath = `pages/${pageId}?populate=`;
  pagePath += "cover";
  pagePath += ",modules.titleBlock";
  pagePath += ",modules.mediaBlocks.mediaAssets";
  pagePath += ",modules.backgroundImage";
  pagePath += ",modules.text";
  pagePath += ",modules.text.font";
  pagePath += ",coversBlock";
  pagePath += ",coversBlock.backgroundImage";
  pagePath += ",coversBlock.overlayImage";

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
      populateCoversBlock: pageResponse.data.attributes.coversBlock
        ? populateCoversBlock(pageResponse.data.attributes.coversBlock)
        : null,
      modules: populateModulesKey(pageResponse.data.attributes.modules),
    },
  };

  return response;
};
