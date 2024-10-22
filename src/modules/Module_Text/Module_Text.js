import styles from "./Module_Text.module.css";

import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import ModuleWrapper from "@/constructors/ModuleWrapper/ModuleWrapper";
import TextWrapper from "@/constructors/TextWrapper/TextWrapper";
import generateInlineStyle from "@/utils/generateInlineStyle";

const Module_Text = ({ module, customColors }) => {
  const { sectionStyle } = generateInlineStyle(module);

  return (
    <ModuleWrapper inlineStyle={sectionStyle} customColors={customColors}>
      <div className={styles.content}>
        <TextWrapper textModule={module.text}>
          <BlocksRenderer content={module.text.richText} />
        </TextWrapper>
      </div>
    </ModuleWrapper>
  );
};

export default Module_Text;
