// This func returns an object with the CSS properties of the modules that calls it
const parseRequestToCSS = (module) => {
  // First we extract each key of the objetc
  const {
    gap,
    backgroundImage,
    backgroundColor,
    medias,
    imageSliderColor,
    imagesPerRow,
    text,
  } = module;

  // Then we prepare the object we will return
  const response = {
    backgroundStyle: {},
    contentStyle: {},
    mediasContainerStyle: {},
    mediasStyle: {},
    sliderStyle: {},
    textStyle: {},
  };

  // Background properties
  if (backgroundColor)
    response.backgroundStyle.backgroundColor = backgroundColor;

  if (backgroundImage)
    response.backgroundStyle.backgroundImage = `url(${backgroundImage.url})`;

  // Medias container width
  // if (medias.length > 1) {
  //   response.mediasContainerStyle.gap = `${gap}px`;
  //   const imagesPerLine = imagesPerRow || medias.length;
  //   // response.mediasStyle.width = `calc((100% - ${
  //   //   (imagesPerLine - 1) * gap
  //   // }px) / ${imagesPerLine})`;
  // } else if (medias.length === 1) {
  //   // response.mediasStyle.width = "100%";
  // }

  response.sliderStyle.borderColor = imageSliderColor;

  // If the module contains text, more parameters must be set
  if (text) {
    // The text is on the left or right
    switch (text.textPosition) {
      case "Gauche":
        response.contentStyle.flexDirection = "row-reverse";
        break;

      case "Droite":
        response.contentStyle.flexDirection = "row";
        break;

      default:
        break;
    }

    // Text alignment property
    switch (text.alignment) {
      case "Gauche":
        response.textStyle.textAlign = "left";
        break;

      case "Droite":
        response.textStyle.textAlign = "right";
        break;

      case "Centré":
        response.textStyle.textAlign = "center";
        break;

      case "Justifié":
        response.textStyle.textAlign = "justify";
        break;

      default:
        break;
    }

    // Font properties
    switch (text.fontSize) {
      case "xLarge":
        response.textStyle.fontSize = "80px";
        break;

      case "Large":
        response.textStyle.fontSize = "60px";
        break;

      case "Medium":
        response.textStyle.fontSize = "40px";
        break;

      case "Small":
        response.textStyle.fontSize = "20px";
        break;

      case "xSmall":
        response.textStyle.fontSize = "10px";
        break;

      default:
        break;
    }

    response.textStyle.fontFamily = text.font
      .substring(0, text.font.indexOf("("))
      .trim();

    // Text decorations
    response.textStyle.color = text.textColor;

    if (text.backgroundColor)
      response.textStyle.backgroundColor = text.backgroundColor;

    // Gap between text and medias
    response.contentStyle.gap = `${text.gap}px`;
  }
  return response;
};

export default parseRequestToCSS;
