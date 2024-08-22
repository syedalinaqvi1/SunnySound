import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  runOnJS,
  useAnimatedReaction,
} from "react-native-reanimated";

const ProgressBar = () => {
  const progress = useSharedValue(1);
  const [progressPercentage, setProgressPercentage] = useState(1);

  useEffect(() => {
    const totalDuration = 2000; // Total duration of 2 seconds
    const stepDuration = totalDuration / 4; // Duration for each step

    // Define the animation sequence
    const animationSequence = withSequence(
      withTiming(50, {
        duration: stepDuration,
        easing: Easing.linear,
      }),
      withDelay(
        stepDuration / 2,
        withTiming(100, {
          duration: stepDuration,
          easing: Easing.linear,
        })
      ),
      withDelay(
        stepDuration / 2,
        withTiming(1, {
          duration: stepDuration / 2,
          easing: Easing.linear,
        })
      )
    );

    // Apply the animation sequence to the shared value
    progress.value = animationSequence;
  }, [progress]);

  // Use animated reaction to update progress percentage
  useAnimatedReaction(
    () => progress.value,
    (value) => {
      runOnJS(setProgressPercentage)(Math.round(value));
    }
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      width: `${progress.value}%`,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Animated.View style={[styles.progressBar, animatedStyle]} />
      </View>
      <Text style={styles.text}>{progressPercentage}%</Text>
    </View>
  );
};

const App = () => {
  return (
    <View style={styles.appContainer}>
      <ProgressBar />
    </View>
  );
};

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f3f4f6",
  },
  container: {
    width: "80%",
    alignItems: "center",
    marginBottom: 20,
  },
  bar: {
    width: "100%",
    height: 24,
    backgroundColor: "#e2e8f0",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#374151",
  },
});

export default App;
