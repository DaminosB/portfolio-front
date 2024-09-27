"use client";

import styles from "./TagsContainer.module.css";

import { useState } from "react";

import generateRGBAString from "@/utils/generateRGBAString";

const TagsContainer = ({
  tags,
  activeFilter,
  setActiveFilter,
  customStyle,
  activeCard,
}) => {
  const [isHovered, setIsHovered] = useState([]);
  const toggleFilter = (id) => {
    const isActiveFilter = activeFilter === id;

    if (isActiveFilter) setActiveFilter(null);
    else setActiveFilter(id);
  };

  const mainColorStringStrong = generateRGBAString(
    customStyle.backgroundColor,
    1
  );
  const mainColorStringLight = generateRGBAString(
    customStyle.backgroundColor,
    0.5
  );

  return (
    <div className={`${styles.tagsContainer} container`}>
      {tags.map((tag, i) => {
        const isActiveFilter = activeFilter === tag.id;

        const isTagInActiveCard = activeCard?.tags.some(
          (activeCardTags) => activeCardTags.id === tag.id
        );

        const highlightButton =
          isHovered[i] || isActiveFilter || isTagInActiveCard;

        const inlineStyle = {
          backgroundColor: highlightButton
            ? mainColorStringStrong
            : mainColorStringLight,
          color: customStyle.color,
        };

        const handleHoverEvent = (e) => {
          const newTab = [...isHovered];
          newTab[i] = e.type === "mouseenter" ? true : false;

          setIsHovered(newTab);
        };

        return (
          <button
            key={tag.id}
            style={inlineStyle}
            onClick={() => toggleFilter(tag.id)}
            onMouseEnter={handleHoverEvent}
            onMouseLeave={handleHoverEvent}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
};

export default TagsContainer;
