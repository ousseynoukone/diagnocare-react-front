
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthLayout from './layouts/auth-layout'
import PublicLayout from './layouts/public-layout'
import MainLayout from './layouts/main-layout'

function App() {
  
  return (
    <BrowserRouter>

    <Routes>
    <Route element = {<AuthLayout />}>

      <Route path = "/login" element = {<h1>Login page</h1>} />
      <Route path = "/register" element = {<h1>Register page</h1>} />
    </Route>

    <Route element = {<PublicLayout />}>
      <Route path = "/" element = {<h1>Public page</h1>} />
      <Route path = "/home" element = {<h1>Public page</h1>} />
    </Route>

    <Route element = {<MainLayout />}>
      <Route path = "/dashboard" element = {<h1>Dashboard page</h1>} />
    </Route>

    </Routes>

    
    </BrowserRouter>

  )
}

export default App
