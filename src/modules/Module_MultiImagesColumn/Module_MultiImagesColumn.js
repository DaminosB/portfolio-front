import styles from "./Module_MultiImagesColumn.module.css";

import ModuleWrapper from "@/constructors/ModuleWrapper/ModuleWrapper";
import MediaCardWrapper from "@/constructors/MediaCardWrapper/MediaCardWrapper";
import populateMediasArray from "@/utils/populateMediasArray";

const Module_MultiImagesColumn = ({ module, customColors }) => {
  const { mediaBlocks } = module;

  // This module doesn't handle video files
  const mediasDisplay = mediaBlocks.filter(
    (mediaBlock) => mediaBlock.provider_metadata.resource_type === "image"
  );
  const mediasArray = populateMediasArray(mediaBlocks).filter(
    (media) => media.provider_metadata.resource_type === "image"
  );

  const cardsIdsArray = mediasDisplay.map(
    (media) => `section-${module.id}-media-card-${media.id}`
  );

  return mediasDisplay.map((media, index) => {
    const mediaCardId = cardsIdsArray[index];

    const relatedSiblings = cardsIdsArray.filter(
      (cardId) => cardId !== mediaCardId
    );

    return (
      <ModuleWrapper
        key={media.id}
        customColors={customColors}
        medias={mediasArray}
      >
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
