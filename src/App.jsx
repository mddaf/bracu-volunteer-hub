import { useState } from 'react'
// import './App.css'
import Register from './components/Register'
import { FiUser, FiMail, FiLock, FiCheck } from "react-icons/fi";

function App() {
  const [count, setCount] = useState(0)

  return (
    
    <div>
      <Register/>
    </div>
  
  )
}

export default App;
