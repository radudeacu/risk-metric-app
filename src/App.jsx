import { useState } from 'react'
import './App.css'
import RiskChart from './RiskChart';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
      <h1>Bitcoin Historical Risk Levels</h1>
      <RiskChart />
    </div>
    </>
  )
}

export default App;