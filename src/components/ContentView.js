import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core";
import ReactPDFView from "./ReactPDFView";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
  },
}));

export default function ContentView({ title, type, source }) {
  const classes = useStyles();
  const viewerHeight = window.innerHeight;
  let viewerWidth = window.innerWidth;

  if (viewerWidth > 1024) {
    viewerWidth *= 0.7;
  }

  if (type.toLowerCase().includes("pdf")) {
    // Load PDF Viewer
    return (
      <>
        <div className={classes.container}>
          <ReactPDFView fileUrl={source} width={viewerWidth} />
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
      <div className="flex shadow-lg mb-3 justify-center items-center">
        <video
          className="my-4"
          width={viewerWidth}
          height={viewerHeight}
          controls
          src={source}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (type.toLowerCase().includes("audio")) {
    // Load HTML5 Audio
    return (
      <div
        className="flex shadow-lg mb-3 justify-center items-center"
        style={{
          height: `${viewerHeight}px`,
        }}
      >
        <audio controls>
          <source src={source} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  if (type.toLowerCase().includes("x3d")) {
    return (
      <div
        className="flex shadow-lg mb-3 justify-center items-center"
        style={{
          height: `${viewerHeight}px`,
        }}
        onClick={() => {
          window.x3dom.reload();
        }}
      >
        <x3d width={viewerWidth} height={viewerHeight}>
          <scene>
            <inline url={source}> </inline>
          </scene>
        </x3d>
      </div>
    );
  }

  return (
    <div className="flex-1 shadow-lg mr-3 mb-4" style={{ height: "410px" }}>
      <p>Unknown content.</p>
    </div>
  );
}

ContentView.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
};
