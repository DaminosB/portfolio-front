const calcSliderTranslation = (targetIndex) => {
  const [headerNode] = document.getElementsByTagName("HEADER");

  const sliderElement = document.getElementById("slider");

  const activeSectionTopPosition =
    sliderElement.children[targetIndex].offsetTop;

  // Index 0 is the cover component and has a special treatment
  const coverComponent = sliderElement.children[0];

  switch (targetIndex) {
    case 0:
      // If the targetIndex is 0, we are on the cover, and we should remove classes hidden and removed
      coverComponent.classList.remove("hidden");
      coverComponent.classList.remove("scaled-down");
      headerNode.classList.remove("zero-height");
      headerNode.classList.remove("hidden");

      // We also slide to the cover component
      sliderElement.style.transform = `translateY(${-activeSectionTopPosition}px)`;

      break;

    case 1:
      // We check if the cover if the cover has a hidden class
      const coverIsShown = !Array.from(coverComponent.classList).includes(
        "hidden"
      );
      // If not, it means the cover is shown

      if (coverIsShown) {
        // If so, we reduce its size and opacity
        coverComponent.classList.add("hidden");
        coverComponent.classList.add("scaled-down");
        headerNode.classList.add("zero-height");
        headerNode.classList.add("hidden");
      } else {
        // If not, we just slide the active child
        sliderElement.style.transform = `translateY(${-activeSectionTopPosition}px)`;
      }
      break;

    default:
      // All other scenarios, we slide normaly
      sliderElement.style.transform = `translateY(${-activeSectionTopPosition}px)`;
      break;
  }
};

export default calcSliderTranslation;
