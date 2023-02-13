export const createUser = "Create_User";
export const removeUser = "Remove_User";
export const rejectedCreateUser = "Rejected_Create_User";

const initialState = {
  _id: "",
  first_name: "",
  last_name: "",
  phone: "",
  password: "",
  isLogin: false,
  error: false,
  avatar: "",
  gender: "",
  dateOfBirth: "",
  active: "",
  list_friend: [],
};

export default function actionForReducer(state = initialState, payload) {
  switch (payload.type) {
    case createUser:
      // console.log(payload.User.list_friend);
      return {
        _id: payload.User._id,
        first_name: payload.User.first_name,
        last_name: payload.User.last_name,
        phone: payload.User.phone,
        password: payload.User.password,
        isLogin: payload.User.isLogin,
        avatar: payload.User.avatar,
        gender: payload.User.gender,
        dateOfBirth: payload.User.dateOfBirth,
        // list_friend: payload.User.list_friend,
        active: payload.User.active,
        error: false,
      };
    case rejectedCreateUser:
      return {
        error: payload.error,
        isLogin: false,
      };
    case removeUser:
      return {
        isLogin: false,
      };
    default:
      return state;
  }
}
