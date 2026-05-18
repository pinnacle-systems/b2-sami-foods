import { useState } from "react"

export function useAdminTheme() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("admin-theme") || "dark"
  )

  const toggle = () => {
    setTheme((prev) => {
      const next = prev === "dark" ? "light" : "dark"
      localStorage.setItem("admin-theme", next)
      return next
    })
  }

  return { theme, isDark: theme === "dark", toggle }
}
