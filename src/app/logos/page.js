import ErrorComponent from "@/components/ErrorComponent/ErrorComponent";
import SnapScrollWrapper from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";
import ModulesDisplayer from "@/constructors/ModulesDisplayer/ModulesDisplayer";
import ContentMenu from "@/components/ContentMenu/ContentMenu";
import Modale from "@/components/Modale/Modale";
import generateDynamicStyle from "@/utils/generateDynamicStyle";
import handleFetch from "@/utils/handleFetch";
import { populateModulesKey } from "@/utils/fetchDataHelpers";

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
            modulesContainerIndex={0}
          />
        </SnapScrollWrapper>
        <Modale customColors={customColors} />
        <ContentMenu
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
  logoPath += ",modules.text.font";
  logoPath += ",modules.mediaBlocks.mediaAssets";

  const [logosResponse, customStyleResponse] = await Promise.all([
    handleFetch(logoPath),
    handleFetch("style"),
  ]);

  if (!logosResponse.data) return;

  const response = {
    logos: {
      ...logosResponse.data.attributes,
      modules: populateModulesKey(logosResponse.data.attributes.modules),
    },
    customStyle: { ...customStyleResponse.data.attributes },
  };

  return response;
};
