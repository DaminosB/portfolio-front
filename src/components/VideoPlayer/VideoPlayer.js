"use client";

import { useState, useRef } from "react";

import styles from "./VideoPlayer.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay } from "@fortawesome/free-solid-svg-icons";

const VideoPlayer = ({ children, video, customColors }) => {
  const [videoStatus, setVideoStatus] = useState("inactive");

  const videoPlayerRef = useRef(null);

  const buttonId = `video-player-button-${video.id}`;

  const buttonStyle = {
    color: customColors.fontColor,
  };

  const enableVideoPlayer = () => {
    setVideoStatus("active");
    videoPlayerRef.current.play();
  };

  const disableVideoPlayer = () => {
    setVideoStatus("inactive");
    customButtonColors("disengage", customColors, buttonId);
  };

  const handleMouseEvents = (event) => {
    switch (event.type) {
      case "mouseenter":
        customButtonColors("engage", customColors, buttonId);

        break;
      case "mouseleave":
        customButtonColors("disengage", customColors, buttonId);

        break;

      default:
        break;
    }
  };

  return (
    <div className={styles.videoWrapper}>
      <div className={videoStatus === "active" ? "hidden" : ""}>
        <button
          style={buttonStyle}
          id={buttonId}
          //   id={`video-player-button-${video.id}`}
          //   style={buttonStyle}
          onMouseEnter={handleMouseEvents}
          onMouseLeave={handleMouseEvents}
          onClick={enableVideoPlayer}
        >
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <img src={video.caption} alt="" />
      </div>
      <video
        autoPlay={videoStatus === "active" ? true : false}
        ref={videoPlayerRef}
        className={styles.videoPlayer}
        controls
        preload="metadata"
        onEnded={disableVideoPlayer}
      >
        {children}
      </video>
    </div>
  );
};

const customButtonColors = (scenario, customColors, buttonId) => {
  const { themeColor, fontColor } = customColors;

  const buttonNode = document.getElementById(buttonId);

  console.log(document);

  if (scenario === "engage") buttonNode.style.color = themeColor;
  else if (scenario === "disengage") buttonNode.style.color = fontColor;
};

export default VideoPlayer;
