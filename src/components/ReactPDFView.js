import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { pdfjs, Document, Page } from "react-pdf";
import { ButtonGroup, Button, Grid, makeStyles, Fade } from "@material-ui/core";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import FullscreenExitIcon from "@material-ui/icons/FullscreenExit";
import Modal from "@material-ui/core/Modal";
import useEventListener from "./useEventListener";
import "../../node_modules/tocca/Tocca";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

const useStyles = makeStyles((theme) => ({
  btnContainer: {
    position: "absolute",
    bottom: 5,
    backgroundColor: "transparent",
  },
  maxBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    borderRadius: "unset",
    "&:hover": {
      backgroundColor: theme.palette.background.default,
      color: theme.palette.text.primary,
    },
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

export default function ReactPDFView({ fileUrl, width }) {
  const classes = useStyles();
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const [newWidth, setNewWidth] = useState(width);
  const [showNav, setShowNav] = useState(true);
  const pdfRef = useRef(null);

  const handleFullscreenMode = () => {
    setOpen(!open);
  };

  const handleWidth = () => {
    if (open) {
      setNewWidth(window.innerWidth);
    } else {
      setNewWidth(window.innerWidth);

      if (window.innerWidth > 1024) {
        setNewWidth(window.innerWidth * 0.7);
      }
    }
  };

  const handleNextPage = (e) => {
    if (pageNumber < numPages) {
      setPageNumber(pageNumber + 1);
    }
  };

  const handlePrevPage = (e) => {
    if (pageNumber > 1) {
      setPageNumber(pageNumber - 1);
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
    const timer = setTimeout(() => {
      setShowNav(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [showNav]);

  useEventListener(window, "resize", handleWidth);
  useEventListener(document, "keydown", handleKeyDown);
  useEventListener(pdfRef, "swipeleft", handleNextPage);
  useEventListener(pdfRef, "swiperight", handlePrevPage);
  useEventListener(pdfRef, "mousemove", handleMousemove);

  useEffect(() => {
    handleWidth();
  }, [open]);

  const handleClose = () => {
    setOpen(false);
  };

  function onDocumentLoadSuccess({ numPages: pages }) {
    setNumPages(pages);
  }

  const body = (
    <div ref={pdfRef}>
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess}>
        <Page
          pageNumber={pageNumber}
          renderAnnotationLayer={false}
          renderMode="svg"
          width={newWidth}
        />
      </Document>
      <Button className={classes.maxBtn} onClick={handleFullscreenMode}>
        {open ? <FullscreenExitIcon /> : <FullscreenIcon />}
      </Button>
      <Fade in={showNav}>
        <Grid container justify="center" className={classes.btnContainer}>
          {numPages && showNav && (
            <ButtonGroup size="large" color="primary" variant="contained">
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

  if (!open) {
    return <div style={{ position: "relative" }}>{body}</div>;
  }

  if (open) {
    return (
      <>
        <Modal
          className={classes.modal}
          open={open}
          onClose={handleClose}
          disableBackdropClick
        >
          <div className={classes.paper}>{body}</div>
        </Modal>
      </>
    );
  }
}

ReactPDFView.propTypes = {
  fileUrl: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
};
