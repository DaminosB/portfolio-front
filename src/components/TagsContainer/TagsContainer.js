"use client";

import styles from "./TagsContainer.module.css";

const TagsContainer = ({
  tags,
  activeFilter,
  setActiveFilter,
  customStyle,
  filtersToHighlight,
}) => {
  const toggleFilter = (id) => {
    const isActiveFilter = activeFilter === id;

    if (isActiveFilter) {
      setActiveFilter(null);
    } else {
      const thumbnailsWrapper = document.getElementById("thumbnails-wrapper");
      thumbnailsWrapper.scrollIntoView({ behavior: "smooth" });
      setActiveFilter(id);
    }
  };

  const inlineStyle = {
    backgroundColor: customStyle.backgroundColor,
    color: customStyle.color,
  };

  return (
    <div className={`${styles.tagsContainer} container`}>
      {tags.map((tag) => {
        const isActiveFilter =
          activeFilter === tag.id ||
          filtersToHighlight.some((filter) => tag.id === filter);
        return (
          <button
            key={tag.id}
            style={inlineStyle}
            className={isActiveFilter ? styles.active : styles.inactive}
            onClick={() => toggleFilter(tag.id)}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
};

export default TagsContainer;
