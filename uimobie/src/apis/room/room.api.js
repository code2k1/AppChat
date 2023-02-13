import { LIST_ROOM } from "../_constant";
// import { request_api_post } from "../request_post";
import { request_api_get } from "../request_get";
import { request_api_post } from "../request_post";
import { request_api_put } from "../request_put";

export const getRoomByPhone = async (values) => {
  return await request_api_get(LIST_ROOM.LIST_ROOM, values);
};

export const getRoomByID = async (values) => {
  return await request_api_get(LIST_ROOM.LIST_ROOM, values);
};

export const addRoom = async (values) => {
  return await request_api_post(LIST_ROOM.LIST_ROOM, values);
};

export const deleteMember = async (values) => {
  return await request_api_put(LIST_ROOM.REMOVE_MEMBER, values);
};

export const changeRole = async (values) => {
  return await request_api_put(LIST_ROOM.CHANG_ROLE, values);
};

export const addMember = async (values) => {
  return await request_api_put(LIST_ROOM.ADD_MEMBER, values);
};

export const outRoom = async (values) => {
  return await request_api_put(LIST_ROOM.OUT_ROOM, values);
};


