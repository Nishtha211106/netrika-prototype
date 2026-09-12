import { Eye, Globe2 } from 'lucide-react'
import { Link } from 'react-router-dom'

const platformLinks = [
  { label: 'How It Works', to: '/how-it-works' },
  { label: 'Technology', to: '/technology' },
  { label: 'About Netrika', to: '/about' },
  { label: 'Screening', to: '/login' },
]

const legalLinks = [
  { label: 'Privacy Policy', to: '/privacy-policy' },
  { label: 'Terms of Use', to: '/terms-of-use' },
  { label: 'Medical Disclaimer', to: '/medical-disclaimer' },
  { label: 'Data Security', to: '/data-security' },
]

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-white">
      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0F8F87] text-[#0F8F87]">
        <Eye aria-hidden="true" size={21} strokeWidth={1.8} />
      </span>
      <span className="font-heading text-[1.2rem] font-semibold tracking-[-0.02em]">Netrika</span>
    </Link>
  )
}

function LanguageSelector() {
  return (
    <label className="flex items-center gap-2 text-sm font-medium text-[#D6E8E6]">
      <Globe2 aria-hidden="true" size={16} />
      <span className="sr-only">Language</span>
      <select
        aria-label="Language"
        className="cursor-pointer bg-transparent py-1 pr-1 text-white outline-none focus-visible:ring-2 focus-visible:ring-[#0F8F87] focus-visible:ring-offset-2 focus-visible:ring-offset-[#07152F]"
        defaultValue="en"
      >
        <option className="text-[#0B1F41]" value="en">English</option>
        <option className="text-[#0B1F41]" value="hi">Hindi</option>
      </select>
    </label>
  )
}

function FooterLinkGroup({ heading, links }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-[0.14em] text-[#D6E8E6]">{heading}</h2>
      <nav className="mt-5 flex flex-col items-start gap-3 text-sm" aria-label={`${heading} links`}>
        {links.map((item) => (
          <Link key={item.to} to={item.to} className="text-[#D6E8E6] transition-colors hover:text-white">
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

function Footer() {
  return (
    <footer className="bg-[#07152F] text-[#D6E8E6]">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-12 lg:py-14">
        <div>
          <Brand />
          <p className="mt-5 max-w-xs text-sm leading-6 text-[#D6E8E6]">
            A technology platform for explainable diabetic retinopathy screening.
          </p>
          <div className="mt-7">
            <LanguageSelector />
          </div>
        </div>

        <FooterLinkGroup heading="Platform" links={platformLinks} />
        <FooterLinkGroup heading="Legal" links={legalLinks} />
      </div>

      <div className="border-t border-[#243B61]">
        <div className="mx-auto max-w-6xl px-5 py-5 text-xs text-[#D6E8E6] sm:px-8">
          © 2026 NETRIKA. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer