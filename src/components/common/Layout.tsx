import React, { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>投资追踪</h2>
        </div>
        <nav className="sidebar-nav">
          <ul>
            <li>
              <Link to="/dashboard">
                <span className="nav-icon">📊</span>
                <span className="nav-text">仪表盘</span>
              </Link>
            </li>
            <li>
              <Link to="/investments">
                <span className="nav-icon">💼</span>
                <span className="nav-text">投资项目</span>
              </Link>
            </li>
            <li>
              <Link to="/analytics">
                <span className="nav-icon">📈</span>
                <span className="nav-text">数据分析</span>
              </Link>
            </li>
          </ul>
        </nav>
        <div className="sidebar-footer">
          <div className="user-info">
            <span className="user-avatar">{user?.username.charAt(0).toUpperCase()}</span>
            <span className="user-name">{user?.username}</span>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span className="nav-text">退出登录</span>
          </button>
        </div>
      </aside>
      <main className="main-content">
        <header className="top-nav">
          <div className="nav-title">
            <h1>{document.title}</h1>
          </div>
          <div className="nav-actions">
            <span className="welcome-text">欢迎回来，{user?.username}！</span>
          </div>
        </header>
        <div className="content-wrapper">
          {children}
        </div>
      </main>
    </div>
  )
}

export default Layout