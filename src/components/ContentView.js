import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, Grid } from "@material-ui/core";
import ReactPDFView from "./ReactPDFView";
import { auth, db } from "./Firebase";

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

  const saveCurrentPosition = (position) => {
    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("content")
      .doc(id)
      .update({
        position,
      });
  };

  const onTimeUpdate = (event) => {
    const videoEl = document.getElementById(`video-${id}`);
    const audioEl = document.getElementById(`audio-${id}`);
    if (videoEl) {
      const currentTime = Math.floor(videoEl.currentTime);
      if (currentTime !== lastSavedPosition) {
        setLastSavedPosition(currentTime);
        saveCurrentPosition(currentTime);
      }
    } else if (audioEl) {
      const currentTime = Math.floor(audioEl.currentTime);
      if (currentTime !== lastSavedPosition) {
        setLastSavedPosition(currentTime);
        saveCurrentPosition(currentTime);
      }
    }
  };

  useEffect(() => {
    if (position) {
      const videoEl = document.getElementById(`video-${id}`);
      const audioEl = document.getElementById(`audio-${id}`);
      if (videoEl) {
        videoEl.currentTime = lastSavedPosition;
      } else if (audioEl) {
        audioEl.currentTime = lastSavedPosition;
      }
    }
  }, [position]);

  if (viewerWidth > 1024) {
    viewerWidth *= 0.7;
  }

  if (type.toLowerCase().includes("pdf")) {
    // Load PDF Viewer
    return (
      <>
        <div className={classes.container}>
          <ReactPDFView
            fileUrl={source}
            width={viewerWidth}
            position={position}
            pageChange={saveCurrentPosition}
          />
        </div>
      </>
    );
  }

  if (type.toLowerCase().includes("youtube")) {
    const youtubeId = source.split("/").pop();
    // Load Youtube Embed
    return (
      <div className={classes.container}>
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
      </div>
    );
  }

  if (type.toLowerCase().includes("video")) {
    // Load HTML5 Video
    return (
      <Grid container alignItems="center" justify="center">
        <video
          id={"video-" + id}
          width={viewerWidth}
          controls
          src={source}
          onTimeUpdate={onTimeUpdate}
        >
          Your browser does not support the video tag.
        </video>
      </Grid>
    );
  }

  if (type.toLowerCase().includes("audio")) {
    // Load HTML5 Audio
    return (
      <Grid container alignItems="center" justify="center">
        <audio
          id={"audio-" + id}
          width={viewerWidth}
          src={source}
          controls
          onTimeUpdate={onTimeUpdate}
        >
          Your browser does not support the audio element.
        </audio>
      </Grid>
    );
  }

  return (
    <div className="flex-1 shadow-lg mr-3 mb-4" style={{ height: "410px" }}>
      <p>Unknown content.</p>
    </div>
  );
}

ContentView.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  position: PropTypes.number,
};
