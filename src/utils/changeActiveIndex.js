// This func is called after the wheel or touch events. It checks if the activeIndex needs to be updated
// It's updated if we are at the top or bottom of the section and the scroll is in the right direction
const changeActiveIndex = (scrollDirection, activeIndex) => {
  const sliderElement = document.getElementById("slider");

  const activeSection = sliderElement.children[activeIndex];
  // First we check the distance from the top of the visitor's screen of the displayed element
  const distanceFromTop = Math.round(activeSection.scrollTop); // First we need to set theses variables
  // The height of the content of the section
  const sectionTotalHeight = Math.round(activeSection.scrollHeight);

  // The height displayed on client's screen
  const sectionClientHeight = Math.round(activeSection.offsetHeight);

  // Then 2 scenarios according to the scroll direction
  switch (scrollDirection) {
    case "down":
      const visibleSectionHeight = sectionTotalHeight - distanceFromTop;
      // If down we check if we are at the bottom of the displayed child
      const marginOfError = 1;
      const isAtBottom =
        Math.abs(visibleSectionHeight - sectionClientHeight) <= marginOfError;

      // We check if we are not on the last parent's child
      const isLastChild = activeIndex === sliderElement.children.length - 1;

      // If parameters are ok, we set a new activeIndex to the displayer
      const canSlideDown = isAtBottom && !isLastChild;

      if (canSlideDown) return activeIndex + 1;
      else break;

    case "up":
      // If up, we check if we are not on the 1st child
      const isFirstChild = activeIndex === 0;

      // The we check if we are at the top of the section
      const isAtTop = distanceFromTop === 0;

      // If parameters are ok, we set a new activeIndex to the displayer
      const canSlideUp = isAtTop && !isFirstChild;

      if (canSlideUp) {
        return activeIndex - 1;
      } else break;

    default:
      break;
  }
};

export default changeActiveIndex;
