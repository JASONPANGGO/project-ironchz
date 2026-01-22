import React, { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import Layout from '../common/Layout'

interface ProtectedRouteProps {
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <Layout>
      {children}
    </Layout>
  )
}

export default ProtectedRoute