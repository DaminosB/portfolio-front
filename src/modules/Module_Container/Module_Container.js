import styles from "./Module_Container.module.css";

import TextContainer from "../../components/TextContainer/TextContainer";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";

import generateCssClasses from "@/utils/generateCssClasses";
import generateInlineStyle from "@/utils/generateInlineStyle";
import MediaCardWrapper from "../../wrappers/MediaCardWrapper/MediaCardWrapper";
import ModuleWrapper from "@/wrappers/ModuleWrapper/ModuleWrapper";

const Module_Container = ({ module, customColors }) => {
  const { medias, text } = module;

  const contentDivClasses = generateCssClasses(module);

  const { sectionStyle, contentDivStyle, mediasContainerStyle } =
    generateInlineStyle(module);

  const mediasArray = populateMediasArray(medias, module.imagesPerRow);

  const sectionId = `section-${module.id}`;

  return (
    <ModuleWrapper
      inlineStyle={sectionStyle}
      customColors={customColors}
      sectionId={sectionId}
      medias={medias}
    >
      <div
        className={`container ${styles.content} ${contentDivClasses}`}
        style={contentDivStyle}
      >
        <div className={styles.mediasFrame}>
          <div className={styles.mediasContainer} style={mediasContainerStyle}>
            {mediasArray.map((mediasLine, index) => {
              return (
                <div key={index} style={mediasContainerStyle}>
                  {mediasLine.map((media) => {
                    const isImageFile =
                      media.provider_metadata.resource_type === "image";

                    const mediaCardId = `${sectionId}-media-card-${media.id}`;
                    return (
                      <MediaCardWrapper
                        key={media.id}
                        customColors={customColors}
                        id={mediaCardId}
                        media={media}
                        preventContainedView={true}
                        sectionId={sectionId}
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
              );
            })}
          </div>
        </div>
        {text && (
          <TextContainer sectionId={sectionId}>{text.text}</TextContainer>
        )}
      </div>
    </ModuleWrapper>
  );
};

const populateMediasArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

export default Module_Container;
