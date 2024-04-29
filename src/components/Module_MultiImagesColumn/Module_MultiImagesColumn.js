import styles from "./Module_MultiImagesColumn.module.css";

import ImageSlider from "../ImageSlider/ImageSlider";

const Module_MultiImagesColumn = ({ module }) => {
  return (
    <>
      {module.medias.map((media, index) => {
        return (
          <section key={media.id} className={styles.multiImagesColumn}>
            <div>
              <img
                src={media.url}
                alt={media.alternativeText}
                id={`media-content-${media.id}`}
              />
            </div>
          </section>
        );
      })}
      {/* <ImageSlider imageId={`media-content-${module.medias[0].id}`} /> */}
    </>
  );
};

export default Module_MultiImagesColumn;
