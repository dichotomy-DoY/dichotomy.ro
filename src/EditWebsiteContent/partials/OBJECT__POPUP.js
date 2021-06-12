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
export default ({
  open,
  newObject,
  objectDetails,
  openMethod,
  setObjectDetails,
  setIsNewObject,
}) => {
  console.log("Is New Object", newObject);
  console.log("Object Details", objectDetails);
  const classes = useStyles();
  const [reload, setReload] = useState(false);
  const [name, setName] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [top, setTop] = useState("");
  const [left, setLeft] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [type, setType] = useState("Select Type");
  const [objectId, setObjectId] = useState("");

  useEffect(() => {
    setObjectId("");
    setName("");
    setWidth("");
    setHeight("");
    setTop("");
    setLeft("");
    setImgUrl("");
    setType("Select Type");
    if (open) {
      if (newObject) {
        setObjectId(Date.now());
      } else {
        console.log("existing");
        setObjectId(objectDetails.objectId);
        setName(objectDetails.name);
        setWidth(objectDetails.width);
        setHeight(objectDetails.height);
        setTop(objectDetails.top);
        setLeft(objectDetails.left);
        setImgUrl(objectDetails.imgUrl);
        setType(objectDetails.type);
      }
    }
  }, [open]);

  const saveDetails = (e) => {
    firebase
      .database()
      .ref("websiteContent/objects/" + objectId)
      .set(
        {
          objectId,
          name,
          type,
          width,
          height,
          top,
          left,
          imgUrl,
        },
        (error) => {
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
        }
      );
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
            console.log(url);
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
          label={"Image URL"}
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
