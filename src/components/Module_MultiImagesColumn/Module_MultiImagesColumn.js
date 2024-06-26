import styles from "./Module_MultiImagesColumn.module.css";

import MediasWrapper from "../MediasWrapper/MediasWrapper";
import MediaCardWrapper from "../MediaCardWrapper/MediaCardWrapper";

const Module_MultiImagesColumn = ({ module, customColors }) => {
  const cardsIdsArray = module.medias.map(
    (media, index) => `section-${media.id}-media-card-${index}`
  );

  console.log(cardsIdsArray);
  return module.medias.map((media, index) => {
    return (
      <section
        key={media.id}
        className={styles.multiImagesColumn}
        id={`section-${media.id}`}
      >
        <MediasWrapper parentStyle={styles} customColors={customColors}>
          <MediaCardWrapper
            key={media.id}
            parentStyle={styles}
            customColors={customColors}
            media={media}
            id={cardsIdsArray[index]}
            relatedSiblings={cardsIdsArray}
          >
            <img
              draggable={false}
              src={media.url}
              alt={media.alternativeText}
            />
          </MediaCardWrapper>
        </MediasWrapper>
      </section>
    );
  });
};

export default Module_MultiImagesColumn;
