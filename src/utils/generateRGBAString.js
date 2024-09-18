const generateRGBAString = (themeColor, opacityValue) => {
  const colorCodesArray = themeColor
    .substring(1)
    .split("")
    .map((char, index, array) => {
      if (index % 2 === 0) {
        const nextChar = array[index + 1];
        return `${char}${nextChar}`;
      }
    })
    .filter((entry) => entry)
    .map((hexaCode) => parseInt(hexaCode, 16));

  const [r, g, b] = colorCodesArray;

  return `rgba(${r}, ${g}, ${b}, ${opacityValue})`;
};

export default generateRGBAString;
