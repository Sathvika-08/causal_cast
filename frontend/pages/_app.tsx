import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import '../styles/globals.css'
import Sidebar from '../components/Sidebar'
import Chatbot from '../components/Chatbot'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const [showSidebar, setShowSidebar] = useState(false)

  // Pages that should show sidebar (authenticated pages)
  const sidebarPages = ['/dashboard', '/new-prediction', '/history', '/research', '/profile']

  useEffect(() => {
    const token = localStorage.getItem('token')
    const shouldShowSidebar = token && sidebarPages.includes(router.pathname)
    setShowSidebar(shouldShowSidebar || false)
  }, [router.pathname])

  if (showSidebar) {
    return (
      <div className="flex min-h-screen bg-[#11221c]" style={{fontFamily: 'Manrope, "Noto Sans", sans-serif'}}>
        <Sidebar />
        <div className="flex-1 relative">
          <Component {...pageProps} />
          <Chatbot />
        </div>
      </div>
    )
  }

  return <Component {...pageProps} />
}


