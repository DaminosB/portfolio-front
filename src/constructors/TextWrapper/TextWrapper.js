import styles from "./TextWrapper.module.css";

const TextWrapper = ({ textModule, children }) => {
  const inlineStyle = generateTextStyle(textModule);

  return (
    <div className={styles.textWrapper} style={inlineStyle}>
      <div>{children}</div>
    </div>
  );
};

export default TextWrapper;

const generateTextStyle = (textModule) => {
  const { alignment, font, textColor } = textModule;

  const response = {
    fontFamily: "",
    color: "",
    textAlign: "",
  };

  response.fontFamily = font.substring(0, font.indexOf("(")).trim();

  response.color = textColor;

  if (alignment === "Centré") response.textAlign = "center";
  else if (alignment === "Gauche") response.textAlign = "left";
  else if (alignment === "Droite") response.textAlign = "right";
  else if (alignment === "Justifié") response.textAlign = "justify";

  return response;
};
