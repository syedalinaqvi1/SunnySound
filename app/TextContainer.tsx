import React from "react";
import { View, Text } from "react-native";

const TextContainer = ({ item }: any) => {
  return (
    <View
      className="bg-[#F3F7FF] py-2 pl-4 rounded-[17px] mt-4 min-w-2 mx-4"
      key={item.title}
    >
      <Text className="text-lg md:text-xl font-bold text-[#5D687E]">
        {item.title}
      </Text>
    </View>
  );
};

export default TextContainer;
