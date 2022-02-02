import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./styles.css";

import Canvas from "./Canvas/Canvas";
import EditWebsiteContent from "./EditWebsiteContent/EditWebsiteContent";
import GridExample from "./EditWebsiteContent/partials/GridExample";

const App = () => (
  <>
    <Router>
      <Switch>
        <Route path="/edit-website-content">
          <EditWebsiteContent />
        </Route>
        <Route path="/">
          <Canvas />
        </Route>
      </Switch>
    </Router>
  </>
);

export default App;
