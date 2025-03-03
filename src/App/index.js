import React, { Component, Suspense } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Loadable from "react-loadable";

import "../../node_modules/font-awesome/scss/font-awesome.scss";

import Loader from "./layout/Loader";
import Aux from "../hoc/_Aux";
import ScrollToTop from "./layout/ScrollToTop";
import routes from "../route";

import { connect } from "react-redux";
import { getData } from "../store/logginActions";

import { IsRoundData } from "../store/logginActions";

const AdminLayout = Loadable({
  loader: () => import("./layout/AdminLayout"),
  loading: Loader,
});

class App extends Component {
  constructor() {
    super();
    // console.log("Loggin Redducer");
  }

  render() {
    const menu = routes.map((route, index) => {
      return route.component ? (
        <Route
          key={index}
          path={route.path}
          exact={route.exact}
          name={route.name}
          render={(props) => <route.component {...props} />}
        />
      ) : null;
    });

    return (
      <Aux>
        <ScrollToTop>
          <Suspense fallback={<Loader />}>
            <Switch>
              {menu}
              {!this.props.data.logginStatus ? (
                <Redirect to={"/"} />
              ) : (
                <Route path="/" component={AdminLayout} />
              )}
            </Switch>
          </Suspense>
        </ScrollToTop>
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log("APP COMPONENT");
  // console.log(state.loggedReducer);
  return {
    data: state.loggedReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    IsRoundData: () => {
      dispatch(
        IsRoundData(
          this.state.user,
          // this.state.school,
          this.state.userWiseAuthorization
        )
      );
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
