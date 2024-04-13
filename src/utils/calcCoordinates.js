const calcCoordinates = (index, domElement, styleInputs) => {
  // index: Number. The position of the element in the projectsToDisplay array
  // domElement. The ProjectCards whose coordinates are going to be calculates
  // styleInputs: Object. Contains 2 keys that will be destructured

  const { elementsPerRow, gap } = styleInputs;
  // elementsPerRow: Number. The number of thumbnails per row the user wants to display (set up in the backoffice)
  // gap: Number. The gap in px between thumbnails the user wants to display (set up in the backoffice)

  // We begin by getting the CardProjects dimensions (all CardProject's have the same)
  const referenceCard = domElement.parentNode.children[0];

  const cardSize = {
    width: referenceCard.offsetWidth,
    height: referenceCard.offsetHeight,
  };

  // We can determine on which Row the card is displayed
  const rowIndex = Math.floor(index / elementsPerRow);

  // To get the columnIndex, we need to remove all the elements displayed on the previous rows from the current index
  const columnIndex = index - rowIndex * elementsPerRow;

  // This lets us calculate the coordinates of the card
  const topPosition = rowIndex * cardSize.height + rowIndex * gap;
  const leftPosition = columnIndex * cardSize.width + columnIndex * gap;

  // We apply them the card
  domElement.style.top = `${topPosition}px`;
  domElement.style.left = `${leftPosition}px`;
};

export default calcCoordinates;
