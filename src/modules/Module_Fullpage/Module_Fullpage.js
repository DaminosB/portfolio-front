import styles from "./Module_Fullpage.module.css";

import MediaCardWrapper from "../../wrappers/MediaCardWrapper/MediaCardWrapper";
import ModuleWrapper from "../../wrappers/ModuleWrapper/ModuleWrapper";
import TextWrapper from "../../wrappers/TextWrapper/TextWrapper";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import generateCssClasses from "@/utils/generateCssClasses";
import generateInlineStyle from "@/utils/generateInlineStyle";
import populateMediasArray from "@/utils/populateMediasArray";

const Module_Fullpage = ({ module, customColors }) => {
  const { mediaBlocks, text } = module;

  const contentDivClasses = generateCssClasses(module);

  const { sectionStyle, contentDivStyle, mediasContainerStyle } =
    generateInlineStyle(module);

  const mediasArray = populateMediasArray(mediaBlocks);

  return (
    <ModuleWrapper
      inlineStyle={sectionStyle}
      customColors={customColors}
      medias={mediasArray}
    >
      <div
        className={`${styles.content} ${contentDivClasses}`}
        style={contentDivStyle}
      >
        <div className={styles.mediasContainer} style={mediasContainerStyle}>
          {mediaBlocks.map((mediaBlock) => {
            const isImageFile =
              mediaBlock.provider_metadata.resource_type === "image";

            return (
              <MediaCardWrapper
                key={mediaBlock.id}
                customColors={customColors}
                media={mediaBlock}
              >
                {isImageFile ? (
                  <img
                    draggable={false}
                    src={mediaBlock.url}
                    alt={mediaBlock.alternativeText}
                  />
                ) : (
                  <source src={mediaBlock.url} />
                )}
              </MediaCardWrapper>
            );
          })}
        </div>
        {text && (
          <TextWrapper textModule={text}>
            <BlocksRenderer content={text.richText} />
          </TextWrapper>
        )}
      </div>
    </ModuleWrapper>
  );
};

export default Module_Fullpage;
