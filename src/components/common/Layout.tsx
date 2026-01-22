import React, { ReactNode, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import { supabase } from '../../utils/supabase'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [isConnected, setIsConnected] = useState<boolean>(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // 检测数据库连接状态
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // 尝试执行一个简单的查询来测试连接
        const { error } = await supabase
          .from('users')
          .select('id')
          .limit(1)
        
        setIsConnected(!error)
      } catch (error) {
        setIsConnected(false)
      }
    }

    // 初始检查
    checkConnection()

    // 每30秒检查一次连接状态
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

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
            <div className="db-connection-status">
              <div className={`db-status-indicator ${isConnected ? 'connected' : 'disconnected'}`} title={isConnected ? '数据库已连接' : '数据库未连接'}></div>
              <span className="db-status-text">{isConnected ? '已连接' : '未连接'}</span>
            </div>
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