import { Eye, Globe2, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

const navigation = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Technology', to: '/technology' },
  { label: 'Contact', to: '/contact' },
]

function Brand({ onClick }) {
  return (
    <Link to="/" onClick={onClick} className="flex shrink-0 items-center gap-2.5 text-[#263B4D]">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0F8F87] text-[#0F8F87]">
        <Eye aria-hidden="true" size={21} strokeWidth={1.8} />
      </span>
      <span className="font-heading text-[1.2rem] font-semibold tracking-[-0.02em]">Netrika</span>
    </Link>
  )
}

function LanguageSelector() {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-[#617589]">
      <Globe2 aria-hidden="true" size={16} />
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        className="cursor-pointer bg-transparent py-1 pr-1 outline-none focus-visible:ring-2 focus-visible:ring-[#0F8F87] focus-visible:ring-offset-2"
        defaultValue="en"
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>
    </label>
  )
}

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  const linkClasses = ({ isActive }) =>
    `relative whitespace-nowrap py-2 text-sm font-medium transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:origin-left after:scale-x-0 after:bg-[#0F8F87] after:transition-transform hover:text-[#0F8F87] hover:after:scale-x-100 ${
      isActive ? 'text-[#0F8F87] after:scale-x-100' : 'text-[#617589]'
    }`

  return (
    <header className="border-b border-[#D6E8E6] bg-white">
      <nav
        aria-label="Primary navigation"
        className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8 lg:py-[1.15rem]"
      >
        <Brand onClick={closeMenu} />

        <div className="hidden items-center gap-7 lg:flex xl:gap-9">
          {navigation.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClasses}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-6 lg:flex">
          <LanguageSelector />
          <Link
            to="/login"
            className="rounded-md bg-[#0F8F87] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#08746E] focus:outline-none focus:ring-2 focus:ring-[#0F8F87] focus:ring-offset-2"
          >
            Login
          </Link>
        </div>

        <button
          type="button"
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          className="rounded-md p-2 text-[#263B4D] transition-colors hover:bg-[#E7F5F3] focus:outline-none focus:ring-2 focus:ring-[#0F8F87] lg:hidden"
        >
          {isMenuOpen ? <X aria-hidden="true" size={23} /> : <Menu aria-hidden="true" size={23} />}
        </button>
      </nav>

      {isMenuOpen && (
        <div id="mobile-navigation" className="border-t border-[#D6E8E6] bg-white px-5 py-5 sm:px-8 lg:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-3">
            {navigation.map((item) => (
              <NavLink key={item.to} to={item.to} className={linkClasses} onClick={closeMenu}>
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-4 border-t border-[#D6E8E6] pt-4 sm:flex-row sm:items-center sm:justify-between">
              <LanguageSelector />
              <Link
                to="/login"
                onClick={closeMenu}
                className="inline-flex justify-center rounded-md bg-[#0F8F87] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#08746E] focus:outline-none focus:ring-2 focus:ring-[#0F8F87] focus:ring-offset-2"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar