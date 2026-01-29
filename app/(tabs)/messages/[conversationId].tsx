import MessagesThread from "@/components/MessageThread";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function ConversationScreen() {
  const { conversationId, participantName, totalUnread } = useLocalSearchParams<{
    conversationId?: string;
    participantName?: string;
    totalUnread: string;
  }>();

  if (!conversationId || typeof conversationId !== "string") {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <MessagesThread
      conversationId={conversationId}
      participantName={participantName}
      totalUnread={totalUnread}
    />
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
});
