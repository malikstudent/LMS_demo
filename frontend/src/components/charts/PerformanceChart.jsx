import React from 'react'

const PerformanceChart = ({ data }) => {
  // Simple chart visualization using CSS and HTML
  const maxValue = data?.datasets?.[0]?.data ? Math.max(...data.datasets[0].data) : 100
  
  if (!data || !data.labels || !data.datasets) {
    return (
      <div className="chart-placeholder">
        <div className="placeholder-content">
          <h4>📈 Performance Chart</h4>
          <p>Chart data is loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="performance-chart">
      <h4>📈 Student Performance Trend</h4>
      <div className="chart-area">
        <div className="y-axis">
          {[100, 80, 60, 40, 20, 0].map(value => (
            <div key={value} className="y-tick">
              <span>{value}</span>
            </div>
          ))}
        </div>
        
        <div className="chart-container">
          <div className="chart-grid">
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} className="grid-line"></div>
            ))}
          </div>
          
          <div className="chart-bars">
            {data.labels.map((label, index) => {
              const value = data.datasets[0].data[index]
              const height = (value / maxValue) * 100
              
              return (
                <div key={index} className="bar-container">
                  <div 
                    className="bar"
                    style={{ height: `${height}%` }}
                    title={`${label}: ${value}%`}
                  >
                    <div className="bar-value">{value}</div>
                  </div>
                  <div className="bar-label">{label}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <style>{`
        .performance-chart {
          width: 100%;
          max-width: 600px;
          margin: 0 auto;
        }

        .performance-chart h4 {
          text-align: center;
          color: #2c3e50;
          margin-bottom: 20px;
        }

        .chart-area {
          display: flex;
          align-items: flex-end;
          height: 300px;
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .y-axis {
          display: flex;
          flex-direction: column-reverse;
          justify-content: space-between;
          height: 100%;
          margin-right: 15px;
          width: 40px;
        }

        .y-tick {
          display: flex;
          align-items: center;
          height: 20px;
        }

        .y-tick span {
          font-size: 11px;
          color: #6c757d;
          text-align: right;
          width: 100%;
        }

        .chart-container {
          flex: 1;
          height: 100%;
          position: relative;
        }

        .chart-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .grid-line {
          height: 1px;
          background-color: #f0f0f0;
          width: 100%;
        }

        .chart-bars {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          height: 100%;
          gap: 10px;
          position: relative;
          z-index: 2;
        }

        .bar-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
          height: 100%;
        }

        .bar {
          background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
          border-radius: 4px 4px 0 0;
          width: 100%;
          max-width: 60px;
          position: relative;
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding-top: 5px;
          min-height: 20px;
        }

        .bar:hover {
          filter: brightness(1.1);
          transform: translateY(-2px);
        }

        .bar-value {
          color: white;
          font-size: 11px;
          font-weight: 600;
          text-shadow: 0 1px 2px rgba(0,0,0,0.3);
        }

        .bar-label {
          margin-top: 8px;
          font-size: 12px;
          color: #6c757d;
          font-weight: 500;
        }

        .chart-placeholder {
          height: 300px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8f9fa;
          border-radius: 8px;
          border: 2px dashed #dee2e6;
        }

        .placeholder-content {
          text-align: center;
          color: #6c757d;
        }

        .placeholder-content h4 {
          margin: 0 0 10px 0;
          color: #495057;
        }

        .placeholder-content p {
          margin: 0;
          font-size: 14px;
        }

        @media (max-width: 600px) {
          .chart-area {
            height: 250px;
            padding: 15px;
          }

          .y-axis {
            width: 30px;
            margin-right: 10px;
          }

          .y-tick span {
            font-size: 10px;
          }

          .bar {
            max-width: 40px;
          }

          .bar-value {
            font-size: 10px;
          }

          .bar-label {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  )
}

export default PerformanceChart
