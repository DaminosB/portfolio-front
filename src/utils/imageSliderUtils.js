// This func applies the button's position to its CSS properties
const applyButtonPos = (domElement, buttonPosition) => {
  const [xAxisElement, buttonElement] = domElement.children;
  // This is the max value we can give to the button's CSS properties
  const maxPosition = xAxisElement.offsetWidth - buttonElement.offsetWidth;

  // We get the cursorPosition
  const cursorPosition = buttonPosition * (maxPosition / 100);

  // This is the position we will give to the button
  let finalPosition;

  // We had an extra security to ensure the min and max value are 0 and 100
  if (cursorPosition < 0) {
    finalPosition = 0;
  } else if (cursorPosition > maxPosition) {
    finalPosition = maxPosition;
  } else {
    finalPosition = cursorPosition;
  }

  // And we apply it
  buttonElement.style.left = `${finalPosition}px`;

  // Now lets make the axis disapear behind the button
  const buttonRightPos = finalPosition + buttonElement.offsetWidth;

  // We want the button and the axis to be the same color
  const xAxisColor = buttonElement.style.borderColor;

  // From left af the axis to left of the button, the axis is colored
  // Between the left and right of the button, the axis is transparent
  // From the right of the button to the right of the axis, the axis is colored
  console.log("salut");
  xAxisElement.style.background = `linear-gradient(to right, ${xAxisColor} ${finalPosition}px, transparent ${finalPosition}px, transparent ${buttonRightPos}px, ${xAxisColor} ${buttonRightPos}px)`;
};

// This func is called anytime the visitor moves over the button with their mouse or finger
const moveButton = (e, domElement) => {
  const [xAxisElement, buttonElement] = domElement.children;
  // First we check if the button is clicked
  // If so we need te determine where the contact has taken place
  let contactPosition;

  // It depennds on the event that is the source of triggering
  if (e._reactName === "onTouchMove") {
    contactPosition = e.changedTouches[0].pageX;
  } else if (e._reactName === "onMouseMove") {
    contactPosition = e.clientX;
  }

  // To calculate the position of the cursor, we need to know the position of the left of the axis
  const axisRectLeft = xAxisElement.getBoundingClientRect().left;

  // And the radius of the button (in order to take the center into account)
  const buttonRadius = buttonElement.offsetWidth / 2;

  const cursorPosition = contactPosition - axisRectLeft - buttonRadius;

  // The image can't move more to the right than the axis can reach
  const maxPosition = xAxisElement.offsetWidth - buttonElement.offsetWidth;

  // The value of the button's position on its axis is calculed here
  const value = (cursorPosition / maxPosition) * 100;

  // We had an extra security to ensure the min and max positions are 0 and 100
  if (value < 0) return 0;
  else if (value > 100) return 100;
  else return value;
};

// When the sliding button is activated, the image moves accordingly
const calcSliderMov = (imagesArray, buttonPosition) => {
  const referenceImage = imagesArray[0];
  // First we get the container's width
  const containerWidth = referenceImage.parentNode.offsetWidth;

  // Then we deduct the left max and min positions
  const sliderMinLeftPos = (containerWidth - referenceImage.scrollWidth) / 2;
  const sliderMaxLeftPos = -sliderMinLeftPos;

  // We multiply it by the value of buttonPosition to determine how much the slider needs to be translated
  const sliderTranslateValue =
    sliderMinLeftPos +
    (sliderMaxLeftPos - sliderMinLeftPos) * (buttonPosition / 100);

  // We apply the result
  imagesArray.map(
    (image) => (image.style.transform = `translateX(${sliderTranslateValue}px)`)
  );
};

const toggleDisplay = (domElement, image) => {
  // This is its parent
  const imageContainer = image.parentNode;

  // We check if the image is wider than its parent
  const isImageTooWide = image.scrollWidth > imageContainer.offsetWidth;

  if (isImageTooWide) {
    // If so, we display the component
    domElement.style.display = "unset";
    requestAnimationFrame(() => domElement.classList.remove("hidden"));
  } else {
    // If the image is not wider, no need to displauy this component
    domElement.style.display = "none";
    requestAnimationFrame(() => domElement.classList.add("hidden"));
  }
};

export { applyButtonPos, moveButton, calcSliderMov, toggleDisplay };
