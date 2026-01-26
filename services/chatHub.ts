import { API_BASE_URL } from "@/config/api";
import { Message } from "@/types/message";
import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const startChatHub = async (
  conversationId: string,
  onMessage: (message: Message) => void,
) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${API_BASE_URL}/chatHub`)
    .withAutomaticReconnect()
    .build();

  connection.on("ReceiveMessage", onMessage);

  await connection.start();
  await connection.invoke("JoinConversation", conversationId);
};

export const stopChatHub = async () => {
  if (!connection) return;

  const conn = connection;
  connection = null;

  try {
    if (conn.state === signalR.HubConnectionState.Connected) {
      await conn.stop();
    }
  } catch (err) {
    console.warn("SignalR stop error", err);
  }
};
