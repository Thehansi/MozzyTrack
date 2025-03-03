import React, { Component } from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { withRouter } from "react-router-dom";
import windowSize from "react-window-size";

import Aux from "../../../../../../hoc/_Aux";
import NavIcon from "./../NavIcon";
import NavBadge from "./../NavBadge";
import * as actionTypes from "../../../../../../store/actions";

class NavItem extends Component {
  render() {
    let itemTitle = this.props.item.title;
    if (this.props.item.icon) {
      itemTitle = <span className="pcoded-mtext">{this.props.item.title}</span>;
    }

    let itemTarget = "";
    if (this.props.item.target) {
      itemTarget = "_blank";
    }

    let subContent;
    if (this.props.item.external) {
      subContent = (
        <a href={this.props.item.url} target="_blank" rel="noopener noreferrer">
          <NavIcon items={this.props.item} />
          {itemTitle}
          <NavBadge layout={this.props.layout} items={this.props.item} />
        </a>
      );
    } else {
      // console.log("asdasdasdas");
      // console.log(this.props.loggedReducer.userWiseAuthorization);
      let isCountHaveProp = false;
      // let isHaveData = this.props.loggedReducer.userWiseAuthorization.filter(
      //   (e) =>
      //     e.MenuID === this.props.item.id &&
      //     e.Auth == 2
      // );

      // console.log("this.props.item.DocumentName", this.props.item.DocumentName)
      // console.log("this.props.loggedReducer.userWiseAuthorization", this.props.loggedReducer.userWiseAuthorization)
      if (true) {
        //isHaveData.length > 0
        isCountHaveProp = true;
      }

      if (true) {
        //isCountHaveProp === false
        subContent = (
          <NavLink
            to={this.props.item.url}
            className="nav-link"
            exact={true}
            target={itemTarget}
          >
            <NavIcon items={this.props.item} />
            {itemTitle}
            <NavBadge layout={this.props.layout} items={this.props.item} />
          </NavLink>
        );
      }
    }
    let mainContent = "";
    if (this.props.layout === "horizontal") {
      mainContent = <li onClick={this.props.onItemLeave}>{subContent}</li>;
    } else {
      if (this.props.windowWidth < 992) {
        mainContent = (
          <li
            className={this.props.item.classes}
            onClick={this.props.onItemClick}
          >
            {subContent}
          </li>
        );
      } else {
        mainContent = <li className={this.props.item.classes}>{subContent}</li>;
      }
    }

    return <Aux>{mainContent}</Aux>;
  }
}

const mapStateToProps = (state) => {
  // console.log("state");
  // console.log(state);
  return {
    layout: state.reducers.layout,
    collapseMenu: state.reducers.collapseMenu,
    loggedReducer: state.loggedReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onItemClick: () => dispatch({ type: actionTypes.COLLAPSE_MENU }),
    onItemLeave: () => dispatch({ type: actionTypes.NAV_CONTENT_LEAVE }),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(windowSize(NavItem))
);

//Edit By Lasitha
