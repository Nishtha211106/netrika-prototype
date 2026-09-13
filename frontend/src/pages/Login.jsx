import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const handleSubmit = (event) => {
    event.preventDefault()
    sessionStorage.setItem('netrika-demo-auth', 'true')
    navigate('/app/dashboard')
  }

  return (
    <main className="flex min-h-[60vh] items-center justify-center px-5 py-16">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl border border-[#D6E8E6] bg-white p-8 shadow-[0_8px_24px_rgba(7,21,47,0.04)]">
        <h1 className="font-heading text-3xl font-semibold text-[#263B4D]">Login</h1>
        <p className="mt-3 text-sm leading-6 text-[#617589]">Use the demo login to open the Netrika screening workspace.</p>
        <button type="submit" className="mt-7 inline-flex w-full items-center justify-center rounded-md bg-[#0F8F87] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#08746E] focus:outline-none focus:ring-2 focus:ring-[#0F8F87] focus:ring-offset-2">
          Continue to Dashboard
        </button>
      </form>
    </main>
  )
}

export default Login