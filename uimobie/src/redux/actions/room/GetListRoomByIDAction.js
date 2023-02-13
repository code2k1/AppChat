import {
  getRoom,
  rejectedGetRoom,
  initialization,
} from "../../reducers/RoomReducer";
import { getRoomByID } from "../../../apis/room/room.api";
export const GetListRoomByID = (id) => async (dispatch) => {
  try {
    const room = (await getRoomByID({ _id: id })).data;
    dispatch({
      Room: room,
      type: getRoom,
    });
  } catch (error) {
    dispatch({
      error: true,
      type: rejectedGetRoom,
    });
  }
};

export const initializationRoom = () => async (dispatch) => {
  try {
    const room = {
      _id: "",
      room_type: true,
      count_member: "",
      name_room: "",
      list_message: [],
      list_member: [],
      error: false,
      isLoad: false,
      reload: false,
    };
    dispatch({
      Room: room,
      type: initialization,
    });
  } catch (error) {
    dispatch({
      error: true,
      type: rejectedGetRoom,
    });
  }
};
