import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "./src/modules/auth/components/Home";
import DangNhap from "./src/modules/auth/screens/DangNhap";
import DangKy from "./src/modules/auth/screens/DangKy";
import QuenMatKhau from "./src/modules/auth/screens/QuenMatKhau";
import ResetMatKHau from "./src/modules/auth/screens/ResetMatKhau";
import NhapMaOTP from "./src/modules/auth/screens/NhapMaOTP";
import ModalScreen from "./src/modules/chat/components/layout/ModalSearch";
import BottomTabNavigator from "./src/modules/chat/components/layout/BottomTabNavigator";
import Option from "./src/modules/chat/Option";
import { ChatRoom } from "./src/modules/chat/ChatRoom";
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { LogBox } from "react-native";
import OptionsFriend from "./src/modules/chat/OptionsFriend";
import Profile from "./src/modules/info/screens/Profile";
LogBox.ignoreLogs(["EventEmitter.removeListener"]);
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Group>
            <Stack.Screen
              name="ChatListFriend"
              component={BottomTabNavigator}
            ></Stack.Screen>
            <Stack.Screen name="ChatRoom" component={ChatRoom}></Stack.Screen>
            <Stack.Screen name="Option" component={Option}></Stack.Screen>
            <Stack.Screen
              name="OptionsFriend"
              component={OptionsFriend}
            ></Stack.Screen>
          </Stack.Group>

          <Stack.Group>
            <Stack.Screen name="Home" component={Home}></Stack.Screen>
            <Stack.Screen name="DangNhap" component={DangNhap}></Stack.Screen>
            <Stack.Screen name="DangKy" component={DangKy}></Stack.Screen>
            <Stack.Screen name="Profile" component={Profile}></Stack.Screen>
            <Stack.Screen
              name="QuenMatKhau"
              component={QuenMatKhau}
            ></Stack.Screen>
            <Stack.Screen
              name="ResetMatKhau"
              component={ResetMatKHau}
            ></Stack.Screen>
            <Stack.Screen name="NhapMaOTP" component={NhapMaOTP}></Stack.Screen>
          </Stack.Group>

          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="ModalScreen" component={ModalScreen} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
