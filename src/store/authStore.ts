import { create } from 'zustand'
import { AuthState, User } from '../types'
import { supabase } from '../utils/supabase'

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: async (username, password) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single()
    
    if (error || !data) {
      return false
    }
    
    const user: User = {
      id: data.id,
      username: data.username,
      password: data.password,
      role: data.role as 'admin' | 'user'
    }
    
    set({ isAuthenticated: true, user })
    localStorage.setItem('user', JSON.stringify(user))
    return true
  },
  logout: () => {
    set({ isAuthenticated: false, user: null })
    localStorage.removeItem('user')
  }
}))

export default useAuthStore