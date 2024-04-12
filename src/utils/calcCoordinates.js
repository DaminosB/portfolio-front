const calcCoordinates = (index, domElement) => {
  // index: Number. The position of the element in the projectsToDisplay array
  // domElement. The ProjectCards whose coordinates are going to be calculates

  // We begin by getting the CardProjects dimensions (all CardProject's have the same)
  const referenceCard = domElement.parentNode.children[0];

  const cardSize = {
    width: referenceCard.offsetWidth,
    height: referenceCard.offsetHeight,
  };

  // We need to find the parent's width
  const parentWidth = domElement.parentNode.offsetWidth;

  // With the card's width, we get the number of elemennts per row
  const elementsPerRow = Math.floor(parentWidth / cardSize.width);

  // Knowing this, we can determine on which Row the card is displayed
  const rowIndex = Math.floor(index / elementsPerRow);

  // To get the columnIndex, we need to remove all the elements displayed on the previous rows from the current index
  const columnIndex = index - rowIndex * elementsPerRow;

  // This lets us calculate the coordinates of the card, 20 being the gap between each card
  const topPosition = rowIndex * cardSize.height + rowIndex * 20;
  const leftPosition = columnIndex * cardSize.width + columnIndex * 20;

  // We apply them the card
  domElement.style.top = `${topPosition}px`;
  domElement.style.left = `${leftPosition}px`;
};

export default calcCoordinates;
