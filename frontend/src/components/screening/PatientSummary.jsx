import { CalendarDays, IdCard, UserRound } from 'lucide-react'

function PatientSummary({ patient }) {
  const details = [
    { label: 'Patient ID', value: patient.id, icon: IdCard },
    { label: 'Patient name', value: patient.name, icon: UserRound },
    { label: 'Age', value: `${patient.age} years`, icon: UserRound },
    { label: 'Sex', value: patient.sex, icon: UserRound },
    { label: 'Screening date', value: patient.screeningDate, icon: CalendarDays },
  ]

  return (
    <section className="rounded-xl border border-[#D6E8E6] bg-white shadow-[0_8px_24px_rgba(7,21,47,0.03)]" aria-labelledby="patient-summary-heading">
      <div className="border-b border-[#D6E8E6] px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 id="patient-summary-heading" className="font-heading text-lg font-semibold text-[#263B4D]">Patient summary</h2>
            <p className="mt-1 text-xs text-[#617589]">DEMO DATA · Replace with a patient record from the screening service.</p>
          </div>
          <span className="rounded-md bg-[#E7F5F3] px-2.5 py-1 text-xs font-semibold text-[#08746E]">Prototype record</span>
        </div>
      </div>
      <dl className="grid gap-5 px-5 py-6 sm:grid-cols-2 sm:px-6 lg:grid-cols-5">
        {details.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon aria-hidden="true" className="mt-0.5 shrink-0 text-[#0F8F87]" size={18} />
            <div className="min-w-0">
              <dt className="text-xs text-[#617589]">{label}</dt>
              <dd className="mt-1 truncate text-sm font-semibold text-[#263B4D]">{value}</dd>
            </div>
          </div>
        ))}
      </dl>
    </section>
  )
}

export default PatientSummary
