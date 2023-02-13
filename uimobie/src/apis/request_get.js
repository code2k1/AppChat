import axios from "axios";
import * as SecureStore from "expo-secure-store";
export const request_api_get = async (url, values) => {
  try {
    const token_api = await SecureStore.getItemAsync("secure_token");

    const instance = axios.create({
      // baseURL: "http://192.168.1.7:4001",
      baseURL: "http://172.16.20.170:4001",
    });

    instance.defaults.headers.common["Authorization"] = `Bearer ${token_api}`;

    // console.log(token_api);
    let temp = ``;
    // Object.values(values).foreach((value) => {
    //   temp1 += `/${value}`;
    // });

    if (values) {
      if (values._id) {
        var value = await instance.get(`${url}/${values["_id"]}`, values);
        return value;
      }
      if (values.id_room) {
        var value = await instance.get(
          `${url}/${values["id_room"]}/${values["skip"]}/${values["limit"]}`,
          values
        );
        return value;
      }
      if (values.phone) {
        var value = await instance.get(`${url}/${values["phone"]}`, values);
        return value;
      }
    } else {
      var value = await instance.get(url, values);
      return value;
    }
  } catch (e) {}
};
