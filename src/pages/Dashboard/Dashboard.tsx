import React, { useEffect } from 'react'
import useInvestmentStore from '../../store/investmentStore'
import './Dashboard.css'

const Dashboard: React.FC = () => {
  const investments = useInvestmentStore((state) => state.investments)
  const loadInvestments = useInvestmentStore((state) => state.loadInvestments)

  useEffect(() => {
    loadInvestments()
  }, [loadInvestments])

  // 计算总投资和总收益
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.initial_investment, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.current_value, 0)
  const totalProfit = totalCurrentValue - totalInvestment
  const totalProfitPercentage = totalInvestment > 0 ? (totalProfit / totalInvestment) * 100 : 0

  // 按标签分组投资
  const investmentsByTag = investments.reduce((acc, inv) => {
    inv.tags.forEach(tag => {
      if (!acc[tag]) {
        acc[tag] = []
      }
      acc[tag].push(inv)
    })
    return acc
  }, {} as Record<string, typeof investments>)

  // 计算每个标签的投资总额
  const tagStats = Object.entries(investmentsByTag).map(([tag, invs]) => {
    const tagTotal = invs.reduce((sum, inv) => sum + inv.current_value, 0)
    const tagPercentage = (tagTotal / totalCurrentValue) * 100
    return { tag, total: tagTotal, percentage: tagPercentage }
  })

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>投资仪表盘</h2>
        <p>欢迎查看您的投资概览</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>总投资</h3>
            <p className="stat-value">¥{totalInvestment.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>当前总值</h3>
            <p className="stat-value">¥{totalCurrentValue.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className={`stat-icon ${totalProfit > 0 ? 'profit' : 'loss'}`}>
            {totalProfit > 0 ? '📈' : '📉'}
          </div>
          <div className="stat-content">
            <h3>总收益</h3>
            <p className={`stat-value ${totalProfit > 0 ? 'profit' : 'loss'}`}>
              ¥{Math.abs(totalProfit).toLocaleString()}
              {totalProfit > 0 ? '+' : ''}
            </p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className={`stat-icon ${totalProfitPercentage > 0 ? 'profit' : 'loss'}`}>
            {totalProfitPercentage > 0 ? '📈' : '📉'}
          </div>
          <div className="stat-content">
            <h3>收益率</h3>
            <p className={`stat-value ${totalProfitPercentage > 0 ? 'profit' : 'loss'}`}>
              {totalProfitPercentage.toFixed(2)}%
              {totalProfitPercentage > 0 ? '+' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="dashboard-sections">
        <div className="section">
          <h3>投资项目分布</h3>
          <div className="investments-list">
            {investments.map((investment) => (
              <div key={investment.id} className="investment-item">
                <div className="investment-info">
                  <h4>{investment.name}</h4>
                  <p>{investment.description}</p>
                </div>
                <div className="investment-values">
                  <span className="value">¥{investment.current_value.toLocaleString()}</span>
                  <span className={`percentage ${investment.current_value > investment.initial_investment ? 'profit' : 'loss'}`}>
                    {(((investment.current_value - investment.initial_investment) / investment.initial_investment) * 100).toFixed(2)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="section">
          <h3>投资类别分布</h3>
          <div className="tags-distribution">
            {tagStats.map((stat) => (
              <div key={stat.tag} className="tag-stat">
                <div className="tag-info">
                  <span className="tag-name">{stat.tag}</span>
                  <span className="tag-value">¥{stat.total.toLocaleString()}</span>
                </div>
                <div className="tag-progress">
                  <div 
                    className="tag-progress-bar" 
                    style={{ width: `${stat.percentage}%` }}
                  ></div>
                </div>
                <span className="tag-percentage">{stat.percentage.toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard