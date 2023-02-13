import { getProfile } from "../../../apis/auth/auth.api";
import { createUser, removeUser } from "../../reducers/UserReducer";
export const GetUser = () => async (dispatch) => {
  try {
    const User = (await getProfile()).data;
    // console.log(User);
    User.isLogin = true;
    dispatch({
      type: createUser,
      User: User,
    });
  } catch (error) {}
};
export const RemoveUser = () => async (dispatch) => {
  try {
    dispatch({
      type: removeUser,
    });
  } catch (error) {}
};
