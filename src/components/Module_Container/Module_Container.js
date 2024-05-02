import styles from "./Module_Container.module.css";

import parseRequestToCSS from "@/utils/parseRequestToCSS";

import Module_Text from "../Module_Text/Module_Text";

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
        <div className={styles.mediasContainer} style={mediasContainerStyle}>
          {medias.map((media) => {
            return (
              <div key={media.id} style={mediasStyle}>
                <img
                  src={media.url}
                  alt={media.alternativeText}
                  id={`media-content-${media.id}`}
                />
              </div>
            );
          })}
        </div>
        {text && <Module_Text stylingObject={textStyle} text={text.text} />}
      </div>
    </section>
  );
};

export default Module_Container;
