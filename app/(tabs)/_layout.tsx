import { useUnread } from "@/context/UnreadContext";
import { Tabs } from "expo-router";
import React from "react";
import { Text, View } from "react-native";

export default function TabsLayout() {

  const { totalUnread } = useUnread();

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
          tabBarLabel: ({ focused }) => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, marginRight: 6, color: '#fff'}}>Messages</Text>
              {totalUnread > 0 && (
                <View style={{
                  backgroundColor: 'red',
                  borderRadius: 10,
                  paddingHorizontal: 6,
                  paddingVertical: 2,
                  minWidth: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
                    {totalUnread}
                  </Text>
                </View>
              )}
            </View>
          ),
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
