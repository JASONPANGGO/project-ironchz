import { create } from 'zustand'
import { InvestmentState } from '../types'
import { supabase } from '../utils/supabase'

const useInvestmentStore = create<InvestmentState>((set, get) => ({
  investments: [],
  loadInvestments: async () => {
    const { data, error } = await supabase
      .from('investments')
      .select('*')
    
    if (error) {
      console.error('Error loading investments:', error)
      return
    }
    
    const investmentsWithTransactions = await Promise.all(
      data.map(async (investment) => {
        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .eq('investment_id', investment.id)
        
        return {
          ...investment,
          transactions: transactions || []
        }
      })
    )
    
    set({ investments: investmentsWithTransactions })
  },
  addInvestment: async (investment) => {
    const newInvestment = {
      ...investment,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    }
    
    const { data, error } = await supabase
      .from('investments')
      .insert(newInvestment)
      .select()
      .single()
    
    if (error) {
      console.error('Error adding investment:', error)
      return
    }
    
    set((state) => ({
      investments: [...state.investments, { ...data, transactions: [] }]
    }))
  },
  updateInvestment: async (id, data, updatedBy) => {
    const updateData = {
      ...data,
      updated_at: new Date().toISOString().split('T')[0],
      updated_by: updatedBy
    }
    
    const { data: updatedInvestment, error } = await supabase
      .from('investments')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error('Error updating investment:', error)
      return
    }
    
    set((state) => ({
      investments: state.investments.map(inv => {
        if (inv.id === id) {
          return {
            ...updatedInvestment,
            transactions: inv.transactions
          }
        }
        return inv
      })
    }))
  },
  deleteInvestment: async (id) => {
    const { error } = await supabase
      .from('investments')
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting investment:', error)
      return
    }
    
    set((state) => ({
      investments: state.investments.filter(inv => inv.id !== id)
    }))
  },
  addTransaction: async (investmentId, transaction) => {
    const newTransaction = {
      ...transaction,
      investment_id: investmentId
    }
    
    const { data: createdTransaction, error } = await supabase
      .from('transactions')
      .insert(newTransaction)
      .select()
      .single()
    
    if (error) {
      console.error('Error adding transaction:', error)
      return
    }
    
    const investment = get().investments.find(inv => inv.id === investmentId)
    if (!investment) return
    
    let currentValue = investment.current_value
    if (transaction.type === 'buy') {
      currentValue += transaction.amount
    } else if (transaction.type === 'sell') {
      currentValue -= transaction.amount
    }
    
    await supabase
      .from('investments')
      .update({
        current_value: currentValue,
        updated_at: new Date().toISOString().split('T')[0],
        updated_by: transaction.created_by
      })
      .eq('id', investmentId)
    
    set((state) => ({
      investments: state.investments.map(inv => {
        if (inv.id === investmentId) {
          return {
            ...inv,
            current_value: currentValue,
            updated_at: new Date().toISOString().split('T')[0],
            updated_by: transaction.created_by,
            transactions: [...inv.transactions, createdTransaction]
          }
        }
        return inv
      })
    }))
  }
}))

export default useInvestmentStore