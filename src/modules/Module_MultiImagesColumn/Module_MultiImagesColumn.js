import styles from "./Module_MultiImagesColumn.module.css";

import ModuleWrapper from "@/constructors/ModuleWrapper/ModuleWrapper";
import MediaCardWrapper from "@/constructors/MediaCardWrapper/MediaCardWrapper";
import MediasGallery from "@/constructors/MediasGallery/MediasGallery";
import populateCardsIdsArray from "@/utils/populateCardsIdsArray";
import ModuleColumn from "@/constructors/ModuleColumn/ModuleColumn";
import Image from "next/image";

const Module_MultiImagesColumn = ({ module, customColors, sectionCoords }) => {
  const { mediaBlocks } = module;

  // This module doesn't handle video files
  const filteredMediaBlocks = mediaBlocks.map((mediaBlock) => ({
    ...mediaBlock,
    mediaAssets: mediaBlock.mediaAssets.filter(
      (mediaAsset) => mediaAsset.provider_metadata.resource_type === "image"
    ),
  }));

  module.mediaBlocks = filteredMediaBlocks;

  const cardsIdsArray = populateCardsIdsArray(module);

  return filteredMediaBlocks.map((mediaBlock, i, array) => {
    return (
      <ModuleWrapper
        key={mediaBlock.id}
        customColors={customColors}
        module={module}
        sectionCoords={sectionCoords}
      >
        <div className={styles.mediaContainer}>
          <MediasGallery
            key={mediaBlock.id}
            mediaBlock={mediaBlock}
            customColors={customColors}
          >
            {mediaBlock.mediaAssets.map((mediaAsset, subIndex, subArray) => {
              const mediaCardId = cardsIdsArray[i * subArray.length + subIndex];

              const relatedMedias = cardsIdsArray.filter(
                (cardId) => cardId !== mediaCardId
              );

              return (
                <MediaCardWrapper
                  key={mediaAsset.id}
                  customColors={customColors}
                  media={mediaAsset}
                  cardId={mediaCardId}
                  relatedSiblings={relatedMedias}
                >
                  <Image
                    width={mediaAsset.width}
                    height={mediaAsset.height}
                    src={mediaAsset.url}
                    alt={mediaAsset.alternativeText}
                    draggable={false}
                  />
                </MediaCardWrapper>
              );
            })}
          </MediasGallery>
        </div>
      </ModuleWrapper>
    );
  });
};

export default Module_MultiImagesColumn;
