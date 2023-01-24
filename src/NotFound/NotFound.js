import React from "react";
import { Link } from "react-router-dom";
import NotFoundImage from "../assets/404.png";
import "./NotFound.css";

const NotFound = () => {

  return (
    <div className="notfound-page">
        <img width={300} src={NotFoundImage}/>
        <Link to="/">Back to Home</Link>
    </div>
  );
};

export default NotFound;
