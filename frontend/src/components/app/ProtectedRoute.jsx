import { Navigate, Outlet, useLocation } from 'react-router-dom'

function isDemoAuthenticated() {
  return sessionStorage.getItem('netrika-demo-auth') !== 'false'
}

function ProtectedRoute() {
  const location = useLocation()

  if (!isDemoAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}

export default ProtectedRoute
