import { AUTH } from "../_constant";
import { request_api_post } from "../request_post";
import { request_api_get } from "../request_get";

export const loginApi = async (values) => {
  return await request_api_post(AUTH.LOGIN, values);
};

// export const registerApi = async (values) => {
//   return await request_api().post(AUTH.REGISTER, values);
// };

// export const verifyApi = async (values) => {
//   return await request_api().post(AUTH.VERIFYACCOUNT, values);
// };

export const getProfile = async (values) => {
  return await request_api_get(AUTH.PROFILE, values);
};
