import { combineReducers } from "redux";
import User from "./UserReducer";
import Room from "./RoomReducer";
const reducers = combineReducers({
  User: User,
  Room: Room,
});

export default (state, action) => reducers(state, action);
