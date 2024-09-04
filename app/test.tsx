import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  Image,
  View,
  Text,
  Dimensions,
  Pressable,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import * as Progress from "react-native-progress";
import { useRouter } from "expo-router";

import Hexagon from "./Hexagon";

const Trophy_Hexagon = {
  activeColor: ["#ad8578", "#a57085", "#985299", "#9145a1"],
  fillColor: ["#800076", "#770DFD"],
  borderColor: ["#E06B16", "#D600C4"],
};

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
const circleSize: number = Math.ceil(deviceHeight / 4);
const circleThickness: number = Math.ceil(deviceHeight / 60);
const progressBarHeight: number = Math.ceil(deviceWidth / 80);

export default function AnimatedScreen() {
  const [progress, setProgress] = useState(0);
  const [progressBar, setProgressBar] = useState(0);

  const popScaleValue = useSharedValue(1);
  const scale = useSharedValue(1);
  const router = useRouter();
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: popScaleValue.value }],
    };
  });
  const animatedBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  let mount = true;
  const progressRun = async () => {
    if (mount) {
      scale.value = withSequence(
        withTiming(1.2, {
          duration: 400,
        }),
        withTiming(1, {
          duration: 300,
        })
      );
      setTimeout(() => {
        setInterval(updateProgressBar, 0);
      }, 500);
    }
    return;
  };
  useEffect(() => {
    const updateProgress = () => {
      setProgress((prevProgress) => {
        const newProgress = prevProgress + 0.01;
        return newProgress >= 0.5 ? 0.5 : newProgress;
      });
    };
    const progressInterval = setInterval(updateProgress, 0);
    popScaleValue.value = withDelay(
      2200,
      withSequence(
        withTiming(1.25, {
          duration: 300,
        }),
        withTiming(
          1,
          {
            duration: 300,
          },
          () => {
            runOnJS(progressRun)();
          }
        )
      )
    );
    return () => {
      clearInterval(progressInterval);
    };
  }, []);
  const updateProgressBar = () => {
    setProgressBar((prevProgress) => {
      const newProgress = prevProgress + 0.01;
      return newProgress >= 0.5 ? 0.5 : newProgress;
    });
  };
  const backHandler = () => {
    router.back();
  };
  const progressCircleValue = (
    <View className="justify-center items-center">
      <Text className="text-3xl md:text-4xl font-bold text-[#313B4D]">
        {Math.round(progress * 100)}%
      </Text>
      <Text className="text-[18px] md:text-[28px] font-400 text-[#5D687E]">
        Complete
      </Text>
    </View>
  );

  return (
    <>
      <ImageBackground
        source={require("../assets/images/backGround.png")}
        className="flex-1 items-center justify-center"
        imageStyle={{ resizeMode: "cover" }}
      >
        <Text className="text-2xl md:text-3xl font-bold  pt-7 text-[#313B4D]">
          Great job,
        </Text>
        <Text className="text-2xl md:text-3xl font-bold pb-5 text-[#313B4D]">
          keep going!
        </Text>
        <View className="w-[90%] h-[52%] items-center  bg-[#effafc] py-3 md:pt-10 border border-[#0D61FD] rounded-2xl mb-4">
          <Text className="text-2xl md:text-4xl font-semibold text-[#313B4D]">
            Today’s goal
          </Text>
          <Text className="text-base md:text-2xl font-400 text-[#5D687E] pt-1 pb-6">
            15 minutes - 60 lessons
          </Text>
          <Animated.View style={animatedStyle}>
            <Progress.Circle
              size={circleSize}
              progress={progress}
              showsText={true}
              formatText={() => progressCircleValue}
              thickness={circleThickness}
              color={"#D600C4"}
              unfilledColor="#C9D0DE"
              borderWidth={0}
              strokeCap="round"
              indeterminate={false}
            />
          </Animated.View>
          <Text className="text-lg md:text-3xl font-400 text-[#313B4D]  pt-7 md:pt-9">
            Keep going and reach your daily goal!
          </Text>
        </View>
        <View className="w-[90%]  items-center  bg-[#effafc] py-4  border border-[#0D61FD] rounded-2xl">
          <View className="flex-row items-center  w-[86%] pb-5">
            <Hexagon
              hexagonSize={deviceHeight / 22}
              fillPercentage={1}
              cornerRadius={2.5}
              iconWidth={deviceHeight / 26}
              iconHeight={deviceHeight / 26}
              strokeWidth={4}
              activeColor={Trophy_Hexagon.activeColor}
              fillColor={Trophy_Hexagon.fillColor}
              borderColor={Trophy_Hexagon.borderColor}
            />
            <View className="w-70 ml-3">
              <Text className="text-2xl md:text-3xl font-semibold pb-1  text-[#313B4D]">
                Keep going!
              </Text>
              <Text className="text-base md:text-2xl font-400 text-[#5D687E] ">
                Speech in noise - Level 3
              </Text>
            </View>
          </View>
          <Animated.View style={animatedBarStyle}>
            <View className="w-[100%]  items-end   pt-0 px-2  ">
              <Progress.Bar
                progress={progressBar}
                width={deviceWidth / 1.35}
                height={progressBarHeight}
                color={"#0D61FD"}
                unfilledColor={"white"}
                borderWidth={1}
                borderColor="#C9D0DE"
              />
              <View className="w-[82%] items-end">
                <Text className="text-lg font-400 text-[#5D687E]">{`${(
                  progressBar * 100
                ).toFixed(0)}%`}</Text>
              </View>
            </View>
          </Animated.View>
        </View>
      </ImageBackground>
      <View className="h-[11%] w-full bg-white shadow-lg flex-row items-center justify-evenly">
        <Pressable
          onPress={backHandler}
          className="w-[16%] h-[65%]   bg-white border border-[#0D61FD] rounded-2xl md:rounded-3xl  items-center justify-center"
        >
          <Image
            source={require("../assets/images/home.png")}
            className="h-10 w-10 md:w-16 md:h-16"
          />
        </Pressable>
        <Pressable className="w-[70%] h-[65%] bg-[#0D61FD] border border-[#0D61FD]  flex-row  rounded-2xl md:rounded-3xl items-center justify-center">
          <Text className="text-xl md:text-3xl font-medium text-white">
            Keep going
          </Text>
          <Image
            source={require("../assets/images/arrowRight.png")}
            className="h-10 w-10 md:w-14 md:h-14 ml-5"
          />
        </Pressable>
      </View>
    </>
  );
}
