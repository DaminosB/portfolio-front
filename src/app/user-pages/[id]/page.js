import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";
import PageBuilder from "@/constructors/PageBuilder/PageBuilder";

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

    return <PageBuilder content={page} />;
  }
}

const fetchData = async (pageId) => {
  let pagePath = `pages/${pageId}?populate=`;
  pagePath += "cover";
  pagePath += ",modules.mediaBlocks.mediaAsset";
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
