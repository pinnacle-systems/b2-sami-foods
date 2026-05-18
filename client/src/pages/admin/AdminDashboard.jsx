import { ShieldCheck } from "lucide-react"
import { useAppSelector } from "../../redux/Dispatch/useAppDispatch"
import { selectCurrentUser } from "../../redux/features/authSlice"

export default function AdminDashboard() {
  const user = useAppSelector(selectCurrentUser)

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <ShieldCheck size={24} className="text-primary" />
        <div>
          <h2 className="text-foreground text-xl font-bold">Welcome, {user?.name}</h2>
          <p className="text-muted-foreground text-sm">You are logged in as admin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: "Product Categories", value: "—", color: "text-blue-500",   bg: "bg-blue-500/10 border-blue-500/20" },
          { label: "Products",           value: "—", color: "text-green-500",  bg: "bg-green-500/10 border-green-500/20" },
          { label: "Orders",             value: "—", color: "text-purple-500", bg: "bg-purple-500/10 border-purple-500/20" },
        ].map((card) => (
          <div key={card.label} className={`rounded-2xl border p-6 ${card.bg}`}>
            <p className={`text-sm font-medium ${card.color} opacity-80`}>{card.label}</p>
            <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
