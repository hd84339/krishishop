import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone, FiMapPin, FiLinkedin } from 'react-icons/fi';

const GALLERY_IMAGES = [
  { src: '/images/gallery/crops.png', alt: 'Fresh Crops' },
  { src: '/images/gallery/fertilizer.png', alt: 'Quality Fertilizers' },
  { src: '/images/gallery/fields.png', alt: 'Lush Fields' },
];

const Footer = () => {
  return (
    <>
      {/* Google Maps Section */}
      <section className="bg-black/30 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">📍 Find Us Here</h2>
            <p className="font-body text-white/50 text-sm">Visit our agriculture shop</p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d807.3193879157442!2d82.42039211179093!3d25.386707893189808!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x398fe3b2275cbcc9%3A0xacbef4ace678e7ce!2sAgriculture%20shop!5e0!3m2!1sen!2sin!4v1773049426297!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0, filter: 'brightness(0.85) contrast(1.1)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Agriculture Shop Location"
            />
          </div>
        </div>
      </section>

      {/* Agricultural Gallery */}
      <section className="bg-black/20 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white mb-2">🌾 Agricultural Gallery</h2>
            <p className="font-body text-white/50 text-sm">Glimpses of Indian farming excellence</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GALLERY_IMAGES.map(({ src, alt }) => (
              <div key={alt} className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10">
                <img
                  src={src}
                  alt={alt}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <span className="font-body text-white text-sm font-medium">{alt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/40 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center">
                  <span className="text-lg">🌱</span>
                </div>
                <span className="font-display font-bold text-xl text-white">Vindhya<span className="text-primary-400">Krishi</span></span>
              </div>
              <p className="font-body text-white/50 text-sm leading-relaxed">
                Empowering Indian farmers with quality agricultural products — fertilizers, seeds, pesticides and tools delivered to your doorstep.
              </p>
              <div className="flex gap-3 mt-5">
                {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-primary-400 hover:border-primary-500/50 transition-all duration-200">
                    <Icon size={16} />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2.5">
                {[
                  { to: '/', label: 'Home' },
                  { to: '/products', label: 'All Products' },
                  { to: '/products?category=Khad', label: 'Fertilizers (Khad)' },
                  { to: '/products?category=Beej', label: 'Seeds (Beej)' },
                  { to: '/products?category=Kitnashak', label: 'Pesticides' },
                ].map(({ to, label }) => (
                  <li key={label}>
                    <Link to={to} className="font-body text-sm text-white/50 hover:text-primary-400 transition-colors duration-200">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Categories</h4>
              <ul className="space-y-2.5">
                {['Khad', 'Beej', 'Kitnashak', 'Farming Tools', 'Other'].map((cat) => (
                  <li key={cat}>
                    <Link to={`/products?category=${cat}`} className="font-body text-sm text-white/50 hover:text-primary-400 transition-colors duration-200">
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display font-semibold text-white mb-4">Contact Us</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <FiMapPin size={15} className="text-primary-400 mt-0.5 flex-shrink-0" />
                  <span className="font-body text-sm text-white/50">nagamalpur bazar pali gyanpur road bhadohi </span>
                </li>
                <li className="flex items-center gap-3">
                  <FiPhone size={15} className="text-primary-400 flex-shrink-0" />
                  <a href="tel:+919876543210" className="font-body text-sm text-white/50 hover:text-primary-400 transition-colors">anoop dubey 9026463025 & abishek dubey 9250144985</a>
                </li>
                <li className="flex items-center gap-3">
                  <FiMail size={15} className="text-primary-400 flex-shrink-0" />
                  <a href="mailto:support@vindhyakrishi.in" className="font-body text-sm text-white/50 hover:text-primary-400 transition-colors">hd84339@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-body text-xs text-white/30">© {new Date().getFullYear()} VindhyaKrishi. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <p className="font-body text-xs text-white/20">Developed by</p>
              <a
                href="https://www.linkedin.com/in/harsh-dubey-498498256/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-body text-primary-400 hover:text-primary-300 transition-colors"
              >
                <FiLinkedin size={13} />
                Harsh Dubey
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
