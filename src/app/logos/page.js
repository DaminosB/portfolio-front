import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";
import PageBuilder from "@/constructors/PageBuilder/PageBuilder";

import handleFetch from "@/utils/handleFetch";

export default async function ProjectsIdPage() {
  const data = await fetchData();

  if (!data) return <ErrorComponent type={"error"} />;
  else {
    const { logos, customStyle } = data;

    logos.mainColor = customStyle.mainColor;
    logos.secondaryColor = customStyle.secondaryColor;

    return <PageBuilder content={logos} />;
  }
}

const fetchData = async () => {
  let logoPath = "logo?populate=";
  logoPath += "thumbnail";
  logoPath += ",modules.backgroundImage";
  logoPath += ",modules.text";
  logoPath += ",modules.mediaBlocks.mediaAsset";
  const [logosResponse, customStyleResponse] = await Promise.all([
    handleFetch(logoPath),
    handleFetch("style"),
  ]);

  if (!logosResponse.data) return;

  const response = {
    logos: {
      ...logosResponse.data.attributes,
      modules: logosResponse.data.attributes.modules.map((module) => ({
        ...module,
        backgroundImage: module.backgroundImage?.data
          ? {
              ...module.backgroundImage.data.attributes,
              id: module.backgroundImage.data.id,
            }
          : null,
        mediaBlocks: module.mediaBlocks
          ? module.mediaBlocks.map(({ mediaAsset, ...restOfMediaBlock }) => ({
              ...restOfMediaBlock,
              ...mediaAsset.data.attributes,
              mediaId: mediaAsset.data.id,
            }))
          : null,
      })),
    },
    customStyle: { ...customStyleResponse.data.attributes },
  };

  return response;
};
