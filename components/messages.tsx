import MessageBubble from "@/components/MessageBubble";
import { useMember } from "@/context/MemberContext";
import { GetMessagesByConversation } from "@/services/messageService";
import { Message } from "@/types/message";
import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

const PAGE_SIZE = 20;

const Messages: React.FC<{ conversationId: string }> = ({ conversationId }) => {
  const { member } = useMember();
  const flatListRef = useRef<FlatList>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMessages = async () => {
    if (loading || !hasMore || !member) return;
    setLoading(true);
    try {
      const data = await GetMessagesByConversation(
        member.id,
        "d74d64c7-bb1b-4046-9ce6-73a404d9ca3a",
      );
      if (data.length < PAGE_SIZE) setHasMore(false);
      setMessages((prev) => [...prev, ...data]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !member) return;

    const optimisticMessage: Message = {
      messageId: `temp-${Date.now()}`,
      senderId: member.id,
      content: newMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [optimisticMessage, ...prev]);
    setNewMessage("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container}>
          <Text style={styles.title}>Messages</Text>

          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.messageId}
            inverted
            onEndReached={loadMessages}
            onEndReachedThreshold={0.2}
            contentContainerStyle={{ paddingBottom: 16 }}
            renderItem={({ item, index }) => {
              const prevMessage = messages[index + 1];
              const showDate =
                !prevMessage ||
                new Date(item.createdAt).toDateString() !==
                  new Date(prevMessage.createdAt).toDateString();

              return (
                <MessageBubble
                  message={item}
                  isOwnMessage={item.senderId === member!.id}
                  showDate={showDate}
                />
              );
            }}
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Messages;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#fff",
    padding: 16,
    paddingTop: 48,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
    backgroundColor: "#000",
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
