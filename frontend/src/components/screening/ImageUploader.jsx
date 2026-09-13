import { FileImage, RefreshCw, Trash2, UploadCloud } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'

const acceptedTypes = ['image/jpeg', 'image/png']

function formatFileSize(bytes) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function ImageUploader({ file, onFileChange }) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ''), [file])

  useEffect(() => {
    if (!previewUrl) return undefined
    return () => URL.revokeObjectURL(previewUrl)
  }, [previewUrl])

  const selectFile = (nextFile) => {
    if (!nextFile) return

    if (!acceptedTypes.includes(nextFile.type)) {
      setError('Please select a JPG, JPEG, or PNG image.')
      return
    }

    setError('')
    onFileChange(nextFile)
  }

  const handleInputChange = (event) => {
    selectFile(event.target.files?.[0])
  }

  const handleDrop = (event) => {
    event.preventDefault()
    setIsDragging(false)
    selectFile(event.dataTransfer.files?.[0])
  }

  const removeFile = () => {
    setError('')
    onFileChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      {!file ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragEnter={(event) => {
            event.preventDefault()
            setIsDragging(true)
          }}
          onDragOver={(event) => event.preventDefault()}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`flex min-h-[18rem] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#0F8F87] focus:ring-offset-2 ${
            isDragging ? 'border-[#0F8F87] bg-[#E7F5F3]' : 'border-[#D6E8E6] bg-[#F7FAFA] hover:border-[#0F8F87] hover:bg-[#E7F5F3]'
          }`}
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#E7F5F3] text-[#0F8F87]">
            <UploadCloud aria-hidden="true" size={27} />
          </span>
          <span className="mt-5 font-heading text-lg font-semibold text-[#263B4D]">Drop a retinal image here</span>
          <span className="mt-2 text-sm text-[#617589]">or click to browse from this device</span>
          <span className="mt-5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-[#617589] ring-1 ring-[#D6E8E6]">JPG, JPEG, or PNG · Prototype only</span>
        </button>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(15rem,0.75fr)]">
          <div className="overflow-hidden rounded-xl border border-[#D6E8E6] bg-[#07152F]">
            <img src={previewUrl} alt="Selected retinal image preview" className="aspect-[4/3] h-full w-full object-contain" />
          </div>
          <div className="flex flex-col justify-center rounded-xl border border-[#D6E8E6] bg-[#F7FAFA] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E7F5F3] text-[#0F8F87]"><FileImage aria-hidden="true" size={21} /></div>
            <p className="mt-5 break-all text-sm font-semibold text-[#263B4D]">{file.name}</p>
            <p className="mt-2 text-sm text-[#617589]">{formatFileSize(file.size)}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button type="button" onClick={() => inputRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-md border border-[#D6E8E6] bg-white px-4 py-2.5 text-sm font-semibold text-[#0F8F87] hover:border-[#0F8F87] focus:outline-none focus:ring-2 focus:ring-[#0F8F87] focus:ring-offset-2">
                <RefreshCw aria-hidden="true" size={16} />
                Replace
              </button>
              <button type="button" onClick={removeFile} className="inline-flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-semibold text-[#617589] hover:bg-white hover:text-[#08746E] focus:outline-none focus:ring-2 focus:ring-[#0F8F87] focus:ring-offset-2">
                <Trash2 aria-hidden="true" size={16} />
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      <input ref={inputRef} type="file" accept=".jpg,.jpeg,.png,image/jpeg,image/png" onChange={handleInputChange} className="sr-only" />
      {error && <p role="alert" className="mt-3 text-sm font-medium text-[#A14C45]">{error}</p>}
    </div>
  )
}

export default ImageUploader
