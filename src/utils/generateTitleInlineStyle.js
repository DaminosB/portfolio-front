import generateRGBAString from "./generateRGBAString";

const generateTitleInlineStyle = (titleBlock) => {
  return {
    color: titleBlock.fontColor,
    backgroundColor: titleBlock.backgroundColor
      ? generateRGBAString(
          titleBlock.backgroundColor,
          titleBlock.backgroundOpacity / 100
        )
      : "",
  };
};

export default generateTitleInlineStyle;
