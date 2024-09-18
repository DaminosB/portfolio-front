import styles from "./Module_MultiImagesColumn.module.css";

import ModuleWrapper from "@/wrappers/ModuleWrapper/ModuleWrapper";
import MediaCardWrapper from "@/wrappers/MediaCardWrapper/MediaCardWrapper";

const Module_MultiImagesColumn = ({ module, customColors }) => {
  const { medias } = module;

  const cardsIdsArray = module.medias.map(
    (media, index) => `section-${media.id}-media-card-${index}`
  );

  return medias.map((media, index) => {
    const sectionId = `section-${media.id}`;

    const mediaCardId = cardsIdsArray[index];

    const relatedSiblings = cardsIdsArray.filter(
      (cardId) => cardId !== mediaCardId
    );

    return (
      <ModuleWrapper
        key={media.id}
        customColors={customColors}
        sectionId={sectionId}
        medias={medias}
      >
        <div className={styles.mediaContainer}>
          <MediaCardWrapper
            customColors={customColors}
            media={media}
            sectionId={sectionId}
            id={mediaCardId}
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
