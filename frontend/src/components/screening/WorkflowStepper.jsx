import { Check } from 'lucide-react'

const stages = [
  { key: 'patient', label: 'Patient' },
  { key: 'upload', label: 'Image Upload' },
  { key: 'quality', label: 'Quality Check' },
  { key: 'analysis', label: 'AI Analysis' },
  { key: 'result', label: 'Result' },
  { key: 'evidence', label: 'Evidence' },
  { key: 'reports', label: 'Reports' },
]

function WorkflowStepper({ currentStage = 'patient' }) {
  const currentIndex = stages.findIndex((stage) => stage.key === currentStage)

  return (
    <nav aria-label="Screening workflow" className="overflow-x-auto pb-2">
      <ol className="flex min-w-max items-start gap-2 sm:gap-4">
        {stages.map((stage, index) => {
          const isCurrent = index === currentIndex
          const isComplete = index < currentIndex

          return (
            <li key={stage.key} className="flex items-start">
              <div className="flex min-w-[6.75rem] flex-col items-center gap-2 text-center sm:min-w-[7.5rem]">
                <span
                  aria-current={isCurrent ? 'step' : undefined}
                  className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-semibold ${
                    isCurrent
                      ? 'border-[#0F8F87] bg-[#0F8F87] text-white'
                      : isComplete
                        ? 'border-[#0F8F87] bg-[#E7F5F3] text-[#08746E]'
                        : 'border-[#D6E8E6] bg-white text-[#91A3B2]'
                  }`}
                >
                  {isComplete ? <Check aria-hidden="true" size={16} /> : String(index + 1).padStart(2, '0')}
                </span>
                <span className={`text-xs font-medium ${isCurrent ? 'text-[#08746E]' : 'text-[#617589]'}`}>
                  {stage.label}
                </span>
              </div>
              {index < stages.length - 1 && (
                <span aria-hidden="true" className={`mt-[1.1rem] h-px w-5 sm:w-8 ${isComplete ? 'bg-[#0F8F87]' : 'bg-[#D6E8E6]'}`} />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export default WorkflowStepper
