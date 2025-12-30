import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg md:text-xl font-serif font-bold mb-3 md:mb-4">
              Rajasthan Birding Festival
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Celebrating the diverse avian life of Rajasthan's wetlands, deserts,
              and sanctuaries through conservation, education, and cultural exchange.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-amber-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-400 hover:text-amber-300 transition-colors">
                  Schedule
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-amber-300 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/ebook" className="text-gray-400 hover:text-amber-300 transition-colors">
                  E-Book
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Rajasthan, India</li>
              <li>Email: info@rajasthanbirdingfestival.com</li>
              <li>Phone: +91 (0) 123 456 7890</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p><Link to='/admin/login'>©</Link>{currentYear} Rajasthan Birding Festival. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
