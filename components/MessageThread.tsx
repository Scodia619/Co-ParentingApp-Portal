import MessageBubble from "@/components/MessageBubble";
import { useMember } from "@/context/MemberContext";
import { useUnread } from "@/context/UnreadContext";
import { startChatHub, stopChatHub } from "@/services/chatHub";
import { MarkConversationAsRead } from "@/services/conversationService";
import {
  GetMessagesByConversation,
  PostMessage,
} from "@/services/messageService";
import { Message } from "@/types/message";
import { Stack } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const PAGE_SIZE = 20;

export default function MessagesThread({
  conversationId,
  participantName,
  totalUnread
}: {
  conversationId: string;
  participantName?: string;
  totalUnread : string
}) {
  const { member } = useMember();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [oldestMessageAt, setOldestMessageAt] = useState<string | null>(null);
  const {setTotalUnread} = useUnread()

  const loadMessages = async () => {
    if (!member || loading || !hasMore) return;
    setLoading(true);

    try {
      const data = await GetMessagesByConversation(
        member.id,
        conversationId,
        oldestMessageAt || undefined,
      );

      if (data.length < PAGE_SIZE) setHasMore(false);

      if (data.length > 0) {
        setMessages((prev) => [...prev, ...data]);
        setOldestMessageAt(data[data.length - 1].createdAt);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  if (!member) return;

  startChatHub(conversationId, (message) => {
    if (message.senderId === member.id) return;

    setMessages((prev) => {
      if (prev.some((m) => m.messageId === message.messageId)) return prev;
      return [message, ...prev];
    });
  });

  return () => {
    stopChatHub();
  };
}, [conversationId, member]);


  useEffect(() => {
    loadMessages();
  }, [conversationId]);

  useEffect(() => {
  if (!member) return;

  const markAsRead = async () => {
    try {
      await MarkConversationAsRead(conversationId, member.id);
      console.log("Total Unread", totalUnread)
      if(parseInt(totalUnread) > 0){
        console.log(totalUnread)
        setTotalUnread(prev => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("Failed to mark conversation as read", err);
    }
  };

  markAsRead();
}, [conversationId, member]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !member) return;

    const tempId = `temp-${Date.now()}`;

    setMessages((prev) => [
      {
        messageId: tempId,
        senderId: member.id,
        content: newMessage,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setNewMessage("");

    try {
      const savedMessage = await PostMessage(
        conversationId,
        member.id,
        newMessage,
      );
      setMessages((prev) =>
        prev.map((m) => (m.messageId === tempId ? savedMessage : m)),
      );
    } catch (err) {
      console.error(err);
      setMessages((prev) => prev.filter((m) => m.messageId !== tempId));
    }
  };

  return (
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
  >
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: participantName || "Messages",
          headerTitleAlign: "left",
          headerStyle: {
            backgroundColor: "#000",
          },
          headerTitleStyle: {
            color: "#fff",
            fontSize: 18,
            fontWeight: "600",
          },
          headerShadowVisible: false,
        }}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        inverted
        keyExtractor={(item) => item.messageId}
        onEndReached={loadMessages}
        onEndReachedThreshold={0.2}
        keyboardDismissMode="on-drag"
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isOwnMessage={item.senderId === member!.id}
          />
        )}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message"
          placeholderTextColor="#888"
          value={newMessage}
          onChangeText={setNewMessage}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 12,
    color: "#fff",
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#2563eb",
    paddingHorizontal: 16,
    justifyContent: "center",
    borderRadius: 8,
  },
  sendButtonText: { color: "#fff", fontWeight: "600" },
});
