import { API_BASE_URL } from "@/config/api";
import { Conversation } from "@/types/conversation";
import axios from "axios";

export const GetUserConversations = async (
  memberId: string,
): Promise<Conversation[]> => {
  try {
    const response = await axios.get<Conversation[]>(
      `${API_BASE_URL}/Conversations`,
      {
        params: { memberId },
      },
    );
    return response.data;
  } catch (error: any) {
    if (error.response)
      throw new Error(error.response.data || "Failed to fetch conversations");
    if (error.request) throw new Error("No response from server");
    throw new Error(error.message);
  }
};
