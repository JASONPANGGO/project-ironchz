import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'
import useInvestmentStore from '../../store/investmentStore'
import './Analytics.css'

// 注册Chart.js组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const Analytics: React.FC = () => {
  const { investments } = useInvestmentStore()

  // 计算总投资和总收益
  const totalInvestment = investments.reduce((sum, inv) => sum + inv.initialInvestment, 0)
  const totalCurrentValue = investments.reduce((sum, inv) => sum + inv.currentValue, 0)
  const totalProfit = totalCurrentValue - totalInvestment

  // 准备投资趋势图数据（模拟30天的数据）
  const generateTrendData = () => {
    const labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
    const datasets = investments.map((inv, index) => {
      const baseValue = inv.initialInvestment
      const data = labels.map(() => {
        // 生成随机波动的数据
        const change = (Math.random() - 0.45) * 0.1 * baseValue
        return baseValue + change
      })
      // 确保最后一个数据点是当前值
      data[data.length - 1] = inv.currentValue

      // 为每个投资项目生成不同的颜色
      const colors = [
        'rgba(102, 126, 234, 0.8)',
        'rgba(118, 75, 162, 0.8)',
        'rgba(244, 114, 182, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(219, 39, 119, 0.8)'
      ]

      return {
        label: inv.name,
        data,
        borderColor: colors[index % colors.length],
        backgroundColor: colors[index % colors.length].replace('0.8', '0.1'),
        tension: 0.4
      }
    })

    return { labels, datasets }
  }

  // 准备投资类别分布图数据
  const generateCategoryData = () => {
    const categoryMap = investments.reduce((acc, inv) => {
      inv.tags.forEach(tag => {
        if (!acc[tag]) {
          acc[tag] = 0
        }
        acc[tag] += inv.currentValue
      })
      return acc
    }, {} as Record<string, number>)

    const labels = Object.keys(categoryMap)
    const data = Object.values(categoryMap)
    const backgroundColor = [
      'rgba(102, 126, 234, 0.8)',
      'rgba(118, 75, 162, 0.8)',
      'rgba(244, 114, 182, 0.8)',
      'rgba(236, 72, 153, 0.8)',
      'rgba(219, 39, 119, 0.8)'
    ]

    return { labels, datasets: [{ data, backgroundColor }] }
  }

  // 准备收益率对比图数据
  const generateReturnData = () => {
    const labels = investments.map(inv => inv.name)
    const data = investments.map(inv => {
      return ((inv.currentValue - inv.initialInvestment) / inv.initialInvestment) * 100
    })
    const backgroundColor = investments.map((_, index) => {
      const colors = [
        'rgba(102, 126, 234, 0.8)',
        'rgba(118, 75, 162, 0.8)',
        'rgba(244, 114, 182, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(219, 39, 119, 0.8)'
      ]
      return colors[index % colors.length]
    })

    return { labels, datasets: [{ label: '收益率 (%)', data, backgroundColor }] }
  }

  const trendData = generateTrendData()
  const categoryData = generateCategoryData()
  const returnData = generateReturnData()

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const
      },
      title: {
        display: true,
        text: ''
      }
    }
  }

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>数据分析</h2>
        <p>投资表现和趋势分析</p>
      </div>

      <div className="analytics-grid">
        <div className="chart-card">
          <h3>投资价值趋势</h3>
          <div className="chart-container">
            <Line 
              options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: '30天价值趋势' } } }} 
              data={trendData} 
            />
          </div>
        </div>

        <div className="chart-card">
          <h3>投资类别分布</h3>
          <div className="chart-container">
            <Pie 
              options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: '按类别分布' } } }} 
              data={categoryData} 
            />
          </div>
        </div>

        <div className="chart-card full-width">
          <h3>投资收益率对比</h3>
          <div className="chart-container">
            <Bar 
              options={{ 
                ...chartOptions, 
                plugins: { ...chartOptions.plugins, title: { text: '各投资项目收益率' } },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return value + '%'
                      }
                    }
                  }
                }
              }} 
              data={returnData} 
            />
          </div>
        </div>
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <h3>投资概览</h3>
          <div className="summary-stats">
            <div className="summary-item">
              <span className="summary-label">总投资项目数</span>
              <span className="summary-value">{investments.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">总投资金额</span>
              <span className="summary-value">¥{totalInvestment.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">当前总价值</span>
              <span className="summary-value">¥{totalCurrentValue.toLocaleString()}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">总收益</span>
              <span className={`summary-value ${totalProfit > 0 ? 'profit' : 'loss'}`}>
                ¥{Math.abs(totalProfit).toLocaleString()}{totalProfit > 0 ? '+' : ''}
              </span>
            </div>
            <div className="summary-item">
              <span className="summary-label">总收益率</span>
              <span className={`summary-value ${totalProfit > 0 ? 'profit' : 'loss'}`}>
                {totalInvestment > 0 ? ((totalProfit / totalInvestment) * 100).toFixed(2) : '0.00'}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics