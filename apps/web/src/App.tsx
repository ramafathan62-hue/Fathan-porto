import React, { useEffect } from 'react'
import TopNavBar from './components/TopNavBar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import Experience from './components/Experience'
import Certifications from './components/Certifications'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SideNavBar from './components/SideNavBar'

// Error Boundary to prevent full black screen
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: string }> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-on-surface p-8">
          <div className="text-center max-w-lg">
            <span className="material-symbols-outlined text-6xl text-red-400 block mb-4">error</span>
            <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
            <p className="text-on-surface-variant mb-6 text-sm font-mono bg-surface-variant p-4 rounded-lg">{this.state.error}</p>
            <button onClick={() => window.location.reload()} className="px-6 py-3 bg-primary text-on-primary rounded-lg font-bold">
              Reload Page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  // Global scroll reveal hook
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, observerOptions)

    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach(el => observer.observe(el))

    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      if (anchor && anchor.getAttribute('href')?.startsWith('#')) {
        e.preventDefault()
        const id = anchor.getAttribute('href')!
        document.querySelector(id)?.scrollIntoView({
          behavior: 'smooth'
        })
      }
    }

    document.addEventListener('click', handleAnchorClick)

    return () => {
      revealElements.forEach(el => observer.unobserve(el))
      document.removeEventListener('click', handleAnchorClick)
    }
  }, [])

  return (
    <ErrorBoundary>
      <TopNavBar />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Experience />
      <Certifications />
      <Contact />
      <Footer />
      <SideNavBar />
    </ErrorBoundary>
  )
}

export default App
