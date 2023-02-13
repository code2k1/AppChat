import axios from "axios";
import * as SecureStore from "expo-secure-store";
export const request_api_put = async (url, values) => {
  try {
    const token_api = await SecureStore.getItemAsync("secure_token");

    const instance = axios.create({
      baseURL: "http://172.16.20.170:4001",
    });

    instance.defaults.headers.common["Authorization"] = `Bearer ${token_api}`;
    // instance.defaults.headers.common["Content-Type"] = "multipart/form-data";
    // instance.defaults.headers.post["Content-Type"] = "multipart/form-data";
    // const config = {
    //   headers: { "content-type": "multipart/form-data" },
    // };
    var user = await instance.put(url, values);
    return user;
  } catch (e) {}
};
