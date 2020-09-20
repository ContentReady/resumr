import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import PublicContentCard from "./PublicContentCard";
import { db } from "./Firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: "center",
  },
  card: {
    height: 140,
    width: 100,
  },
  media: {
    height: 140,
  },
}));

export default function PublicLibrary() {
  const classes = useStyles();
  const [spacing, setSpacing] = useState(2);
  const [publicContent, setPublicContent] = useState([]);
  useEffect(() => {
    if (publicContent.length) {
      return;
    }
    db.collection("public")
      .get()
      .then((querySnapshot) => {
        const contentArray = [];
        querySnapshot.forEach((doc) => {
          const obj = doc.data();
          obj["id"] = doc.id;
          contentArray.push(obj);
        });
        setPublicContent(contentArray);
      })
      .catch((e) => {
        console.error(e);
      });
  });
  return (
    <>
      <Typography className={classes.root} variant="h3" component="h2">
        Free Downloads
      </Typography>
      <Grid container className={classes.root} spacing={2}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={spacing}>
            {publicContent.map((content) => (
              <Grid key={content.id} item>
                <PublicContentCard content={content} className={classes.card} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
