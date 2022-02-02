import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollContainer from "react-indiana-drag-scroll";
import "./Canvas.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import firebase from "../firebase";
import Image from "../Image/Image";
import loadingGIF from "./loading.gif";

const App = () => {
  let numberOfResourcesLoaded = 0;
  const [totalResourcesToBeLoaded, setTotalResourcesToBeLoaded] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [rowData, setRowData] = useState([]);
  const [canvasScale, setCanvasScale] = useState(0);
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
        let data = snapshot.val();

        setTotalResourcesToBeLoaded(
          data.reduce((sum, value) => {
            if (value.imgUrl) {
              return sum + 1;
            } else {
              return sum;
            }
          }, 0)
        );
        setRowData(data);
      });
    firebase
      .database()
      .ref("websiteContent/canvas")
      .get()
      .then((snapshot) => {
        setCanvasScale(snapshot.val().canvasScale);
      });
    firebase
      .database()
      .ref("websiteContent/button")
      .get()
      .then((snapshot) => {
        set_button_width(snapshot.val().width);
        set_button_height(snapshot.val().height);
        set_button_top(snapshot.val().top);
        set_button_left(snapshot.val().left);
      });
  }, []);

  const resourceLoaded = () => {
    ++numberOfResourcesLoaded;
    console.log(
      `resources loaded: ${numberOfResourcesLoaded}/${totalResourcesToBeLoaded}`
    );
    if (numberOfResourcesLoaded == totalResourcesToBeLoaded) {
      setIsLoading(false);
      console.log("Everything loaded");
    }
  };

  return (
    <>
      <div
        className="loading"
        style={{
          display: isLoading ? "block" : "none",
          backgroundImage: `url(${loadingGIF})`,
          backgroundSize: `20%`,
        }}
      />
      <div
        style={{
          display: isLoading ? "none" : "block",
        }}
      >
        <ScrollContainer
          className="container"
          vertical={false}
          horizontal={false}
        >
          <div>
            <CustomTransformWrapper canvasScale={canvasScale}>
              <div
                style={{
                  width: 100 + "vw",
                  height: 100 + "vh",
                }}
                className="canvas__container"
              >
                {rowData.map((obj, index) => (
                  <>
                    {obj.type === "Image" ? (
                      <Link to="/">
                        <Image
                          key={index}
                          imgUrl={obj.imgUrl}
                          width={obj.width}
                          height={obj.height}
                          top={obj.top}
                          left={obj.left}
                          rotation={obj.rotation}
                          resourceLoaded={resourceLoaded}
                        />
                      </Link>
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
                  </>
                ))}
              </div>
              <VisitStore
                button_width={button_width}
                button_height={button_height}
                button_top={button_top}
                button_left={button_left}
              />
            </CustomTransformWrapper>
          </div>
        </ScrollContainer>
      </div>
    </>
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
      <Link to="/edit-website-content" className="visit-store">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        Visit Store
      </Link>
    </div>
  );
};

const CustomTransformWrapper = ({ canvasScale, children }) => {
  if (canvasScale === 0) {
    return <></>;
  } else {
    return (
      <TransformWrapper
        initialScale={Number(canvasScale)}
        minScale={Number(canvasScale)}
        maxScale={Number(canvasScale)}
      >
        <TransformComponent>{children}</TransformComponent>
      </TransformWrapper>
    );
  }
};
