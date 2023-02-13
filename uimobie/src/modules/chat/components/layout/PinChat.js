import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { HStack, VStack } from "native-base";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetListRoomByID } from "../../../../redux/actions/room/GetListRoomByIDAction";
import { useState } from "react";
import { useEffect } from "react";
import Socket from "../../../../common/socket";
import { getUserByPhone } from "../../../../apis/user/user.api";
const link =
  "https://th.bing.com/th/id/R.d3dc8025cb042a7df472465dbee26ad3?rik=3jpC3jxSM75D4A&riu=http%3a%2f%2fthuvienanhdep.net%2fwp-content%2fuploads%2f2015%2f11%2fnhung-hinh-anh-dep-de-thuong-va-dang-yeu-cua-dong-vat-trong-cuoc-song-9.jpg&ehk=l9eBKKAk1S3wrXMG0GbGY85e3gmZG2yX1QV10veyIgM%3d&risl=&pid=ImgRaw&r=0";

export const PinChat = (props) => {
  const user = useSelector((state) => state.User);
  const dispatch = useDispatch();
  const { item } = props;
  const sizeMessage = item.list_message.length;
  const [reMessage, setRemessage] = useState("");
  const [time, setTime] = useState("");
  const [nickname, setNickname] = useState();
  const [avatar, setAvatar] = useState("");
  const [active, setActive] = useState("");

  useEffect(() => {
    Socket.emit("join_room", item._id);
  }, []);

  useEffect(() => {
    Socket.on("receive_message", (data) => {
      if (data.id_room === item._id) {
        setRemessage(data.data.mess_content);
        const date = new Date(data.data.time);
        setTime(date.getHours() + ":" + date.getMinutes());
      }
    });
  }, [Socket, item._id]);

  const [dataTemp, setDataTemp] = useState("");

  useEffect(() => {
    if (sizeMessage > 0) {
      setRemessage(item.list_message[0].mess_content);
      const date = new Date(item.list_message[0].time);
      setTime(date.getHours() + ":" + date.getMinutes());
    } else {
      setRemessage("Chạm để nhắn tin");
      setTime("");
    }

    if (item.count_member === 2) {
      item.list_member.map((data, index) => {
        if (user.phone !== data.phone) {
          setNickname(data.nickname);
          setAvatar(data.avatar);
          setDataTemp(data);
        }
      });
    } else {
      setAvatar(
        "https://res.cloudinary.com/dkxrpvitu/image/upload/v1675318567/ThiLTTBDD/People_Group_Logo_1_z533t2.png"
      );
      setNickname(item.name_room);
    }
  }, [item]);

  return (
    <Pressable
      onPress={() => {
        dispatch(GetListRoomByID(item._id));
        props.navigation.navigate("ChatRoom", {
          nickname: nickname,
          avatar: avatar,
          active: active,
        });
      }}
    >
      <HStack style={stytes.container}>
        <View style={stytes.wrapperImg}>
          <Image
            source={{ uri: avatar ? avatar : null }}
            style={stytes.avatar}
          ></Image>
        </View>
        <HStack style={{ width: "79%" }}>
          <VStack style={{ width: "76%" }} space={0}>
            <Text numberOfLines={1} style={stytes.name}>
              {nickname}
            </Text>
            <Text numberOfLines={1} style={stytes.preViewMessage}>
              {reMessage}
            </Text>
          </VStack>
          <VStack style={stytes.wrapperRight} space={2}>
            <View style={stytes.wrapperNotify}>
              <Text numberOfLines={1} style={stytes.notify}>
                2
              </Text>
            </View>
            <Text numberOfLines={1} style={stytes.time}>
              {time}
            </Text>
          </VStack>
        </HStack>
      </HStack>
    </Pressable>
  );
};

const stytes = StyleSheet.create({
  container: {
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    height: 70,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  wrapperImg: {
    borderRadius: 50,
    padding: 1,
    width: 55,
    height: 55,
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 50,
    resizeMode: "contain",
  },
  name: {
    width: "100%",
    fontFamily: "Poppins-Medium",
    fontSize: 16,
  },
  preViewMessage: {
    width: "100%",
    fontFamily: "Poppins-Light",
    fontSize: 15,
    opacity: 0.5,
  },
  wrapperRight: {
    width: "27%",
    justifyContent: "center",
    alignItems: "center",
  },
  wrapperNotify: {
    width: 21,
    height: 21,
    borderRadius: 50,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  notify: {
    fontFamily: "Poppins-Light",
    color: "white",
    fontSize: 13,
  },
  time: {
    fontFamily: "Poppins-Light",
    textAlign: "center",
    opacity: 0.5,
    fontSize: 14,
  },
});
