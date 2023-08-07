import React, { lazy, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "./components/AccessibleNavigationAnnouncer";
import GIF from "../src/assets/img/splash.gif";
import { AuthContext } from "./utils/AuthProvider";
const Layout = lazy(() => import("./containers/Layout"));
const Login = lazy(() => import("./pages/Login"));
const CreateAccount = lazy(() => import("./pages/CreateAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Index = lazy(() => import("./pages/Index"));
// const Index = lazy(() => import("./pages/Index"));
function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      <Router>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/create-account" component={CreateAccount} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/app" component={Layout} />
          <Route path="/" component={Index} />

          {/* Place new routes over this */}
          {/* If you have an index page, you can remothis Redirect */}
          {/* <Redirect exact from="/" to="/login" /> */}
        </Switch>
      </Router>
    </>
  );
  // }
}

export default App;
