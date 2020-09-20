import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import PropTypes from "prop-types";
import PDFIcon from "../assets/images/pdf.png";
import AudioIcon from "../assets/images/audio.png";
import VideoIcon from "../assets/images/video.png";
import { Link } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: 300,
  },
  media: {
    height: 140,
  },
}));

export default function ContentCard({ content }) {
  const classes = useStyles();

  //   const verbs = {
  //     pdf: "Read",
  //     audio: "Listen",
  //     video: "Watch",
  //   };
  const defaultThumbnails = {
    pdf: PDFIcon,
    audio: AudioIcon,
    video: VideoIcon,
  };
  return (
    <Card className={classes.root}>
      <CardActionArea component={Link} to={`/content/${content.id}`}>
        <CardMedia
          className={classes.media}
          image={content.thumbnail || defaultThumbnails[content.type]}
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {content.title}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

ContentCard.propTypes = {
  content: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    thumbnail: PropTypes.string,
    type: PropTypes.string.isRequired,
  }),
};
