import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from  './components/navbar'
import Home from './pages/home'
import Dashboard from "@/pages/Dashboard"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ExpenseForm from './pages/ExpenseForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path = "/expense"  element = {<ExpenseForm />} />
      
      </Routes>
    </>
  )
}

export default App
