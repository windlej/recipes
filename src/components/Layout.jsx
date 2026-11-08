import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import MobileNav from './MobileNav'
import RandomPicker from './RandomPicker'
import ScrollToTop from './ScrollToTop'

export default function Layout() {
  const [picker, setPicker] = useState({ open: false, preset: {}, session: 0 })

  const openPicker = useCallback((preset = {}) => {
    setPicker((current) => ({ open: true, preset, session: current.session + 1 }))
  }, [])

  const closePicker = useCallback(() => {
    setPicker((current) => ({ ...current, open: false }))
  }, [])

  return (
    <div className="flex min-h-screen flex-col pb-[calc(60px+env(safe-area-inset-bottom))] md:pb-0 print:pb-0">
      <a
        href="#main"
        className="sr-only z-[100] rounded-full border-2 border-black bg-white font-bold focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:min-h-11 focus:px-4 focus:py-3"
      >
        Skip to content
      </a>

      <ScrollToTop />
      <Header onSurprise={() => openPicker()} />

      <main id="main" tabIndex={-1} className="flex-1 focus:outline-none">
        <Outlet context={{ openPicker }} />
      </main>

      <Footer />
      <MobileNav onSurprise={() => openPicker()} />

      <RandomPicker
        key={picker.session}
        open={picker.open}
        preset={picker.preset}
        onClose={closePicker}
      />
    </div>
  )
}
