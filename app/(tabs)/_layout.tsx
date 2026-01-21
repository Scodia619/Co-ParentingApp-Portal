import { Tabs } from "expo-router";
import React from "react";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarStyle: {
          backgroundColor: "#000",
          borderTopWidth: 1,
          borderTopColor: "#333",
        },

        tabBarActiveTintColor: "#fff",
        tabBarInactiveTintColor: "#888",

        tabBarItemStyle: {
          borderRightWidth: 1,
          borderRightColor: "#333",
        },

        sceneContainerStyle: {
          backgroundColor: "#000",
        },
      }}
    >
      <Tabs.Screen
        name="messages"
        options={{
          title: "Messages",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",

          tabBarItemStyle: {
            borderRightWidth: 0,
          },
        }}
      />
    </Tabs>
  );
}
