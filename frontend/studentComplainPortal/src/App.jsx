import './App.css'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Home.jsx'

import Signup from './components/signup.jsx'
import About from './components/About.jsx'

import Login from './components/Login.jsx'
function App() {
  

  return (
    <>
    <BrowserRouter> 
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
