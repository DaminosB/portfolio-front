import styles from "./Module_Fullpage.module.css";

import ImageSlider from "../ImageSlider/ImageSlider";
import Module_Text from "../Module_Text/Module_Text";

import parseRequestToCSS from "@/utils/parseRequestToCSS";

const Module_Fullpage = ({ module }) => {
  const { medias, text } = module;

  const { sectionStyle, containerStyle, mediasStyle, sliderStyle, textStyle } =
    parseRequestToCSS(module);

  return (
    <section className={styles.fullpage} style={sectionStyle}>
      <div style={containerStyle}>
        {medias.map((media) => {
          return (
            <div
              key={media.id}
              style={mediasStyle}
              className={styles.mediasContainer}
            >
              <img
                src={media.url}
                alt={media.alternativeText}
                id={`media-content-${media.id}`}
              />
              <ImageSlider
                stylingObject={sliderStyle}
                imageId={`media-content-${media.id}`}
              />
            </div>
          );
        })}
      </div>
      {text && <Module_Text stylingObject={textStyle} text={text.text} />}
    </section>
  );
};

export default Module_Fullpage;
