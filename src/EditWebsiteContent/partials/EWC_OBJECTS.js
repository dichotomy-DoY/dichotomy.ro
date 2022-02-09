import React, { useState, useEffect } from "react";
import { Theme, createStyles, makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import {
  Button,
  TextField,
  Dialog,
  AppBar,
  Toolbar,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Select,
  MenuItem,
} from "@material-ui/core/";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { AgGridReact, AgGridColumn } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import firebase from "../../firebase";
import OBJECT__POPUP from "./OBJECT__POPUP";
import GROUP__POPUP from "./GROUP__POPUP";

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
export default () => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [groupOpen, setGroupOpen] = React.useState(false);
  const [reload, setReload] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [objectDetails, setObjectDetails] = useState({
    rowData: [],
    selectedRow: {},
  });
  const [isNewObject, setIsNewObject] = useState(true);

  const handleClickOpen = () => {
    setObjectDetails({ rowData, selectedRow: {} });
    setOpen(true);
  };

  const handleGroupClickOpen = () => {
    setObjectDetails({ rowData, selectedRow: {} });
    setGroupOpen(true);
  };

  useEffect(() => {
    firebase
      .database()
      .ref("websiteContent")
      .get()
      .then((snapshot) => {
        setRowData(snapshot.val().objects);
      });
  }, [open, groupOpen]);

  const saveOrderDetails = (updatedRowData) => {
    firebase
      .database()
      .ref("websiteContent/objects")
      .set(updatedRowData, (error) => {
        if (error) {
          alert("Error Occured");
        } else {
          console.log("Saved");
        }
      });
  };

  const BtnCellRenderer = (props) => {
    return (
      <DeleteIcon
        color="secondary"
        onClick={() => {
          let data = props.agGridReact.props.rowData;
          console.log(data);
          data = data.filter(
            (element) => element.objectId !== props.data.objectId
          );
          console.log(data);
          firebase
            .database()
            .ref("websiteContent/objects/")
            .set(data, (error) => {
              if (error) {
                alert("Error Occured");
              } else {
                //alert("Deleted");
                setRowData(data);
              }
            });
        }}
      />
    );
  };

  const FullWidthCellRenderer = (props) => {
    return (
      <h4
        style={{
          marginBlockStart: 0.8 + "em",
          marginBlockEnd: 0.8 + "em",
          marginInlineStart: 0.8 + "em",
        }}
      >
        {props.data.name}
      </h4>
    );
  };
  const gridOptions = {
    // enable sorting on 'name' and 'age' columns only
    columnDefs: [
      { field: "type", sortable: true, filter: true },
      { field: "name", sortable: true, filter: true, rowDrag: true },
      { field: "width", sortable: true, filter: true },
      { field: "height", sortable: true, filter: true },
      { field: "top", sortable: true, filter: true },
      { field: "left", sortable: true, filter: true },
      { field: "rotation", sortable: true, filter: true },
      { cellRenderer: "btnCellRenderer", minWidth: 150 },
    ],
    frameworkComponents: {
      btnCellRenderer: BtnCellRenderer,
      fullWidthCellRenderer: FullWidthCellRenderer,
    },

    // other grid options ...
  };

  const array_move = (collection, elementId, newIndex) => {
    const prevIndex = collection.findIndex((e) => e.objectId === elementId);
    const up = prevIndex > newIndex ? true : false; // is movement towards up

    let index = 0;

    return _.sortBy(collection, (element) => {
      if (newIndex === 0) {
        // move to the top
        return element.objectId === elementId ? 1 : 2;
      } else if (newIndex === collection.length - 1) {
        // move to the bottom
        return element.objectId === elementId ? 2 : 1;
      } else {
        if (element.objectId === elementId) {
          index++;
          return 2;
        }
        if (index < newIndex || (!up && index === newIndex)) {
          index++;
          return 1;
        } else {
          index++;
          return 3;
        }
      }
    });
  };

  const onRowDragEnd = (event) => {
    let movedNode = event.node;

    let movedData = movedNode.data;
    let toIndex = movedNode.rowIndex;

    console.log(rowData);

    // update rowOrderData array, state does not need to be updated
    let updatedRowData = array_move(rowData, movedData.objectId, toIndex);

    console.log(updatedRowData);

    // update state
    setRowData(updatedRowData);

    // update row order
    saveOrderDetails(updatedRowData);
  };

  return (
    <>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Add or Remove Objects</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div
            style={{
              display: "flex",
              width: "100%",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                flex: "1",
                justifyContent: "flex-end",
                alignItems: "center",
                margin: "15px 30px",
                marginTop: "-10px",
              }}
            >
              <Button
                style={{ marginRight: 1 + "em" }}
                variant="contained"
                onClick={handleGroupClickOpen}
              >
                + Create New Group
              </Button>
              <Button variant="contained" onClick={handleClickOpen}>
                + Add Object
              </Button>
            </div>
            <div
              className="ag-theme-alpine"
              style={{ height: "100vh", width: "100%" }}
            >
              <AgGridReact
                gridOptions={gridOptions}
                rowData={rowData}
                onRowDoubleClicked={(e) => {
                  setObjectDetails({ rowData, selectedRow: e.data });
                  setIsNewObject(false);
                  e.data.isGroup ? setGroupOpen(true) : setOpen(true);
                }}
                rowDragManaged={true}
                onRowDragEnd={onRowDragEnd}
                isFullWidthCell={(rowNode) => rowNode.data.isGroup}
                fullWidthCellRenderer="fullWidthCellRenderer"
              ></AgGridReact>
            </div>
          </div>
          <OBJECT__POPUP
            open={open}
            objectDetails={objectDetails}
            setObjectDetails={setObjectDetails}
            openMethod={setOpen}
            newObject={isNewObject}
            setIsNewObject={setIsNewObject}
          />
          <GROUP__POPUP
            open={groupOpen}
            objectDetails={objectDetails}
            setObjectDetails={setObjectDetails}
            openMethod={setGroupOpen}
            newObject={isNewObject}
            setIsNewObject={setIsNewObject}
          />
        </AccordionDetails>
      </Accordion>
    </>
  );
};
