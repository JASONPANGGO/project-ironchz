export interface Investment {
  id: string
  name: string
  description: string
  initial_investment: number
  current_value: number
  created_at: string
  updated_at: string
  updated_by: string
  tags: string[]
  transactions: Transaction[]
}

export interface Transaction {
  id: string
  investment_id: string
  date: string
  amount: number
  type: 'buy' | 'sell' | 'dividend' | 'fee'
  description: string
  created_by: string
  created_at?: string
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
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export interface InvestmentState {
  investments: Investment[]
  loadInvestments: () => Promise<void>
  addInvestment: (investment: Omit<Investment, 'id' | 'created_at' | 'updated_at' | 'transactions'>) => Promise<void>
  updateInvestment: (id: string, data: Partial<Investment>, updatedBy: string) => Promise<void>
  deleteInvestment: (id: string) => Promise<void>
  addTransaction: (investmentId: string, transaction: Omit<Transaction, 'id' | 'investment_id' | 'created_at'>) => Promise<void>
}