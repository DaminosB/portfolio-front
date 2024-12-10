// Calculate and update scrollbar metrics
const populateScrollbarMetrics = (scroller) => {
  const yOverflowRatio = scroller.scrollHeight / scroller.offsetHeight;
  const newThumbHeight = 100 / yOverflowRatio;

  const yScrollPosition = scroller.scrollTop;
  const maxYScrollPosition = scroller.scrollHeight - scroller.offsetHeight;
  const newYScrollProgress = yScrollPosition / maxYScrollPosition;

  return {
    thumbHeight: newThumbHeight,
    scrollProgress: newYScrollProgress,
  };
};

export default populateScrollbarMetrics;
