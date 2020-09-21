import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import PDFIcon from "../assets/images/pdf.png";
import AudioIcon from "../assets/images/audio.png";
import VideoIcon from "../assets/images/video.png";
import offline from "./OfflineStorage";
import { auth, rtdb } from "./Firebase";
import { navigate } from "@reach/router";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
  },
  media: {
    height: 140,
  },
}));

export default function PublicContentCard({ content }) {
  const classes = useStyles();
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const defaultThumbnails = {
    "application/pdf": PDFIcon,
    "audio/mp3": AudioIcon,
    "video/mp4": VideoIcon,
  };

  useEffect(() => {
    if (content.thumbnail) {
      if (content.thumbnail.startsWith("gs://")) {
        offline(content.thumbnail).then((url) => {
          setThumbnailUrl(url);
        });
      } else {
        setThumbnailUrl(content.thumbnail);
      }
    } else {
      setThumbnailUrl(defaultThumbnails[content.type]);
    }
  }, [content]);

  const addToLibrary = () => {
    const contentId = uuidv4();
    rtdb
      .ref(`users/${auth.currentUser.uid}/content/${contentId}`)
      .set(content)
      .then(() => {
        navigate(`/content/${contentId}`);
      });
  };

  return (
    <Card className={classes.root}>
      {thumbnailUrl && (
        <CardMedia
          className={classes.media}
          image={thumbnailUrl}
          title="Contemplative Reptile"
        />
      )}
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {content.title}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" color="primary" onClick={addToLibrary}>
          Add to Library
        </Button>
      </CardActions>
    </Card>
  );
}

PublicContentCard.propTypes = {
  content: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    type: PropTypes.string.isRequired,
    source: PropTypes.string,
  }),
};
