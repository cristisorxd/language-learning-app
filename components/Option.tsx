import { Text, TouchableOpacity } from "react-native";
import React from "react";
import tw from "twrnc";

interface IOption {
  word: string;
  isCorrect?: boolean;
  isDisabled?: boolean;
  onPress: () => void;
  selected: boolean;
}

const Option = ({
  word,
  isCorrect,
  onPress,
  selected,
  isDisabled,
}: IOption) => {
  const getBgColor = () => {
    if (isDisabled) {
      return "#6392a7";
    }
    if (selected) {
      return "#9fb6c0";
    }

    let bgColor = "#ffffff";
    if (isCorrect === true) {
      bgColor = "#75dafd";
    } else if (isCorrect === false) {
      bgColor = "#ff8089";
    }
    return bgColor;
  };

  const getTextColor = () => {
    if (isDisabled) {
      return "#638294";
    }

    let bgColor = "#3b6c81";
    if (isCorrect === true || isCorrect === false) {
      bgColor = "#ffffff";
    }
    return bgColor;
  };

  return (
    <TouchableOpacity
      style={tw`bg-[${getBgColor()}] p-4 shadow-lg rounded-2xl`}
      onPress={isDisabled ? undefined : onPress}
    >
      <Text
        style={[
          tw`text-[${getTextColor()}] text-lg font-bold`,
          selected && !isDisabled && tw`opacity-0`,
        ]}
      >
        {word}
      </Text>
    </TouchableOpacity>
  );
};

export default Option;
