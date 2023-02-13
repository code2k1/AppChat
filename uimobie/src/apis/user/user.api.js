import { USER, FRIEND } from "../_constant";
// import { request_api_post } from "../request_post";
import { request_api_get } from "../request_get";
import { request_api_post } from "../request_post";

export const getUserByPhone = async (values) => {
  return await request_api_get(USER.USER, values);
};

export const sendRequestsAddFriend = async (values) => {
  return await request_api_post(FRIEND.REQUESTS, values);
};
export const applyRequestsAddFriend = async (values) => {
  return await request_api_post(FRIEND.APPLY, values);
};

export const getFriend = async (values) => {
  return await request_api_get(FRIEND.FRIEND, values);
};

export const editProfile = async (values) => {
  return await request_api_post(USER.USER_EDIT, values);
};
