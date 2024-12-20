const generateTitleInlineStyle = (titleBlock) => {
  const response = {};

  response.color = titleBlock.fontColor;
  if (titleBlock.textBorderColor) {
    let textShadowString = "";
    textShadowString += `1px 1px 15px ${titleBlock.textBorderColor}`;
    textShadowString += `, -1px -1px 15px ${titleBlock.textBorderColor}`;
    textShadowString += `, -1px 1px 15px ${titleBlock.textBorderColor}`;
    textShadowString += `, 1px -1px 15px ${titleBlock.textBorderColor}`;

    response.textShadow = textShadowString;
  }

  return response;
};

export default generateTitleInlineStyle;
