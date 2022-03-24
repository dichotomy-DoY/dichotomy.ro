import React, { useState } from "react";
import "./Image.css";
import Radium from "radium";

const Image = (props) => {
  const [swapped, setSwapped] = useState(false);
  const [played, setPlayed] = useState(false);

  if (props.clickActionObject && props.clickActionObject.actionCode === 2) {
    return (
      <>
        <img
          key={1}
          src={props.imgUrl}
          className={`canvas-image ${swapped ? 'canvas-image-hidden' : ''}`}
          onClick={() => {
            swapped ? setSwapped(false) : setSwapped(true);
          }}
          onLoad={props.resourceLoaded}
          style={{
            position: "absolute",
            width: props.width,
            height: props.height,
            top: props.top,
            left: props.left,
            transform: "rotate(" + props.rotation + "deg)",
            pointerEvents: swapped ? "none" : "auto",
            transition: "transform 0.2s, opacity 1s linear",
            zIndex: 1,

            ":hover": {
              transform: `rotate(${props.rotation}deg) ${window.innerWidth > 768 ? `scale(${props.onHoverScale})` : ""
                }`,
              zIndex: 2,
            },
          }}
        />
        <img
          key={2}
          src={props.clickActionObject.link}
          className={`canvas-image ${swapped ? '' : 'canvas-image-hidden'}`}
          onClick={() => {
            swapped ? setSwapped(false) : setSwapped(true);
          }}
          style={{

            position: "absolute",
            width: props.width,
            height: props.height,
            top: props.top,
            left: props.left,
            transform: "rotate(" + props.rotation + "deg)",
            pointerEvents: swapped ? "auto" : "none",
            transition: "transform 0.2s, opacity 1s linear",
            zIndex: 1,

            ":hover": {
              transform: `rotate(${props.rotation}deg) ${window.innerWidth > 768 ? `scale(${props.onHoverScale})` : ""
                }`,
              zIndex: 2,
            },
          }}
        />
      </>
    );
  } else {
    return (
      <img
        src={
          (!played &&
            props.clickActionObject &&
            props.clickActionObject.actionCode === 3)
            ? props.clickActionObject.link
            : props.imgUrl
        }
        className="images"
        onClick={() => {
          if (
            !played &&
            props.clickActionObject &&
            props.clickActionObject.actionCode === 3
          ) {
            setPlayed(true);
            setTimeout(() => {
              setPlayed(false);
            }, props.clickActionObject.gifDuration * 1000);
          }
        }}
        onLoad={props.resourceLoaded}
        style={{
          position: "absolute",
          width: props.width,
          height: props.height,
          top: props.top,
          left: props.left,
          transform: "rotate(" + props.rotation + "deg)",
          pointerEvents: "auto",
          transition: "transform 0.2s",
          zIndex: 1,

          ":hover": {
            transform: `rotate(${props.rotation}deg) ${window.innerWidth > 768 ? `scale(${props.onHoverScale})` : ""
              }`,
            zIndex: 2,
          },
        }}
      />
    );
  }


};

export default Radium(Image);
