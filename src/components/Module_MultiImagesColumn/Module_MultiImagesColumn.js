import styles from "./Module_MultiImagesColumn.module.css";

import MediasWrapper from "../MediasWrapper/MediasWrapper";

const Module_MultiImagesColumn = ({ module }) => {
  const imagesIdsArray = module.medias.map(
    (media) => `media-content-${media.id}`
  );

  return module.medias.map((media, index) => (
    <section
      key={media.id}
      className={styles.multiImagesColumn}
      id={`section-${media.id}`}
    >
      <MediasWrapper module={module} id={media.id}>
        <img
          draggable={false}
          src={media.url}
          alt={media.alternativeText}
          id={imagesIdsArray[index]}
        />
      </MediasWrapper>
    </section>
  ));
};

export default Module_MultiImagesColumn;
