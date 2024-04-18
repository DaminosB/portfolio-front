"use client";

import styles from "./TagsContainer.module.css";

const TagsContainer = ({
  tags,
  activeFilter,
  setActiveFilter,
  style,
  filtersToHighlight,
}) => {
  const toggleFilter = (id) => {
    const isActiveFilter = activeFilter === id;

    if (isActiveFilter) setActiveFilter(null);
    else setActiveFilter(id);

    console.log(isActiveFilter);
  };

  const customStyles = {
    backgroundColor: style.defaultBackgroundColor,
    color: style.defaultFontColor,
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
            style={customStyles}
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
