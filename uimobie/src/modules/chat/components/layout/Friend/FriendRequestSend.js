import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { HStack, VStack } from "native-base";
import * as React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { applyRequestsAddFriend } from "../../../../../apis/user/user.api";
import Socket from "../../../../../common/socket";
export default FriendRequestSend = (props) => {
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
            // uri: value.uri,
            uri: props.avatar,
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
        <VStack style={{ width: "65%" }}>
          <Text numberOfLines={1} style={stytes.name}>
            {value.name}
            {/* Võ Minh Hiếu */}
          </Text>
          <Text numberOfLines={1} style={stytes.preViewMessage}>
            {value.phone}
            {/* 0377723460 */}
          </Text>
        </VStack>

        <TouchableOpacity
          onPress={async () => {
            await applyRequestsAddFriend({
              status: "cancel",
              phone: value.phone,
              name: value.name,
              avatar: props.avatar,
            });
            Socket.emit("request_Add_Friend", {
              phone: value.phone,
              phoneMe: phoneMe,
            });
          }}
          style={{
            backgroundColor: "#eb4389",
            paddingHorizontal: 8,
            paddingVertical: 5,
            borderRadius: 5,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#fff",
              fontFamily: "Poppins-Medium",
              fontSize: 13,
            }}
          >
            cancel
          </Text>
        </TouchableOpacity>
      </HStack>
    </HStack>
  ) : (
    <Text
      style={{ fontFamily: "Poppins-Light", fontSize: 16, color: "#329db6" }}
    >
      Not friend requests send yet
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
      height: 5,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5.62,
    elevation: 7,
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
