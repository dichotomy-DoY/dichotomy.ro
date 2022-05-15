import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles.css";

import Canvas from "./Canvas/Canvas";
import EditWebsiteContent from "./EditWebsiteContent/EditWebsiteContent";
import SignIn from "./SignIn/SignIn";
import { AuthProvider } from "./Contexts/AuthContext";
import PrivateRoute from "./PrivateRoute/PrivateRoute";

const App = () => (
  <>
    <Router>
      <AuthProvider>
        <Switch>
          <PrivateRoute exact path="/">
            <Canvas />
          </PrivateRoute>
          <Route path="/signin">
            <SignIn />
          </Route>
          <PrivateRoute path="/edit-website-content">
            <EditWebsiteContent />
          </PrivateRoute>
        </Switch>
      </AuthProvider>
    </Router>
  </>
);

export default App;
