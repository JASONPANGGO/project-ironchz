import { create } from 'zustand'
import { InvestmentState, Investment, Transaction } from '../types'

const useInvestmentStore = create<InvestmentState>((set) => ({
  investments: [
    // 模拟数据
    {
      id: '1',
      name: '阿里巴巴股票',
      description: '中国领先的电子商务公司',
      initialInvestment: 10000,
      currentValue: 12500,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-20',
      updatedBy: 'admin',
      tags: ['股票', '科技', '中国'],
      transactions: [
        {
          id: 't1',
          date: '2024-01-01',
          amount: 10000,
          type: 'buy',
          description: '初始购买',
          createdBy: 'admin'
        }
      ]
    },
    {
      id: '2',
      name: '比特币',
      description: '加密货币',
      initialInvestment: 5000,
      currentValue: 6200,
      createdAt: '2024-01-05',
      updatedAt: '2024-01-21',
      updatedBy: 'user',
      tags: ['加密货币', '数字资产'],
      transactions: [
        {
          id: 't2',
          date: '2024-01-05',
          amount: 5000,
          type: 'buy',
          description: '初始购买',
          createdBy: 'user'
        }
      ]
    }
  ],
  addInvestment: (investment) => {
    const newInvestment: Investment = {
      ...investment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    }
    set((state) => ({
      investments: [...state.investments, newInvestment]
    }))
  },
  updateInvestment: (id, data, updatedBy) => {
    set((state) => ({
      investments: state.investments.map(inv => {
        if (inv.id === id) {
          return {
            ...inv,
            ...data,
            updatedAt: new Date().toISOString().split('T')[0],
            updatedBy
          }
        }
        return inv
      })
    }))
  },
  deleteInvestment: (id) => {
    set((state) => ({
      investments: state.investments.filter(inv => inv.id !== id)
    }))
  },
  addTransaction: (investmentId, transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString()
    }
    set((state) => ({
      investments: state.investments.map(inv => {
        if (inv.id === investmentId) {
          // 更新当前价值
          let currentValue = inv.currentValue
          if (transaction.type === 'buy') {
            currentValue += transaction.amount
          } else if (transaction.type === 'sell') {
            currentValue -= transaction.amount
          }
          
          return {
            ...inv,
            currentValue,
            updatedAt: new Date().toISOString().split('T')[0],
            updatedBy: transaction.createdBy,
            transactions: [...inv.transactions, newTransaction]
          }
        }
        return inv
      })
    }))
  }
}))

export default useInvestmentStore