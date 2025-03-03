import { combineReducers } from "redux";
import reducer from "./reducer";
import loggedReducer from "./IsLoggedReducer";

const allReducers = combineReducers({
  reducers: reducer,
  loggedReducer: loggedReducer,
});

export default allReducers;