import { Bell, Menu } from 'lucide-react'

function AppHeader({ onMenuClick }) {
  return (
    <header className="flex min-h-20 items-center justify-between border-b border-[#D6E8E6] bg-white px-5 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onMenuClick}
          className="rounded-md p-2 text-[#263B4D] hover:bg-[#E7F5F3] focus:outline-none focus:ring-2 focus:ring-[#0F8F87] lg:hidden"
        >
          <Menu aria-hidden="true" size={21} />
        </button>
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-[#617589]">Screening workspace</p>
          <h1 className="font-heading mt-1 text-xl font-semibold text-[#263B4D] sm:text-2xl">Dashboard</h1>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <button
          type="button"
          aria-label="View notifications"
          className="relative rounded-md p-2 text-[#617589] hover:bg-[#E7F5F3] focus:outline-none focus:ring-2 focus:ring-[#0F8F87]"
        >
          <Bell aria-hidden="true" size={19} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[#0F8F87]" />
        </button>
        <div className="flex items-center gap-3 border-l border-[#D6E8E6] pl-3 sm:pl-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E7F5F3] text-sm font-semibold text-[#08746E]">AK</div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-[#263B4D]">Asha Kapoor</p>
            <p className="text-xs text-[#617589]">Healthcare worker</p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default AppHeader
