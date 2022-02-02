import React, { useState, useEffect } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import {
  Button,
  TextField,
  Dialog,
  AppBar,
  Toolbar,
  Typography,
  Select,
  MenuItem,
} from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
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
export default ({
  open,
  newObject,
  objectDetails,
  openMethod,
  setObjectDetails,
  setIsNewObject,
}) => {
  const classes = useStyles();
  const [reload, setReload] = useState(false);
  const [objectId, setObjectId] = useState("");
  const isGroup = true;
  const [name, setName] = useState("");

  useEffect(() => {
    setObjectId("");
    setName("");
    if (open) {
      if (newObject) {
        setObjectId(Date.now());
      } else {
        setObjectId(objectDetails.selectedRow.objectId);
        setName(objectDetails.selectedRow.name);
      }
    }
  }, [open]);

  const deleteGroup = () => {
    let data = objectDetails.rowData;
    data = data.filter(
      (element) => element.objectId !== objectDetails.selectedRow.objectId
    );
    firebase
      .database()
      .ref("websiteContent/objects/")
      .set(data, (error) => {
        if (error) {
          alert("Error Occured");
          openMethod(false);
          setObjectDetails({});
          setIsNewObject(true);
        } else {
          alert("Deleted");
          setReload(!reload);
          openMethod(false);
          setObjectDetails({});
          setIsNewObject(true);
        }
      });
  };

  const saveDetails = (e) => {
    const updatedGroup = {
      objectId,
      isGroup,
      name,
    };
    const changedObjectIndex = objectDetails.rowData.findIndex(
      (element) => element.objectId === objectDetails.selectedRow.objectId
    );
    if (changedObjectIndex === -1) {
      objectDetails.rowData.push(updatedGroup);
    } else {
      objectDetails.rowData[changedObjectIndex] = updatedGroup;
    }

    firebase
      .database()
      .ref("websiteContent/objects/")
      .set(objectDetails.rowData, (error) => {
        if (error) {
          alert("Error Occured");
          openMethod(false);
          setObjectDetails({});
          setIsNewObject(true);
        } else {
          alert("Saved");
          setReload(!reload);
          openMethod(false);
          setObjectDetails({});
          setIsNewObject(true);
        }
      });
  };

  return (
    <>
      <Dialog fullScreen open={open}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                openMethod(false);
                setObjectDetails({});
                setIsNewObject(true);
              }}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Add New Group
            </Typography>
            <Button
              style={{
                display: _.isEmpty(objectDetails.selectedRow)
                  ? "none"
                  : "block",
              }}
              autoFocus
              color="inherit"
              onClick={(e) => deleteGroup()}
            >
              Delete Group
            </Button>
            <Button autoFocus color="inherit" onClick={(e) => saveDetails()}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <TextField
          required
          margin="dense"
          id="outlined-basic"
          label={"Name"}
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="ewc1--textInput"
        />
      </Dialog>
    </>
  );
};
