import {
  Accessibility,
  ArrowRight,
  Brain,
  Camera,
  Check,
  Eye,
  FileCheck2,
  HeartHandshake,
  Languages,
  Lightbulb,
  MapPin,
  ShieldCheck,
  Sparkles,
  Upload,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

const projectMetrics = [
  { value: '2,40,000+', label: 'Diabetes patients screened' },
  { value: '94.2%', label: 'Sensitivity' },
  { value: '350+', label: 'Health centres' },
]

const benefits = [
  {
    title: 'Early Detection',
    description: 'Identify diabetic retinopathy at an early, treatable stage — before vision loss begins.',
    icon: Eye,
  },
  {
    title: 'Explainable Results',
    description: 'See which retinal regions influenced the AI assessment using visual heatmaps.',
    icon: Lightbulb,
  },
  {
    title: 'Fast Screening',
    description: 'Support rapid screening workflows suitable for high-volume community screening.',
    icon: Zap,
  },
  {
    title: 'Accessible Healthcare',
    description: 'Designed for primary health centres and screening camps in underserved areas.',
    icon: Accessibility,
  },
]

const processSteps = [
  { number: '01', title: 'Capture', description: 'Capture retinal image using a fundus camera or smartphone adapter.', icon: Camera },
  { number: '02', title: 'Upload', description: 'Upload the image securely to the Netrika platform.', icon: Upload },
  { number: '03', title: 'Quality Check', description: 'Automated image quality assessment before analysis.', icon: ShieldCheck },
  { number: '04', title: 'AI Analysis', description: 'AI model detects lesions and grades DR severity.', icon: Brain },
  { number: '05', title: 'Result', description: 'Explainable result with referral recommendation.', icon: FileCheck2 },
]

const evidenceCategories = [
  { label: 'Microaneurysms', color: 'bg-[#e98b72]' },
  { label: 'Hemorrhages', color: 'bg-[#d94763]' },
  { label: 'Hard Exudates', color: 'bg-[#f2c94c]' },
  { label: 'Retinal Vessels', color: 'bg-[#0F8F87]' },
]

function SectionIntro({ eyebrow, title, description, align = 'center' }) {
  return (
    <div className={`${align === 'left' ? 'text-left' : 'mx-auto text-center'} max-w-2xl`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F8F87]">{eyebrow}</p>
      <h2 className="font-heading mt-4 text-3xl font-semibold tracking-[-0.035em] text-[#263B4D] sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-7 text-[#617589]">{description}</p>}
    </div>
  )
}

function ActionLink({ children, to, secondary = false }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F8F87] focus:ring-offset-2 ${
        secondary
          ? 'text-[#0F8F87] hover:bg-[#E7F5F3]'
          : 'bg-[#0F8F87] text-white shadow-[0_8px_20px_rgba(15,143,135,0.2)] hover:bg-[#08746E]'
      }`}
    >
      {children}
      <ArrowRight aria-hidden="true" size={17} />
    </Link>
  )
}

function FundusVisual({ heatmap = false }) {
  return (
    <div
      role="img"
      aria-label={heatmap ? 'Illustrative retinal heatmap visual' : 'Illustrative retinal visual'}
      className="relative mx-auto aspect-square w-full max-w-[25rem] rounded-full border-[1.5rem] border-[#E7F5F3] bg-[#d98c7c] p-5 shadow-[0_20px_60px_rgba(7,21,47,0.14)] sm:border-[2rem] sm:p-7"
    >
      <div className="relative h-full w-full overflow-hidden rounded-full bg-[radial-gradient(circle_at_48%_45%,#ffd9c7_0%,#e99a87_28%,#ba554f_54%,#622c4d_100%)]">
        <div className="absolute left-[42%] top-[35%] h-12 w-12 rounded-full bg-[#f9e8c7] opacity-80 blur-sm" />
        <div className="absolute left-[46%] top-[48%] h-1/2 w-1 rotate-[38deg] rounded-full bg-[#6d344e] opacity-70" />
        <div className="absolute left-[45%] top-[48%] h-1/2 w-1 -rotate-[48deg] rounded-full bg-[#70354c] opacity-70" />
        <div className="absolute left-[45%] top-[49%] h-1/2 w-0.5 rotate-[78deg] rounded-full bg-[#7f3b4c] opacity-75" />
        <div className="absolute left-[44%] top-[49%] h-1/3 w-0.5 -rotate-[78deg] rounded-full bg-[#7f3b4c] opacity-75" />
        {heatmap && (
          <>
            <div className="absolute left-[19%] top-[18%] h-9 w-9 rounded-full bg-[#e84d69]/60 blur-md" />
            <div className="absolute left-[66%] top-[31%] h-7 w-7 rounded-full bg-[#f5c84b]/80 blur-sm" />
            <div className="absolute left-[25%] top-[67%] h-8 w-8 rounded-full bg-[#e84d69]/70 blur-md" />
            <div className="absolute left-[67%] top-[70%] h-6 w-6 rounded-full bg-[#f5c84b]/80 blur-sm" />
          </>
        )}
      </div>
      {heatmap && <span className="absolute right-0 top-8 rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-[#0F8F87] shadow-md">Heatmap view</span>}
    </div>
  )
}

function Home() {
  return (
    <div className="overflow-hidden bg-[#F7FAFA] text-[#263B4D]">
    <section className="bg-[#F7FAFA]">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[calc(100vh-82px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-20">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#0F8F87]">Diabetic retinopathy screening</p>
            <h1 className="font-heading mt-5 max-w-2xl text-5xl font-semibold leading-[1.08] tracking-[-0.045em] sm:text-6xl lg:text-[4.25rem]">
              Early detection. <span className="text-[#0F8F87]">Clear results.</span>{' '}
              <span className="text-[#617589]">Accessible everywhere.</span>
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-[#617589] sm:text-lg sm:leading-8">
              Netrika uses AI to screen for diabetic retinopathy from retinal images — helping healthcare workers identify patients who need specialist referral.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ActionLink to="/login">Start Screening</ActionLink>
              <ActionLink to="/how-it-works" secondary>Learn More</ActionLink>
            </div>
            <div className="mt-14 grid max-w-xl grid-cols-1 gap-4 border-t border-[#D6E8E6] pt-6 min-[480px]:grid-cols-3 min-[480px]:gap-0 min-[480px]:divide-x min-[480px]:divide-[#D6E8E6]">
              {projectMetrics.map((metric) => (
                <div key={metric.label} className="border-b border-[#D6E8E6] pb-4 last:border-b-0 min-[480px]:border-b-0 min-[480px]:px-3 min-[480px]:pb-0 first:min-[480px]:pl-0 last:min-[480px]:pr-0 sm:px-5">
                  <p className="text-xl font-semibold tracking-[-0.03em] sm:text-2xl">{metric.value}</p>
                  <p className="mt-1 max-w-[9rem] text-xs leading-5 text-[#617589] sm:text-sm">{metric.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 inline-flex rounded-md bg-[#E7F5F3] px-2.5 py-1 text-xs font-medium text-[#0F8F87]">Prototype data · illustrative only</p>
          </div>
          <FundusVisual />
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionIntro eyebrow="Why choose Netrika" title="Designed for real-world healthcare" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ title, description, icon: Icon }) => (
              <article key={title} className="rounded-xl border border-[#D6E8E6] bg-white p-6 shadow-[0_8px_30px_rgba(7,21,47,0.04)]">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E7F5F3] text-[#0F8F87]"><Icon aria-hidden="true" size={21} /></div>
                <h3 className="mt-6 text-lg font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#617589]">{description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#F7FAFA] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionIntro eyebrow="The screening process" title="How it works" description="A clear workflow from image capture to an explainable result." />
          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {processSteps.map(({ number, title, description, icon: Icon }, index) => (
              <article key={number} className="relative rounded-xl border border-[#D6E8E6] bg-white p-5 shadow-[0_8px_24px_rgba(7,21,47,0.03)]">
                <div className="flex items-center justify-between"><span className="text-sm font-semibold text-[#0F8F87]">{number}</span><Icon aria-hidden="true" className="text-[#0F8F87]" size={19} /></div>
                <h3 className="mt-7 text-base font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#617589]">{description}</p>
                {index < processSteps.length - 1 && <ArrowRight aria-hidden="true" className="absolute -right-3 top-1/2 z-10 hidden text-[#0F8F87] lg:block" size={20} />}
              </article>
            ))}
          </div>
          <div className="mt-10 text-center"><ActionLink to="/login">Begin a Screening</ActionLink></div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <div className="order-2 lg:order-1"><FundusVisual heatmap /></div>
          <div className="order-1 lg:order-2">
            <SectionIntro align="left" eyebrow="Explainable AI" title="See what the AI sees" description="Netrika can use visual heatmaps to show retinal regions influencing the assessment. This frontend representation is ready for future model-connected evidence." />
            <div className="mt-8 grid grid-cols-2 gap-3">
              {evidenceCategories.map(({ label, color }) => <div key={label} className="flex items-center gap-3 rounded-lg border border-[#D6E8E6] px-4 py-3 text-sm font-medium text-[#617589]"><span className={`h-2.5 w-2.5 rounded-full ${color}`} />{label}</div>)}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#07152F] px-5 py-20 text-white sm:px-8 lg:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0F8F87]">Built for India</p>
            <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Screening that meets people where care begins.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-[#D6E8E6]">Netrika is designed for primary health centres and screening camps, supporting healthcare workers with a focused, accessible workflow.</p>
          </div>
          <div className="rounded-2xl border border-[#243B61] bg-[#07152F] p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#0F8F87] text-white"><MapPin aria-hidden="true" size={22} /></div>
            <h3 className="mt-6 text-xl font-semibold">Accessible by design</h3>
            <ul className="mt-5 space-y-4 text-sm text-[#c4d2e7]">
              {['Built around practical screening workflows', 'Clear information for healthcare workers', 'Designed for English and Hindi interfaces'].map((item) => <li key={item} className="flex gap-3"><Check aria-hidden="true" className="mt-0.5 shrink-0 text-[#0F8F87]" size={17} />{item}</li>)}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#F7FAFA] px-5 py-20 sm:px-8 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <SectionIntro eyebrow="Language support" title="Speak the language of care" description="The interface is designed to support both English and Hindi, with translation logic to follow in a future release." />
          <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
            {[{ title: 'English', subtitle: 'English interface', icon: Languages }, { title: 'हिन्दी', subtitle: 'Hindi interface', icon: HeartHandshake }].map(({ title, subtitle, icon: Icon }, index) => <div key={title} className={`flex items-center gap-4 rounded-xl border p-5 ${index === 0 ? 'border-[#0F8F87] bg-white shadow-[0_8px_25px_rgba(15,143,135,0.08)]' : 'border-[#D6E8E6] bg-white/60'}`}><div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E7F5F3] text-[#0F8F87]"><Icon aria-hidden="true" size={21} /></div><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm text-[#617589]">{subtitle}</p></div>{index === 0 && <span className="ml-auto rounded-md bg-[#E7F5F3] px-2.5 py-1 text-xs font-semibold text-[#0F8F87]">Selected</span>}</div>)}
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 lg:py-24">
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-2xl bg-[#E7F5F3] px-6 py-14 text-center sm:px-10">
          <Sparkles aria-hidden="true" className="text-[#0F8F87]" size={25} />
          <h2 className="font-heading mt-5 text-3xl font-semibold tracking-[-0.035em] text-[#263B4D] sm:text-4xl">Ready to begin screening?</h2>
          <p className="mt-4 max-w-lg text-base leading-7 text-[#617589]">Join health centres using Netrika for diabetic retinopathy screening.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row"><ActionLink to="/login">Start Screening</ActionLink><ActionLink to="/about" secondary>About Netrika</ActionLink></div>
        </div>
      </section>
    </div>
  )
}

export default Home