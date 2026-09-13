import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AppHeader from '../components/app/AppHeader.jsx'
import AppSidebar from '../components/app/AppSidebar.jsx'

function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[#F7FAFA] text-[#263B4D]">
      <AppSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="min-w-0 flex-1 overflow-x-hidden px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
