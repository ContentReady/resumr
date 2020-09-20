import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import ContentCard from "./ContentCard";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
  },
  card: {
    height: 140,
    width: 100,
  },
  media: {
    height: 140,
  },
}));

export default function UserLibrary() {
  const [spacing, setSpacing] = useState(2);
  const [userContent, setUserContent] = useState([]);
  const classes = useStyles();
  //   setUserContent([
  //     {
  //       id: "1",
  //       thumbnail: "",
  //       title: "The Time Travel - HG Wells",
  //       type: "pdf",
  //     },
  //   ]);
  return (
    <Grid container className={classes.root} spacing={2}>
      <Grid item xs={12}>
        <Grid container justify="center" spacing={spacing}>
          {userContent.map((content) => (
            <Grid key={content.id} item>
              <ContentCard content={content} className={classes.card} />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
}
