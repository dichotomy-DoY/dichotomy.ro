import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles.css";

import Canvas from "./Canvas/Canvas";
import EditWebsiteContent from "./EditWebsiteContent/EditWebsiteContent";
import SignIn from "./SignIn/SignIn";
import NotFound from "./NotFound/NotFound";
import { AuthProvider } from "./Contexts/AuthContext";
import PrivateRoute from "./PrivateRoute/PrivateRoute";

const App = () => (
  <>
    <Router>
      <AuthProvider>
        <Switch>
          {/* <PrivateRoute exact path="/">
            <Canvas />
          </PrivateRoute> */}
          <Route exact path="/">
            <Canvas />
          </Route>
          <Route exact path="/signin">
            <SignIn />
          </Route>
          <PrivateRoute exact path="/edit-website-content">
            <EditWebsiteContent />
          </PrivateRoute>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </AuthProvider>
    </Router>
  </>
);

export default App;
