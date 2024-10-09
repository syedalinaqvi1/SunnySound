import { Pressable, Text } from "react-native";
import React from "react";

const ActiveButton = ({ buttontitle, onPress, backGroundColor }: any) => {
  return (
    <Pressable
      className={` w-[80%] h-[5%] items-center justify-center rounded-[12px] mt-5`}
      style={{ backgroundColor: backGroundColor }}
      onPress={onPress}
    >
      <Text className="text-2xl md:text-xl font-samibold text-[#fdfdfe] ">
        {buttontitle}
      </Text>
    </Pressable>
  );
};

export default ActiveButton;
