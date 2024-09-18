const generateInlineStyle = (module) => {
  // // This func returns an object with the CSS properties of the modules that calls it
  // First we extract each key of the objetc
  const { backgroundImage, backgroundColor, text, medias, gap } = module;

  // Then we prepare the object we will return
  const response = {
    sectionStyle: {},
    contentDivStyle: {},
    mediasWrapperStyle: {},
  };

  // Background properties
  if (backgroundColor) response.sectionStyle.backgroundColor = backgroundColor;

  if (backgroundImage)
    response.sectionStyle.backgroundImage = `url(${backgroundImage.url})`;

  if (medias.length > 1) {
    // If multiple medias must be displayed, we apply the gap value the user has stored
    response.mediasWrapperStyle.gap = `${gap}px`;
  }

  // If the module contains text, more parameters must be set
  if (text) {
    response.contentDivStyle.fontFamily = text.font
      .substring(0, text.font.indexOf("("))
      .trim();

    // Text decorations
    response.contentDivStyle.color = text.textColor;

    // Gap between text and medias
    response.contentDivStyle.gap = `${text.gap}px`;
  }
  return response;
};

export default generateInlineStyle;
