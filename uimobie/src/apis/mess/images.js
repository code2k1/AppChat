import { IMAGES } from "../_constant";
// import { request_api_post } from "../request_post";
import { request_api_get } from "../request_get";
import { request_api_post } from "../request_post";

export const uploadImage = async (values) => {
  return await request_api_post(IMAGES.IMAGE, values);
};
