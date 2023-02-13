import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Touchable = () => {
  const TouchableComponent = (text = "Select a option") => {
    return (
      <TouchableOpacity>
        <Text>{text}</Text>
      </TouchableOpacity>
    );
  };
  return { TouchableComponent };
};
const Select = ({ touchableComponent = Touchable, touchableText = "" }) => {
  const { TouchableComponent } = touchableComponent(touchableText);
};

export default Select;
