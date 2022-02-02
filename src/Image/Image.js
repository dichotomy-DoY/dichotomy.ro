import React from "react";
import Radium from "radium";

const Image = (props) => {
  return (
    <img
      src={props.imgUrl}
      className="images"
      onLoad={props.resourceLoaded}
      style={{
        position: "absolute",
        width: props.width,
        height: props.height,
        top: props.top,
        left: props.left,
        transform: "rotate(" + props.rotation + "deg)",
        // objectFit: "contain",
        pointerEvents: "auto",
        transition: "transform 0.2s",
        zIndex: 1,

        ":hover": {
          transform: "rotate(" + props.rotation + "deg) scale(1.25)",
          zIndex: 2,
        },
      }}
    />
  );
};

export default Radium(Image);
