import { LinearGradient } from "expo-linear-gradient";
import { HStack, View, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text } from "react-native";
import { Dimensions } from "react-native";
import ImageCompose from "./ImageCompose";
import ImageComposeRevert from "./ImageComposeRevert";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SimpleLineIcons } from "@expo/vector-icons";
import { Menu } from "react-native-material-menu";
import { MenuItem } from "react-native-material-menu";
import { TouchableOpacity } from "react-native-gesture-handler";
import {
  deleteToMessage,
  revokeMessage,
} from "../../../../../apis/mess/message.api";
import Socket from "../../../../../common/socket";
const width = Dimensions.get("window").width;
const height = Dimensions.get("window").height;
export const Message = (props) => {
  const { item } = props;
  const [time, setTime] = useState();
  const [uris, setUris] = useState();
  const [isLoad, setIsLoad] = useState(false);
  const [mess_content, setMess_content] = useState(item.mess_content);
  const [visible, setVisible] = useState(false);
  const hideMenu = () => setVisible(false);
  const showMenu = () => setVisible(true);
  useEffect(() => {
    const date = new Date(item.time);
    setTime(date.getHours() + ":" + date.getMinutes());

    setUris(item.mess_content.split(","));
    setIsLoad(true);
  }, []);

  useEffect(() => {
    setMess_content(item.mess_content);
  }, [props]);

  return isLoad ? (
    item.type_message.type !== "image" ? (
      props.isYou ? (
        <VStack
          style={{
            flexDirection: "row-reverse",
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
        >
          <VStack space={1}>
            <HStack
              style={{
                flexDirection: "row-reverse",
                paddingRight: 10,
                alignItems: "center",
              }}
              space={2}
            >
              <View
                style={{
                  borderRadius: 20,
                  width: 25,
                  height: 25,
                  overflow: "hidden",
                }}
              >
                <Image
                  style={{ width: "100%", height: "100%" }}
                  source={{
                    uri: item.arthor.avatar,
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Medium",
                  opacity: 0.5,
                }}
              >
                {time}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Medium",
                  opacity: 0.8,
                }}
              >
                You
              </Text>
            </HStack>
            <HStack style={{ alignItems: "center" }} space={1}>
              <Menu
                visible={visible}
                style={{
                  position: "relative",
                  width: 165,
                }}
                anchor={
                  <MaterialCommunityIcons
                    onPress={showMenu}
                    name="dots-vertical"
                    size={20}
                    color="rgba(0,0,0,0.3)"
                  />
                }
                onRequestClose={hideMenu}
              >
                <MenuItem
                  onPress={() => {
                    hideMenu();
                    deleteToMessage({
                      id_room: props.id_room,
                      index: props.index,
                    });
                    setMess_content("");
                  }}
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={20}
                    color="rgba(255,67,142,0.7)"
                  />
                  <Text
                    style={{
                      color: "rgba(255,67,142,0.7)",
                      fontWeight: "400",
                    }}
                  >
                    Delete for me only
                  </Text>
                </MenuItem>
                <MenuItem
                  onPress={() => {
                    hideMenu();
                    revokeMessage({
                      id_room: props.id_room,
                      index: props.index,
                    });
                    Socket.emit("recall_message", {
                      data: { id_room: props.id_room, index: props.index },
                    });
                  }}
                >
                  <View style={{ flexDirection: "row" }}>
                    <SimpleLineIcons
                      name="reload"
                      size={16}
                      color="rgba(255,67,142,0.7)"
                    />
                    <Text
                      style={{
                        color: "rgba(255,67,142,0.7)",
                        fontWeight: "400",
                        textAlign: "center",
                        width: 50,
                      }}
                    >
                      Recall
                    </Text>
                  </View>
                </MenuItem>
              </Menu>

              <LinearGradient
                start={{ x: -0.2, y: 0 }}
                colors={["#48a3ec", "#48a3ec"]}
                style={stytes.content}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins-Light",
                    color: "#fff",
                  }}
                >
                  {mess_content === "" ||
                  (item.is_removes &&
                    item.is_removes.some(
                      (course) => course.phone === props.userPhone
                    )) ? (
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins-Light",
                        color: "rgba(0,0,0,0.5)",
                        fontWeight: "400",
                      }}
                    >
                      Tin nhắn đã được thu hồi
                    </Text>
                  ) : (
                    item.mess_content
                  )}
                </Text>
              </LinearGradient>
            </HStack>
          </VStack>
        </VStack>
      ) : (
        <HStack
          style={{
            width: "100%",
            flexDirection: "row",
            paddingHorizontal: 20,
            paddingVertical: 15,
          }}
          space={2}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 20,
              width: 25,
              height: 25,
              overflow: "hidden",
            }}
          >
            <Image
              style={{ width: "100%", height: "100%" }}
              source={{
                uri: item.arthor.avatar,
              }}
            />
          </View>
          <VStack>
            <HStack
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingRight: 10,
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Medium",
                  opacity: 0.8,
                }}
              >
                {item.arthor.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  fontFamily: "Poppins-Medium",
                  opacity: 0.5,
                }}
              >
                {time}
              </Text>
            </HStack>
            <HStack style={{ alignItems: "center" }} space={1}>
              <LinearGradient
                start={{ x: -0.2, y: 0 }}
                colors={["#fff", "#fff"]}
                style={stytes.contentRevert}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins-Light",
                    color: "#000",
                  }}
                >
                  {mess_content === "" ||
                  (item.is_removes &&
                    item.is_removes.some(
                      (course) => course.phone === props.userPhone
                    )) ? (
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: "Poppins-Light",
                        color: "rgba(0,0,0,0.5)",
                        fontWeight: "400",
                      }}
                    >
                      Tin nhắn đã được thu hồi
                    </Text>
                  ) : (
                    item.mess_content
                  )}
                </Text>
              </LinearGradient>
              <Menu
                visible={visible}
                style={{
                  position: "relative",
                  width: 165,
                }}
                anchor={
                  <MaterialCommunityIcons
                    onPress={showMenu}
                    name="dots-vertical"
                    size={20}
                    color="rgba(0,0,0,0.3)"
                  />
                }
                onRequestClose={hideMenu}
              >
                <MenuItem
                  onPress={() => {
                    hideMenu();
                    deleteToMessage({
                      id_room: props.id_room,
                      index: props.index,
                    });
                    setMess_content("");
                  }}
                >
                  <MaterialCommunityIcons
                    name="delete"
                    size={20}
                    color="rgba(255,67,142,0.7)"
                  />
                  <Text
                    style={{
                      color: "rgba(255,67,142,0.7)",
                      fontWeight: "400",
                    }}
                  >
                    Delete for me only
                  </Text>
                </MenuItem>
              </Menu>
            </HStack>
          </VStack>
        </HStack>
      )
    ) : props.isYou ? (
      <VStack
        style={{
          flexDirection: "row-reverse",
          paddingHorizontal: 20,
          paddingVertical: 15,
          width: "100%",
        }}
      >
        <VStack space={1} style={{ width: "100%" }}>
          <HStack
            style={{
              flexDirection: "row-reverse",
              paddingRight: 10,
              alignItems: "center",
              width: "100%",
            }}
            space={2}
          >
            <View
              style={{
                borderRadius: 40,
                width: 25,
                height: 25,
                overflow: "hidden",
              }}
            >
              <Image
                style={{ width: "100%", height: "100%" }}
                source={{
                  uri: item.arthor.avatar,
                }}
              />
            </View>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins-Medium",
                opacity: 0.5,
              }}
            >
              {time}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins-Medium",
                opacity: 0.8,
              }}
            >
              You
            </Text>
          </HStack>
          <HStack
            style={{ alignItems: "center", justifyContent: "flex-end" }}
            space={1}
          >
            <Menu
              visible={visible}
              style={{
                position: "relative",
                width: 165,
              }}
              anchor={
                <MaterialCommunityIcons
                  onPress={showMenu}
                  name="dots-vertical"
                  size={20}
                  color="rgba(0,0,0,0.3)"
                />
              }
              onRequestClose={hideMenu}
            >
              <MenuItem
                onPress={() => {
                  hideMenu();
                  deleteToMessage({
                    id_room: props.id_room,
                    index: props.index,
                  });
                  setMess_content("");
                }}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={20}
                  color="rgba(255,67,142,0.7)"
                />
                <Text
                  style={{
                    color: "rgba(255,67,142,0.7)",
                    fontWeight: "400",
                  }}
                >
                  Delete for me only
                </Text>
              </MenuItem>
              <MenuItem
                onPress={() => {
                  hideMenu();
                  revokeMessage({
                    id_room: props.id_room,
                    index: props.index,
                  });
                  Socket.emit("recall_message", {
                    data: { id_room: props.id_room, index: props.index },
                  });
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  <SimpleLineIcons
                    name="reload"
                    size={16}
                    color="rgba(255,67,142,0.7)"
                  />
                  <Text
                    style={{
                      color: "rgba(255,67,142,0.7)",
                      fontWeight: "400",
                      textAlign: "center",
                      width: 50,
                    }}
                  >
                    Recall
                  </Text>
                </View>
              </MenuItem>
            </Menu>
            {mess_content === "" ||
            item.is_removes.some(
              (course) => course.phone === props.userPhone
            ) ? (
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: "Poppins-Light",
                  color: "rgba(0,0,0,0.5)",
                  fontWeight: "400",
                }}
              >
                Hình ảnh đã được thu hồi
              </Text>
            ) : (
              <ImageCompose data={uris} />
            )}
          </HStack>
        </VStack>
      </VStack>
    ) : (
      <HStack
        style={{
          flexDirection: "row",
          paddingHorizontal: 20,
          paddingVertical: 15,
        }}
        space={2}
      >
        <View
          style={{
            borderRadius: 20,
            width: 25,
            height: 25,
            overflow: "hidden",
          }}
        >
          <Image
            style={{ width: "100%", height: "100%" }}
            source={{
              uri: item.arthor.avatar,
            }}
          />
        </View>
        <VStack>
          <HStack
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingRight: 10,
              width: "85%",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins-Medium",
                opacity: 0.8,
              }}
            >
              {item.arthor.name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: "Poppins-Medium",
                opacity: 0.5,
                marginRight: "15%",
              }}
            >
              {time}
            </Text>
          </HStack>
          <HStack
            style={{ alignItems: "center", justifyContent: "flex-start" }}
            space={1}
          >
            <View
              style={{
                width: "70%",
                borderRadius: 15,
                overflow: "hidden",
              }}
            >
              {mess_content === "" ||
              item.is_removes.some(
                (course) => course.phone === props.userPhone
              ) ? (
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: "Poppins-Light",
                    color: "rgba(0,0,0,0.5)",
                    fontWeight: "400",
                  }}
                >
                  Hình ảnh đã được thu hồi
                </Text>
              ) : (
                <ImageComposeRevert data={uris} />
              )}
            </View>
            <Menu
              visible={visible}
              style={{
                position: "relative",
                width: 165,
              }}
              anchor={
                <MaterialCommunityIcons
                  onPress={showMenu}
                  name="dots-vertical"
                  size={20}
                  color="rgba(0,0,0,0.3)"
                />
              }
              onRequestClose={hideMenu}
            >
              <MenuItem
                onPress={() => {
                  hideMenu();
                  deleteToMessage({
                    id_room: props.id_room,
                    index: props.index,
                  });
                  setMess_content("");
                }}
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={20}
                  color="rgba(255,67,142,0.7)"
                />
                <Text
                  style={{
                    color: "rgba(255,67,142,0.7)",
                    fontWeight: "400",
                  }}
                >
                  Delete for me only
                </Text>
              </MenuItem>
            </Menu>
          </HStack>
        </VStack>
      </HStack>
    )
  ) : null;
};

const stytes = StyleSheet.create({
  image: {
    width: 30,
    height: 30,
    borderRadius: 25,
    resizeMode: "contain",
  },
  imageRevert: {
    width: 25,
    height: 25,
    borderRadius: 25,
    resizeMode: "contain",
  },
  content: {
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: width - width * 0.28,
    minHeight: 45,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  contentRevert: {
    borderTopRightRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: width - width * 0.28,
    minHeight: 45,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
});
