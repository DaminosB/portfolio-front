import styles from "./Module_Fullpage.module.css";

import Module_Text from "../Module_Text/Module_Text";

import parseRequestToCSS from "@/utils/parseRequestToCSS";
import MediasWrapper from "../MediasWrapper/MediasWrapper";

const Module_Fullpage = ({ module }) => {
  const { medias, text } = module;

  const {
    backgroundStyle,
    contentStyle,
    mediasContainerStyle,
    mediasStyle,
    sliderStyle,
    textStyle,
  } = parseRequestToCSS(module);

  return (
    <section
      className={styles.fullpage}
      style={{ ...contentStyle, ...backgroundStyle }}
    >
      <MediasWrapper module={module} id={module.id}>
        {medias.map((media) => {
          return (
            <div key={media.id}>
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
      {text && <Module_Text stylingObject={textStyle} text={text.text} />}
    </section>
  );
};

export default Module_Fullpage;
