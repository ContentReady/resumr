import React from "react";
import Dropzone from "../../components/Dropzone";
import UserLibrary from "../../components/UserLibrary";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

function Home() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Dropzone />
      <UserLibrary />
    </div>
  );
}

export default Home;
