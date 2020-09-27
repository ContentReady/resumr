import React, { useState, useEffect, lazy, Suspense } from "react";
import {
  Typography,
  makeStyles,
  CircularProgress,
  Grid,
  Paper,
  Fab,
} from "@material-ui/core";
import { getMetadataById, getFilebyId } from "./DB";
import HomeIcon from "@material-ui/icons/Home";
import { Link } from "@reach/router";

const renderLoader = () => <p>Loading...</p>;
const ContentView = lazy(() => import("./ContentView"));

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(0),
    textAlign: "center",
    color: theme.palette.text.secondary,
    elevation: 0,
  },
  fab: {
    position: "absolute",
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
}));

export default function ContentDetails({ id }) {
  const classes = useStyles();
  const [content, setContent] = useState({});
  const [sensibleUrl, setSensibleUrl] = useState("");
  useEffect(() => {
    if (id) {
      getMetadataById(id)
        .then((data) => {
          setContent(data);
          // Our hosted contentUrl will need to be:
          // 1. Publicly accessible OR
          // 2. Hosted on Firebase with a gs:// URL
          getFilebyId(id).then((blob) => {
            if (blob) {
              setSensibleUrl(window.URL.createObjectURL(blob));
            }
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, [id]);
  if (!content || !content.title) {
    return (
      <Grid container alignItems="center" justify="center">
        <CircularProgress />
      </Grid>
    );
  }
  return (
    <Suspense fallback={renderLoader()}>
      <Paper className={classes.paper} elevation={0}>
        {sensibleUrl ? (
          <ContentView
            id={id}
            title={content.title}
            type={content.type}
            position={content.position}
            source={sensibleUrl}
          />
        ) : (
          <Typography
            variant="h5"
            component="p"
            color="textSecondary"
            align="center"
          >
            Loading file...
          </Typography>
        )}
        <Typography
          color="textSecondary"
          variant="caption"
          component="h1"
          align="center"
          className={classes.heading}
        >
          {content.title}
        </Typography>
      </Paper>
      <Fab aria-label="home" className={classes.fab} component={Link} to="/">
        <HomeIcon />
      </Fab>
    </Suspense>
  );
}
