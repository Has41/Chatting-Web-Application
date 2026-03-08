import React, { Suspense, useRef } from "react"

// Eagerly-loaded components
import Navbar from "@/modules/home/components/Navbar"
import HeroComponent from "@/modules/home/components/HeroSection"

// Lazy-loaded components
const IntroSection = React.lazy(() => import("@/modules/home/components/IntroSection"))
const AppBenefits = React.lazy(() => import("@/modules/home/components/AppBenefitSection"))
const WhyChooseUs = React.lazy(() => import("@/modules/home/components/WhyChooseUs"))
const TrustedByPeople = React.lazy(() => import("@/modules/home/components/TrustedByPeople"))
const ConnectSection = React.lazy(() => import("@/modules/home/components/ConnectSection"))
const Footer = React.lazy(() => import("@/modules/home/components/Footer"))

// Custom hook for IntersectionObserver
import useIntersectionObserver from "@shared/hooks/useIntersectionObserver"

const Home = () => {
  // Create refs for the wrapper divs
  const introSectionRef = useRef<HTMLDivElement | null>(null)
  const appBenefitsRef = useRef<HTMLDivElement | null>(null)
  const whyChooseUsRef = useRef<HTMLDivElement | null>(null)
  const trustedByPeopleRef = useRef<HTMLDivElement | null>(null)
  const connectSectionRef = useRef<HTMLDivElement | null>(null)
  const footerRef = useRef<HTMLDivElement | null>(null)

  // Observe the visibility of each section
  const isIntroSectionVisible = useIntersectionObserver(introSectionRef as React.RefObject<Element>)
  const isAppBenefitsVisible = useIntersectionObserver(appBenefitsRef as React.RefObject<Element>)
  const isWhyChooseUsVisible = useIntersectionObserver(whyChooseUsRef as React.RefObject<Element>)
  const isTrustedByPeopleVisible = useIntersectionObserver(trustedByPeopleRef as React.RefObject<Element>)
  const isConnectSectionVisible = useIntersectionObserver(connectSectionRef as React.RefObject<Element>)
  const isFooterVisible = useIntersectionObserver(footerRef as React.RefObject<Element>)

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
