import { ArrowRight, ClipboardPlus, Clock3, FileCheck2, Plus } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

const overviewCards = [
  { label: "Today's screenings", value: '08', detail: 'Demo activity', icon: ClipboardPlus },
  { label: 'Completed', value: '05', detail: 'Demo activity', icon: FileCheck2 },
  { label: 'Pending', value: '03', detail: 'Needs review', icon: Clock3 },
]

const recentScreenings = [
  { id: 'NR-DEMO-1042', patient: 'Patient A', date: 'Today, 10:24 AM', status: 'Ready for review' },
  { id: 'NR-DEMO-1041', patient: 'Patient B', date: 'Today, 09:48 AM', status: 'Processing' },
  { id: 'NR-DEMO-1040', patient: 'Patient C', date: 'Yesterday, 04:16 PM', status: 'Completed' },
  { id: 'NR-DEMO-1039', patient: 'Patient D', date: 'Yesterday, 02:35 PM', status: 'Needs image' },
]

const statusStyles = {
  'Ready for review': 'bg-[#E7F5F3] text-[#08746E]',
  Processing: 'bg-[#F1F5F6] text-[#617589]',
  Completed: 'bg-[#E7F5F3] text-[#08746E]',
  'Needs image': 'bg-[#FFF4E5] text-[#9A6515]',
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}>
      {status}
    </span>
  )
}

function Dashboard() {
  const navigate = useNavigate()

  const openScreening = (screeningId) => navigate(`/app/screenings/${screeningId}`)

  const handleRowKeyDown = (event, screeningId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openScreening(screeningId)
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 border-b border-[#D6E8E6] pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-[#0F8F87]">Good morning, Asha</p>
          <h2 className="font-heading mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#263B4D] sm:text-4xl">Your screening overview</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-[#617589]">Review today&apos;s activity and continue screening work from your clinical workspace.</p>
        </div>
        <Link
          to="/app/screenings/NR-DEMO-NEW"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-[#0F8F87] px-5 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(15,143,135,0.16)] transition-colors hover:bg-[#08746E] focus:outline-none focus:ring-2 focus:ring-[#0F8F87] focus:ring-offset-2"
        >
          <Plus aria-hidden="true" size={18} />
          New Screening
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {overviewCards.map(({ label, value, detail, icon: Icon }) => (
          <article key={label} className="rounded-xl border border-[#D6E8E6] bg-white p-5 shadow-[0_8px_24px_rgba(7,21,47,0.03)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[#617589]">{label}</p>
                <p className="font-heading mt-3 text-3xl font-semibold text-[#263B4D]">{value}</p>
                <p className="mt-1 text-xs text-[#617589]">{detail}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E7F5F3] text-[#0F8F87]">
                <Icon aria-hidden="true" size={19} />
              </div>
            </div>
          </article>
        ))}
      </div>

      <section className="mt-8 rounded-xl border border-[#D6E8E6] bg-white shadow-[0_8px_24px_rgba(7,21,47,0.03)]">
        <div className="flex flex-col gap-3 border-b border-[#D6E8E6] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="font-heading text-lg font-semibold text-[#263B4D]">Recent screenings</h3>
            <p className="mt-1 text-xs text-[#617589]">DEMO DATA · Replace with API-backed screening records.</p>
          </div>
          <button type="button" className="inline-flex items-center gap-2 self-start text-sm font-semibold text-[#0F8F87] hover:text-[#08746E] focus:outline-none focus:ring-2 focus:ring-[#0F8F87] focus:ring-offset-2">
            View all
            <ArrowRight aria-hidden="true" size={16} />
          </button>
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead className="bg-[#F7FAFA] text-xs uppercase tracking-[0.12em] text-[#617589]">
              <tr>
                <th className="px-6 py-4 font-semibold">Screening ID</th>
                <th className="px-6 py-4 font-semibold">Patient</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D6E8E6]">
              {recentScreenings.map((screening) => (
                <tr
                  key={screening.id}
                  tabIndex="0"
                  role="link"
                  onClick={() => openScreening(screening.id)}
                  onKeyDown={(event) => handleRowKeyDown(event, screening.id)}
                  className="cursor-pointer text-[#263B4D] hover:bg-[#F7FAFA] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0F8F87]"
                >
                  <td className="px-6 py-4 font-medium">{screening.id}</td>
                  <td className="px-6 py-4 text-[#617589]">{screening.patient}</td>
                  <td className="px-6 py-4 text-[#617589]">{screening.date}</td>
                  <td className="px-6 py-4"><StatusBadge status={screening.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="divide-y divide-[#D6E8E6] md:hidden">
          {recentScreenings.map((screening) => (
            <article
              key={screening.id}
              tabIndex="0"
              role="link"
              onClick={() => openScreening(screening.id)}
              onKeyDown={(event) => handleRowKeyDown(event, screening.id)}
              className="flex cursor-pointer items-start justify-between gap-4 px-5 py-4 hover:bg-[#F7FAFA] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0F8F87]"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#263B4D]">{screening.id}</p>
                <p className="mt-1 text-sm text-[#617589]">{screening.patient}</p>
                <p className="mt-2 text-xs text-[#617589]">{screening.date}</p>
              </div>
              <StatusBadge status={screening.status} />
            </article>
          ))}
        </div>
      </section>

      <p className="mt-5 text-center text-xs text-[#617589]">This dashboard is a frontend demonstration. Screening records and statuses are not connected to a live service.</p>
    </div>
  )
}

export default Dashboard
