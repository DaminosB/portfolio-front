const populateCardsIdsArray = (module) => {
  return module.mediaBlocks.flatMap((mediaBlock) =>
    mediaBlock.mediaAssets.map((mediaAsset) => {
      return `section-${module.id}-media-block-${mediaBlock.id}-media-asset-${mediaAsset.id}`;
    })
  );
};

export default populateCardsIdsArray;
