import React from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import WhoWeAre from '@/components/sections/WhoWeAre'
import OurUshers from '@/components/sections/OurUshers'
import PreviousEvents from '@/components/sections/PreviousEvents'
import ContactForm from '@/components/sections/ContactForm'

const HomePage = () => {
  return (
    <div className="min-h-screen bg-primary-black">
      <Header />
      <main>
        <Hero />
        <WhoWeAre />
        <OurUshers />
        <PreviousEvents />
        <ContactForm />
      </main>
      <Footer />
    </div>
  )
}

export default HomePage