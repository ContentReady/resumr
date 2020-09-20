import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import ContentCard from "./ContentCard";
import { db, auth } from "./Firebase";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    paddingTop: 20,
    paddingBottom: 20,
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

export default function UserLibrary() {
  const [spacing, setSpacing] = useState(2);
  const [userContent, setUserContent] = useState([]);
  const classes = useStyles();
  useEffect(() => {
    if (userContent.length) {
      return;
    }
    db.collection("users")
      .doc(auth.currentUser.uid)
      .collection("content")
      .get()
      .then((querySnapshot) => {
        const contentArray = [];
        querySnapshot.forEach((doc) => {
          const obj = doc.data();
          obj["id"] = doc.id;
          contentArray.push(obj);
        });
        setUserContent(contentArray);
      })
      .catch((e) => {
        console.error(e);
      });
  });
  return (
    <>
      <Typography className={classes.root} variant="h3" component="h2">
        Your Uploads
      </Typography>
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
    </>
  );
}
