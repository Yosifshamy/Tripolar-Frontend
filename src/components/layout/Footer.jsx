import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'COMPANY',
      links: [
        { name: 'ABOUT US', href: '/' },
        { name: 'OUR SERVICES', href: '/' },
        { name: 'PREVIOUS EVENTS', href: '/events' },
        { name: 'CONTACT', href: '/contact' },
      ]
    },
    {
      title: 'USHERS',
      links: [
        { name: 'BROWSE USHERS', href: '/ushers' },
        { name: 'JOIN OUR TEAM', href: '/auth/signup' },
        { name: 'USHER LOGIN', href: '/auth/login' },
      ]
    },
    {
      title: 'SUPPORT',
      links: [
        { name: 'HELP CENTER', href: '/contact' },
        { name: 'CONTACT SUPPORT', href: '/contact' },
        { name: 'REQUEST USHERS', href: '/contact' },
      ]
    }
  ]

  return (
    <footer className="bg-primary-black text-secondary-white border-t border-gray-800">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="text-4xl font-display font-light text-secondary-white mb-8 tracking-luxury"
              >
                TRIPOLAR
              </motion.div>
              <p className="text-gray-300 mb-8 leading-relaxed font-light tracking-wide">
                We don't just run events, we engineer every detail for a seamless experience. 
                Your trusted partner in professional event management.
              </p>
              <div className="flex space-x-6">
                {/* Social Media Icons */}
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 bg-transparent border border-gray-600 hover:border-secondary-white flex items-center justify-center cursor-pointer transition-colors group"
                >
                  <span className="text-gray-300 group-hover:text-secondary-white font-light text-sm">f</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 bg-transparent border border-gray-600 hover:border-secondary-white flex items-center justify-center cursor-pointer transition-colors group"
                >
                  <span className="text-gray-300 group-hover:text-secondary-white font-light text-sm">@</span>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-12 h-12 bg-transparent border border-gray-600 hover:border-secondary-white flex items-center justify-center cursor-pointer transition-colors group"
                >
                  <span className="text-gray-300 group-hover:text-secondary-white font-light text-sm">in</span>
                </motion.div>
              </div>
            </div>

            {/* Footer Links */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-lg font-medium text-secondary-white mb-6 tracking-wide">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        to={link.href}
                        className="text-gray-300 hover:text-secondary-white transition-colors duration-200 font-light tracking-wide text-sm"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm font-light tracking-wide">
              © {currentYear} YOUSSEF ELSHAMY. ALL RIGHTS RESERVED.
            </p>
            <div className="flex space-x-8 mt-4 md:mt-0">
              <Link to="/privacy" className="text-gray-400 hover:text-secondary-white text-sm font-light tracking-wide transition-colors">
                PRIVACY POLICY
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-secondary-white text-sm font-light tracking-wide transition-colors">
                TERMS OF SERVICE
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer