import React, { Component } from "react";
import { NavLink, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import * as actionTypes from "../../../../src/store/actions";
import "./../../../assets/scss/style.scss";
import Aux from "../../../hoc/_Aux";
import Breadcrumb from "../../../App/layout/AdminLayout/Breadcrumb";
import { fetchLoginData } from "../../../store/logginActions";
import notify from "devextreme/ui/notify";
class SignUp1 extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.value });
    console.log(this.state);
  }

  OnNotification = (message, type) => {
    notify({
      message: message,
      type: type,
      displayTime: 3000,
      position: { at: "top right", offset: "50" },
    });
  };

  OnClickRegistration = (e) => {
    window.open(`/auth/signup-1`, "_self");
  };

  // openForm = (e) => {
  //   window.open(`../../../Forms/Branch/Create-Branch`);
  // };

  render() {
    if (!this.props.data.logginStatus) {
      return (
        <Aux>
          <Breadcrumb />
          <div className='auth-wrapper'>
            <div className='auth-content'>
              <div className='auth-bg'>
                <span className='r' />
                <span className='r s' />
                <span className='r s' />
                <span className='r' />
              </div>
              <div className='card'>
                <div className='card-body text-center'>
                  {/* <div className="mb-4">
                    <i className="feather icon-unlock auth-icon" />
                  </div> */}
                  <h3 className='mb-4'>MozziTrack</h3>
                  {/* <p>{this.props.data.error}</p> */}

                  <div className='input-group mb-3'>
                    <input
                      type='email'
                      className='form-control'
                      placeholder='Username'
                      name='email'
                      onChange={this.onChange}
                    />
                  </div>
                  <div className='input-group mb-4'>
                    <input
                      type='password'
                      className='form-control'
                      placeholder='Password'
                      name='password'
                      onChange={this.onChange}
                    />
                  </div>
                  <div className='form-group text-left'></div>
                  <button
                    className='btn btn-primary shadow-2 mb-4'
                    onClick={() => {
                      if (
                        this.state.email != undefined &&
                        this.state.password != undefined
                      ) {
                        this.props.fetchLoginData(
                          this.state.email,
                          this.state.password
                        );
                      } else {
                        this.OnNotification(
                          "Invalid Username or Password",
                          "error"
                        );
                      }
                    }}
                  >
                    Login
                  </button>
                  <p className='mb-0 text-muted'>© 2025 Theshani</p>
                  <p className='mb-0 text-muted'>Version 1.0.0</p>
                </div>
              </div>
            </div>
          </div>
        </Aux>
      );
    } else {
      return <Redirect to={"/forms/home/dashboard"} />;
    }
  }
}

const mapStateToProps = (state) => {
  console.log(state.loggedReducer);
  return {
    data: state.loggedReducer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchLoginData: (email, password) => {
      dispatch(fetchLoginData(email, password));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp1);
