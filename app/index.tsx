import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  View,
  Text,
  Dimensions,
  Pressable,
  StatusBar,
} from "react-native";
import Animated, {
  withDelay,
  withSpring,
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import * as Progress from "react-native-progress";
import Hexagon from "./Hexagon";
import TextContainer from "./TextContainer";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const textData = [
  { id: 1, title: "Daily goal complete!" },
  { id: 2, title: "You completed 30 of 30 exercises" },
  { id: 3, title: "You trained for 12 min, 37 sec" },
  { id: 4, title: "Trivia score: 55 correct of 60" },
];

const Trophy_Hexagon = {
  activeColor: ["#ad8578", "#a57085", "#985299", "#9145a1"],
  fillColor: ["#800076", "#770DFD"],
  borderColor: ["#E06B16", "#D600C4"],
};

export default function AnimatedScreen() {
  const [text] = useState("Great Work!");
  const [progressBar, setProgressBar] = useState(0);
  const progressBarHeight = Math.ceil(deviceWidth / 60);
  const [progressBarC, setProgressBarC] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const cardScale = useSharedValue(1);

  const startProgressBar = async () => {
    let progressValue = 0;
    const stepDuration = 1;
    const increment = 0.01;
    const interval = setInterval(() => {
      progressValue += increment;
      setProgressBar(progressValue);
      if (progressValue >= 1) {
        clearInterval(interval);
        setProgressBarC(true);
      }
    }, stepDuration);
  };

  const animations = textData.map(() => useSharedValue(0));

  useEffect(() => {
    !progressBarC && startProgressBar();

    progressBarC && func();
  }, [progressBarC]);

  const func = () => {
    animations.forEach((anim, index) => {
      anim.value = withDelay(
        index * 500,
        withSpring(1, { damping: 10, stiffness: 80 })
      );
    });

    setTimeout(() => {
      setShowCard(true);
      cardScale.value = withSpring(1, { damping: 10, stiffness: 80 });
    }, textData.length * 500);
  };

  const animatedCardStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: cardScale.value }],
    };
  });

  return (
    <View className="flex-1 items-center w-[100%]  bg-[#F3F7FF]">
      <View className=" items-center flex-1 w-[100%] h-[100%] ">
        <Image
          source={require("./assets/images/logo.png")}
          className="w-[50%] h-[6%] mt-12 "
          resizeMode="contain"
        />
        <Text className="text-[32px] md:text-3xl text-[#313B4D] text-center mt-2 ">
          {text}
        </Text>
        <View className="bg-white w-[91%] p-2 rounded-[17px] pb-5 mt-4 ">
          <View className="items-center flex-row px-2 pt-1">
            <Hexagon
              hexagonSize={deviceHeight / 22}
              fillPercentage={1}
              cornerRadius={2.5}
              iconWidth={deviceHeight / 22}
              iconHeight={deviceHeight / 22}
              strokeWidth={4}
              activeColor={Trophy_Hexagon.activeColor}
              fillColor={Trophy_Hexagon.fillColor}
              borderColor={Trophy_Hexagon.borderColor}
            />
            <View className="pl-1">
              <Text className="text-2xl md:text-2xl font-bold text-[#313B4D]">
                Training complete
              </Text>
              <Text className="text-lg md:text-2xl font-normal text-[#5D687E]">
                15 minutes - 30 exercises
              </Text>
            </View>
          </View>
          <View className=" items-center flex-row self-center w-[85%] ">
            <Progress.Bar
              progress={progressBar}
              width={deviceWidth / 1.8}
              height={progressBarHeight}
              color={"#0D61FD"}
              unfilledColor={"white"}
              borderWidth={1}
              borderColor="#C9D0DE"
            />
            <View className="justify-between items-center flex-row self-center pb-1  sm:w-[26%] md:w-[15%] lg:w-[10%] ">
              <Text className="text-base md:text-xl pl-2 text-[#5D687E]">
                100 of
              </Text>
              <Text className="text-base md:text-xl text-[#5D687E]">
                {` ${(progressBar * 100).toFixed(0)}`}
              </Text>
            </View>
          </View>

          <View>
            {textData.map((item, index) => {
              const animatedStyle = useAnimatedStyle(() => {
                return {
                  transform: [{ scale: animations[index].value }],
                };
              });

              return (
                <Animated.View key={index.toString()} style={animatedStyle}>
                  <TextContainer item={item} />
                </Animated.View>
              );
            })}
          </View>
        </View>
        {showCard && (
          <Animated.View
            style={[animatedCardStyle]}
            className="bg-white w-[91%] p-2 rounded-[17px] mt-4 py-7 px-4 mb-4"
          >
            <View className="items-center rounded-[30px] z-10 flex-row ">
              <Image
                source={require("./assets/images/flame.png")}
                style={{ width: 70, height: 120 }}
                resizeMode="cover"
              />
              <View>
                <View className=" ml-6">
                  <Text className="text-2xl md:text-3xl font-semibold text-[#313B4D]">
                    7 days in a row!
                  </Text>
                  <View className="items-center flex-row mt-2 mb-2  ">
                    <Image
                      source={require("./assets/images/calendar2.png")}
                      style={{ width: 35, height: 35, marginLeft: 1 }}
                      resizeMode="cover"
                      tintColor={"#0D61FD"}
                    />
                    <Image
                      source={require("./assets/images/line.png")}
                      style={{ width: 135, height: 50, marginLeft: 2 }}
                      resizeMode="contain"
                      tintColor={"#0D61FD"}
                    />
                    <Image
                      source={require("./assets/images/checkmark.png")}
                      style={{ width: 40, height: 40 }}
                      resizeMode="cover"
                      tintColor={"#0D61FD"}
                    />
                  </View>

                  <Text className="text-lg md:text-xl font-normal text-[#5D687E] w-60">
                    You are on a streak! See ya tomorrow, ok?
                  </Text>
                </View>
              </View>
            </View>
          </Animated.View>
        )}
      </View>
      <View
        className="h-[10%] w-full bg-white items-center justify-evenly"
        style={{
          elevation: 5,
          shadowColor: "black",
          shadowOffset: {
            width: 4,
            height: 6,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.5,
        }}
      >
        <Pressable className="w-[91%] h-[60%] bg-[#0D61FD] border border-[#0D61FD]  rounded-xl md:rounded-xl items-center justify-center">
          <Text className="text-xl md:text-3xl font-bold text-white ">
            Continue
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
