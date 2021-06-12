import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import {
  Button,
  TextField,
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
  const [canvas_width, set_canvas_width] = useState("");
  const [canvas_height, set_canvas_height] = useState("");

  const home = [
    {
      label: "canvas_width",
      value: canvas_width,
      method: set_canvas_width,
    },
    {
      label: "canvas_height",
      value: canvas_height,
      method: set_canvas_height,
    },
  ];

  const updateCanvasDetails = () => {
    firebase
      .database()
      .ref("websiteContent/" + "canvas")
      .set({
        canvas_width,
        canvas_height,
      });
  };

  useEffect(() => {
    firebase
      .database()
      .ref("websiteContent/" + "canvas")
      .get()
      .then((snapshot) => {
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
          <Typography className={classes.heading}>Canvas Size</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
            }}
          >
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
              onClick={() => updateCanvasDetails()}
              variant="contained"
              color="primary"
            >
              Update Canvas Size
            </Button>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
