
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import PublicLayout from './layouts/PublicLayout'
import MainLayout from './layouts/MainLayout'
import { HomePage } from './pages/home/HomePage'

function App() {
  
  return (
    <BrowserRouter>

    <Routes>
    <Route element = {<AuthLayout />}>

      <Route path = "/login" element = {<h1>Login page</h1>} />
      <Route path = "/register" element = {<h1>Register page</h1>} />
    </Route>

    <Route element = {<PublicLayout />}>
      <Route path = "/" element = {<HomePage />} />
      <Route path = "/home" element = {<HomePage />} />
    </Route>

    <Route element = {<MainLayout />}>
      <Route path = "/dashboard" element = {<h1>Dashboard page</h1>} />
    </Route>

    </Routes>

    
    </BrowserRouter>

  )
}

export default App
