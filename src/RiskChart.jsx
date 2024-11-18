import axios from 'axios';
import { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

async function fetchHistoricalData() {
  const response = await axios.get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart', {
    params: {
      vs_currency: 'usd',
      days: 'max', // fetch all available data
    },
  });
  return response.data;
}

function calculateRisk(prices, windowSize = 30) {
    let riskValues = [];
    for (let i = windowSize; i < prices.length; i++) {
      const windowPrices = prices.slice(i - windowSize, i);
      const mean = windowPrices.reduce((a, b) => a + b, 0) / windowPrices.length;
      const variance = windowPrices.reduce((sum, price) => sum + (price - mean) ** 2, 0) / windowPrices.length;
      const risk = Math.sqrt(variance); // standard deviation
      riskValues.push(risk);
    }
    return riskValues;
  }
  

  function RiskChart() {
    const [data, setData] = useState([]);
    
    useEffect(() => {
      async function loadData() {
        const historicalData = await fetchHistoricalData();
        const prices = historicalData.prices.map(item => item[1]);
        
        // Assuming dates are included in your data
        const dates = historicalData.prices.map(item => new Date(item[0]).toLocaleDateString());
        
        const riskValues = calculateRisk(prices);
        
        // Combine prices, risk values, and dates into one data structure
        const chartData = riskValues.map((risk, index) => ({
          date: dates[index + 30], // Offset by the rolling window
          price: prices[index + 30],
          risk: risk
        }));
  
        setData(chartData);
      }
      
      loadData();
    }, []);
  
    return (
      <LineChart width={800} height={400} data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" domain={[0, 'auto']} />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" domain={[0, 1]} />
        <Tooltip />
        <Legend />
        <Line yAxisId="left" type="monotone" dataKey="price" stroke="#8884d8" />
        <Line yAxisId="right" type="monotone" dataKey="risk" stroke="#82ca9d" />
      </LineChart>
    );
  }
  
  export default RiskChart;  

