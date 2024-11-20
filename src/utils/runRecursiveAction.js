const runRecursiveAction = (callback, initialValue, factor) => {
  let currentValue = initialValue;

  // Repeatedly calls the callback function, applying the updated value each time
  const step = () => {
    callback(currentValue);

    // Adjust the current value using the given factor to simulate progression (e.g., deceleration)
    currentValue *= factor;

    // Continue calling the function recursively as long as the value remains significant
    if (Math.abs(currentValue) > 0.1) {
      requestAnimationFrame(step);
    }
  };

  // Initiate the recursive action
  requestAnimationFrame(step);
};

export default runRecursiveAction;
