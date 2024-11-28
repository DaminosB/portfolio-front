import styles from "./Module_Text.module.css";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import ModuleWrapper from "@/constructors/ModuleWrapper/ModuleWrapper";
import TextWrapper from "@/constructors/TextWrapper/TextWrapper";
import generateInlineStyle from "@/utils/generateInlineStyle";
import ModuleColumn from "@/constructors/ModuleColumn/ModuleColumn";
import generateTitleInlineStyle from "@/utils/generateTitleInlineStyle";

const Module_Text = ({ module, customColors }) => {
  const { titleBlock, text } = module;

  const { sectionStyle } = generateInlineStyle(module);

  const titleInlineStyle = titleBlock
    ? generateTitleInlineStyle(titleBlock)
    : {};

  return (
    <ModuleWrapper
      inlineStyle={sectionStyle}
      customColors={customColors}
      module={module}
    >
      <div className={`container ${styles.content}`}>
        {titleBlock && <h2 style={titleInlineStyle}>{titleBlock.title}</h2>}
        <div>
          <ModuleColumn>
            <TextWrapper textModule={text}>
              <BlocksRenderer content={text.richText} />
            </TextWrapper>
          </ModuleColumn>
        </div>
      </div>
    </ModuleWrapper>
  );
};

export default Module_Text;
