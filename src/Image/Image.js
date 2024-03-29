import Radium from 'radium';
import React, { useRef, useState } from 'react';
import mainGif from '../Canvas/ezgif.com-gif-maker.mp4';
import './Image.css';

const Image = (props) => {
  const [swapped, setSwapped] = useState(false);
  const mainGIF = useRef();

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
            position: 'absolute',
            width: props.width,
            height: props.height,
            top: props.top,
            left: props.left,
            transform: 'rotate(' + props.rotation + 'deg)',
            pointerEvents: swapped ? 'none' : 'auto',
            transition: 'transform 0.2s, opacity 1s linear',
            zIndex: 1,

            ':hover': {
              transform: `rotate(${props.rotation}deg) ${
                window.innerWidth > 768 ? `scale(${props.onHoverScale})` : ''
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
            position: 'absolute',
            width: props.width,
            height: props.height,
            top: props.top,
            left: props.left,
            transform: 'rotate(' + props.rotation + 'deg)',
            pointerEvents: swapped ? 'auto' : 'none',
            transition: 'transform 0.2s, opacity 1s linear',
            zIndex: 1,

            ':hover': {
              transform: `rotate(${props.rotation}deg) ${
                window.innerWidth > 768 ? `scale(${props.onHoverScale})` : ''
              }`,
              zIndex: 2,
            },
          }}
        />
      </>
    );
  } else if (props.clickActionObject && props.clickActionObject.actionCode === 3) {
    return (
      <video
        autoPlay
        playsInline
        ref={mainGIF}
        onClick={() => {
          mainGIF.current.play();
        }}
        src={mainGif}
        onLoad={props.resourceLoaded}
        style={{
          position: 'absolute',
          width: props.width,
          height: props.height,
          top: props.top,
          left: props.left,
          transform: 'rotate(' + props.rotation + 'deg)',
          pointerEvents: 'auto',
          transition: 'transform 0.2s',
          zIndex: 1,

          ':hover': {
            transform: `rotate(${props.rotation}deg) ${window.innerWidth > 768 ? `scale(${props.onHoverScale})` : ''}`,
            zIndex: 2,
          },
        }}></video>
    );
  } else if (props.clickActionObject && props.clickActionObject.actionCode === 4) {
    return (
      <>
        <img
          src={
            !swapped && props.clickActionObject && props.clickActionObject.actionCode === 4
              ? props.imgUrl
              : props.clickActionObject.link
          }
          className='images'
          onClick={() => {
            swapped ? setSwapped(false) : setSwapped(true);
          }}
          onLoad={props.resourceLoaded}
          style={{
            position: 'absolute',
            width: props.width,
            height: props.height,
            top: props.top,
            left: props.left,
            transform: 'rotate(' + props.rotation + 'deg)',
            pointerEvents: 'auto',
            transition: 'transform 0.2s',
            zIndex: 1,

            ':hover': {
              transform: `rotate(${props.rotation}deg) ${
                window.innerWidth > 768 ? `scale(${props.onHoverScale})` : ''
              }`,
              zIndex: 2,
            },
          }}
        />
        <img // this is just to download the gif beforehand
          src={props.imgUrl}
          className='images'
          onLoad={props.resourceLoaded}
          style={{
            display: 'none',
            position: 'absolute',
            width: props.width,
            height: props.height,
            top: props.top,
            left: props.left,
            transform: 'rotate(' + props.rotation + 'deg)',
            pointerEvents: 'auto',
            transition: 'transform 0.2s',
            zIndex: 1,
          }}
        />
        <img // this is just to download the gif beforehand
          src={props.clickActionObject.link}
          className='images'
          onLoad={props.resourceLoaded}
          style={{
            display: 'none',
            position: 'absolute',
            width: props.width,
            height: props.height,
            top: props.top,
            left: props.left,
            transform: 'rotate(' + props.rotation + 'deg)',
            pointerEvents: 'auto',
            transition: 'transform 0.2s',
            zIndex: 1,
          }}
        />
      </>
    );
  } else {
    return (
      <img
        src={props.imgUrl}
        className='images'
        onLoad={props.resourceLoaded}
        style={{
          position: 'absolute',
          width: props.width,
          height: props.height,
          top: props.top,
          left: props.left,
          transform: 'rotate(' + props.rotation + 'deg)',
          pointerEvents: 'auto',
          transition: 'transform 0.2s',
          zIndex: 1,

          ':hover': {
            transform: `rotate(${props.rotation}deg) ${window.innerWidth > 768 ? `scale(${props.onHoverScale})` : ''}`,
            zIndex: 2,
          },
        }}
      />
    );
  }
};

export default Radium(Image);

