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
  const [rowData, setRowData] = useState("");
  const [objectDetails, setObjectDetails] = useState({});
  const [isNewObject, setIsNewObject] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleGroupClickOpen = () => {
    setGroupOpen(true);
  };

  const putDataInOrder = (data) => {
    console.log(data);

    let sortedCollection = _.sortBy(data.objects, function (item) {
      return data.objectsOrder.indexOf(item.objectId);
    });

    return sortedCollection;
  };

  useEffect(() => {
    firebase
      .database()
      .ref("websiteContent")
      .get()
      .then((snapshot) => {
        let data = [];
        // for (let item in snapshot.val()) {
        //   data.push(snapshot.val()[item]);
        // }
        data = putDataInOrder(snapshot.val());

        //console.log(data);
        setRowData(data);
      });
  }, [open]);

  const BtnCellRenderer = (props) => {
    return (
      <DeleteIcon
        color="secondary"
        onClick={() => {
          firebase
            .database()
            .ref("websiteContent/objects/" + props.data.ref)
            .remove();
          alert(JSON.stringify(props.data));
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

  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  //const [rowData, setRowData] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);

    const updateData = (data) => params.api.setRowData(data);

    fetch("https://www.ag-grid.com/example-assets/olympic-winners.json")
      .then((resp) => resp.json())
      .then((data) => updateData(data));
  };

  const onRowDragEnd = (event) => {
    console.log(rowData);
    console.log(event);
    // var movingNode = event.node;
    // var overNode = event.overNode;
    // var rowNeedsToMove = movingNode !== overNode;
    // if (rowNeedsToMove) {
    //   var movingData = movingNode.data;
    //   var overData = overNode.data;
    //   var fromIndex = immutableStore.indexOf(movingData);
    //   var toIndex = immutableStore.indexOf(overData);
    //   var newStore = immutableStore.slice();
    //   moveInArray(newStore, fromIndex, toIndex);
    //   immutableStore = newStore;
    //   gridApi.setRowData(newStore);
    //   gridApi.clearFocusedCell();
    // }
    // function moveInArray(arr, fromIndex, toIndex) {
    //   var element = arr[fromIndex];
    //   arr.splice(fromIndex, 1);
    //   arr.splice(toIndex, 0, element);
    // }
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
              style={{ height: "65vh", width: "100%", maxWidth: "1200px" }}
            >
              <AgGridReact
                defaultColDef={{
                  width: 170,
                  sortable: true,
                  filter: true,
                }}
                rowDragManaged={true}
                rowDragMultiRow={true}
                rowSelection={"multiple"}
                animateRows={true}
                onGridReady={onGridReady}
                rowData={rowData}
              >
                <AgGridColumn field="athlete" rowDrag={true} />
                <AgGridColumn field="country" />
                <AgGridColumn field="year" width={100} />
                <AgGridColumn field="date" />
                <AgGridColumn field="sport" />
                <AgGridColumn field="gold" />
                <AgGridColumn field="silver" />
                <AgGridColumn field="bronze" />
              </AgGridReact>
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
