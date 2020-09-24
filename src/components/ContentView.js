import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, Grid, IconButton, ButtonGroup } from "@material-ui/core";
import Replay30Icon from "@material-ui/icons/Replay30";
import Forward30Icon from "@material-ui/icons/Forward30";
import { updateMetadata } from "./DB";
import AdobePdfViewer from "./AdobePDFView";
import ReactPDFView from "./ReactPDFView";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function ContentView({ id, title, type, source, position }) {
  const classes = useStyles();
  const viewerHeight = 0.7 * window.innerHeight;
  let viewerWidth = window.innerWidth;
  if (window.innerWidth > 480) {
    viewerWidth = 0.7 * window.innerWidth;
  }

  const [lastSavedPosition, setLastSavedPosition] = useState(position);

  const saveCurrentPosition = (position, totalLength) => {
    updateMetadata(id, { position, totalLength });
  };

  const onTimeUpdate = (event) => {
    const player = document.getElementById("player");
    if (player) {
      const currentTime = Math.floor(player.currentTime);
      const duration = Math.round(player.duration);
      if (currentTime !== lastSavedPosition) {
        setLastSavedPosition(currentTime);
        saveCurrentPosition(currentTime, duration);
      }
    }
  };

  const goBack = () => {
    const player = document.getElementById("player");
    player.currentTime -= 30;
  };
  const goForward = () => {
    const player = document.getElementById("player");
    player.currentTime += 30;
  };

  useEffect(() => {
    if (position) {
      const player = document.getElementById("player");
      if (player) {
        player.currentTime = position;
      }
    }
  }, [position]);

  let contentEl = <p>Loading content...</p>;

  if (type.toLowerCase().includes("pdf")) {
    contentEl = (
      <ReactPDFView
        fileUrl={source}
        // width={viewerWidth}
        height={viewerHeight}
        position={position}
        pageChange={saveCurrentPosition}
      />
    );
    // if (window.navigator.onLine) {
    //   contentEl = (
    //     <div style={{ height: viewerHeight + "px", width: viewerWidth + "px" }}>
    //       <AdobePdfViewer
    //         id={id}
    //         url={source}
    //         fileName={`${title}.pdf`}
    //         position={position}
    //         onPageChange={saveCurrentPosition}
    //       />
    //     </div>
    //   );
    // } else {
    //   contentEl = (
    //     <ReactPDFView
    //       fileUrl={source}
    //       width={viewerWidth}
    //       position={position}
    //       pageChange={saveCurrentPosition}
    //     />
    //   );
    // }
  } else if (type.toLowerCase().includes("youtube")) {
    const youtubeId = source.split("/").pop();
    contentEl = (
      <iframe
        id="player"
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
      <Grid container direction="column" justify="center" alignItems="center">
        <video
          id="player"
          width={viewerWidth}
          controls
          src={source}
          onTimeUpdate={onTimeUpdate}
        >
          Your browser does not support the video tag.
        </video>
        <ButtonGroup
          size="large"
          color="primary"
          aria-label="large outlined primary button group"
        >
          <IconButton color="primary" onClick={goBack}>
            <Replay30Icon />
          </IconButton>
          <IconButton color="primary" onClick={goForward}>
            <Forward30Icon />
          </IconButton>
        </ButtonGroup>
      </Grid>
    );
  } else if (type.toLowerCase().includes("audio")) {
    contentEl = (
      <Grid container direction="column" justify="center" alignItems="center">
        <audio id="player" src={source} controls onTimeUpdate={onTimeUpdate}>
          Your browser does not support the audio element.
        </audio>
        <ButtonGroup
          size="medium"
          color="primary"
          aria-label="large outlined primary button group"
        >
          <IconButton color="primary" onClick={goBack}>
            <Replay30Icon />
          </IconButton>
          <IconButton color="primary" onClick={goForward}>
            <Forward30Icon />
          </IconButton>
        </ButtonGroup>
      </Grid>
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
