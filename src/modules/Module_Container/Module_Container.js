import styles from "./Module_Container.module.css";

import ModuleWrapper from "@/constructors/ModuleWrapper/ModuleWrapper";
import ModuleColumn from "@/constructors/ModuleColumn/ModuleColumn";
import TextWrapper from "@/constructors/TextWrapper/TextWrapper";
import MediasGallery from "@/constructors/MediasGallery/MediasGallery";
import MediaCardWrapper from "@/constructors/MediaCardWrapper/MediaCardWrapper";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import generateCssClasses from "@/utils/generateCssClasses";
import generateInlineStyle from "@/utils/generateInlineStyle";
import populateCardsIdsArray from "@/utils/populateCardsIdsArray";
import generateTitleInlineStyle from "@/utils/generateTitleInlineStyle";

const Module_Container = ({ module, customColors, sectionCoords }) => {
  const { titleBlock, mediaBlocks, text } = module;

  const contentDivClasses = generateCssClasses(module);

  const { sectionStyle, contentDivStyle, mediasContainerStyle } =
    generateInlineStyle(module);

  const cardsIdsArray = populateCardsIdsArray(module);

  const titleInlineStyle = titleBlock
    ? generateTitleInlineStyle(titleBlock)
    : {};

  return (
    <ModuleWrapper
      inlineStyle={sectionStyle}
      customColors={customColors}
      module={module}
      sectionCoords={sectionCoords}
    >
      {titleBlock && (
        <h2 data-role="title" className={styles.title} style={titleInlineStyle}>
          {titleBlock.title}
        </h2>
      )}
      <div className={styles.content}>
        <div className={contentDivClasses} style={contentDivStyle}>
          <ModuleColumn>
            <div
              className={styles.mediasContainer}
              style={mediasContainerStyle}
            >
              {mediaBlocks.map((mediaBlock, i, array) => {
                if (i % module.imagesPerRow === 0) {
                  const slicedArray = array.slice(i, i + module.imagesPerRow);

                  const isSmallerThanChunk =
                    slicedArray.length < module.imagesPerRow;

                  const ghostDivStyle = {
                    flex: (module.imagesPerRow - slicedArray.length) / 2,
                  };

                  return (
                    <div key={mediaBlock.id} style={mediasContainerStyle}>
                      {isSmallerThanChunk && (
                        <div
                          className={styles.ghost}
                          style={ghostDivStyle}
                        ></div>
                      )}
                      {slicedArray.map((subItem) => {
                        return (
                          <MediasGallery
                            key={subItem.id}
                            mediaBlock={subItem}
                            customColors={customColors}
                          >
                            {subItem.mediaAssets.map((mediaAsset, j) => {
                              const isImageFile =
                                mediaAsset.provider_metadata.resource_type ===
                                "image";

                              const mediaCardId =
                                cardsIdsArray[i * array.length + j];

                              return (
                                <div
                                  key={mediaAsset.id}
                                  className={styles.mediaCardFrame}
                                >
                                  <MediaCardWrapper
                                    // key={mediaAsset.id}
                                    customColors={customColors}
                                    media={mediaAsset}
                                    cardId={mediaCardId}
                                  >
                                    {isImageFile ? (
                                      <img
                                        draggable={false}
                                        src={mediaAsset.url}
                                        alt={mediaAsset.alternativeText}
                                      />
                                    ) : (
                                      <source src={mediaAsset.url} />
                                    )}
                                  </MediaCardWrapper>
                                </div>
                              );
                            })}
                          </MediasGallery>
                        );
                      })}
                      {isSmallerThanChunk && (
                        <div
                          className={styles.ghost}
                          style={ghostDivStyle}
                        ></div>
                      )}
                    </div>
                  );
                }
              })}
            </div>
          </ModuleColumn>
          {text && (
            <ModuleColumn>
              <TextWrapper textModule={text}>
                <BlocksRenderer content={text.richText} />
              </TextWrapper>
            </ModuleColumn>
          )}
        </div>
      </div>
    </ModuleWrapper>
  );
};

export default Module_Container;
