import { API_BASE_URL } from '@/config/api'
import { Member } from '@/types/member'
import axios from 'axios'

export const login = async (
  username: string,
  password: string
): Promise<Member> => {
  try {
    const response = await axios.post<Member>(
      `${API_BASE_URL}/Member/login`,
      { Username: username, 
        Password: password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data || 'Login failed')
    } else if (error.request) {
      throw new Error('No response from server')
    } else {
      throw new Error(error.message)
    }
  }
}
