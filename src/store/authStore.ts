import { create } from 'zustand'
import { AuthState, User } from '../types'

// 模拟用户数据，实际项目中应该从后端获取
const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123', // 实际项目中应该使用加密存储
    role: 'admin'
  },
  {
    id: '2',
    username: 'user',
    password: 'user123',
    role: 'user'
  }
]

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (username, password) => {
    const user = mockUsers.find(u => u.username === username && u.password === password)
    if (user) {
      set({ isAuthenticated: true, user })
      // 实际项目中应该存储token到localStorage或cookie
      localStorage.setItem('user', JSON.stringify(user))
      return true
    }
    return false
  },
  logout: () => {
    set({ isAuthenticated: false, user: null })
    localStorage.removeItem('user')
  }
}))

export default useAuthStore