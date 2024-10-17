import styles from "./Module_Container.module.css";

import MediaCardWrapper from "../../wrappers/MediaCardWrapper/MediaCardWrapper";
import ModuleWrapper from "@/wrappers/ModuleWrapper/ModuleWrapper";
import TextWrapper from "../../wrappers/TextWrapper/TextWrapper";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";

import generateCssClasses from "@/utils/generateCssClasses";
import generateInlineStyle from "@/utils/generateInlineStyle";

const Module_Container = ({ module, customColors }) => {
  const { medias, text } = module;

  const contentDivClasses = generateCssClasses(module);

  const { sectionStyle, contentDivStyle, mediasContainerStyle } =
    generateInlineStyle(module);

  const mediasArray = populateMediasArray(medias, module.imagesPerRow);

  return (
    <ModuleWrapper
      inlineStyle={sectionStyle}
      customColors={customColors}
      medias={medias}
    >
      <div
        className={`container ${styles.content} ${contentDivClasses}`}
        style={contentDivStyle}
      >
        <div className={styles.mediasFrame}>
          <div className={styles.mediasContainer} style={mediasContainerStyle}>
            {mediasArray.map((mediasLine, index) => {
              return (
                <div key={index} style={mediasContainerStyle}>
                  {mediasLine.map((media) => {
                    const isImageFile =
                      media.provider_metadata.resource_type === "image";

                    return (
                      <MediaCardWrapper
                        key={media.id}
                        customColors={customColors}
                        media={media}
                      >
                        {isImageFile ? (
                          <img
                            draggable={false}
                            src={media.url}
                            alt={media.alternativeText}
                          />
                        ) : (
                          <source src={media.url} />
                        )}
                      </MediaCardWrapper>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>{" "}
        {text && (
          <TextWrapper textModule={text}>
            <BlocksRenderer content={text.richText} />
          </TextWrapper>
        )}
      </div>
    </ModuleWrapper>
  );
};

const populateMediasArray = (array, chunkSize) => {
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
};

export default Module_Container;
