import { Stack } from "expo-router";
import React from "react";

export default function MessagesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[conversationId]" options={{ headerShown: false }} />
    </Stack>
  );
}
