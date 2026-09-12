import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/app/ProtectedRoute.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Home from './pages/Home.jsx'
import HowItWorks from './pages/HowItWorks.jsx'
import Login from './pages/Login.jsx'
import ScreeningWorkspace from './pages/app/ScreeningWorkspace.jsx'
import Technology from './pages/Technology.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/technology" element={<Technology />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/screenings/:id" element={<ScreeningWorkspace />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App