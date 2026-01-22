import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import './Auth.css'

const AuthPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const success = await login(username, password)
    if (success) {
      navigate('/dashboard')
    } else {
      setError('用户名或密码错误')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-form">
        <h2>投资项目追踪平台</h2>
        <p>请登录以访问您的投资数据</p>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          <button type="submit" className="login-button">登录</button>
        </form>
        
        <div className="login-info">
          <p>测试账号：</p>
          <p>管理员：admin / admin123</p>
          <p>用户：user / user123</p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage