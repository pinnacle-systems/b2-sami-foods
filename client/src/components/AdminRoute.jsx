import { Navigate } from "react-router-dom"
import { useAppSelector } from "@/redux/Dispatch/useAppDispatch"
import { selectIsAdmin, selectIsAuthenticated } from "@/redux/features/authSlice"

export default function AdminRoute({ children }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const isAdmin = useAppSelector(selectIsAdmin)

  if (!isAuthenticated || !isAdmin) return <Navigate to="/admin" replace />
  return children
}
