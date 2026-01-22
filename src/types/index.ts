export interface Investment {
  id: string
  name: string
  description: string
  initialInvestment: number
  currentValue: number
  createdAt: string
  updatedAt: string
  updatedBy: string
  tags: string[]
  transactions: Transaction[]
}

export interface Transaction {
  id: string
  date: string
  amount: number
  type: 'buy' | 'sell' | 'dividend' | 'fee'
  description: string
  createdBy: string
}

export interface User {
  id: string
  username: string
  password: string
  role: 'admin' | 'user'
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

export interface InvestmentState {
  investments: Investment[]
  addInvestment: (investment: Omit<Investment, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateInvestment: (id: string, data: Partial<Investment>, updatedBy: string) => void
  deleteInvestment: (id: string) => void
  addTransaction: (investmentId: string, transaction: Omit<Transaction, 'id'>) => void
}