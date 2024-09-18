import styles from "./Module_Fullpage.module.css";

import TextContainer from "../../components/TextContainer/TextContainer";

import generateCssClasses from "@/utils/generateCssClasses";
import generateInlineStyle from "@/utils/generateInlineStyle";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import MediaCardWrapper from "../../wrappers/MediaCardWrapper/MediaCardWrapper";
import ModuleWrapper from "../../wrappers/ModuleWrapper/ModuleWrapper";

const Module_Fullpage = ({ module, customColors }) => {
  const { medias, text } = module;

  const contentDivClasses = generateCssClasses(module);

  const { sectionStyle, contentDivStyle, mediasContainerStyle } =
    generateInlineStyle(module);

  console.log(sectionStyle, contentDivStyle, mediasContainerStyle);

  const sectionId = `section-${module.id}`;

  const hasMultipleChildren = medias.length > 1;

  return (
    <ModuleWrapper
      inlineStyle={sectionStyle}
      customColors={customColors}
      sectionId={sectionId}
      medias={medias}
    >
      <div
        className={`${styles.content} ${contentDivClasses}`}
        style={contentDivStyle}
      >
        <div className={styles.mediasContainer} style={mediasContainerStyle}>
          {medias.map((media) => {
            const isImageFile =
              media.provider_metadata.resource_type === "image";

            const mediaCardId = `${sectionId}-media-card-${media.id}`;
            return (
              <MediaCardWrapper
                key={media.id}
                customColors={customColors}
                media={media}
                id={mediaCardId}
              >
                {isImageFile ? (
                  <img
                    draggable={false}
                    src={media.url}
                    alt={media.alternativeText}
                  />
                ) : (
                  <source src={media.url} />
                )}
              </MediaCardWrapper>
            );
          })}
        </div>
        {text && (
          <TextContainer sectionId={sectionId}>{text.text}</TextContainer>
        )}
      </div>
    </ModuleWrapper>
  );
};

export default Module_Fullpage;
