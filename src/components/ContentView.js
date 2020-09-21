import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, Grid } from "@material-ui/core";
import ReactPDFView from "./ReactPDFView";
import { auth, rtdb } from "./Firebase";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default function ContentView({ id, title, type, source, position }) {
  const classes = useStyles();
  const viewerHeight = window.innerHeight;
  let viewerWidth = window.innerWidth;
  const [lastSavedPosition, setLastSavedPosition] = useState(position);

  const saveCurrentPosition = (position, totalLength) => {
    rtdb.ref(`users/${auth.currentUser.uid}/content/${id}`).update({
      position: position,
      totalLength: totalLength,
      lastPlayed: new Date(),
    });
  };

  const onTimeUpdate = (event) => {
    const videoEl = document.getElementById(`video-${id}`);
    const audioEl = document.getElementById(`audio-${id}`);
    if (videoEl) {
      const currentTime = Math.floor(videoEl.currentTime);
      const duration = Math.round(videoEl.duration);
      if (currentTime !== lastSavedPosition) {
        setLastSavedPosition(currentTime);
        saveCurrentPosition(currentTime, duration);
      }
    } else if (audioEl) {
      const currentTime = Math.floor(audioEl.currentTime);
      const duration = Math.round(audioEl.duration);
      if (currentTime !== lastSavedPosition) {
        setLastSavedPosition(currentTime);
        saveCurrentPosition(currentTime, duration);
      }
    }
  };

  useEffect(() => {
    if (position) {
      const videoEl = document.getElementById(`video-${id}`);
      const audioEl = document.getElementById(`audio-${id}`);
      if (videoEl) {
        videoEl.currentTime = position;
      } else if (audioEl) {
        audioEl.currentTime = position;
      }
    }
  }, [position]);

  if (viewerWidth > 1024) {
    viewerWidth *= 0.7;
  }

  let contentEl = <p>Loading content...</p>;

  if (type.toLowerCase().includes("pdf")) {
    contentEl = (
      <ReactPDFView
        fileUrl={source}
        width={viewerWidth}
        position={position}
        pageChange={saveCurrentPosition}
      />
    );
  } else if (type.toLowerCase().includes("youtube")) {
    const youtubeId = source.split("/").pop();
    contentEl = (
      <iframe
        className="my-4"
        title={title}
        width={viewerWidth * 0.7}
        height={viewerHeight * 0.7}
        src={`https://www.youtube.com/embed/${youtubeId}`}
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  } else if (type.toLowerCase().includes("video")) {
    contentEl = (
      <video
        id={"video-" + id}
        width={viewerWidth}
        controls
        src={source}
        onTimeUpdate={onTimeUpdate}
      >
        Your browser does not support the video tag.
      </video>
    );
  } else if (type.toLowerCase().includes("audio")) {
    contentEl = (
      <audio
        id={"audio-" + id}
        src={source}
        controls
        onTimeUpdate={onTimeUpdate}
      >
        Your browser does not support the audio element.
      </audio>
    );
  }

  return (
    <Grid container classes={classes}>
      {contentEl}
    </Grid>
  );
}

ContentView.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  position: PropTypes.number,
};
