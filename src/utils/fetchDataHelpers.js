const populateCoversBlock = (coversBlock) => {
  return coversBlock.map((coverItem) => ({
    ...coverItem,
    backgroundImage: coverItem.backgroundImage.data
      ? coverItem.backgroundImage.data.attributes
      : null,
    overlayImage: coverItem.overlayImage.data
      ? coverItem.overlayImage.data.attributes
      : null,
  }));
};

const populateModulesKey = (modules) => {
  return modules.map((module) => ({
    ...module,
    text: module.text
      ? {
          ...module.text,
          font: module.text.font.data
            ? {
                ...module.text.font.data.attributes,
                id: module.text.font.data.id,
              }
            : null,
        }
      : null,
    backgroundImage: module.backgroundImage?.data
      ? {
          ...module.backgroundImage.data.attributes,
          id: module.backgroundImage.data.id,
        }
      : null,
    mediaBlocks: module.mediaBlocks
      ? module.mediaBlocks.map((mediaBlock) => ({
          ...mediaBlock,
          mediaAssets: mediaBlock.mediaAssets.data.map((mediaAsset) => ({
            ...mediaAsset.attributes,
            addToCarousel: mediaBlock.addToCarousel,
            id: mediaAsset.id,
          })),
        }))
      : [],
  }));
};

export { populateCoversBlock, populateModulesKey };
