import styles from "./Module_Fullpage.module.css";

import TextWrapper from "../../wrappers/TextWrapper/TextWrapper";

import generateCssClasses from "@/utils/generateCssClasses";
import generateInlineStyle from "@/utils/generateInlineStyle";
import VideoPlayer from "../../wrappers/VideoPlayer/VideoPlayer";
import MediaCardWrapper from "../../wrappers/MediaCardWrapper/MediaCardWrapper";
import ModuleWrapper from "../../wrappers/ModuleWrapper/ModuleWrapper";

const Module_Fullpage = ({ module, customColors }) => {
  const { medias, text } = module;

  const contentDivClasses = generateCssClasses(module);

  const { sectionStyle, contentDivStyle, mediasContainerStyle } =
    generateInlineStyle(module);

  const hasMultipleChildren = medias.length > 1;

  return (
    <ModuleWrapper
      inlineStyle={sectionStyle}
      customColors={customColors}
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

            return (
              <MediaCardWrapper
                key={media.id}
                customColors={customColors}
                media={media}
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
        {text && <TextWrapper>{text.text}</TextWrapper>}
      </div>
    </ModuleWrapper>
  );
};

export default Module_Fullpage;
