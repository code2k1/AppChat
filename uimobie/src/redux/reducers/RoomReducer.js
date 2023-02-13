export const getRoom = "Get_Room";
export const rejectedGetRoom = "Get_List_Room";
export const setReload = "SET_RELOAD";
export const initialization = "INITIALIZATION";
const initialState = {
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

export default function actionForReducer(state = initialState, payload) {
  switch (payload.type) {
    case initialization:
      // console.log(payload.User.list_friend);
      return {
        _id: payload.Room._id,
        room_type: payload.Room.room_type,
        count_member: payload.Room.count_member,
        name_room: payload.Room.name_room,
        list_message: payload.Room.list_message,
        list_member: payload.Room.list_member,
        error: false,
        isLoad: true,
      };
    case getRoom:
      return {
        _id: payload.Room._id,
        room_type: payload.Room.room_type,
        count_member: payload.Room.count_member,
        name_room: payload.Room.name_room,
        list_message: payload.Room.list_message,
        list_member: payload.Room.list_member,
        error: false,
        isLoad: true,
      };
    case setReload:
      return { reload: payload.reload };
    case rejectedGetRoom:
      return {
        error: payload.error,
        isLoad: false,
      };
    default:
      return state;
  }
}
