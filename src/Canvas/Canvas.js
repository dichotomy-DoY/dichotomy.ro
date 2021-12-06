import ReactDOM from "react-dom";
import React, { useEffect, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import "./Canvas.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import firebase from "../firebase";

const numbers = new Array(50).fill(1).map((_, index) => index + 1);
const rowStyle = {
  width: "300vw",
  height: "100vh",
  display: "flex",
};

let objectDataDB = [
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

const App = () => {
  const [rowData, setRowData] = useState([]);
  const [canvas_width, set_canvas_width] = useState("");
  const [canvas_height, set_canvas_height] = useState("");
  const [button_width, set_button_width] = useState("");
  const [button_height, set_button_height] = useState("");
  const [button_top, set_button_top] = useState("");
  const [button_left, set_button_left] = useState("");

  useEffect(() => {
    firebase
      .database()
      .ref("websiteContent/objects")
      .get()
      .then((snapshot) => {
        console.log(snapshot.val());
        let data = [];
        for (let item in snapshot.val()) {
          data.push(snapshot.val()[item]);
        }
        console.log(data);
        setRowData(data);
      });
    firebase
      .database()
      .ref("websiteContent/canvas")
      .get()
      .then((snapshot) => {
        console.log(snapshot.val());
        set_canvas_width(snapshot.val().canvas_width);
        set_canvas_height(snapshot.val().canvas_height);
      });
    firebase
      .database()
      .ref("websiteContent/button")
      .get()
      .then((snapshot) => {
        console.log(snapshot.val());
        set_button_width(snapshot.val().width);
        set_button_height(snapshot.val().height);
        set_button_top(snapshot.val().top);
        set_button_left(snapshot.val().left);
      });
  }, []);
  return (
    <div>
      <ScrollContainer className="container">
        <div>
          <h1>123</h1>
          <TransformWrapper
            defaultScale={1}
            wheel={{ step: 100 }}
            pan={{
              disabled: true,
            }}
            options={{
              minScale: 0.8,
              maxScale: 1,
            }}
          >
            <TransformComponent>
              <div
                style={{ width: canvas_width, height: canvas_height }}
                className="canvas__container"
              >
                {rowData.map((obj) => (
                  <>
                    {obj.type === "Image" ? (
                      <img
                        src={obj.imgUrl}
                        style={{
                          position: "absolute",
                          width: obj.width,
                          height: obj.height,
                          top: obj.top,
                          left: obj.left,
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      <video
                        src={obj.imgUrl}
                        style={{
                          position: "absolute",
                          width: obj.width,
                          height: obj.height,
                          top: obj.top,
                          left: obj.left,
                          objectFit: "cover",
                        }}
                        autoPlay
                        muted
                      />
                    )}

                    {/*
                    
                    Add custom components here
                    Add custom components here
                    Add custom components here  
                    
                    
                    */}
                  </>
                ))}
              </div>
              <VisitStore
                button_width={button_width}
                button_height={button_height}
                button_top={button_top}
                button_left={button_left}
              />
            </TransformComponent>
          </TransformWrapper>
        </div>
      </ScrollContainer>
    </div>
  );
};

export default App;

const VisitStore = ({
  button_width,
  button_height,
  button_top,
  button_left,
}) => {
  return (
    <div
      style={{
        position: "absolute",
        width: button_width,
        height: button_height,
        top: button_top,
        left: button_left,
      }}
    >
      <a href="/edit-website-content">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Visit Store
      </a>
    </div>
  );
};
