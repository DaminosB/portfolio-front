import styles from "./Module_Container.module.css";

import TextContainer from "../TextContainer/TextContainer";
import MediasWrapper from "../MediasWrapper/MediasWrapper";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

import generateCssClasses from "@/utils/generateCssClasses";
import generateInlineStyle from "@/utils/generateInlineStyle";
import MediaCardWrapper from "../MediaCardWrapper/MediaCardWrapper";

const Module_Container = ({ module, customColors }) => {
  const { medias, text } = module;

  const contentDivClasses = generateCssClasses(module);

  const { sectionStyle, contentDivStyle, mediasWrapperStyle } =
    generateInlineStyle(module);

  const mediasArray = populateMediasArray(medias, module.imagesPerRow);

  const sectionId = `section-${module.id}`;

  return (
    <section
      className={styles.containerModule}
      style={sectionStyle}
      id={sectionId}
    >
      <div className={`container ${contentDivClasses}`} style={contentDivStyle}>
        <div className={styles.mediasContainer} style={mediasWrapperStyle}>
          {mediasArray.map((mediasLine, index) => {
            return (
              <MediasWrapper
                key={index}
                customColors={customColors}
                parentStyle={styles}
                mediasWrapperStyle={mediasWrapperStyle}
              >
                {mediasLine.map((media) => {
                  const isImageFile =
                    media.provider_metadata.resource_type === "image";

                  const mediaCardId = `${sectionId}-media-card-${media.id}`;
                  return (
                    <MediaCardWrapper
                      key={media.id}
                      parentStyle={styles}
                      customColors={customColors}
                      id={mediaCardId}
                      media={media}
                    >
                      {isImageFile ? (
                        <img
                          draggable={false}
                          src={media.url}
                          alt={media.alternativeText}
                        />
                      ) : (
                        <VideoPlayer video={media} customColors={customColors}>
                          <source src={media.url} />
                        </VideoPlayer>
                      )}
                    </MediaCardWrapper>
                  );
                })}
              </MediasWrapper>
            );
          })}
        </div>
        {text && <TextContainer text={text.text} />}
      </div>
    </section>
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
