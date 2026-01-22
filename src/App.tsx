import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import AuthPage from './pages/Auth/Auth'
import Dashboard from './pages/Dashboard/Dashboard'
import Investments from './pages/Investments/Investments'
import Analytics from './pages/Analytics/Analytics'
import ProtectedRoute from './components/auth/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/investments" element={<ProtectedRoute><Investments /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App