import { motion } from 'framer-motion'

const WhoWeAre = () => {
  const features = [
    {
      title: 'PROFESSIONAL EXCELLENCE',
      description: 'Our team of trusted ushers delivers unmatched professionalism and attention to detail.',
      icon: '◆'
    },
    {
      title: 'SEAMLESS EXPERIENCE',
      description: 'We engineer every aspect of your event to ensure flawless execution from start to finish.',
      icon: '◇'
    },
    {
      title: 'TRUSTED PARTNERS',
      description: 'Only verified and experienced ushers join our exclusive network of event professionals.',
      icon: '◆'
    },
    {
      title: 'COMPLETE SOLUTIONS',
      description: 'From planning to execution, we provide comprehensive event management services.',
      icon: '◇'
    }
  ]

  return (
    <section id="who-we-are" className="section-padding bg-primary-rich-black">
      <div className="container-custom">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <h2 className="heading-secondary text-secondary-white mb-8">
              <span className="text-luxury">WHO WE ARE</span>
            </h2>

            <div className="w-24 h-px bg-secondary-white mx-auto mb-12"></div>

            {/* TRIPOLAR Company Description */}
            <div className="max-w-5xl mx-auto mb-16">
              <p className="text-2xl lg:text-3xl font-light text-secondary-white leading-relaxed mb-8 tracking-wide">
                TRIPOLAR IS AN EVENT MANAGEMENT COMPANY OFFERING A WIDE
                VARIATION OF SERVICES & WE DON'T JUST RUN EVENTS.
              </p>
              <p className="text-2xl lg:text-3xl font-light text-secondary-white leading-relaxed tracking-wide">
                WE ENGINEER EVERY DETAIL FOR A SEAMLESS EXPERIENCE.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.15, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="card-primary p-10 h-full border border-gray-800 hover:border-gray-600 transition-colors">
                <div className="text-6xl mb-8 text-secondary-white font-light">{feature.icon}</div>
                <h3 className="text-xl font-medium text-secondary-white mb-6 tracking-wide">
                  {feature.title}
                </h3>
                <p className="text-gray-300 leading-relaxed font-light">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          viewport={{ once: true }}
          className="mt-24"
        >
          <div className="card-dark p-16 text-center bg-primary-black border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
              <div>
                <div className="text-5xl font-light text-secondary-white mb-4">500+</div>
                <div className="w-12 h-px bg-gray-600 mx-auto mb-4"></div>
                <p className="text-gray-300 tracking-wider font-light">EVENTS MANAGED</p>
              </div>
              <div>
                <div className="text-5xl font-light text-secondary-white mb-4">50+</div>
                <div className="w-12 h-px bg-gray-600 mx-auto mb-4"></div>
                <p className="text-gray-300 tracking-wider font-light">TRUSTED USHERS</p>
              </div>
              <div>
                <div className="text-5xl font-light text-secondary-white mb-4">100%</div>
                <div className="w-12 h-px bg-gray-600 mx-auto mb-4"></div>
                <p className="text-gray-300 tracking-wider font-light">CLIENT SATISFACTION</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default WhoWeAre