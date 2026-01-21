import { useMember } from "@/context/MemberContext";
import { GetUserConversations } from "@/services/conversationService";
import { Conversation } from "@/types/conversation";
import { Stack, useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ConversationsScreen: React.FC = () => {
  const { member } = useMember();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadConversations = async () => {
    if (!member) return;
    setLoading(true);
    try {
      const data = await GetUserConversations(member.id);
      setConversations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [member]),
  );

  const openConversation = (
    conversationId: string,
    participantName: string,
  ) => {
    router.push({
      pathname: "/(tabs)/messages/[conversationId]",
      params: { conversationId, participantName },
    });
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const hasLastMessage = !!item.lastMessage && !!item.lastMessageAt;

    return (
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() =>
          openConversation(item.conversationId, item.participantName)
        }
      >
        <Text style={styles.name}>{item.participantName}</Text>

        {hasLastMessage ? (
          <>
            <Text style={styles.lastMessage}>{item.lastMessage}</Text>
            <Text style={styles.date}>
              {new Date(item.lastMessageAt!).toLocaleString()}
            </Text>
          </>
        ) : (
          <Text style={styles.lastMessage}>Send your first message</Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "",
          headerLeft: () => <Text style={styles.headerTitle}>Messages</Text>,
          headerRight: () => null,
          headerStyle: {
            backgroundColor: "#000",
          },
          headerShadowVisible: false,
        }}
      />

      <View style={styles.container}>
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.conversationId}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={{ paddingTop: 8, paddingBottom: 16 }}
        />
      </View>
    </>
  );
};

export default ConversationsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  itemContainer: { padding: 16 },
  name: { color: "#fff", fontSize: 18, fontWeight: "600" },
  lastMessage: { color: "#aaa", fontSize: 14, marginTop: 4 },
  date: { color: "#555", fontSize: 12, marginTop: 2, alignSelf: "flex-end" },
  separator: { height: 1, backgroundColor: "#222", marginHorizontal: 16 },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
