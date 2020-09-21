import React from "react";
import Dropzone from "../../components/Dropzone";
import UserLibrary from "../../components/UserLibrary";
import { makeStyles } from "@material-ui/core/styles";
// import Modal from "@material-ui/core/Modal";
import { navigate } from "@reach/router";
// import ContentDetails from "../../components/ContentDetails";

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
}));

// function getModalStyle() {
//   const top = 500;
//   const left = 50;

//   return {
//     top: `${top}%`,
//     left: `${left}%`,
//     transform: `translate(-${top}%, -${left}%)`,
//   };
// }

function Home() {
  const classes = useStyles();
  // const [modalStyle] = React.useState(getModalStyle);
  // const [open, setOpen] = React.useState(false);
  // const [contentId, setContentId] = React.useState();
  // const handleOpen = () => {
  //   setOpen(true);
  // };

  // const handleClose = () => {
  //   setOpen(false);
  // };
  const openContent = (id) => {
    // setContentId(id);
    // handleOpen();
    navigate(`/content/${id}`);
  };
  return (
    <div className={classes.root}>
      <Dropzone />
      <UserLibrary openContent={openContent} />
      {/* <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {contentId && <ContentDetails id={contentId} />}
      </Modal> */}
    </div>
  );
}

export default Home;
