import Module_Fullpage from "@/modules/Module_Fullpage/Module_Fullpage";
import Module_MultiImagesColumn from "@/modules/Module_MultiImagesColumn/Module_MultiImagesColumn";
import Module_Container from "@/modules/Module_Container/Module_Container";
import Module_Text from "@/modules/Module_Text/Module_Text";

import CoverContainer from "@/components/CoverContainer/CoverContainer";
import SidePanelNavigation from "@/components/SidePanelNavigation/SidePanelNavigation";
import SnapScrollWrapper from "@/wrappers/SnapScrollWrapper/SnapScrollWrapper";
import ProjectsContainer from "@/components/ProjectsContainer/ProjectsContainer";
import EndScrollPanel from "@/constructors/EndScrollPanel/EndScrollPanel";
import Modale from "@/components/Modale/Modale";
import generateDynamicStyle from "@/utils/generateDynamicStyle";

const PageBuilder = ({ content, customStyle, relatedProjects }) => {
  const customColors = {
    mainColor: content.mainColor,
    secondaryColor: content.secondaryColor,
  };

  return (
    <>
      {content.cover && (
        <CoverContainer
          coverUrl={content.cover.url}
          coverAltTxt={content.cover.alternativeText}
          customColors={customColors}
        />
      )}
      <SnapScrollWrapper>
        {content.modules.map((module) => {
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
      {relatedProjects && customStyle && (
        <EndScrollPanel customColors={customColors}>
          <ProjectsContainer
            projects={relatedProjects}
            customStyle={customStyle}
            logos={false}
          />
        </EndScrollPanel>
      )}
      <Modale customColors={customColors} />
      <SidePanelNavigation
        content={content}
        customStyle={customColors}
        showRelatedProject={relatedProjects ? true : false}
      />
      <style>{generateDynamicStyle(customColors)}</style>
    </>
  );
};

export default PageBuilder;
