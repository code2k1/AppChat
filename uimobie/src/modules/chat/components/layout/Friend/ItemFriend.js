import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { HStack, VStack } from "native-base";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { sendRequestsAddFriend } from "../../../../../apis/user/user.api";
import Socket from "../../../../../common/socket";
export default ItemFriend = (props) => {
  const [value, setValue] = useState(props.value);
  const [phoneMe, setPhoneMe] = useState(props.phoneMe);
  useEffect(() => {
    setValue(props.value);
  }, [props]);
  return value ? (
    <HStack style={stytes.container}>
      <View style={stytes.wrapperImg}>
        <Image
          source={{
            uri: value.uri,
          }}
          style={stytes.avatar}
        ></Image>
      </View>
      <HStack
        style={{
          width: "80%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <VStack style={{ width: "73%" }} space={0}>
          <Text numberOfLines={1} style={stytes.name}>
            {value.name}
          </Text>
          <Text numberOfLines={1} style={stytes.preViewMessage}>
            {value.phone}
          </Text>
        </VStack>
        <TouchableOpacity
          onPress={() => {
            sendRequestsAddFriend({
              phone: value.phone,
              name: value.name,
              avatar: value.uri,
            }).then(() => {
              Socket.emit("request_Add_Friend", {
                phone: value.phone,
                phoneMe: phoneMe,
              });
              Alert.alert("Thông báo", "Đã gửi kết bạn");
              props.setValue(null);
            });

            // Socket.emit("request_Add_Friend", {
            //   phone: value.phone,
            //   phoneMe: phoneMe,
            // });
          }}
          style={{
            backgroundColor: "#329db6",
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 5,
            height: 35,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "Poppins-Medium",
              fontSize: 14,
            }}
          >
            Add
          </Text>
        </TouchableOpacity>
      </HStack>
    </HStack>
  ) : (
    <Text style={{ fontFamily: "Poppins-Light", fontSize: 14, opacity: 0.7 }}>
      No result
    </Text>
  );
};

const stytes = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    width: "95%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 60,
    // backgroundColor: "rgba(255,255,255,1)",
    backgroundColor: "#f1ffff",
    borderRadius: 10,

    shadowColor: "#003d4c",
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20.0,
    elevation: 24,
  },
  wrapperImg: {
    borderRadius: 50,
    width: 45,
    height: 45,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 50,
    resizeMode: "contain",
  },
  name: {
    width: "100%",
    fontFamily: "Poppins-Medium",
    fontSize: 13,
  },
  preViewMessage: {
    width: "100%",
    fontFamily: "Poppins-Light",
    fontSize: 13,
  },
});
