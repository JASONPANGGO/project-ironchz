import React, { useState } from 'react'
import useInvestmentStore from '../../store/investmentStore'
import useAuthStore from '../../store/authStore'
import './Investments.css'

const Investments: React.FC = () => {
  const { investments, deleteInvestment } = useInvestmentStore()
  const { user } = useAuthStore()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newInvestment, setNewInvestment] = useState({
    name: '',
    description: '',
    initialInvestment: 0,
    currentValue: 0,
    tags: ''
  })

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      useInvestmentStore.getState().addInvestment({
        name: newInvestment.name,
        description: newInvestment.description,
        initialInvestment: parseFloat(newInvestment.initialInvestment.toString()),
        currentValue: parseFloat(newInvestment.currentValue.toString()),
        updatedBy: user.username,
        tags: newInvestment.tags.split(',').map(tag => tag.trim()),
        transactions: []
      })
      setNewInvestment({ name: '', description: '', initialInvestment: 0, currentValue: 0, tags: '' })
      setShowAddForm(false)
    }
  }

  const handleDeleteInvestment = (id: string) => {
    if (window.confirm('确定要删除这个投资项目吗？')) {
      deleteInvestment(id)
    }
  }

  return (
    <div className="investments-container">
      <div className="investments-header">
        <h2>投资项目管理</h2>
        <button className="add-button" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? '取消' : '添加投资项目'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-form">
          <h3>添加新投资项目</h3>
          <form onSubmit={handleAddInvestment}>
            <div className="form-row">
              <div className="form-group">
                <label>项目名称</label>
                <input
                  type="text"
                  value={newInvestment.name}
                  onChange={(e) => setNewInvestment({ ...newInvestment, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>初始投资</label>
                <input
                  type="number"
                  value={newInvestment.initialInvestment}
                  onChange={(e) => setNewInvestment({ ...newInvestment, initialInvestment: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>当前价值</label>
                <input
                  type="number"
                  value={newInvestment.currentValue}
                  onChange={(e) => setNewInvestment({ ...newInvestment, currentValue: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="form-group">
                <label>标签（用逗号分隔）</label>
                <input
                  type="text"
                  value={newInvestment.tags}
                  onChange={(e) => setNewInvestment({ ...newInvestment, tags: e.target.value })}
                />
              </div>
            </div>
            <div className="form-group full-width">
              <label>描述</label>
              <textarea
                value={newInvestment.description}
                onChange={(e) => setNewInvestment({ ...newInvestment, description: e.target.value })}
                rows={3}
              ></textarea>
            </div>
            <button type="submit" className="submit-button">添加</button>
          </form>
        </div>
      )}

      <div className="investments-list">
        {investments.map((investment) => (
          <div key={investment.id} className="investment-card">
            <div className="investment-header">
              <h3>{investment.name}</h3>
              <div className="investment-actions">
                <button className="edit-button">编辑</button>
                <button className="delete-button" onClick={() => handleDeleteInvestment(investment.id)}>
                  删除
                </button>
              </div>
            </div>
            <p className="investment-description">{investment.description}</p>
            <div className="investment-stats">
              <div className="stat-item">
                <span className="stat-label">初始投资：</span>
                <span className="stat-value">¥{investment.initialInvestment.toLocaleString()}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">当前价值：</span>
                <span className={`stat-value ${investment.currentValue > investment.initialInvestment ? 'profit' : 'loss'}`}>
                  ¥{investment.currentValue.toLocaleString()}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">收益率：</span>
                <span className={`stat-value ${(investment.currentValue - investment.initialInvestment) / investment.initialInvestment > 0 ? 'profit' : 'loss'}`}>
                  {(((investment.currentValue - investment.initialInvestment) / investment.initialInvestment) * 100).toFixed(2)}%
                </span>
              </div>
            </div>
            <div className="investment-meta">
              <div className="tags">
                {investment.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
              <div className="updated-info">
                <span>更新于：{investment.updatedAt}</span>
                <span>更新者：{investment.updatedBy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Investments