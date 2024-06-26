import styles from "./Module_Fullpage.module.css";

import TextContainer from "../TextContainer/TextContainer";
import MediasWrapper from "../MediasWrapper/MediasWrapper";

import generateCssClasses from "@/utils/generateCssClasses";
import generateInlineStyle from "@/utils/generateInlineStyle";
import VideoPlayer from "../VideoPlayer/VideoPlayer";
import MediaCardWrapper from "../MediaCardWrapper/MediaCardWrapper";

const Module_Fullpage = ({ module, customColors }) => {
  const { medias, text } = module;

  const contentDivClasses = generateCssClasses(module);

  const { sectionStyle, contentDivStyle, mediasWrapperStyle } =
    generateInlineStyle(module);

  const sectionId = `section-${module.id}`;

  const hasMultipleChildren = medias.length > 1;

  return (
    <section className={styles.fullpage} style={sectionStyle}>
      <div
        style={contentDivStyle}
        className={`${contentDivClasses} ${
          hasMultipleChildren ? styles.noHeight : ""
        }`}
        id={sectionId}
      >
        <MediasWrapper
          mediasWrapperStyle={mediasWrapperStyle}
          parentStyle={styles}
          customColors={customColors}
        >
          {medias.map((media) => {
            const isImageFile =
              media.provider_metadata.resource_type === "image";

            const mediaCardId = `${sectionId}-media-card-${media.id}`;
            return (
              <MediaCardWrapper
                key={media.id}
                parentStyle={styles}
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
                  <VideoPlayer video={media} customColors={customColors}>
                    <source src={media.url} />
                  </VideoPlayer>
                )}
              </MediaCardWrapper>
            );
          })}
        </MediasWrapper>
        {text && <TextContainer text={text.text} />}
      </div>
    </section>
  );
};

export default Module_Fullpage;
