import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Grid from "@material-ui/core/Grid";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import FlightTakeoffIcon from "@material-ui/icons/FlightTakeoff";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import { Link } from "@reach/router";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    maxWidth: 752,
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
}));

function ListItemA(props) {
  return <ListItem button component="a" {...props} />;
}

function ListItemLink(props) {
  return <ListItem button component={Link} {...props} />;
}

export default function Subscribe({ onClick }) {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={6}>
      <div className={classes.demo}>
        <List component="nav">
          <ListItemA href="https://imjo.in/f47GT8">
            <ListItemIcon>
              <AttachMoneyIcon />
            </ListItemIcon>
            <ListItemText
              primary="Subscribe for ₹299/y"
              secondary="No questions refund for 15 days."
            />
          </ListItemA>
          <ListItem button onClick={onClick}>
            <ListItemIcon>
              <FlightTakeoffIcon />
            </ListItemIcon>
            <ListItemText
              primary="Sign up"
              secondary="30 day trial. No card needed."
            />
          </ListItem>
          <ListItem button onClick={onClick}>
            <ListItemIcon>
              <VpnKeyIcon />
            </ListItemIcon>
            <ListItemText
              primary="Already a subscriber"
              secondary="Awesome! Welcome back :-)"
            />
          </ListItem>
        </List>
      </div>
    </Grid>
  );
}
