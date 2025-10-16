import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import Button from '@/components/ui/Button'

const Hero = () => {
  const scrollToWhoWeAre = () => {
    const element = document.getElementById('who-we-are')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-primary-black overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.1) 1px, transparent 0),
                           radial-gradient(circle at 75px 75px, rgba(255, 255, 255, 0.1) 1px, transparent 0)`,
          backgroundSize: '100px 100px'
        }}></div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-96 h-96 bg-secondary-white/5 rounded-full"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
            }}
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.05, 0.1, 0.05],
            }}
            transition={{
              duration: 6 + i,
              repeat: Infinity,
              delay: i * 2,
            }}
          />
        ))}
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mb-12"
          >
            <h2 className="heading-primary text-secondary-white mb-8">
              <span className="block text-luxury">ELEVATING EVERY EVENT</span>
              <span className="block text-luxury mt-4">INTO A LUXURY</span>
              <span className="block text-luxury mt-4">EXPERIENCE</span>
            </h2>
            <div className="w-24 h-px bg-secondary-white mx-auto mb-8"></div>
            <p className="text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
              BECAUSE PERFECTION IS OUR STANDARD
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed font-light"
            style={{ letterSpacing: '0.05em' }}
          >
            Professional event management with our trusted team of elite ushers.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-20"
          >
            <Link to="/ushers">
              <Button className="min-w-[240px] bg-secondary-white text-primary-black hover:bg-secondary-off-white font-medium">
                BROWSE OUR USHERS
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="secondary" 
                className="min-w-[240px] text-secondary-white border-secondary-white hover:bg-secondary-white hover:text-primary-black font-medium"
              >
                REQUEST USHERS
              </Button>
            </Link>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9, ease: "easeOut" }}
            onClick={scrollToWhoWeAre}
            className="inline-flex flex-col items-center text-gray-400 hover:text-secondary-white transition-colors group"
          >
            <span className="text-sm font-light mb-3 tracking-wider">DISCOVER MORE</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDownIcon className="w-6 h-6 group-hover:text-secondary-white transition-colors" />
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Bottom gradient */}
      <motion.div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-primary-rich-black to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 1 }}
      />
    </section>
  )
}

export default Hero