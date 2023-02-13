import {
  AppState,
  EventEmitter,
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  LogBox,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Image,
  HStack,
  NativeBaseProvider,
  StatusBar,
  VStack,
} from "native-base";
import * as React from "react";
import { TouchableNativeFeedback } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { Message } from "./components/layout/ChatRoom/Message";
import { Dimensions } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  getListMessageSkipAndLimit,
  sendMessage,
} from "../../apis/mess/message.api";
import { useRoute } from "@react-navigation/native";
import Socket from "../../common/socket";
import { useState } from "react";
import { useEffect } from "react";
import { initializationRoom } from "../../redux/actions/room/GetListRoomByIDAction";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import * as MediaLibrary from "expo-media-library";
import { useRef } from "react";
import { useMemo } from "react";
import { useCallback } from "react";
import Animated from "react-native-reanimated";
import ImageItem from "./components/layout/ModalImage/ImageItem";
import { uploadImage } from "../../apis/mess/images";
const width = Dimensions.get("window").width;
const heightScreen = Dimensions.get("window").height;
// const socket = Socket.socket;
const APPROXIMATE_HEIGHT = 250;
export const ChatRoom = (props) => {
  LogBox.ignoreLogs(["EventEmitter.removeListener"]);
  const dispatch = useDispatch();
  const room = useSelector((state) => state.Room);
  const user = useSelector((state) => state.User);
  const [messages, setMessages] = useState(room.list_message);
  const [messageContent, setMessageContent] = useState([]);
  // const [messageRender, setMessageRender] = useState([]);
  const [visible, setVisible] = useState();
  const [ref, setRef] = useState(null);
  const route = useRoute();
  const [nickname, setNickname] = useState("");
  const [image, setImage] = useState(null);
  const [isOpenKey, setIsOpenKey] = useState(false);
  const [assets, setAssets] = useState([]);
  const [listImageChoose, setListImageChoose] = useState([]);
  let inputRef = useRef();
  const [heightKeyBoard, setheightKeyBoard] = useState(APPROXIMATE_HEIGHT);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Videos,
    //   // allowsMultipleSelection: true,
    //   // selectionLimit: 10,
    //   // aspect: [4, 3],
    //   quality: 1,
    // });
    // console.log(result);

    const options = {
      // first: 2,
      sortBy: [MediaLibrary.SortBy.creationTime],
      mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
    };
    MediaLibrary.requestPermissionsAsync(false)
      .then((permissionRes) => {
        if (permissionRes.granted) {
          MediaLibrary.getAssetsAsync(options)
            .then(async (res) => {
              setAssets(res.assets);
              // console.log(res.assets);
            })
            .catch((err) => {
              console.log("Error : ", err.message);
            });
          // MediaLibrary.getAlbumsAsync({ includeSmartAlbums: true })
          //   .then(async (res) => {
          //     setAlbums(res);
          //   })
          //   .catch((err) => {
          //     console.log("Error : ", err.message);
          //   });
        } else {
          console.log("Something went wrong.");
        }
      })
      .catch((err) => {
        console.log("Error : ", err.message);
      });
  };

  const [avatar, setAvatar] = useState("");
  const [active, setActive] = useState("");
  // const bottomSheetRef = useRef(null);

  // variables
  // const snapPoints = useMemo(() => [heightKeyBoard + 10, "100%"]);

  // callbacks
  // const handleSheetChanges = useCallback((index) => {
  //   bottomSheetRef.current.snapToIndex(index);
  //   bottomSheetRef.current.enablePanDownToClose;
  // }, []);

  // const handleClosePress = () => {
  //   setIsOpenKey(false);
  //   setListImageChoose([]);
  //   bottomSheetRef.current.close();
  // };

  // useEffect(() => {
  //   let keyboardDidShowListener;

  //   keyboardDidShowListener = Keyboard.addListener(
  //     "keyboardDidShow",
  //     keyboardDidShow
  //   );

  //   return () => {
  //     if (keyboardDidShowListener) {
  //       keyboardDidShowListener.remove();
  //     }
  //   };
  // }, []);
  // const keyboardDidShow = (e) => {
  //   setVisible(false);
  //   setheightKeyBoard(e.endCoordinates.height); // sets the height after opening the keyboard
  // };

  const openImagePicker = () => {
    setVisible(true);
    Keyboard.dismiss();
    handleSheetChanges(0);
  };

  useEffect(() => {
    if (route.params != null) {
      setNickname(route.params.nickname);
      setAvatar(route.params.avatar);
      setActive(route.params.active);
    }
  }, [route]);

  useEffect(() => {
    setMessages(room.list_message);
  }, [room]);

  const handleSubmit = async (e) => {
    const nickname = user.first_name + " " + user.last_name;
    if (listImageChoose.length === 0) {
      const message = {
        id_room: room._id,
        list_member: room.list_member,
        mess_content: messageContent,
        name: nickname,

        avatar: user.avatar,
      };
      setMessageContent("");
      try {
        await sendMessage(message).then((data) => {
          Socket.emit("send_message", {
            data: { data: data.data, id_room: room._id },
          });
          // setMessageRender((list) => [data.data, ...list]);
        });
      } catch (error) {
        console.log("bbbbbbbb");
      }
    } else {
      const formData = new FormData();
      for (let i = 0; i < listImageChoose.length; i++) {
        // console.log(listImageChoose[i]);
        // formData.append("image",listImageChoose[i] );
        formData.append("file", {
          uri: listImageChoose[i].path,
          type: "image/jpeg",
          name: listImageChoose[i].filename,
        });
      }

      uploadImage(formData).then((course) => {
        let text_file = "";
        course.data.path.forEach((pathContex) => {
          text_file += `,${pathContex.imagePath}`;
        });
        const messageData = {
          id_room: room._id,
          list_member: room.list_member,
          mess_content: messageContent,
          name: nickname,
          avatar: user.avatar,
          mess_content: text_file,
          type_message: { type: "image" },
          time: new Date(),
        };
        sendMessage(messageData).then((data) => {
          console.log("testtt");
          Socket.emit("send_message", {
            data: { data: data.data, id_room: room._id },
          });
          handleClosePress();
        });
      });
    }
  };

  useEffect(() => {
    Socket.on("receive_message", (data) => {
      if (data.id_room === room._id) {
        // setMessageRender((list) => [data.data, ...list]);
        setMessages((list) => [data.data, ...list]);
        // if (user.phone === data.data.arthor.phone) {
        //   // ref.scrollToIndex({
        //   //   animated: true,
        //   //   index: 0,
        //   //   viewPosition: 0,
        //   // });
        // }
      }
    });

    Socket.on("receive_recallMess", (data) => {
      if (data.id_room === room._id) {
        if (messages[data.index]) {
          messages[data.index].mess_content = "";
          setMessages([...messages]);
        }
      }
    });
  }, [Socket, room._id]);

  const handleChooseImage = (image) => {
    let object = {
      id: image.id,
      path: image.uri,
      filename: image.filename,
      mimetype: image.mediaType,
      height: image.height,
      width: image.width,
      originalname: image.filename,
      type: "image/jpeg",
    };
    setListImageChoose((list) => [object, ...list]);
  };

  const handleNotChooseImage = (image) => {
    setListImageChoose(listImageChoose.filter((item) => item.id !== image.id));
  };

  return (
    <NativeBaseProvider>
      <StatusBar
        backgroundColor="#fae7e1"
        hidden={false}
        barStyle={"dark-content"}
      />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={"height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={10}
        >
          <SafeAreaView style={styles.container}>
            <HStack style={styles.header}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.goBack();
                  dispatch(initializationRoom());
                  // props.navigation.navigate("ChatListFriend");
                }}
              >
                <Ionicons name="chevron-back" size={24} color="black" />
              </TouchableOpacity>
              <VStack>
                {room.room_type ? (
                  <Text>Hiếu Võ</Text>
                ) : (
                  <View>
                    <Text
                      style={{ fontFamily: "Poppins-Medium", fontSize: 14 }}
                    >
                      {nickname}
                    </Text>
                    {/* <Text style={{width:'50%'}}>{active}</Text> */}
                  </View>
                )}
              </VStack>
              <TouchableOpacity
                onPress={() => {
                  if (room.name_room == "isFriend") {
                    props.navigation.navigate("OptionsFriend", {
                      nickname: nickname,
                      avatar: avatar,
                    });
                  } else {
                    props.navigation.navigate("Option");
                  }
                }}
              >
                <MaterialIcons name="menu" size={24} color="black" />
              </TouchableOpacity>
            </HStack>

            <LinearGradient
              style={{ flex: 1, flexDirection: "column" }}
              colors={["#f7dad5", "#ffd0f6", "#eaebf0"]}
            >
              <View
                style={{
                  flexDirection: "column",
                  // maxHeight: height - 40 - 100,
                  flex: 1,
                  paddingBottom: 20,
                  width: "100%",
                }}
              >
                {/* <Pressable
                  // background={TouchableNativeFeedback.Ripple("rgba(0,0,0,0)")}
                  style={{
                    width: "100%",
                    height:
                      isOpenKey || visible
                        ? heightScreen - 40 - 90 - heightKeyBoard
                        : heightScreen - 40 - 90,
                  }}
                  onPress={() => {
                    handleClosePress();
                    Keyboard.dismiss();
                    setVisible(false);
                  }}
                > */}
                <FlatList
                  overScrollMode="never"
                  ref={(ref) => {
                    setRef(ref);
                  }}
                  showsVerticalScrollIndicator={false}
                  showsHorizontalScrollIndicator={false}
                  estimatedItemSize={100}
                  initialScrollIndex={0}
                  inverted={-1}
                  data={messages}
                  renderItem={({ item, index }) => {
                    return (
                      <Message
                        id_room={room._id}
                        item={item}
                        key={index}
                        index={index}
                        isYou={user.phone === item.arthor.phone}
                        userPhone={user.phone}
                      />
                    );
                  }}
                  keyExtractor={(item) => item._id}
                  style={{
                    maxHeight: heightScreen - 100,
                    width: "100%",
                  }}
                />

                {/* </Pressable> */}
                <HStack
                  style={{
                    width: "100%",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    height: 40,
                  }}
                >
                  <HStack
                    style={{
                      backgroundColor: "#fff",
                      width: "85%",
                      // position: "absolute",
                      height: 40,
                      borderRadius: 20,
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: 15,
                    }}
                  >
                    {/* <TouchableOpacity
                      onPress={() => {
                        pickImage();
                        setVisible(true);
                        openImagePicker();
                        setIsOpenKey(true);
                      }}
                    > */}
                    <Image
                      source={require("../chat/assets/image/ChatRoom/image-gallery.png")}
                      style={{
                        width: 18,
                        height: 18,
                        resizeMode: "contain",
                        tintColor: "rgba(0,0,0,0.4)",
                      }}
                      alt={"Icon Link"}
                    />
                    {/* </TouchableOpacity> */}
                    <TextInput
                      onChangeText={setMessageContent}
                      value={messageContent}
                      placeholder="Send message"
                      ref={inputRef}
                      style={{ width: "75%", height: "100%" }}
                      onFocus={() => {
                        // setListImageChoose([]);
                        // handleClosePress();
                        // setVisible(false);
                        // setIsOpenKey(true);
                      }}
                    ></TextInput>
                    <TouchableOpacity>
                      <Image
                        source={require("../chat/assets/image/ChatRoom/voice-search.png")}
                        style={{
                          width: 18,
                          height: 18,
                          resizeMode: "contain",
                          tintColor: "rgba(0,0,0,0.4)",
                        }}
                        alt={"Icon Voice"}
                      />
                    </TouchableOpacity>
                  </HStack>
                  <TouchableOpacity
                    onPress={() => handleSubmit()}
                    style={{
                      borderRadius: 25,
                      backgroundColor: "#168fae",
                      width: 40,
                      height: 40,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image
                      source={require("../chat/assets/image/ChatRoom/send.png")}
                      style={{
                        width: 23,
                        height: 23,
                        resizeMode: "contain",
                        tintColor: "#fff",
                      }}
                      alt={"Icon Voice"}
                    />
                  </TouchableOpacity>
                </HStack>
              </View>
            </LinearGradient>
          </SafeAreaView>
          {/* <View
            style={{
              height: visible ? heightKeyBoard : 0,
            }}
          ></View> */}
          {/* <BottomSheet
            ref={bottomSheetRef}
            snapPoints={snapPoints}
            index={-1}
            // onChange={handleSheetChanges}
            enablePanDownToClose={true}
            onClose={() => {
              setListImageChoose([]);
              setVisible(false);
            }}
          >
            <View style={{ width: "100%" }}>
              <FlatList
                data={assets}
                numColumns={3}
                renderItem={({ item, index }) => (
                  <ImageItem
                    {...item}
                    key={index}
                    visible={visible}
                    onPressChooseImage={handleChooseImage}
                    onPressNotChooseImage={handleNotChooseImage}
                  />
                )}
              />
            </View>
          </BottomSheet> */}
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    width: "100%",
    height: 50,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fae7e1",
    paddingHorizontal: 10,
  },
});
