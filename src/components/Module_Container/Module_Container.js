import styles from "./Module_Container.module.css";

import TextContainer from "../TextContainer/TextContainer";
import MediasWrapper from "../MediasWrapper/MediasWrapper";

import generateCssClasses from "@/utils/generateCssClasses";
import generateInlineStyle from "@/utils/generateInlineStyle";

const Module_Container = ({ module }) => {
  const { medias, text } = module;

  const contentDivClasses = generateCssClasses(module);

  const { sectionStyle, contentDivStyle, mediasWrapperStyle } =
    generateInlineStyle(module);

  return (
    <section className={styles.containerModule} style={sectionStyle}>
      <div className={`container ${contentDivClasses}`} style={contentDivStyle}>
        <MediasWrapper
          module={module}
          id={module.id}
          mediasWrapperStyle={mediasWrapperStyle}
        >
          {medias.map((media) => {
            return (
              <div key={media.id} className={styles.mediasCard}>
                <img
                  draggable={false}
                  src={media.url}
                  alt={media.alternativeText}
                  id={`media-content-${media.id}`}
                />
              </div>
            );
          })}
        </MediasWrapper>
        {text && <TextContainer text={text.text} />}
      </div>
    </section>
  );
};

export default Module_Container;
