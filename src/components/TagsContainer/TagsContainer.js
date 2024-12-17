"use client";

import styles from "./TagsContainer.module.css";

import { useState } from "react";

import generateRGBAString from "@/utils/generateRGBAString";

const TagsContainer = ({
  tags,
  activeFilter,
  setActiveFilter,
  customColors,
  activeCard,
}) => {
  const [isHovered, setIsHovered] = useState([]);
  const toggleFilter = (id) => {
    const isActiveFilter = activeFilter === id;

    if (isActiveFilter) setActiveFilter(null);
    else setActiveFilter(id);
  };

  const mainColorStringStrong = generateRGBAString(customColors.mainColor, 1);
  const mainColorStringLight = generateRGBAString(customColors.mainColor, 0.5);

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
          color: customColors.secondaryColor,
        };

        const handleHoverEvent = (e) => {
          const newTab = [...isHovered];

          switch (e.type) {
            case "pointerenter":
              if (e.pointerType === "mouse") newTab[i] = true;
              break;

            case "pointerleave":
              if (e.pointerType === "mouse") newTab[i] = false;
              break;

            default:
              break;
          }

          setIsHovered(newTab);
        };

        return (
          <button
            key={tag.id}
            style={inlineStyle}
            onClick={() => toggleFilter(tag.id)}
            onPointerEnter={handleHoverEvent}
            onPointerLeave={handleHoverEvent}
          >
            {tag.name}
          </button>
        );
      })}
    </div>
  );
};

export default TagsContainer;
