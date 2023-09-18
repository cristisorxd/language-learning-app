import React from "react";
import { View, Text } from "react-native";
import tw from "twrnc";

interface ITooltip {
  text: string;
  position: { x: number; y: number };
}

const Tooltip = ({ text, position }: ITooltip) => {
  return (
    <View
      style={{
        position: "absolute",
        top: position.y - 100,
        left: position.x,
        backgroundColor: "white",
        padding: 5,
        zIndex: 1,
      }}
    >
      <Text style={tw`text-[#3b6c81] font-bold`}>{text}</Text>
    </View>
  );
};

export default Tooltip;
