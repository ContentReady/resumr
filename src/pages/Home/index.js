import React from "react";
import PublicLibrary from "../../components/PublicLibrary";
import Dropzone from "../../components/Dropzone";
import UserLibrary from "../../components/UserLibrary";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { Typography } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
}));

function Home() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className={classes.paper} elevation={0}>
            <Dropzone />
          </Paper>
        </Grid>
        <UserLibrary />
        <PublicLibrary />
      </Grid>
    </div>
  );
}

export default Home;
