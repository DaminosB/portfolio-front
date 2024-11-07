const generateInlineStyle = (module) => {
  // // This func returns an object with the CSS properties of the modules that calls it
  // First we extract each key of the objetc
  const { backgroundImage, backgroundColor, mediaBlocks, gap } = module;

  // Then we prepare the object we will return
  const response = {
    sectionStyle: {},
    mediasContainerStyle: {},
  };

  // Background properties
  if (backgroundColor) response.sectionStyle.backgroundColor = backgroundColor;

  if (backgroundImage)
    response.sectionStyle.backgroundImage = `url(${backgroundImage.url})`;

  // If multiple medias must be displayed, we apply the gap value the user has stored
  if (mediaBlocks && mediaBlocks.length > 1)
    response.mediasContainerStyle.gap = `${gap}px`;

  return response;
};

export default generateInlineStyle;
