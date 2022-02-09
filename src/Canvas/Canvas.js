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
  const [hide, set_hide] = useState(false);

  useEffect(() => {
    firebase
      .database()
      .ref("websiteContent/objects")
      .get()
      .then((snapshot) => {
        let data = snapshot.val();

        // setTotalResourcesToBeLoaded(
        //   data.reduce((sum, value) => {
        //     if (value.imgUrl) {
        //       return sum + 1;
        //     } else {
        //       return sum;
        //     }
        //   }, 0)
        // );

        let hide = false;
        let totalResourcesToBeLoaded = 0;
        data.forEach((item) => {
          if (item.imgUrl) {
            totalResourcesToBeLoaded = totalResourcesToBeLoaded + 1;
          } else {
            hide = item.hide;
          }
          item.hideImg = hide;
        });

        setTotalResourcesToBeLoaded(totalResourcesToBeLoaded);

        setRowData(data);
        //console.log(data);
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
        set_hide(snapshot.val().hide);
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
        <CustomTransformWrapper canvasScale={canvasScale}>
          <div
            style={{
              width: "max(100vw, 100vh)",
              height: "max(100vw, 100vh)",
            }}
          >
            {rowData.map((obj, index) => (
              <>
                {obj.type === "Image" ? (
                  <a
                    href={
                      obj.clickActionObject &&
                      obj.clickActionObject.actionCode === 1
                        ? obj.clickActionObject.link
                        : "#"
                    }
                    target={
                      obj.clickActionObject &&
                      obj.clickActionObject.actionCode === 1
                        ? "_blank"
                        : ""
                    }
                  >
                    <Image
                      key={index}
                      imgUrl={obj.imgUrl}
                      width={obj.width}
                      height={obj.height}
                      top={obj.top}
                      left={obj.left}
                      rotation={obj.rotation}
                      resourceLoaded={resourceLoaded}
                      clickActionObject={obj.clickActionObject}
                      hideImg={obj.hideImg}
                    />
                  </a>
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
            hide={hide}
          />
        </CustomTransformWrapper>
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
  hide,
}) => {
  return (
    <div
      style={{
        display: hide ? "none" : "block",
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
        centerOnInit={true}
      >
        <TransformComponent>
          <ScrollContainer>{children}</ScrollContainer>
        </TransformComponent>
      </TransformWrapper>
    );
  }
};
