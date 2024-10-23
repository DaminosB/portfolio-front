const generateDynamicStyle = (customColors) => {
  return `
        pre {
            background-color: ${customColors.mainColor};
            color: ${customColors.secondaryColor};
        }
        blockquote {
            border-color: ${customColors.mainColor};
        }
      `;
};

export default generateDynamicStyle;
