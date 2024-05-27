"use client";

import styles from "./ProjectCardsWrapper.module.css";

// React hooks import
import { useEffect, useState } from "react";

// Components import
import TagsContainer from "../TagsContainer/TagsContainer";

// This component wraps the projects cards and handles the filters and hovering effects
const ThumbnailsWrapper = ({ style, cardsToDisplay, children }) => {
  // The active filter is the tag on which the viewer has clicked
  const [activeFilter, setActiveFilter] = useState(null);
  // When filled in, we only show projects that are paired with said tag

  // This state stores the tags of the project whose card is being hovered. It will be highlghted with the functions below
  const [filtersToHighlight, setFiltersToHighlight] = useState([]);

  // When the card is not being hovered anymore, we go back to normal
  const resetCardsOpacity = (cardsContainer) => {
    const cards = Array.from(cardsContainer.children);

    cards.map((card) => {
      card.classList.remove(styles.inactiveCard);
    });

    setFiltersToHighlight([]);
  };

  // This func is called when a project card is hovered. It fades the unhovered card and displays the cover of the hovered project
  const dimCardsOpacity = (index, cardsContainer) => {
    // index : Number. It's the position of the card in its parent

    // We start by creating an array of all the cards container inactive children
    const inactiveCards = Array.from(cardsContainer.children).filter(
      (card, i) => i !== index
    );

    inactiveCards.map((card) => {
      card.classList.add(styles.inactiveCard);
    });

    // If the card has any tag
    if (cardsToDisplay[index].tags.length > 0) {
      // We can can highlight the tags that are paired with the project
      // const activeCardTagsIdsList = projects[index].tags.map((tag) => tag.id);
      const activeCardTagsIdsList = cardsToDisplay[index].tags.map(
        (tag) => tag.id
      );

      setFiltersToHighlight(activeCardTagsIdsList);
    }
  };

  // This constant stores the list of tags that will be given to the TagsContainer component
  const tagsList = populateTagsList(cardsToDisplay);

  useEffect(() => {
    // We set the custom styles object
    const styleInputs = {
      gap: style.gap,
      elementsPerRow: style.thumbnailsPerRow,
    };

    // This variable counts the number of visible cards, as this number may vary according to the active filter
    let visibleCardsCounter = 0;

    // This loop checks if the given card should be visible and acts accordingly
    cardsToDisplay.forEach((card) => {
      // Let's call the card's DOM element
      const cardDivId = `project-card-${card.id}`;
      const cardDiv = document.getElementById(cardDivId);

      // This variable will decide if the card must be shown
      let showCard = false;

      if (!activeFilter) {
        // If no active filter, all cards must be visible
        showCard = true;
      } else if (card.tags.length > 0) {
        // If tags are attached to the card, we check if 1 of them is the activeFilter
        showCard = card.tags.some((tag) => tag.id === activeFilter);
      }

      if (showCard) {
        // If the card must be shown, we remove its class hidden and calculates it coordinates
        cardDiv.classList.remove("hidden");
        calcCoordinates(visibleCardsCounter, cardDiv, styleInputs);

        // We increment the counter
        visibleCardsCounter++;
      } else {
        // Otherwise, we set a class hidden on the card
        cardDiv.classList.add("hidden");
      }
    });

    // This is the direct parent of the wrapped projectCards
    const cardsContainer = document.getElementById("cards-container");

    // The next lines let us calculate and apply its height to the cardsContainer as all its children are in absolute positions
    const cardHeight = cardsContainer.children[0].offsetHeight;
    const numberOfChildren = Array.from(cardsContainer.children).length;
    const numberOfRows = Math.ceil(numberOfChildren / style.thumbnailsPerRow);
    const totalGapWidth = (numberOfRows - 1) * style.gap;

    const cardsContainerHeight = cardHeight * numberOfRows + totalGapWidth;

    cardsContainer.style.height = `${cardsContainerHeight}px`;

    // This array stores all the cards' DOM elements
    const projectCardsArray = Array.from(cardsContainer.children);

    // The next loop puts an event listener on each card DOM element
    projectCardsArray.forEach((thumbnail, index) => {
      const handleMouseenter = () => dimCardsOpacity(index, cardsContainer);
      thumbnail.addEventListener("mouseenter", handleMouseenter);

      const handleMousleave = () => resetCardsOpacity(cardsContainer);
      thumbnail.addEventListener("mouseleave", handleMousleave);
    });

    // And we cancel the event listeners
    return () => {
      projectCardsArray.forEach((thumbnail, index) => {
        const handleMouseenter = () => dimCardsOpacity(index, cardsContainer);
        thumbnail.removeEventListener("mouseenter", handleMouseenter);

        const handleMousleave = () => resetCardsOpacity(cardsContainer);
        thumbnail.removeEventListener("mouseleave", handleMousleave);
      });
    };
  }, [activeFilter]);

  return (
    <div className={styles.thumbnailsWrapper} id="thumbnails-wrapper">
      <TagsContainer
        tags={tagsList}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        style={style}
        filtersToHighlight={filtersToHighlight}
      />
      <div
        className={`${styles.cardsContainer} container`}
        id="cards-container"
      >
        {children}
      </div>
    </div>
  );
};

// This func populates the tags list that will be given to TagsContainer component
const populateTagsList = (cardsToDisplay) => {
  const response = [];

  // This loop will push the cards' tags into the response array
  cardsToDisplay.forEach((card) => {
    // First we check if the card has any tag
    if (card.tags.length > 0) {
      // If so, we check if any of them is already in the response array
      card.tags.forEach((tag) => {
        const isAlreadyInResponse = response.some(
          (entry) => entry.id === tag.id
        );

        // Then we push the new tag in teh response array
        if (!isAlreadyInResponse) response.push(tag);
      });
    }
  });

  return response;
};

// This func calculates and apply a card's absolute position
const calcCoordinates = (index, domElement, styleInputs) => {
  // index: Number. The position of the element in the projectsToDisplay array
  // domElement. The ProjectCards whose coordinates are going to be calculates
  // styleInputs: Object. Contains 2 keys that will be destructured

  const { elementsPerRow, gap } = styleInputs;
  // elementsPerRow: Number. The number of thumbnails per row the user wants to display (set up in the backoffice)
  // gap: Number. The gap in px between thumbnails the user wants to display (set up in the backoffice)

  // We begin by getting the CardProjects dimensions (all CardProject's must have the same, except the last one)
  const referenceCard = domElement.parentNode.children[0];

  const cardSize = {
    width: referenceCard.offsetWidth,
    height: referenceCard.offsetHeight,
  };

  // We can determine on which Row the card is displayed
  const rowIndex = Math.floor(index / elementsPerRow);

  // To get the columnIndex, we need to remove all the elements displayed on the previous rows from the current index
  const columnIndex = index - rowIndex * elementsPerRow;

  // This lets us calculate the coordinates of the card
  const topPosition = rowIndex * cardSize.height + rowIndex * gap;
  const leftPosition = columnIndex * cardSize.width + columnIndex * gap;

  // We apply them the card
  domElement.style.top = `${topPosition}px`;
  domElement.style.left = `${leftPosition}px`;
};

export default ThumbnailsWrapper;
