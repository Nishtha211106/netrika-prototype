import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer.jsx'
import Navbar from '../components/Navbar.jsx'

function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F7FAFA]">
      <Navbar />
      <main className="min-w-0 flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout