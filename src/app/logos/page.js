import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";
import SnapScrollWrapper from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";
import ModulesDisplayer from "@/constructors/ModulesDisplayer/ModulesDisplayer";
import SidePanelNavigation from "@/components/SidePanelNavigation/SidePanelNavigation";
import Modale from "@/components/Modale/Modale";
import generateDynamicStyle from "@/utils/generateDynamicStyle";
import handleFetch from "@/utils/handleFetch";

export default async function ProjectsIdPage() {
  const data = await fetchData();

  if (!data) return <ErrorComponent type={"error"} />;
  else {
    const { logos, customStyle } = data;

    logos.mainColor = customStyle.mainColor;
    logos.secondaryColor = customStyle.secondaryColor;

    const customColors = {
      mainColor: customStyle.mainColor,
      secondaryColor: customStyle.secondaryColor,
    };

    return (
      <>
        <SnapScrollWrapper>
          <ModulesDisplayer
            modules={logos.modules}
            customColors={customColors}
          />
        </SnapScrollWrapper>
        <Modale customColors={customColors} />
        <SidePanelNavigation
          content={project}
          customColors={customColors}
          showRelatedProject={relatedProjects ? true : false}
        />
        <style>{generateDynamicStyle(customColors)}</style>
      </>
    );
  }
}

const fetchData = async () => {
  let logoPath = "logo?populate=";
  logoPath += "thumbnail";
  logoPath += ",modules.backgroundImage";
  logoPath += ",modules.titleBlock";
  logoPath += ",modules.text";
  logoPath += ",modules.mediaBlocks.mediaAssets";

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
    customStyle: { ...customStyleResponse.data.attributes },
  };

  return response;
};
