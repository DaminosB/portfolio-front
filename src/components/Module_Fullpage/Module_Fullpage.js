import styles from "./Module_Fullpage.module.css";

import TextContainer from "../TextContainer/TextContainer";
import MediasWrapper from "../MediasWrapper/MediasWrapper";

import generateCssClasses from "@/utils/generateCssClasses";
import generateInlineStyle from "@/utils/generateInlineStyle";
import VideoPlayer from "../VideoPlayer/VideoPlayer";

const Module_Fullpage = ({ module, customColors }) => {
  const { medias, text } = module;

  const contentDivClasses = generateCssClasses(module);

  const { sectionStyle, contentDivStyle, mediasWrapperStyle } =
    generateInlineStyle(module);

  return (
    <section className={styles.fullpage} style={sectionStyle}>
      <div style={contentDivStyle} className={contentDivClasses}>
        <MediasWrapper
          module={module}
          id={module.id}
          mediasWrapperStyle={mediasWrapperStyle}
        >
          {medias.map((media) => {
            const isImageFile =
              media.provider_metadata.resource_type === "image";
            return (
              <div key={media.id} className={styles.mediasCard}>
                {isImageFile ? (
                  <img
                    draggable={false}
                    src={media.url}
                    alt={media.alternativeText}
                    id={`media-content-${media.id}`}
                  />
                ) : (
                  <VideoPlayer video={media} customColors={customColors}>
                    <source src={media.url} />
                  </VideoPlayer>
                )}
              </div>
            );
          })}
        </MediasWrapper>
        {text && <TextContainer text={text.text} />}
      </div>
    </section>
  );
};

export default Module_Fullpage;
