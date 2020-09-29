import React, { lazy, Suspense } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link, navigate } from "@reach/router";
import { Paper, Typography } from "@material-ui/core";

const renderLoader = () => <p>Loading...</p>;
const UserLibrary = lazy(() => import("../../components/UserLibrary"));
const HowDoesItWork = lazy(() => import("../../components/HowDoesItWork"));
const Dropzone = lazy(() => import("../../components/Dropzone"));

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  footer: {
    textAlign: "right",
    fontSize: "0.8rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    paddingTop: "1rem",
  },
}));

export default function Home({ helpShown, setHelpShown }) {
  const classes = useStyles();
  const openContent = (id) => {
    navigate(`/content/${id}`);
  };
  const handleHide = () => {
    setHelpShown(false);
    localStorage.setItem("firstTimeUser", 0);
  };
  return (
    <Suspense fallback={renderLoader()}>
      <div className={classes.root}>
        {helpShown && (
          <Paper>
            <HowDoesItWork handleHide={handleHide} />
          </Paper>
        )}
        <Dropzone />
        <UserLibrary openContent={openContent} />
        <Typography variant="body1" component="p" className={classes.footer}>
          Resumr lets you resume PDFs, audio & video from where you left off,
          across devices! <Link to="/help">Learn more</Link>.
        </Typography>
      </div>
    </Suspense>
  );
}
