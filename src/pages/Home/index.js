import React from "react";
import Dropzone from "../../components/Dropzone";
import UserLibrary from "../../components/UserLibrary";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { navigate } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
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
    </div>
  );
}

export default Home;
