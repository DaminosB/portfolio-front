const generateCssClasses = (module) => {
  // This func returns a string containing all the classes we will attribute to the content div
  // First we destructure our object
  const { text } = module;

  // Then we prepare the string we will return
  let response = "";

  // If the module contains text, more parameters must be set
  if (text) {
    // The text is on the left or right
    switch (text.textPosition) {
      case "Gauche":
        response = "flex-row-reverse";
        break;

      case "Droite":
        response = "flex-row";
        break;

      default:
        break;
    }

    // Text alignment property
    switch (text.alignment) {
      case "Gauche":
        response = `${response} text-align-left`;
        break;

      case "Droite":
        response = `${response} text-align-right`;
        break;

      case "Centré":
        response = `${response} text-align-center`;
        break;

      case "Justifié":
        response = `${response} text-align-justify`;
        break;

      default:
        break;
    }

    // Font properties
    switch (text.fontSize) {
      case "xLarge":
        response = `${response} text-size-x-large`;
        break;

      case "Large":
        response = `${response} text-size-large`;
        break;

      case "Medium":
        response = `${response} text-size-medium`;
        break;

      case "Small":
        response = `${response} text-size-small`;
        break;

      case "xSmall":
        response = `${response} text-size-x-small`;
        break;

      default:
        break;
    }
  }
  return response;
};

export default generateCssClasses;
