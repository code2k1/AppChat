import { loginApi } from "../../../apis/auth/auth.api";
import { createUser } from "../../reducers/UserReducer";
import { rejectedCreateUser } from "../../reducers/UserReducer";
import * as SecureStore from "expo-secure-store";
const setToken = (token) => {
  return SecureStore.setItemAsync("secure_token", token);
};

export const Login = (phone_number, passWord) => async (dispatch) => {
  try {
    const user = {
      phone: phone_number,
      password: passWord,
    };
    const User = (await loginApi(user)).data;
    setToken(User.token);
    User.isLogin = true;
    dispatch({
      User: User,
      type: createUser,
    });
  } catch (error) {
    dispatch({
      error: true,
      type: rejectedCreateUser,
    });
  }
};
