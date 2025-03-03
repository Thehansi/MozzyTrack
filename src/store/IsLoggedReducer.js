import * as actionTypes from "./actions";

export const initialState = {
  loading: false,
  user: [],
  userWiseAuthorization: [],
  error: "",
  logginStatus: false,
};

const loggedReducer = (state = initialState, action) => {
  let user = [];
  switch (action.type) {
    case actionTypes.USER_REQUEST_TO_LOGGIN:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.SET_USER:
      return {
        loading: false,
        user: action.payLoad,
        error: "",
        logginStatus: true,
        // school: action.School,
        userWiseAuthorization: action.Authorization,
      };

    case actionTypes.ERRROR_LOGGIN:
      return {
        loading: false,
        user: action.payLoad,
        error: "",
        logginStatus: false,
        // school: [],
        userWiseAuthorization: [],
      };

    default:
      if (JSON.parse(localStorage.getItem("user")) != null) {
        return {
          loading: false,
          user: JSON.parse(localStorage.getItem("user")),
          error: "",
          logginStatus: true,
          // school: JSON.parse(localStorage.getItem("School")),
          userWiseAuthorization: JSON.parse(
            localStorage.getItem("Authorization")
          ),
          // userWiseAuthorization: JSON.parse(
          //   localStorage.getItem("Authorization")
          // ),
          // ApprovalDocument: JSON.parse(
          //   localStorage.getItem("ApprovalDocument")
          // ),
        };
      } else {
        return {
          loading: false,
          user: [],
          error: action.payLoad,
          logginStatus: false,
        };
      }
  }
};

export default loggedReducer;
