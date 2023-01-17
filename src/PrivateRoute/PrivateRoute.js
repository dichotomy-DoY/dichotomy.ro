import React from "react";
import { Route, Redirect } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const PrivateRoute = ({ children, ...rest }) => {
  const { currentUser } = useAuth();

 // return (
    <Route
      {...rest}
      render={() => {
        return currentUser ? children : <Redirect to="/signin" />;
      }}
    />
 // );
};

export default PrivateRoute;
