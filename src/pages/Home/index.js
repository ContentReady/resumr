import React from "react";
import Dropzone from "../../components/Dropzone";
import UserLibrary from "../../components/UserLibrary";
import { makeStyles } from "@material-ui/core/styles";
import { Link, navigate } from "@reach/router";
import { Typography } from "@material-ui/core";

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

function Home() {
  const classes = useStyles();
  const openContent = (id) => {
    navigate(`/content/${id}`);
  };
  return (
    <div className={classes.root}>
      <Dropzone />
      <UserLibrary openContent={openContent} />
      <Typography variant="body1" component="p" className={classes.footer}>
        Resumr lets you resume PDFs, audio & video from where you left off,
        across devices! <Link to="/help">Learn more</Link>.
      </Typography>
    </div>
  );
}

export default Home;
