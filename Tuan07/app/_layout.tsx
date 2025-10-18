import React from "react";
import { Stack } from "expo-router";
import { TaskProvider } from "../context/TaskContext";

export default function Layout() {
  // Provide TaskContext to whole app and declare stack screens (Build API style)
  return (
    <TaskProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen name="add" options={{ title: "Add Your Job" }} />
      </Stack>
    </TaskProvider>
  );
}