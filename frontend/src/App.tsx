import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import LandingPage from './components/LandingPage'
import HallPlannerForm from './components/HallPlannerForm'
import ResultsPage from './components/ResultsPage'
import { ParallaxContainer } from './components/ui'
import './App.css'

// Loading component
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 300)

    return () => clearTimeout(timer)
  }, [location.pathname])

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-yellow-50 via-orange-50 to-white">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-xl animate-pulse">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
          </div>
          <div className="text-lg font-semibold gradient-text animate-pulse">
            Loading...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      {children}
    </div>
  )
}

// Enhanced background component
const AppBackground = () => {
  return (
    <>
      {/* Main gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-white -z-10" />

      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        <ParallaxContainer speed={0.2} direction="up">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full opacity-20 animate-pulse-slow" />
        </ParallaxContainer>

        <ParallaxContainer speed={0.3} direction="down">
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full opacity-20 animate-float-slow" />
        </ParallaxContainer>

        <ParallaxContainer speed={0.1} direction="right">
          <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-yellow-300 rounded-full opacity-10 animate-bounce-subtle" />
        </ParallaxContainer>

        <ParallaxContainer speed={0.15} direction="left">
          <div className="absolute top-20 right-20 w-16 h-16 bg-orange-300 rounded-full opacity-15 animate-float" />
        </ParallaxContainer>

        <div className="absolute bottom-32 left-32 w-24 h-24 bg-yellow-400 rounded-full opacity-10 animate-pulse-slow" />
      </div>

      {/* Floating particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full opacity-30 animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Mesh gradient overlay */}
      <div className="fixed inset-0 mesh-bg opacity-30 -z-10" />
    </>
  )
}

// Main App component
function AppContent() {
  return (
    <div className="relative min-h-screen">
      <AppBackground />

      <Routes>
        <Route
          path="/"
          element={
            <PageTransition>
              <LandingPage />
            </PageTransition>
          }
        />
        <Route
          path="/planner"
          element={
            <PageTransition>
              <HallPlannerForm />
            </PageTransition>
          }
        />
        <Route
          path="/results"
          element={
            <PageTransition>
              <ResultsPage />
            </PageTransition>
          }
        />
      </Routes>
    </div>
  )
}

function App() {
  const [isAppReady, setIsAppReady] = useState(false)

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsAppReady(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  if (!isAppReady) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-pulse">
              <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-400 rounded-full animate-ping"></div>
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-4">RNS Hall Planner</h2>
          <p className="text-gray-600 text-lg">Initializing application...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
