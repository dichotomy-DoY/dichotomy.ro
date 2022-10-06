import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import "./Canvas.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import firebase from "../firebase";
import Image from "../Image/Image";
import loadingGIF from "./loading.gif";
import dragToExplore from "./dragToExplore.gif";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProgressBar from 'react-bootstrap/ProgressBar';

const App = () => {
  const [numberOfResourcesLoaded, setNumberOfResourcesLoaded] = useState(0);
  const [totalResourcesToBeLoaded, setTotalResourcesToBeLoaded] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [areParticlesLoading, setAreParticlesLoading] = useState(true);

  const [rowData, setRowData] = useState([]);
  const [canvasScale, setCanvasScale] = useState(0);
  const [button_width, set_button_width] = useState("");
  const [button_height, set_button_height] = useState("");
  const [button_top, set_button_top] = useState("");
  const [button_left, set_button_left] = useState("");
  const [hide, set_hide] = useState(false);

  const [partcilesDesktop, setParticlesDesktop] = useState();
  const [particlesMobile, setParticlesMobile] = useState();

  //const videoElement = React.useRef(null);
  const canvasElement = React.useRef();

  useEffect(() => {
    firebase
      .database()
      .ref("websiteContent/objects")
      .get()
      .then((snapshot) => {
        let data = snapshot.val();
        let hideGroupItems = false;
        let totalResources = 0;
        data.forEach((item, index) => {
          if (item.type === "Image" && !hideGroupItems) {
            totalResources = totalResources + 1;
          } else if (item.isGroup) {
            hideGroupItems = item.hide;
          }
          item.key = index;
          item.hideImg = hideGroupItems;
        });

        setTotalResourcesToBeLoaded(totalResources);
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
        set_hide(snapshot.val().hide);
      });
    firebase
      .database()
      .ref("websiteContent/particles")
      .get()
      .then((snapshot) => {
        setParticlesDesktop(snapshot.val().desktop);
        setParticlesMobile(snapshot.val().mobile);
      })
  }, []);

  const loadingScreenParticlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const loadingScreenParticlesLoaded = useCallback(async (container) => {
      setTimeout(()=>{
        setAreParticlesLoading(false);
      }, 1000);
  }, []);

  const canvasScreenParticlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  useEffect(() => {
    if (numberOfResourcesLoaded === totalResourcesToBeLoaded && totalResourcesToBeLoaded !== 0) {
      setIsLoading(false);
    }
  }, [numberOfResourcesLoaded]);

  const resourceLoaded = () => {
    setNumberOfResourcesLoaded(numberOfResourcesLoaded + 1);
  };

  return (
    <div
      ref={canvasElement}
      style={{
        height: "100%"
      }}
    >
      <div
        className={`loading ${window.innerWidth > 768 ? "desktop-loader" : "mobile-loader"}`}
        style={{
          display: isLoading ? "flex" : "none",
          flexDirection: "column",
          placeContent: "center",
          alignItems: "center"
        }}
      >
        <img src={loadingGIF}/>
        <img className="drag-to-explore" src={dragToExplore} />
        <ProgressBar animated now={numberOfResourcesLoaded} />
        <Particles id="loading-screen-particles" init={loadingScreenParticlesInit} loaded={loadingScreenParticlesLoaded}
          url={window.innerWidth > 768 ? partcilesDesktop : particlesMobile} className={areParticlesLoading ? 'particles-loading' : ''} />
      </div>
      <div
        style={{
          display: isLoading ? "none" : "block",
          height: "100%",
          cursor: "grab"
        }}
      >
        <CustomTransformWrapper canvasScale={canvasScale} canvasWidth={canvasElement.current?.clientWidth} canvasHeight={canvasElement.current?.clientHeight}>
          <div
            style={{
              width: `max(${canvasElement.current?.clientWidth}px, ${canvasElement.current?.clientHeight}px)`,
              height: `max(${canvasElement.current?.clientWidth}px, ${canvasElement.current?.clientHeight}px)`,
            }}
          >
            {rowData.map((obj) => (
              <>
                {obj.type === "Image" && !obj.hideImg ? (
                  <a
                    key={obj.key}
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
                      imgUrl={obj.imgUrl}
                      width={obj.width}
                      height={obj.height}
                      top={obj.top}
                      left={obj.left}
                      rotation={obj.rotation}
                      onHoverScale={obj.onHoverScale}
                      resourceLoaded={resourceLoaded}
                      clickActionObject={obj.clickActionObject}
                    />
                  </a>
                ) : (obj.type === "Video" && !obj.hideImg ? ('') : '')}
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
        <Particles id="tsparticles" init={canvasScreenParticlesInit} url={window.innerWidth > 768 ? partcilesDesktop : particlesMobile} />
      </div>
    </div>
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

const CustomTransformWrapper = ({ canvasScale, canvasWidth, canvasHeight, children }) => {
  if (canvasScale === 0) {
    return <></>;
  } else {
    const canvasWidthAndHeight = Math.max(canvasWidth, canvasHeight) * canvasScale;
    return (
      <TransformWrapper
        initialScale={Number(canvasScale)}
        minScale={Number(canvasScale)}
        maxScale={Number(canvasScale)}
        initialPositionX={-(canvasWidthAndHeight - canvasWidth) / 2}
        initialPositionY={-(canvasWidthAndHeight - canvasHeight) / 2}
      >
        <TransformComponent>
          {/* <ScrollContainer> */}
          {children}
          {/* </ScrollContainer> */}
        </TransformComponent>
      </TransformWrapper>
    );
  }
};
