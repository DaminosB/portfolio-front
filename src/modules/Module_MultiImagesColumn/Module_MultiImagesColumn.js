import styles from "./Module_MultiImagesColumn.module.css";

import ModuleWrapper from "@/wrappers/ModuleWrapper/ModuleWrapper";
import MediaCardWrapper from "@/wrappers/MediaCardWrapper/MediaCardWrapper";

const Module_MultiImagesColumn = ({ module, customColors }) => {
  const { medias } = module;

  const cardsIdsArray = medias.map(
    (media) => `section-${module.id}-media-card-${media.id}`
  );

  return medias.map((media, index) => {
    const mediaCardId = cardsIdsArray[index];

    const relatedSiblings = cardsIdsArray.filter(
      (cardId) => cardId !== mediaCardId
    );

    return (
      <ModuleWrapper key={media.id} customColors={customColors} medias={medias}>
        <div className={styles.mediaContainer}>
          <MediaCardWrapper
            customColors={customColors}
            media={media}
            cardId={cardsIdsArray[index]}
            relatedSiblings={relatedSiblings}
          >
            <img
              draggable={false}
              src={media.url}
              alt={media.alternativeText}
            />
          </MediaCardWrapper>
        </div>
      </ModuleWrapper>
    );
  });
};

export default Module_MultiImagesColumn;
