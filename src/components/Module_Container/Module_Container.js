import styles from "./Module_Container.module.css";

import parseRequestToCSS from "@/utils/parseRequestToCSS";

import Module_Text from "../Module_Text/Module_Text";
import MediasWrapper from "../MediasWrapper/MediasWrapper";

const Module_Container = ({ module }) => {
  const { medias, text } = module;

  const {
    backgroundStyle,
    contentStyle,
    mediasContainerStyle,
    mediasStyle,
    textStyle,
  } = parseRequestToCSS(module);

  return (
    <section className={styles.containerModule} style={backgroundStyle}>
      <div className="container" style={contentStyle}>
        <MediasWrapper module={module} id={module.id}>
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
        {text && <Module_Text stylingObject={textStyle} text={text.text} />}
      </div>
    </section>
  );
};

export default Module_Container;
