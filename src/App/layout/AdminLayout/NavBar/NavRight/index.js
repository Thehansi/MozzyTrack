import React, { Component, Redirect } from "react";
import { Dropdown } from "react-bootstrap";

import ChatList from "./ChatList";
import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../../store/constant";

// import Avatar4 from "../../../../../assets/images/user/avatar-4.jpg";
import Avatar4 from "../../../../../image/logo new1.jpg";

import { connect } from "react-redux";
import { loggout } from "../../../../../store/logginActions";

class NavRight extends Component {
  state = {
    listOpen: false,
  };

  logOut() {
    localStorage.setItem("user", null);
    alert(localStorage.getItem("user"));
  }

  render() {
    return (
      <Aux>
        <ul className='navbar-nav ml-auto'>
          <li>
            <Dropdown alignRight={!this.props.rtlLayout} className='drp-user'>
              <Dropdown.Toggle variant={"link"} id='dropdown-basic'>
                <i className='icon feather icon-settings' />
              </Dropdown.Toggle>
              <Dropdown.Menu alignRight className='profile-notification'>
                <div className='pro-head'>
                  <img
                    src={Avatar4}
                    className='img-radius'
                    alt='User Profile'
                  />
                  <span>{this.props.login.user.UserName}</span>

                  <a
                    href={DEMO.BLANK_LINK}
                    className='dud-logout'
                    title='Logout'
                    onClick={() => this.props.loggout()}
                  >
                    <i className='feather icon-log-out' />
                  </a>
                </div>
                <ul className='pro-body'></ul>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        </ul>
        <ChatList
          listOpen={this.state.listOpen}
          closed={() => {
            this.setState({ listOpen: false });
          }}
        />
      </Aux>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.reducers,
    login: state.loggedReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loggout: () => {
      dispatch(loggout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavRight);

//Edit By Lasitha
