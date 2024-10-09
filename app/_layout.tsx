/** @format */

import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
      <Stack.Screen name="testOne" options={{ title: "Test One" }} />
      <Stack.Screen name="test" options={{ title: "Test Two" }} />
      <Stack.Screen name="testThree" options={{ title: "Test Three" }} />
    </Stack>
  );
}
