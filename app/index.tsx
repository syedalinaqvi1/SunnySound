/** @format */

import React, { useEffect, useRef, useState } from "react";
import {
  ImageBackground,
  Image,
  View,
  Text,
  Dimensions,
  Pressable,
} from "react-native";
import LottieView from "lottie-react-native";
import Animated, {
  Easing,
  interpolate,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withSpring,
  withDelay,
  useAnimatedReaction,
  runOnJS,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import { Audio } from "expo-av";
import Hexagon from "./Hexagon";

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const Trophy_Hexagon = {
  activeColor: ["#ad8578", "#a57085", "#985299", "#9145a1"],
  fillColor: ["#800076", "#770DFD"],
  borderColor: ["#E06B16", "#D600C4"],
};

export default function AnimatedScreen() {
  const router = useRouter();
  const [showTada, setShowTada] = useState(false);
  const [text] = useState("Congrats! You reached a new level");
  const animatedValues = text.split("").map(() => useSharedValue(0));
  const [progressPercentage, setProgressPercentage] = useState(0.01);

  const animation = useRef<LottieView>(null);
  const scaleValue = useSharedValue(0);
  const rotateValue = useSharedValue(0);
  const fadeInValue = useSharedValue(0);
  const popScaleValue = useSharedValue(1);
  const progress = useSharedValue(0.01);

  let mount = true;
  const playSound = async () => {
    const totalDuration = 2000;
    const stepDuration = totalDuration / 4;
    if (mount) {
      progress.value = withSequence(
        withTiming(0.01, {
          duration: stepDuration,
          easing: Easing.linear,
        }),
        withDelay(
          stepDuration / 2,
          withTiming(0.5, {
            duration: stepDuration,
            easing: Easing.linear,
          })
        ),
        withDelay(
          stepDuration / 2,
          withTiming(1, {
            duration: 500,
            easing: Easing.linear,
          })
        ),
        withTiming(0.01, {
          duration: 500,
          easing: Easing.linear,
        })
      );
      const { sound }: any = await Audio.Sound.createAsync(
        require("../assets/audio/tada.mp3")
      );
      mount = false;
      await sound.playAsync();
    }
    setShowTada(true);
    return;
  };

  useEffect(() => {
    animatedValues.forEach((anim, index) => {
      anim.value = withDelay(index * 30, withTiming(1, { duration: 100 }));
    });

    const totalAnimationDuration = text.length * 30 + 100;
    const sequence = withSequence(
      withDelay(
        totalAnimationDuration,
        withTiming(1, { duration: 3250 }, () => {
          runOnJS(playSound)();
          fadeInValue.value = withTiming(
            1,
            {
              duration: 1000,
              easing: Easing.out(Easing.ease),
            },
            () => {
              popScaleValue.value = withSpring(
                2,
                {
                  damping: 2,
                  stiffness: 80,
                  mass: 1,
                  overshootClamping: false,
                  restDisplacementThreshold: 0.01,
                  restSpeedThreshold: 0.2,
                },
                () => {
                  popScaleValue.value = withSpring(1, {
                    damping: 8,
                    stiffness: 90,
                    mass: 1,
                    overshootClamping: false,
                    restDisplacementThreshold: 0.01,
                    restSpeedThreshold: 0.03,
                  });
                }
              );
            }
          );
        })
      ),
      withTiming(1, { duration: 3250 })
    );

    scaleValue.value = sequence;
    rotateValue.value = sequence;
  }, []);
  const rotateAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: interpolate(scaleValue.value, [0, 1], [0, 1]) },
        { rotate: `${interpolate(rotateValue.value, [0, 1], [2160, 0])}deg` },
        { scale: popScaleValue.value },
      ],
    };
  });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value * 100}%`,
    };
  });

  useAnimatedReaction(
    () => progress.value,
    (value) => {
      let displayValue = 1;
      if (value >= 0.5 && value < 1) {
        displayValue = 50;
      } else if (value === 1) {
        displayValue = 100;
      } else {
        displayValue = 1;
      }
      runOnJS(setProgressPercentage)(displayValue);
    }
  );
  const handleNext = () => {
    router.push("/test");
  };
  return (
    <>
      <ImageBackground
        source={require("./assets/images/backGround.png")}
        className="flex-1 items-center justify-center"
        imageStyle={{ resizeMode: "cover" }}
      >
        <Image
          source={require("./assets/images/logo.png")}
          className="w-[50%] h-[8%]"
          resizeMode="contain"
        />
        <View className="flex-row flex-wrap w-[63%] self-center justify-center items-center">
          {text.split("").map((char, index) => {
            const animatedStyle = useAnimatedStyle(() => ({
              opacity: animatedValues[index].value,
              transform: [
                {
                  translateY: interpolate(
                    animatedValues[index].value,
                    [0, 1],
                    [10, 0]
                  ),
                },
              ],
            }));

            return (
              <Animated.Text
                key={`${char}-${index}`}
                className="text-2xl md:text-3xl font-bold text-[#313B4D] text-center"
                style={animatedStyle}
              >
                {char}
              </Animated.Text>
            );
          })}
        </View>
        <Animated.View
          className=" justify-center items-center rounded-[30px] z-10"
          style={rotateAnimation}
        >
          <Hexagon
            hexagonSize={deviceHeight / 12}
            fillPercentage={1}
            cornerRadius={2.5}
            iconWidth={deviceHeight / 16}
            iconHeight={deviceHeight / 16}
            strokeWidth={4}
            activeColor={Trophy_Hexagon.activeColor}
            fillColor={Trophy_Hexagon.fillColor}
            borderColor={Trophy_Hexagon.borderColor}
          />
        </Animated.View>
        <Animated.Text
          className="text-xl md:text-2xl font-bold text-[#313B4D]"
          style={{ opacity: fadeInValue }}
        >
          Speech in Noise
        </Animated.Text>
        <Animated.Text
          className="text-lg md:text-2xl font-normal text-[#5D687E]"
          style={{ opacity: fadeInValue }}
        >
          Level 2
        </Animated.Text>
        <Animated.View
          className="w-[80%] h-2 md:h-3 rounded-xl bg-[#DCE2EC] mt-4 "
          style={[{ opacity: fadeInValue }]}
        >
          <Animated.View
            className="h-[100%] bg-[#0D61FD] rounded-xl"
            style={[animatedStyle]}
          />
        </Animated.View>
        <Animated.View
          className="flex-row items-center justify-between w-[79%] mb-6 md:mb-3 "
          style={{ opacity: fadeInValue }}
        >
          <Text className="text-base md:text-xl font-semibold text-[#313B4D]">
            Progress
          </Text>
          <Text className="text-base md:text-xl font-semibold text-[#313B4D]">
            {progressPercentage}%
          </Text>
        </Animated.View>
      </ImageBackground>
      {showTada && (
        <View className="absolute bottom-0 w-[150%] h-[80%] items-center justify-center self-center">
          <LottieView
            autoPlay={true}
            loop={false}
            ref={animation}
            className="w-[100%] h-[100%] items-center justify-end"
            source={require("../assets/images/confettiBackground.json")}
          />
        </View>
      )}
      <View className="h-[10%] w-full bg-white shadow-lg flex-row items-center justify-evenly">
        <Pressable className="w-[40%] h-[65%] bg-white border border-[#0D61FD] rounded-lg items-center justify-center">
          <Text className="text-xl md:text-2xl font-normal text-blue-600">
            End
          </Text>
        </Pressable>
        <Pressable
          className="w-[40%] h-[65%] bg-[#0D61FD] border border-[#0D61FD]  rounded-lg items-center justify-center"
          onPress={handleNext}
        >
          <Text className="text-xl  md:text-2xl font-medium text-white">
            Continue
          </Text>
        </Pressable>
      </View>
    </>
  );
}
