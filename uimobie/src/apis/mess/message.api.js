import { LIST_MESAGE } from "../_constant";
// import { request_api_post } from "../request_post";
import { request_api_get } from "../request_get";
import { request_api_post } from "../request_post";

export const sendMessage = async (values) => {
  return await request_api_post(LIST_MESAGE.ADD_MESAGE, values);
};

export const deleteToMessage = async (values) => {
  return await request_api_post(LIST_MESAGE.DELETE_TO, values);
};

export const revokeMessage = async (values) => {
  return await request_api_post(LIST_MESAGE.REVOKE, values);
};

export const getListMessageSkipAndLimit = async (values) => {
  return await request_api_get(LIST_MESAGE.GET_MESAGE, values);
};
