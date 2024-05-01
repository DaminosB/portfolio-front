import styles from "./Module_MultiImagesColumn.module.css";

import ImageSlider from "../ImageSlider/ImageSlider";
import ImageSliderPortal from "../ImageSliderPortal/ImageSliderPortal";

const Module_MultiImagesColumn = ({ module }) => {
  const imagesIdsArray = module.medias.map(
    (media) => `media-content-${media.id}`
  );

  return (
    <>
      {module.medias.map((media, index) => {
        return (
          <section
            key={media.id}
            className={styles.multiImagesColumn}
            id={`section-${media.id}`}
          >
            <div>
              <img
                src={media.url}
                alt={media.alternativeText}
                id={imagesIdsArray[index]}
              />
            </div>
          </section>
        );
      })}
      <ImageSliderPortal imagesIdsArray={imagesIdsArray}>
        <ImageSlider
          stylingObject={{ borderColor: "#000000" }}
          imagesIdsArray={imagesIdsArray}
        />
      </ImageSliderPortal>
    </>
  );
};

export default Module_MultiImagesColumn;
