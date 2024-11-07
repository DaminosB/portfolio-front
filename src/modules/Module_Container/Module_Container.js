import styles from "./Module_Container.module.css";

import { Fragment } from "react";
import MediaCardWrapper from "@/constructors/MediaCardWrapper/MediaCardWrapper";
import ModuleWrapper from "@/constructors/ModuleWrapper/ModuleWrapper";
import TextWrapper from "@/constructors/TextWrapper/TextWrapper";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import generateCssClasses from "@/utils/generateCssClasses";
import generateInlineStyle from "@/utils/generateInlineStyle";
import MediasGallery from "@/constructors/MediasGallery/MediasGallery";
import populateCardsIdsArray from "@/utils/populateCardsIdsArray";
import ModuleColumn from "@/constructors/ModuleColumn/ModuleColumn";

const Module_Container = ({ module, customColors }) => {
  const { mediaBlocks, text } = module;

  const contentDivClasses = generateCssClasses(module);

  const { sectionStyle, contentDivStyle, mediasContainerStyle } =
    generateInlineStyle(module);

  const cardsIdsArray = populateCardsIdsArray(module);

  return (
    <ModuleWrapper
      inlineStyle={sectionStyle}
      customColors={customColors}
      module={module}
    >
      <div
        className={`container ${styles.content} ${contentDivClasses}`}
        style={contentDivStyle}
      >
        <ModuleColumn>
          <div className={styles.mediasContainer} style={mediasContainerStyle}>
            {mediaBlocks.map((mediaBlock, i, array) => {
              if (i % module.imagesPerRow === 0) {
                return (
                  <div key={mediaBlock.id}>
                    {array
                      .slice(i, i + module.imagesPerRow)
                      .map((subItem, subIndex, subArray) => {
                        const isSmallerThanChunk =
                          subArray.length < module.imagesPerRow;

                        const ghostDivStyle = {
                          flex: (module.imagesPerRow - subArray.length) / 2,
                        };

                        return (
                          <Fragment key={subItem.id}>
                            {isSmallerThanChunk && (
                              <div
                                className={styles.ghost}
                                style={ghostDivStyle}
                              ></div>
                            )}
                            <MediasGallery
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
                                  <MediaCardWrapper
                                    key={mediaAsset.id}
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
                                );
                              })}
                            </MediasGallery>
                            {isSmallerThanChunk && (
                              <div
                                className={styles.ghost}
                                style={ghostDivStyle}
                              ></div>
                            )}
                          </Fragment>
                        );
                      })}
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
    </ModuleWrapper>
  );
};

export default Module_Container;
