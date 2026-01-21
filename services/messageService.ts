import { API_BASE_URL } from "@/config/api";
import { Message } from "@/types/message";
import axios from "axios";

export const GetMessagesByConversation = async (
  member_id: string,
  conversation_id: string,
  created_at?: string,
): Promise<Message[]> => {
  try {
    const response = await axios.post<Message[]>(
      `${API_BASE_URL}/Message/GetMessagesByConversation`,
      {
        ConversationId: conversation_id,
        MemberId: member_id,
        CreatedAt: created_at,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data || "Getting messages failed");
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error(error.message);
    }
  }
};

export const PostMessage = async (
  conversation_id: string,
  sender_id: string,
  content: string,
): Promise<Message> => {
  try {
    const response = await axios.post<Message>(
      `${API_BASE_URL}/Message`,
      {
        ConversationId: conversation_id,
        SenderId: sender_id,
        Content: content,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data || "Sending message failed");
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error(error.message);
    }
  }
};
