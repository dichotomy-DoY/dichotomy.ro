import React, { useState } from "react";
import Radium from "radium";

const Image = (props) => {
  const [swapped, setSwapped] = useState(false);
  const [played, setPlayed] = useState(false);

  return (
    <img
      src={
        (swapped &&
          props.clickActionObject &&
          props.clickActionObject.actionCode === 2) ||
        (!played &&
          props.clickActionObject &&
          props.clickActionObject.actionCode === 3)
          ? props.clickActionObject.link
          : props.imgUrl
      }
      className="images"
      onClick={() => {
        if (
          props.clickActionObject &&
          props.clickActionObject.actionCode === 2
        ) {
          swapped ? setSwapped(false) : setSwapped(true);
        } else if (
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
        display: props.hideImg ? "none" : "",
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
