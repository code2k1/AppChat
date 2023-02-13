import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Login } from "../../../redux/actions/auth/LoginAction";

const DangNhap = (props) => {
  const user = useSelector((state) => state.User);
  const dispatch = useDispatch();

  const [phone, setPhone] = useState("0377723460");
  const [passWord, setPassWord] = useState("hieu123");

  const [checkValidPhone, setCheckValidPhone] = useState(false);
  const [checkValidPassword, setCheckValidPassword] = useState(false);

  const handleCheckPhone = (text) => {
    const regexPhoneNumber = /((09|03|07|08|05)+([0-9]{8})\b)/g;

    setPhone(text);
    if (regexPhoneNumber.test(text)) {
      setCheckValidPhone(false);
    } else {
      setCheckValidPhone(true);
    }
  };

  const handleCheckPassword = (text) => {
    const regexPassWord = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;

    setPassWord(text);
    if (regexPassWord.test(text)) {
      setCheckValidPassword(false);
    } else {
      setCheckValidPassword(true);
    }
  };

  useEffect(() => {
    if (user.error) {
      Alert.alert("Thông báo", "Tài khoản, mật khẩu sai");
    }

    if (user.isLogin) {
      props.navigation.navigate("ChatListFriend");
    }
  }, [user]);

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ marginTop: 40 }}>
        {/* <Text>Is Login: {user.isLogin === true ? "true" : "false"}</Text> */}
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../../../assets/logoDangNhap.png")}
            style={{ height: 200, width: 260, marginLeft: 0 }}
          />
        </View>
        <View style={{ marginLeft: 40, marginTop: 20 }}>
          <Text style={{ fontSize: 28, fontWeight: "700" }}>Login</Text>
        </View>
        <View>
          <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../../../../assets/phone.png")}
                style={{ height: 25, width: 25, marginTop: 20 }}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  onChangeText={(text) => handleCheckPhone(text)}
                  value={phone}
                  placeholder="Phone number"
                  style={styles.input}
                  maxLength={10}
                />
              </View>
            </View>
            {checkValidPhone ? (
              <Text style={{ color: "red", marginLeft: 200 }}>
                Wrong format Phone
              </Text>
            ) : (
              <Text> </Text>
            )}
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../../../../assets/lock.png")}
                style={{ height: 25, width: 25, marginTop: 20 }}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Password"
                  value={passWord}
                  onChangeText={(text) => handleCheckPassword(text)}
                  style={styles.input}
                  secureTextEntry
                />
              </View>
            </View>
            {checkValidPassword ? (
              <Text style={{ color: "red", marginLeft: 150, width: "50%" }}>
                Minimum seven characters, at least one letter and one number
              </Text>
            ) : (
              <Text> </Text>
            )}
            <View style={{ top: 20, marginLeft: 200 }}>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate("QuenMatKhau");
                }}
              >
                <Text
                  style={{ color: "rgba(28,100,209,255)", fontWeight: "500" }}
                >
                  Forgot Password ?
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (checkValidPassword == false && checkValidPhone == false) {
                    console.log("aaaaa");
                    dispatch(Login(phone, passWord));
                  } else {
                    Alert.alert(
                      "Notification",
                      "Please enter the correct format"
                    );
                  }
                  // dispatch(GetUser());
                }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Log in</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginTop: 35, flexDirection: "row" }}>
              <Text style={{ color: "rgba(136,147,165,255)" }}>
                New to Logistics ?
              </Text>
              <TouchableOpacity
                onPress={() => {
                  props.navigation.navigate("DangKy");
                }}
              >
                <Text
                  style={{
                    marginLeft: 5,
                    color: "rgba(28,100,209,255)",
                    fontWeight: "500",
                  }}
                >
                  Reister
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
    // <View style={{ flex: 1 }}>
    //   <Otp></Otp>
    // </View>
  );
};

export default DangNhap;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    marginLeft: 10,
    width: "70%",
    borderBottomWidth: 1,
    borderColor: "rgba(232,233,236,255)",
    flexDirection: "row",
  },
  input: {
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  button: {
    backgroundColor: "rgba(0,101,255,255)",
    width: "100%",
    borderRadius: 10,
    padding: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  buttonContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
});
