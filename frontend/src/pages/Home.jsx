import React, { Suspense, useRef } from "react"

// Eagerly-loaded components
import Navbar from "../components/Home/Navbar"
import HeroComponent from "../components/Home/HeroSection"

// Lazy-loaded components
const IntroSection = React.lazy(() => import("../components/Home/IntroSection"))
const AppBenefits = React.lazy(() => import("../components/Home/AppBenefitSection"))
const WhyChooseUs = React.lazy(() => import("../components/Home/WhyChooseUs"))
const TrustedByPeople = React.lazy(() => import("../components/Home/TrustedByPeople"))
const ConnectSection = React.lazy(() => import("../components/Home/ConnectSection"))
const Footer = React.lazy(() => import("../components/Home/Footer"))

// Custom hook for IntersectionObserver
import useIntersectionObserver from "../hooks/useIntersectionObserver"

const Home = () => {
  // Create refs for the wrapper divs
  const introSectionRef = useRef(null)
  const appBenefitsRef = useRef(null)
  const whyChooseUsRef = useRef(null)
  const trustedByPeopleRef = useRef(null)
  const connectSectionRef = useRef(null)
  const footerRef = useRef(null)

  // Observe the visibility of each section
  const isIntroSectionVisible = useIntersectionObserver(introSectionRef)
  const isAppBenefitsVisible = useIntersectionObserver(appBenefitsRef)
  const isWhyChooseUsVisible = useIntersectionObserver(whyChooseUsRef)
  const isTrustedByPeopleVisible = useIntersectionObserver(trustedByPeopleRef)
  const isConnectSectionVisible = useIntersectionObserver(connectSectionRef)
  const isFooterVisible = useIntersectionObserver(footerRef)

  return (
    <main>
      {/* Early-loaded components */}
      <div className="h-screen">
        <Navbar />
        <HeroComponent />
      </div>

      {/* Lazy-loaded components with fixed-height placeholders */}
      <div ref={introSectionRef} style={{ minHeight: "500px", textAlign: "center" }}>
        {isIntroSectionVisible ? (
          <Suspense fallback={<div>Loading Intro Section...</div>}>
            <IntroSection />
          </Suspense>
        ) : (
          <div style={{ height: "500px", backgroundColor: "#f0f0f0" }}>Loading Intro Section...</div>
        )}
      </div>

      <div ref={appBenefitsRef} style={{ minHeight: "500px", textAlign: "center" }}>
        {isAppBenefitsVisible ? (
          <Suspense fallback={<div>Loading App Benefits...</div>}>
            <AppBenefits />
          </Suspense>
        ) : (
          <div style={{ height: "500px", backgroundColor: "#f0f0f0" }}>Loading App Benefits...</div>
        )}
      </div>

      <div ref={whyChooseUsRef} style={{ minHeight: "500px", textAlign: "center" }}>
        {isWhyChooseUsVisible ? (
          <Suspense fallback={<div>Loading Why Choose Us...</div>}>
            <WhyChooseUs />
          </Suspense>
        ) : (
          <div style={{ height: "500px", backgroundColor: "#f0f0f0" }}>Loading Why Choose Us...</div>
        )}
      </div>

      <div ref={trustedByPeopleRef} style={{ minHeight: "400px", textAlign: "center" }}>
        {isTrustedByPeopleVisible ? (
          <Suspense fallback={<div>Loading Trusted By People...</div>}>
            <TrustedByPeople />
          </Suspense>
        ) : (
          <div style={{ height: "400px", backgroundColor: "#f0f0f0" }}>Loading Trusted By People...</div>
        )}
      </div>

      <div ref={connectSectionRef} style={{ minHeight: "400px", textAlign: "center" }}>
        {isConnectSectionVisible ? (
          <Suspense fallback={<div>Loading Connect Section...</div>}>
            <ConnectSection />
          </Suspense>
        ) : (
          <div style={{ height: "400px", backgroundColor: "#f0f0f0" }}>Loading Connect Section...</div>
        )}
      </div>

      <div ref={footerRef} style={{ minHeight: "0" }}>
        {isFooterVisible ? (
          <Suspense fallback={<div>Loading Footer...</div>}>
            <Footer />
          </Suspense>
        ) : (
          <div style={{ height: "0", backgroundColor: "#f0f0f0" }}>Loading Footer...</div>
        )}
      </div>
    </main>
  )
}

export default Home
