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
import { isUndefined } from "lodash";

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
  { name: "None", actionCode: 0 },
  { name: "Go to link", actionCode: 1 },
  { name: "Swap with another image", actionCode: 2 },
  { name: "Loop GIF once", actionCode: 3 },
  { name: "Replace GIF with GIF", actionCode: 4 }
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
  const [rotation, setRotation] = useState("0");
  const [onHoverScale, setOnHoverScale] = useState("1.25");
  const [imgUrl, setImgUrl] = useState("");
  const [clickActionObject, setClickActionObject] = useState({
    actionCode: 0,
    link: "",
    gifDuration: 0,
  });
  const [type, setType] = useState("Select Type");
  const [objectId, setObjectId] = useState("");

  useEffect(() => {
    setObjectId("");
    setName("");
    setWidth("");
    setHeight("");
    setTop("");
    setLeft("");
    setRotation("0");
    setOnHoverScale("1.25");
    setImgUrl("");
    setClickActionObject({
      actionCode: 0,
      link: "",
      gifDuration: 0,
    });
    setType("Select Type");
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
        setOnHoverScale(objectDetails.selectedRow.onHoverScale);
        setImgUrl(objectDetails.selectedRow.imgUrl);
        setClickActionObject(objectDetails.selectedRow.clickActionObject);
        setType(objectDetails.selectedRow.type);
      }
    }
  }, [open]);

  useEffect(() => {
    console.log(clickActionObject);
  }, [clickActionObject]);

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
      onHoverScale,
      imgUrl,
      clickActionObject,
    };

    if (isUndefined(objectDetails.selectedRow.objectId)) { // this is a new object
      objectDetails.rowData.push(updatedRow);
      objectDetails.selectedRow = updatedRow;
    } else {
      const changedObjectIndex = objectDetails.rowData.findIndex((element) => {
        return element.objectId === objectDetails.selectedRow.objectId;
      });
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
          //openMethod(false);
          //setObjectDetails({});
          //setIsNewObject(true);
        }
      });
  };

  const uploadImage = (file, actionCode) => {
    firebase
      .storage()
      .ref(`objects/${objectId}${actionCode !== 0 ? "-s" : ""}`)
      .put(file)
      .then((snapshot) => {
        alert("Object uploaded");
        firebase
          .storage()
          .ref(`objects/${objectId}${actionCode !== 0 ? "-s" : ""}`)
          .getDownloadURL()
          .then((url) => {
            actionCode !== 0
              ? setClickActionObject({ ...clickActionObject, link: url })
              : setImgUrl(url);
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
          required
          margin="dense"
          id="outlined-basic"
          label={"Rotation"}
          variant="outlined"
          value={rotation}
          onChange={(e) => setRotation(e.target.value)}
          className="ewc1--textInput"
        />
        <TextField
          required
          margin="dense"
          id="outlined-basic"
          label={"On Hover Scale"}
          variant="outlined"
          value={onHoverScale}
          onChange={(e) => setOnHoverScale(e.target.value)}
          className="ewc1--textInput"
        />
        <TextField
          required
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
            return "Select Action On Image Click";
          }}
          labelId="demo-simple-select-outlined-label"
          id="demo-simple-select-outlined"
          value="Select Action On Image Click"
          onChange={(e) => setClickActionObject({ actionCode: e.target.value })}
          autoWidth
        >
          {clickActionList.map((type) => (
            <MenuItem value={type.actionCode}>{type.name}</MenuItem>
          ))}
        </Select>
        <TextField
          style={{
            display: clickActionObject.actionCode === 1 ? "flex" : "none",
          }}
          margin="dense"
          id="outlined-basic"
          label={"Link to be redirected to"}
          variant="outlined"
          value={clickActionObject.link}
          onChange={(e) =>
            setClickActionObject({ ...clickActionObject, link: e.target.value })
          }
          className="ewc1--textInput"
        />
        <TextField
          style={{
            display: clickActionObject.actionCode === 2 ? "flex" : "none",
          }}
          required={clickActionObject.actionCode === 2}
          margin="dense"
          id="outlined-basic"
          label={"Image URL to be swapped with"}
          variant="outlined"
          value={clickActionObject.link}
          onChange={(e) =>
            setClickActionObject({ ...clickActionObject, link: e.target.value })
          }
          className="ewc1--textInput"
        />
        <TextField
          style={{
            display: clickActionObject.actionCode === 3 ? "flex" : "none",
          }}
          margin="dense"
          id="outlined-basic"
          label={"GIF First Frame URL"}
          variant="outlined"
          value={clickActionObject.link}
          onChange={(e) =>
            setClickActionObject({ ...clickActionObject, link: e.target.value })
          }
          className="ewc1--textInput"
        />
        <TextField
          style={{
            display: clickActionObject.actionCode === 3 ? "flex" : "none",
          }}
          margin="dense"
          id="outlined-basic"
          label={"GIF Duration"}
          variant="outlined"
          value={clickActionObject.gifDuration}
          onChange={(e) =>
            setClickActionObject({
              ...clickActionObject,
              gifDuration: e.target.value,
            })
          }
          className="ewc1--textInput"
        />
        <TextField
          style={{
            display: clickActionObject.actionCode === 4 ? "flex" : "none",
          }}
          required={clickActionObject.actionCode === 4}
          margin="dense"
          id="outlined-basic"
          label={"GIF URL to be swapped with"}
          variant="outlined"
          value={clickActionObject.link}
          onChange={(e) =>
            setClickActionObject({ ...clickActionObject, link: e.target.value })
          }
          className="ewc1--textInput"
        />
        <div
          style={{
            display: "flex",
          }}
        >
          <div>
            <h3>Upload Image</h3>
            <img
              src={imgUrl}
              style={{
                width: "125px",
                height: "125px",
                margin: "5px",
                objectFit: "cover",
                display: "block",
                backgroundColor: "black"
              }}
            />
            <input
              style={{
                justifySelf: "center",
              }}
              type="file"
              onChange={(e) => uploadImage(e.target.files[0], 0)}
            />
          </div>
          <div
            style={{
              display: clickActionObject.actionCode === 2 ? "block" : "none",
            }}
          >
            <h3>Upload image to be swapped with</h3>
            <img
              src={clickActionObject.link}
              style={{
                width: "125px",
                height: "125px",
                margin: "5px",
                objectFit: "cover",
                display: "block",
                backgroundColor: "black"
              }}
            />
            <input
              style={{
                justifySelf: "center",
              }}
              type="file"
              onChange={(e) => uploadImage(e.target.files[0], 2)}
            />
          </div>
          <div
            style={{
              display: clickActionObject.actionCode === 3 ? "block" : "none",
            }}
          >
            <h3>Upload GIF first frame</h3>
            <img
              src={clickActionObject.link}
              style={{
                width: "125px",
                height: "125px",
                margin: "5px",
                objectFit: "cover",
                display: "block",
                backgroundColor: "black"
              }}
            />
            <input
              style={{
                justifySelf: "center",
              }}
              type="file"
              onChange={(e) => uploadImage(e.target.files[0], 3)}
            />
          </div>
          <div
            style={{
              display: clickActionObject.actionCode === 4 ? "block" : "none",
            }}
          >
            <h3>Upload GIF to be swapped with</h3>
            <img
              src={clickActionObject.link}
              style={{
                width: "125px",
                height: "125px",
                margin: "5px",
                objectFit: "cover",
                display: "block",
                backgroundColor: "black"
              }}
            />
            <input
              style={{
                justifySelf: "center",
              }}
              type="file"
              onChange={(e) => uploadImage(e.target.files[0], 4)}
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};
