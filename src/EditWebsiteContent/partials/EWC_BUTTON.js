import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
  Switch,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
} from "@material-ui/core/";
import firebase from "../../firebase";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: "relative",
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  })
);

export default () => {
  const [width, set_width] = useState("");
  const [height, set_height] = useState("");
  const [top, set_top] = useState("");
  const [left, set_left] = useState("");
  const [hide, set_hide] = useState(false);

  const home = [
    {
      label: "width",
      value: width,
      method: set_width,
    },
    {
      label: "height",
      value: height,
      method: set_height,
    },
    {
      label: "top",
      value: top,
      method: set_top,
    },
    {
      label: "left",
      value: left,
      method: set_left,
    },
  ];

  const updateButtonDetails = () => {
    firebase
      .database()
      .ref("websiteContent/" + "button")
      .set({
        width,
        height,
        top,
        left,
        hide,
      });
  };

  useEffect(() => {
    firebase
      .database()
      .ref("websiteContent/" + "button")
      .get()
      .then((snapshot) => {
        set_hide(snapshot.val() ? snapshot.val()["hide"] : "");
        home.map((item) =>
          item.method(snapshot.val() ? snapshot.val()[item.label] : "")
        );
      });
  }, []);

  const classes = useStyles();

  return (
    <div
      style={{
        display: "flex",
        flex: "1",
        flexDirection: "column",
        width: "100%",
      }}
    >
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography className={classes.heading}>
            Button Size & Position
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
            }}
          >
            Hide Button:{" "}
            <Switch
              checked={hide}
              onChange={(e) => {
                set_hide(e.target.checked);
              }}
            />
            {home.map((item) => (
              <TextField
                margin="dense"
                id="outlined-basic"
                style={{ backgroundColor: "lightyellow" }}
                multiline
                rows={3}
                label={item.label}
                variant="outlined"
                value={item.value}
                onChange={(e) => item.method(e.target.value)}
                className="ewc1--textInput"
              />
            ))}
            <Button
              onClick={() => updateButtonDetails()}
              variant="contained"
              color="primary"
            >
              Update Button Size & Position
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
