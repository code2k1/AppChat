// api auth
export const AUTH = {
  LOGIN: "/auth/login",
  REGISTER: "auth/register",
  VERIFYACCOUNT: "auth/exist_account",
  PROFILE: "auth/profile",
};

export const USER = {
  USER: "/user",
  USER_EDIT: "/user/editProfile"
};

export const LIST_ROOM = {
  LIST_ROOM: "/listchat",
  REMOVE_MEMBER: "/listchat/removemember",
  CHANG_ROLE: "/listchat/changeRole",
  ADD_MEMBER: "/listchat/addmember",
  OUT_ROOM: "/listchat/outGroup"
};

export const LIST_MESAGE = {
  LIST_MESAGE: "/listmessage",
  ADD_MESAGE: "/listmessage/addMessage",
  GET_MESAGE: "/listmessage/listmess",
  DELETE_TO: "/listmessage/deleteTo",
  REVOKE: "/listmessage/revoke",
};

export const FRIEND = {
  FRIEND: "/friend",
  REQUESTS: "/friend/request",
  APPLY: "/friend/apply",
};

export const IMAGES = {
  IMAGE: "/images",
  IMAGEMOBIE: "/images/imageMobie",
};
