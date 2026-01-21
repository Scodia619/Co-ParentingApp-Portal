import { API_BASE_URL } from '@/config/api'
import { MatchedMemberResult } from '@/types/matchedMember'
import axios from 'axios'

export const MatchMembers = async (
  member_id: string,
  pairing_key: string
): Promise<MatchedMemberResult> => {
  try {
    const response = await axios.post<MatchedMemberResult>(
      `${API_BASE_URL}/MatchedMembers`,
      { MatchingId: member_id, 
        PairingKey: pairing_key },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data || 'Matching Failed')
    } else if (error.request) {
      throw new Error('No response from server')
    } else {
      throw new Error(error.message)
    }
  }
}
