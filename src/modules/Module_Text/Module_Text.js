import styles from "./Module_Text.module.css";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import ModuleWrapper from "@/constructors/ModuleWrapper/ModuleWrapper";
import TextWrapper from "@/constructors/TextWrapper/TextWrapper";
import generateInlineStyle from "@/utils/generateInlineStyle";
import ModuleColumn from "@/constructors/ModuleColumn/ModuleColumn";

const Module_Text = ({ module, customColors }) => {
  const { sectionStyle } = generateInlineStyle(module);

  return (
    <ModuleWrapper
      inlineStyle={sectionStyle}
      customColors={customColors}
      module={module}
    >
      <div className={styles.content}>
        <ModuleColumn>
          <TextWrapper textModule={module.text}>
            <BlocksRenderer content={module.text.richText} />
          </TextWrapper>
        </ModuleColumn>
      </div>
    </ModuleWrapper>
  );
};

export default Module_Text;
