import React, { useEffect, useState } from "react";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import {
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

  const uploadJSONConfig = (file, isMobileConfiguration) => {
    firebase
      .storage()
      .ref(`particles-configuration/${isMobileConfiguration ? 'particles-mobile.json' : 'particles-desktop.json'}`)
      .put(file)
      .then((snapshot) => {
        alert(`Particles configuration for ${isMobileConfiguration ? 'mobile screens' : 'desktop screens'} updated`);
      });
  };

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
            Particles Configuration
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
            Particles desktop configuration
            <input
              style={{
                justifySelf: "center",
                marginBottom: "20px"
              }}
              type="file"
              onChange={(e) => uploadJSONConfig(e.target.files[0], false)}
            />
            Particles mobile configuration
            <input
              style={{
                justifySelf: "center",
                marginBottom: "20px"
              }}
              type="file"
              onChange={(e) => uploadJSONConfig(e.target.files[0], true)}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
