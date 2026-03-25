import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Sidebar() {
  const router = useRouter()

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: '📊' },
    { href: '/new-prediction', label: 'New Prediction', icon: '🔮' },
    { href: '/history', label: 'History', icon: '📈' },
    { href: '/research', label: 'Research', icon: '🔬' },
    { href: '/profile', label: 'Profile', icon: '👤' },
  ]

  return (
    <aside className="w-64 p-6 border-r border-[#24473a] min-h-screen bg-[#11221c]">
      <div className="mb-8">
        <div className="flex items-center gap-3 text-white">
          <div className="size-6">
            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4 42.4379C4 42.4379 14.0962 36.0744 24 41.1692C35.0664 46.8624 44 42.2078 44 42.2078L44 7.01134C44 7.01134 35.068 11.6577 24.0031 5.96913C14.0971 0.876274 4 7.27094 4 7.27094L4 42.4379Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">CausalCast</h2>
        </div>
      </div>
      
      <nav className="grid gap-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
              router.pathname === item.href
                ? 'bg-[#19e69b] text-[#11221c]'
                : 'text-[#93c8b4] hover:bg-[#24473a] hover:text-white'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}


