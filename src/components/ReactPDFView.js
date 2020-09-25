import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { pdfjs, Document, Outline, Page } from "react-pdf";
import { ButtonGroup, Button, Grid, makeStyles, Fade } from "@material-ui/core";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import Modal from "@material-ui/core/Modal";
import useEventListener from "./useEventListener";
import "../../node_modules/tocca/Tocca";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  navContainer: {
    position: "absolute",
    top: 0.8 * window.innerHeight,
    backgroundColor: "transparent",
  },
  zoomContainer: {
    position: "absolute",
    top: 5,
    backgroundColor: "transparent",
  },
  paper: {
    position: "absolute",
    width: "100vw",
    height: "auto",
    maxWidth: "none",
    maxHeight: "100vh",
    objectFit: "contain",
  },
  modal: {
    display: "flex",
    backgroundColor: theme.palette.background.dark,
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function ReactPDFView({
  fileUrl,
  width,
  height,
  position,
  pageChange,
}) {
  let classes = useStyles();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  // const [fadeTimer, setFadeTimer] = useState();
  const [pageScale, setPageScale] = useState(1);
  const [zoomScale, setZoomScale] = useState();
  const [pageWidth, setPageWidth] = useState(width);
  const [pageHeight, setPageHeight] = useState(height);
  const [showNav, setShowNav] = useState(true);
  const pdfRef = useRef(null);

  useEffect(() => {
    if (position) {
      setPageNumber(position);
    }
  }, [position]);

  const handleNextPage = (e) => {
    setShowNav(true);
    if (pageNumber < numPages) {
      const newPageNumber = pageNumber + 1;
      setPageNumber(newPageNumber);
      if (pageChange) pageChange(newPageNumber, numPages);
    }
  };

  const handlePrevPage = (e) => {
    setShowNav(true);
    if (pageNumber > 1) {
      const newPageNumber = pageNumber - 1;
      setPageNumber(newPageNumber);
      if (pageChange) pageChange(newPageNumber, numPages);
    }
  };

  const handleKeyDown = (e) => {
    const { key } = e;
    if (key === "ArrowRight") {
      handleNextPage(e);
    } else if (key === "ArrowLeft") {
      handlePrevPage(e);
    }
  };

  const handleMousemove = async (e) => {
    setShowNav(true);
  };

  useEffect(() => {
    // if (fadeTimer) {
    //   clearTimeout(fadeTimer);
    // }
    const timer = setTimeout(() => {
      setShowNav(false);
    }, 5000);
    // setFadeTimer(timer);
  }, [showNav]);

  useEventListener(document, "keydown", handleKeyDown);
  useEventListener(pdfRef, "swipeleft", handleNextPage);
  useEventListener(pdfRef, "swiperight", handlePrevPage);
  useEventListener(pdfRef, "mousemove", handleMousemove);

  const calcPageScale = () => {
    // console.log(pageWidth, width);
    // console.log(pageHeight, height);
    if (window.innerWidth <= 640) {
      return width / pageWidth;
    }
    if (pageWidth >= pageHeight) {
      // console.log(width / pageWidth);
      return width / pageWidth;
    } else {
      // console.log(height / pageHeight);
      return height / pageHeight;
    }
  };

  const zoomIn = () => {
    setShowNav(true);
    if (zoomScale) {
      setZoomScale(1.1 * zoomScale);
    } else {
      setZoomScale(1.1 * calcPageScale());
    }
  };

  const zoomOut = () => {
    setShowNav(true);
    if (zoomScale) {
      setZoomScale(zoomScale / 1.1);
    } else {
      setZoomScale(calcPageScale() / 1.1);
    }
  };
  const resetZoom = () => {
    setShowNav(true);
    setZoomScale(null);
  };

  function onDocumentLoadSuccess(pdf) {
    setNumPages(pdf.numPages);
  }

  function onPageLoadSuccess(page) {
    setPageWidth(page.originalWidth);
    setPageHeight(page.originalHeight);
  }

  function onItemClick({ pageNumber: itemPageNumber }) {
    setPageNumber(itemPageNumber);
  }

  const body = (
    <div ref={pdfRef}>
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          onLoadSuccess={onPageLoadSuccess}
          pageNumber={pageNumber || 1}
          renderAnnotationLayer={false}
          scale={zoomScale || calcPageScale()}
        />
        <Outline onItemClick={onItemClick} />
      </Document>
      <Fade in={showNav}>
        <Grid container justify="center" className={classes.zoomContainer}>
          <ButtonGroup variant="text">
            <Button onClick={zoomIn}>
              <ZoomInIcon />
            </Button>
            <Button onClick={resetZoom}>Reset</Button>
            <Button onClick={zoomOut}>
              <ZoomOutIcon />
            </Button>
          </ButtonGroup>
        </Grid>
      </Fade>
      <Fade in={showNav}>
        <Grid container justify="center" className={classes.navContainer}>
          {numPages && showNav && (
            <ButtonGroup size="medium" color="primary" variant="contained">
              <Button
                variant="contained"
                color="primary"
                onClick={handlePrevPage}
              >
                &lt;&lt; Prev
              </Button>
              <Button color="inherit">{`${pageNumber} of ${numPages}`}</Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextPage}
              >
                Next &gt;&gt;
              </Button>
            </ButtonGroup>
          )}
        </Grid>
      </Fade>
    </div>
  );

  return <div style={{ position: "relative" }}>{body}</div>;
}

ReactPDFView.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  pageChange: PropTypes.func,
};
