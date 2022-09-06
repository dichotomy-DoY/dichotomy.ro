import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Canvas.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
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

  const [rowData, setRowData] = useState([]);
  const [canvasScale, setCanvasScale] = useState(0);
  const [button_width, set_button_width] = useState("");
  const [button_height, set_button_height] = useState("");
  const [button_top, set_button_top] = useState("");
  const [button_left, set_button_left] = useState("");
  const [hide, set_hide] = useState(false);

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
  }, []);

  useEffect(()=>{
    window.tsParticles.load("tsparticles", {
      "particles": {
        "number": {
          "value": 50,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          },
          "image": {
            "src": "img/github.svg",
            "width": 100,
            "height": 100
          }
        },
        "opacity": {
          "value": 0.8979107540846928,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 4.5,
          "direction": "none",
          "random": false,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": false,
            "rotateX": 600,
            "rotateY": 1200
          }
        },
        "interactivity": {
          "detect_on": "canvas",
          "events": {
            "onhover": {
              "enable": false,
              "mode": "repulse"
            },
            "onclick": {
              "enable": false,
              "mode": "push"
            },
            "resize": true
          },
          "modes": {
            "grab": {
              "distance": 400,
              "line_linked": {
                "opacity": 1
              }
            },
            "bubble": {
              "distance": 400,
              "size": 40,
              "duration": 2,
              "opacity": 8,
              "speed": 3
            },
            "repulse": {
              "distance": 200,
              "duration": 0.4
            },
            "push": {
              "particles_nb": 4
            },
            "remove": {
              "particles_nb": 2
            }
          }
        },
        "retina_detect": true
      }});
  }, []);

  // useEffect(()=>{
  //   if(videoElement && videoElement.current) {
  //     videoElement.current.addEventListener('canplaythrough', resourceLoaded, {once:true});
  //     return () => videoElement.current.removeEventListener('canplaythrough', resourceLoaded);
  //   }
  // });

  useEffect(() => {
    // console.log(
    //   `resources loaded: ${numberOfResourcesLoaded}/${totalResourcesToBeLoaded}`
    // );
    if (numberOfResourcesLoaded === totalResourcesToBeLoaded && totalResourcesToBeLoaded !== 0) {
      //console.log("Everything loaded");
      setIsLoading(false);
    }
  }, [numberOfResourcesLoaded]);

  const resourceLoaded = () => {
    setNumberOfResourcesLoaded(numberOfResourcesLoaded + 1);
  };

  return (
    <div
      className={`${isLoading ? '' : 'main-container'}`}
      id="tsparticles"
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
