import {
  Text,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
} from "react-native";
import React, { ReactNode } from "react";
import tw from "twrnc";

interface IButton {
  children: ReactNode;
  isCorrect?: boolean;
  isDisabled?: boolean;
  style?: StyleProp<ViewStyle>;
  onPress: () => void;
}

const Button = ({
  children,
  isCorrect,
  isDisabled,
  onPress,
  style,
}: IButton) => {
  const getButtonStyles = () => {
    const baseStyle = ["py-5", "mx-6", "rounded-3xl", "items-center"];

    let bgColor = "#6392a7"; 

    if (isDisabled) {
      bgColor = "#17e3e9";
    }
    if (isCorrect === true) {
      bgColor = "#6fd890"; 
    } else if (isCorrect === false) {
      bgColor = "#ff8089"; 
    }

    baseStyle.push(`bg-[${bgColor}]`);
    return [tw`${baseStyle.join(" ")}`, style];
  };

  return (
    <TouchableOpacity style={getButtonStyles()} onPress={onPress}>
      <Text style={tw`uppercase font-bold text-lg text-white`}>{children}</Text>
    </TouchableOpacity>
  );
};

export default Button;
