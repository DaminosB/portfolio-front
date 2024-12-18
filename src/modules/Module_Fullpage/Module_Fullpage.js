import styles from "./Module_Fullpage.module.css";

import MediaCardWrapper from "@/constructors/MediaCardWrapper/MediaCardWrapper";
import ModuleWrapper from "@/constructors/ModuleWrapper/ModuleWrapper";
import TextWrapper from "@/constructors/TextWrapper/TextWrapper";
import ModuleColumn from "@/constructors/ModuleColumn/ModuleColumn";
import MediasGallery from "@/constructors/MediasGallery/MediasGallery";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import generateInlineStyle from "@/utils/generateInlineStyle";
import populateCardsIdsArray from "@/utils/populateCardsIdsArray";
import generateCssClasses from "@/utils/generateCssClasses";
import generateTitleInlineStyle from "@/utils/generateTitleInlineStyle";

const Module_Fullpage = ({ module, customColors, sectionCoords }) => {
  const { titleBlock, mediaBlocks, text } = module;

  const { sectionStyle, mediasContainerStyle } = generateInlineStyle(module);

  const cardsIdsArray = populateCardsIdsArray(module);

  const contentDivClasses = generateCssClasses(module);

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
      <div className={`${styles.content} ${contentDivClasses}`}>
        <ModuleColumn>
          <div className={styles.mediasContainer} style={mediasContainerStyle}>
            {mediaBlocks.map((mediaBlock, i, array) => {
              return (
                <MediasGallery
                  key={mediaBlock.id}
                  mediaBlock={mediaBlock}
                  customColors={customColors}
                >
                  {mediaBlock.mediaAssets.map((mediaAsset, j) => {
                    const isImageFile =
                      mediaAsset.provider_metadata.resource_type === "image";
                    const mediaCardId = cardsIdsArray[i * array.length + j];

                    return (
                      <div
                        key={mediaAsset.id}
                        className={styles.mediaCardFrame}
                      >
                        <MediaCardWrapper
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
          </div>
        </ModuleColumn>
        {text && (
          <ModuleColumn>
            <div className={styles.textContainer}>
              <TextWrapper textModule={text}>
                <BlocksRenderer content={text.richText} />
              </TextWrapper>
            </div>
          </ModuleColumn>
        )}
      </div>
    </ModuleWrapper>
  );
};

export default Module_Fullpage;
