const populateMediasArray = (mediaBlocks) => {
  return mediaBlocks.filter((mediaBlock) => mediaBlock.addToCarousel);
};

export default populateMediasArray;
