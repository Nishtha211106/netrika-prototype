import { ArrowLeft, ArrowRight, ClipboardCheck, ImagePlus, LoaderCircle, LockKeyhole } from 'lucide-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import ImageUploader from '../../components/screening/ImageUploader.jsx'
import PatientSummary from '../../components/screening/PatientSummary.jsx'
import WorkflowStepper from '../../components/screening/WorkflowStepper.jsx'

import { analyzeImage } from '../../services/api.js'

const demoPatient = {
  id: 'PT-DEMO-2048',
  name: 'Demo Patient',
  age: 54,
  sex: 'Not specified',
  screeningDate: '13 September 2026',
}

function ScreeningWorkspace() {
  const { id } = useParams()
  const screeningId = id || 'NR-DEMO-1042'
  const [selectedFile, setSelectedFile] = useState(null)
  const [stage, setStage] = useState('patient')
  const [analysisResult, setAnalysisResult] = useState(null)
  const [analysisError, setAnalysisError] = useState('')

  const isQualityStage = stage === 'quality'

  return (
    <div className="mx-auto max-w-7xl">
      <div className="flex flex-col gap-5 border-b border-[#D6E8E6] pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#0F8F87]">Screening workspace</p>
            <span className="rounded-md bg-[#E7F5F3] px-2.5 py-1 text-xs font-semibold text-[#08746E]">Prototype</span>
          </div>
          <h2 className="font-heading mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#263B4D] sm:text-4xl">Patient screening</h2>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#617589]">
            <span>Screening ID: <strong className="font-semibold text-[#263B4D]">{screeningId}</strong></span>
            <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-[#0F8F87]" />{stage === 'patient' ? 'Patient details' : isQualityStage ? 'Image quality check' : 'Image upload'}</span>
          </div>
        </div>
        <p className="max-w-sm text-sm leading-6 text-[#617589]">Complete each stage in order. Future stages will become available as the workflow is implemented.</p>
      </div>

      <section className="mt-7 rounded-xl border border-[#D6E8E6] bg-white px-5 py-5 shadow-[0_8px_24px_rgba(7,21,47,0.03)] sm:px-6" aria-label="Screening progress">
        <WorkflowStepper currentStage={stage} />
      </section>

      <div className="mt-7 space-y-7">
        <PatientSummary patient={demoPatient} />

        {stage === 'patient' ? (
          <section className="rounded-xl border border-[#D6E8E6] bg-white shadow-[0_8px_24px_rgba(7,21,47,0.03)]" aria-labelledby="patient-stage-heading">
            <div className="border-b border-[#D6E8E6] px-5 py-5 sm:px-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E7F5F3] text-[#0F8F87]">
                  <ClipboardCheck aria-hidden="true" size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0F8F87]">Current stage</p>
                  <h2 id="patient-stage-heading" className="font-heading mt-1 text-xl font-semibold text-[#263B4D]">Patient details confirmed</h2>
                  <p className="mt-2 text-sm leading-6 text-[#617589]">Review the demo patient information before continuing to image upload.</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-5 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-start gap-3 text-sm text-[#617589]">
                <LockKeyhole aria-hidden="true" className="mt-0.5 shrink-0 text-[#0F8F87]" size={17} />
                <p>Patient details are ready for the next workflow stage.</p>
              </div>
              <button
                type="button"
                onClick={() => setStage('upload')}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md bg-[#0F8F87] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#08746E] focus:outline-none focus:ring-2 focus:ring-[#0F8F87] focus:ring-offset-2"
              >
                Continue to Image Upload
                <ArrowRight aria-hidden="true" size={17} />
              </button>
            </div>
          </section>
        ) : stage === 'upload' ? (
          <section className="rounded-xl border border-[#D6E8E6] bg-white shadow-[0_8px_24px_rgba(7,21,47,0.03)]" aria-labelledby="upload-stage-heading">
          <div className="border-b border-[#D6E8E6] px-5 py-5 sm:px-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E7F5F3] text-[#0F8F87]">
                <ImagePlus aria-hidden="true" size={20} />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0F8F87]">Current stage</p>
                <h2 id="upload-stage-heading" className="font-heading mt-1 text-xl font-semibold text-[#263B4D]">Retinal image upload</h2>
                <p className="mt-2 text-sm leading-6 text-[#617589]">Select a retinal image from this device to continue the prototype workflow.</p>
              </div>
            </div>
          </div>
          <div className="px-5 py-6 sm:px-6">
            <ImageUploader file={selectedFile} onFileChange={setSelectedFile} />
            <div className="mt-6 flex flex-col gap-4 border-t border-[#D6E8E6] pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[#617589]">DEMO/PROTOTYPE · The image remains in this browser session and is not uploaded.</p>
              <button
                type="button"
                disabled={!selectedFile}
                onClick={async () => {
                  setStage('quality')
                  setAnalysisResult(null)
                  setAnalysisError('')
                  try {
                    const result = await analyzeImage(selectedFile)
                    setAnalysisResult(result)
                  } catch (err) {
                    setAnalysisError(err.message)
                  }
                }}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F8F87] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-[#D6E8E6] disabled:text-[#617589] enabled:bg-[#0F8F87] enabled:text-white enabled:hover:bg-[#08746E]"
              >
                Continue to Quality Check
                <ArrowRight aria-hidden="true" size={17} />
              </button>
            </div>
          </div>
          </section>
        ) : (
          <section className="rounded-xl border border-[#D6E8E6] bg-white shadow-[0_8px_24px_rgba(7,21,47,0.03)]" aria-labelledby="quality-stage-heading">
            <div className="border-b border-[#D6E8E6] px-5 py-5 sm:px-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#E7F5F3] text-[#0F8F87]">
                  <LoaderCircle aria-hidden="true" size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#0F8F87]">Current stage</p>
                  <h2 id="quality-stage-heading" className="font-heading mt-1 text-xl font-semibold text-[#263B4D]">Image Quality Assessment</h2>
                  <p className="mt-2 text-sm leading-6 text-[#617589]">Analyzing image quality...</p>
                </div>
              </div>
            </div>
            <div className="px-5 py-8 sm:px-6">
              <div className="flex flex-col items-center rounded-xl border border-dashed border-[#D6E8E6] bg-[#F7FAFA] px-6 py-12 text-center">
                {analysisResult ? (
                  <>
                    <p className="rounded-md bg-[#E7F5F3] px-3 py-1.5 text-xs font-semibold text-[#08746E]">Analysis complete</p>
                    <p className="mt-4 text-sm text-[#263B4D]">Reports generated for this image:</p>
                    <a href={`file://${analysisResult.doctor_report}`} className="mt-2 text-sm font-semibold text-[#0F8F87] underline">Doctor Report</a>
                    <a href={`file://${analysisResult.patient_report}`} className="mt-1 text-sm font-semibold text-[#0F8F87] underline">Patient Report</a>
                  </>
                ) : analysisError ? (
                  <>
                    <p className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">Analysis failed</p>
                    <p className="mt-4 max-w-md text-sm leading-6 text-[#617589]">{analysisError}</p>
                  </>
                ) : (
                  <>
                    <LoaderCircle aria-hidden="true" className="text-[#0F8F87]" size={30} />
                    <p className="mt-5 rounded-md bg-[#E7F5F3] px-3 py-1.5 text-xs font-semibold text-[#08746E]">Analyzing...</p>
                  </>
                )}
                <button type="button" onClick={() => setStage('upload')} className="mt-6 inline-flex items-center gap-2 rounded-md border border-[#D6E8E6] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F8F87] hover:border-[#0F8F87] focus:outline-none focus:ring-2 focus:ring-[#0F8F87] focus:ring-offset-2">
                  <ArrowLeft aria-hidden="true" size={16} />
                  Back to Image Upload
                </button>
              </div>
            </div>
          </section>
        )}
      </div>

      <p className="mt-5 text-center text-xs text-[#617589]">This screening workspace uses frontend-only prototype data. No image, model, MATLAB, or backend service is connected.</p>
    </div>
  )
}

export default ScreeningWorkspace