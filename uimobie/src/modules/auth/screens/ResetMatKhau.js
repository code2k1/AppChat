import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Alert } from "react-native";

const ResetMatKhau = (props) => {
  const [passWord, setPassWord] = useState();
  const [confirmPassWord, setConfirmPassWord] = useState();

  const [checkValidPassword, setCheckValidPassword] = useState(false);
  const [checkConfirmValidPassword, setCheckConfirmValidPassword] =
    useState(false);

  const route = useRoute();
  let data = route.params;

  const handleCheckPassword = (text) => {
    const regexPassWord = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{7,}$/;

    setPassWord(text);
    if (regexPassWord.test(text)) {
      setCheckValidPassword(false);
    } else {
      setCheckValidPassword(true);
    }
  };

  const handleCheckConfirmPassword = (text) => {
    setConfirmPassWord(text);
    if (text === passWord) {
      setCheckConfirmValidPassword(false);
    } else {
      setCheckConfirmValidPassword(true);
    }
  };

  const RessetPassword = async () => {
    await fetch("http://" + data.host + ":4001/user/resetPassword", {
      method: "POST", // or 'PUT'
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: data.phoneNumber,
        password: confirmPassWord,
      }),
    }).then(() => {
      props.navigation.navigate("DangNhap");
    });
  };

  const changeDangNhap = () => {
    props.navigation.navigate("DangNhap");
  };

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <View style={{ marginTop: 20 }}>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <Image
            source={require("../../../../assets/DoiLaiMatKhau.png")}
            style={{ height: 260, width: 300 }}
          />
        </View>
        <View style={{ marginLeft: 40 }}>
          <Text style={{ fontSize: 28, fontWeight: "700" }}>
            Reset {"\n"}Password
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../../../../assets/lock.png")}
                style={{ height: 25, width: 25, marginTop: 20 }}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="New password"
                  value={passWord}
                  onChangeText={(text) => handleCheckPassword(text)}
                  secureTextEntry
                  style={styles.input}
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
            <View style={{ flexDirection: "row" }}>
              <Image
                source={require("../../../../assets/lock.png")}
                style={{ height: 25, width: 25, marginTop: 20 }}
              />
              <View style={styles.inputContainer}>
                <TextInput
                  placeholder="Confirm new password"
                  value={confirmPassWord}
                  onChangeText={(text) => handleCheckConfirmPassword(text)}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>
            {checkConfirmValidPassword ? (
              <Text style={{ color: "red", marginLeft: 150, width: "50%" }}>
                please enter the correct password
              </Text>
            ) : (
              <Text> </Text>
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => {
                  if (
                    checkValidPassword == false &&
                    checkConfirmValidPassword == false
                  ) {
                    RessetPassword();
                    //props.navigation.navigate("DangNhap")
                  } else {
                    Alert.alert(
                      "Notification",
                      "Please enter the correct format"
                    );
                  }
                }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </View>
    </View>
  );
};

export default ResetMatKhau;

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
    width: 300,
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
    marginTop: 60,
  },
});
