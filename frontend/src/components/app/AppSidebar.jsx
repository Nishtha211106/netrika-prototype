import { BarChart3, ClipboardList, Eye, FileText, LayoutDashboard, Settings, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const navigation = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/app/dashboard', active: true },
  { label: 'New Screening', icon: ClipboardList, to: '/app/screenings/NR-DEMO-NEW', active: true },
  { label: 'Screenings', icon: BarChart3, to: '/app/dashboard', active: false },
  { label: 'Reports', icon: FileText, to: '/app/dashboard', active: false },
  { label: 'Settings', icon: Settings, to: '/app/dashboard', active: false },
]

function AppSidebar({ isOpen, onClose }) {
  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-30 bg-[#07152F]/30 lg:hidden"
        />
      )}
      <aside
        aria-label="Application navigation"
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-[#D6E8E6] bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-[#D6E8E6] px-6">
          <NavLink to="/app/dashboard" onClick={onClose} className="flex items-center gap-2.5 text-[#263B4D]">
            <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0F8F87] text-[#0F8F87]">
              <Eye aria-hidden="true" size={21} strokeWidth={1.8} />
            </span>
            <span className="font-heading text-[1.2rem] font-semibold tracking-[-0.02em]">Netrika</span>
          </NavLink>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="rounded-md p-2 text-[#617589] hover:bg-[#E7F5F3] focus:outline-none focus:ring-2 focus:ring-[#0F8F87] lg:hidden"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="px-3 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#617589]">Workspace</p>
          <div className="mt-3 space-y-1">
            {navigation.map(({ label, icon: Icon, to, active }) => (
              <NavLink
                key={label}
                to={to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                    active && isActive
                      ? 'bg-[#E7F5F3] text-[#08746E]'
                      : 'text-[#617589] hover:bg-[#F7FAFA] hover:text-[#0F8F87]'
                  }`
                }
              >
                <Icon aria-hidden="true" size={18} />
                <span>{label}</span>
                {!active && <span className="ml-auto text-[0.65rem] text-[#91A3B2]">Soon</span>}
              </NavLink>
            ))}
          </div>
        </nav>

        <div className="border-t border-[#D6E8E6] px-6 py-5">
          <p className="text-xs leading-5 text-[#617589]">Demo workspace</p>
          <p className="mt-1 text-sm font-medium text-[#263B4D]">Screening team</p>
        </div>
      </aside>
    </>
  )
}

export default AppSidebar
