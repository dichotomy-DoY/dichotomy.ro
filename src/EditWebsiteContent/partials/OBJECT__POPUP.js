import React, { useState, useEffect } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
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

let objectList = [
  {
    key: "a1",
    type: "image",
    width: "300px",
    height: "auto",
    top: "500px",
    left: "350px",
    url: "images/ca1.webp",
  },
  {
    key: "a2",
    type: "image",
    width: "300px",
    height: "350px",
    top: "10px",
    left: "350px",
    url: "images/ca1.webp",
  },
  {
    key: "a3",
    type: "image",
    width: "300px",
    height: "350px",
    top: "10px",
    left: "1000px",
    url: "images/ca1.webp",
  },
];
const typeList = [{ name: "Image" }, { name: "Video" }];
const clickActionList = [
  { name: "Go to link" },
  { name: "Swap with another image" },
];
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
  const [name, setName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [top, setTop] = useState("");
  const [left, setLeft] = useState("");
  const [rotation, setRotation] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [type, setType] = useState("Select Type");
  const [clickAction, setClickAction] = useState(
    "Select Action On Image Click"
  );
  const [objectId, setObjectId] = useState("");

  useEffect(() => {
    setObjectId("");
    setName("");
    setWidth("");
    setHeight("");
    setTop("");
    setLeft("");
    setRotation("");
    setImgUrl("");
    setType("Select Type");
    setClickAction("Select Action On Image Click");
    if (open) {
      if (newObject) {
        setObjectId(Date.now());
      } else {
        setObjectId(objectDetails.selectedRow.objectId);
        setName(objectDetails.selectedRow.name);
        setWidth(objectDetails.selectedRow.width);
        setHeight(objectDetails.selectedRow.height);
        setTop(objectDetails.selectedRow.top);
        setLeft(objectDetails.selectedRow.left);
        setRotation(objectDetails.selectedRow.rotation);
        setImgUrl(objectDetails.selectedRow.imgUrl);
        setType(objectDetails.selectedRow.type);
      }
    }
  }, [open]);

  const saveDetails = (e) => {
    const updatedRow = {
      objectId,
      name,
      type,
      width,
      height,
      top,
      left,
      rotation,
      imgUrl,
    };
    const changedObjectIndex = objectDetails.rowData.findIndex((element) => {
      return element.objectId === objectDetails.selectedRow.objectId;
    });
    if (changedObjectIndex === -1) {
      objectDetails.rowData.push(updatedRow);
    } else {
      objectDetails.rowData[changedObjectIndex] = updatedRow;
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

  const uploadImage = (file) => {
    firebase
      .storage()
      .ref("objects/" + objectId)
      .put(file)
      .then((snapshot) => {
        alert("Object uploaded");
        firebase
          .storage()
          .ref("objects/" + objectId)
          .getDownloadURL()
          .then((url) => {
            setImgUrl(url);
          })
          .catch((error) => {
            alert("error");
          });
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
              Add Key Project
            </Typography>
            <Button autoFocus color="inherit" onClick={(e) => saveDetails()}>
              Save
            </Button>
          </Toolbar>
        </AppBar>
        <Select
          margin="dense"
          style={{ margin: "10px", marginTop: "25px" }}
          displayEmpty={true}
          renderValue={() => {
            return type;
          }}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={type}
          onChange={(e) => setType(e.target.value)}
          autoWidth
        >
          {typeList.map((type) => (
            <MenuItem value={type.name}>{type.name}</MenuItem>
          ))}
        </Select>
        <TextField
          margin="dense"
          id="outlined-basic"
          label={"Name"}
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="ewc1--textInput"
        />
        <TextField
          margin="dense"
          id="outlined-basic"
          label={"Width"}
          variant="outlined"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          className="ewc1--textInput"
        />
        <TextField
          margin="dense"
          id="outlined-basic"
          label={"Height"}
          variant="outlined"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          className="ewc1--textInput"
        />
        <TextField
          margin="dense"
          id="outlined-basic"
          label={"Top"}
          variant="outlined"
          value={top}
          onChange={(e) => setTop(e.target.value)}
          className="ewc1--textInput"
        />
        <TextField
          margin="dense"
          id="outlined-basic"
          label={"Left"}
          variant="outlined"
          value={left}
          onChange={(e) => setLeft(e.target.value)}
          className="ewc1--textInput"
        />
        <TextField
          margin="dense"
          id="outlined-basic"
          label={"Rotation"}
          variant="outlined"
          value={rotation}
          onChange={(e) => setRotation(e.target.value)}
          className="ewc1--textInput"
        />
        <TextField
          margin="dense"
          id="outlined-basic"
          label={"Image URL"}
          variant="outlined"
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
          className="ewc1--textInput"
        />
        <Select
          margin="dense"
          style={{ margin: "10px", marginTop: "25px" }}
          displayEmpty={true}
          renderValue={() => {
            return clickAction;
          }}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value={clickAction}
          onChange={(e) => setClickAction(e.target.value)}
          autoWidth
        >
          {clickActionList.map((type) => (
            <MenuItem value={type.name}>{type.name}</MenuItem>
          ))}
        </Select>
        <TextField
          style={{
            display: clickAction.actionId === "Go to link" ? "block" : "none",
          }}
          margin="dense"
          id="outlined-basic"
          label={"Go to link"}
          variant="outlined"
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
          className="ewc1--textInput"
        />
        <TextField
          style={{
            display:
              clickAction.actionId === "Swap with another image"
                ? "block"
                : "none",
          }}
          margin="dense"
          id="outlined-basic"
          label={"Swap with another image"}
          variant="outlined"
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
          className="ewc1--textInput"
        />
        <h3>Upload Image</h3>
        <img
          src={imgUrl}
          style={{
            width: "125px",
            height: "125px",
            margin: "5px",
            objectFit: "cover",
          }}
        />
        <input
          style={{
            justifySelf: "center",
          }}
          type="file"
          onChange={(e) => uploadImage(e.target.files[0])}
        />
      </Dialog>
    </>
  );
};
