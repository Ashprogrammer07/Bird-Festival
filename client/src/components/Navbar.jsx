
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext'; // Saved context

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showRegistrationsDropdown, setShowRegistrationsDropdown] = useState(false);
  const location = useLocation();
  const { language, toggleLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about'), path: '/about' },
    { name: t('nav.schedule'), path: '/schedule' },
    { name: t('nav.competitions'), path: '/competitions' },
    { name: t('nav.contact'), path: '/contact' },
    { name: t('nav.ebook'), path: '/ebook' },
  ];

  const registrationLinks = [
    { name: t('nav.registerResource'), path: '/register/resource-person' },
    { name: t('nav.registerVolunteer'), path: '/register/volunteers' },
  ];

  return (
    <nav
      className='
        fixed top-0 left-0 right-0 z-50
        transition-all duration-300
        bg-gray-900 shadow-lg'
    >

      <div className="container mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="text-white">
              <h1 className="text-base sm:text-xl font-serif font-bold tracking-wide">
                Rajasthan Birding Festival
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden xl:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-white hover:text-amber-300 transition-colors duration-200 font-medium ${location.pathname === link.path ? 'text-amber-300' : ''
                  }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Registrations Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowRegistrationsDropdown(true)}
              onMouseLeave={() => setShowRegistrationsDropdown(false)}
            >
              <div
                className={`text-white hover:text-amber-300 transition-all duration-300 font-medium cursor-pointer flex items-center py-2 px-3 -mx-3 rounded-lg ${registrationLinks.some(link => location.pathname === link.path)
                    ? 'text-amber-300 bg-white/10'
                    : 'hover:bg-white/5'
                  }`}
              >
                {t('nav.registrations')}
                <svg
                  className={`inline-block ml-1 w-4 h-4 transition-transform duration-300 ${showRegistrationsDropdown ? 'rotate-180' : ''
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
              {showRegistrationsDropdown && (
                <div
                  className="absolute top-full right-0 pt-2 w-72 z-[100]"
                  onMouseEnter={() => setShowRegistrationsDropdown(true)}
                >
                  <div className="bg-gray-900/98 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden animate-slide-down">
                    <div className="p-2">
                      {registrationLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className={`block px-4 py-3 text-white rounded-lg transition-all duration-200 cursor-pointer ${location.pathname === link.path
                              ? 'bg-amber-500 shadow-lg'
                              : 'hover:bg-amber-500/80 hover:shadow-md'
                            }`}
                          onClick={() => setShowRegistrationsDropdown(false)}
                        >
                          <div className="flex items-center">
                            <span className="font-medium">{link.name}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-full font-bold text-sm transition-colors border border-amber-400"
            >
              {language === 'en' ? 'हिंदी' : 'English'}
            </button>
          </div>

          {/* Mobile Menu Button + Lang */}
          <div className="xl:hidden flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-2 py-1 bg-amber-500 text-white rounded text-xs font-bold"
            >
              {language === 'en' ? 'HI' : 'EN'}
            </button>
            <button
              className="text-white focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="xl:hidden mt-4 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block py-2 text-white hover:text-amber-300 transition-colors duration-200 ${location.pathname === link.path ? 'text-amber-300' : ''
                  }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="mt-2 pt-2 border-t border-gray-700">
              <div className="text-white font-semibold py-2">{t('nav.registrations')}</div>
              {registrationLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block py-2 pl-4 text-white hover:text-amber-300 transition-colors duration-200 ${location.pathname === link.path ? 'text-amber-300' : ''
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
