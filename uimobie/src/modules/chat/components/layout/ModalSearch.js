import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { HStack, NativeBaseProvider, VStack } from "native-base";
import * as React from "react";
import { Ionicons } from "@expo/vector-icons";
import { LogBox } from "react-native";

export default function ModalScreen({ navigation }) {
  return (
    <NativeBaseProvider>
      <VStack flex={1}>
        <HStack style={{ alignItems: "center" }}>
          <View
            style={{
              backgroundColor: "#fff",
              width: "15%",
              height: 45,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={{ opacity: 0.6 }}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back-sharp" size={30} color="black" />
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Search anything..."
            style={{
              fontSize: 13,
              fontFamily: "Poppins-Light",
              width: "70%",
              backgroundColor: "#fff",
              height: 45,
            }}
          />
          <View
            style={{
              backgroundColor: "#fff",
              width: "15%",
              height: 45,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity style={{ opacity: 0.6 }}>
              <Ionicons name="ios-close" size={30} color="black" />
            </TouchableOpacity>
          </View>
        </HStack>
      </VStack>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({});
