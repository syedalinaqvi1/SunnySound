import { Image, Text, View } from "react-native";
import React from "react";
import ActiveButton from "./ActiveButton";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const handleFirstScreen = () => {
    router.push("/testOne");
  };

  const handleSecondScreen = () => {
    router.push("/test");
  };

  const handleThirdScreen = () => {
    router.push("/testThree");
  };

  return (
    <View className="flex-1  items-center justify-center w-[100%] bg-[#F3F7FF]">
      <Text className="text-3xl md:text-2xl font-bold text-[#020408] mb-20">
        Welcome
      </Text>
      <Image
        source={require("./assets/images/logo.png")}
        className="w-[70%] h-[10%] mb-20"
        resizeMode="contain"
      />
      <ActiveButton
        buttontitle={"First Screen"}
        onPress={handleFirstScreen}
        backGroundColor={"#F4C417"}
      />
      <ActiveButton
        buttontitle={"Second Screen"}
        onPress={handleSecondScreen}
        backGroundColor={"#731811"}
      />
      <ActiveButton
        buttontitle={"Third Screen"}
        onPress={handleThirdScreen}
        backGroundColor={"#0D61FD"}
      />
    </View>
  );
}
