import {
  getRoom,
  rejectedGetRoom,
  setReload,
} from "../../reducers/RoomReducer";
export const SetReload = () => async (dispatch) => {
  try {
    dispatch({
      reload: true,
      type: setReload,
    });
  } catch (error) {
    dispatch({
      error: true,
      type: rejectedGetRoom,
    });
  }
};
