import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PerfectScrollbar from "react-perfect-scrollbar";
import windowSize from "react-window-size";

import Aux from "../../../../../hoc/_Aux";
import NavGroup from "./NavGroup";
import DEMO from "../../../../../store/constant";
import * as actionTypes from "../../../../../store/actions";
import { getData } from "../../../../../store/logginActions";
class NavContent extends Component {
  
  state = {
    scrollWidth: 0,
    prevDisable: true,
    nextDisable: false,
  };

  scrollPrevHandler = () => {
    const wrapperWidth = document.getElementById("sidenav-wrapper").clientWidth;

    let scrollWidth = this.state.scrollWidth - wrapperWidth;
    if (scrollWidth < 0) {
      this.setState({ scrollWidth: 0, prevDisable: true, nextDisable: false });
    } else {
      this.setState({ scrollWidth: scrollWidth, prevDisable: false });
    }
  };

  scrollNextHandler = () => {
    const wrapperWidth = document.getElementById("sidenav-wrapper").clientWidth;
    const contentWidth = document.getElementById("sidenav-horizontal")
      .clientWidth;

    let scrollWidth = this.state.scrollWidth + (wrapperWidth - 80);
    if (scrollWidth > contentWidth - wrapperWidth) {
      scrollWidth = contentWidth - wrapperWidth + 80;
      this.setState({
        scrollWidth: scrollWidth,
        prevDisable: false,
        nextDisable: true,
      });
    } else {
      this.setState({ scrollWidth: scrollWidth, prevDisable: false });
    }
  };

  render() {
    const navItems = this.props.navigation.map((item) => {
      switch (item.type) {
        case "group":
          return (
            <NavGroup
              layout={this.props.layout}
              key={item.id}
              group={item}
              loginData={this.props.loggedData}
            />
          );
        default:
          return false;
      }
    });
    // console.log("navItems");
    // console.log(navItems);
    let mainContent = "";
    if (this.props.layout === "horizontal") {
      let prevClass = ["sidenav-horizontal-prev"];
      if (this.state.prevDisable) {
        prevClass = [...prevClass, "disabled"];
      }
      let nextClass = ["sidenav-horizontal-next"];
      if (this.state.nextDisable) {
        nextClass = [...nextClass, "disabled"];
      }

      mainContent = (
        <div className="navbar-content sidenav-horizontal" id="layout-sidenav">
          <button
            className={prevClass.join(" ")}
            onClick={this.scrollPrevHandler}
          >
            <span />
          </button>
          <div id="sidenav-wrapper" className="sidenav-horizontal-wrapper">
            <ul
              id="sidenav-horizontal"
              className="nav pcoded-inner-navbar sidenav-inner"
              onMouseLeave={this.props.onNavContentLeave}
              style={{ marginLeft: "-" + this.state.scrollWidth + "px" }}
            >
              {navItems}
            </ul>
          </div>
          <button
            className={nextClass.join(" ")}
            onClick={this.scrollNextHandler}
          >
            <span />
          </button>
        </div>
      );
    } else {
      mainContent = (
        <div className="navbar-content datta-scroll">
          <PerfectScrollbar>
            <ul className="nav pcoded-inner-navbar">{navItems}</ul>
          </PerfectScrollbar>
        </div>
      );
    }

    return <Aux>{mainContent}</Aux>;
  }
}

// CHANGE BY LASITHA
const mapStateToProps = (state) => {
  // console.log("Main Nav");
  // console.log(state);
  return {
    layout: state.reducers.layout,
    collapseMenu: state.reducers.collapseMenu,
    loggedData: state.loggedReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onNavContentLeave: () => dispatch({ type: actionTypes.NAV_CONTENT_LEAVE }),
    getData: () => {
      dispatch(getData());
    },
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(windowSize(NavContent))
);


//Edit By Lasitha