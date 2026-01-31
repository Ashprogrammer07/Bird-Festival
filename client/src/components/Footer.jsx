
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="text-lg md:text-xl font-serif font-bold mb-3 md:mb-4">
              {t('home.heroTitle')}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.desc')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-amber-300 transition-colors">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-amber-300 transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
              <li>
                <Link to="/schedule" className="text-gray-400 hover:text-amber-300 transition-colors">
                  {t('nav.schedule')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-amber-300 transition-colors">
                  {t('nav.contact')}
                </Link>
              </li>
              <li>
                <Link to="/ebook" className="text-gray-400 hover:text-amber-300 transition-colors">
                  {t('nav.ebook')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>{t('footer.address')}</li>
              <li>Email: info@rajasthanbirdingfestival.com</li>
              <li>Phone: +91 (0) 123 456 7890</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p><Link to='/admin/login'>©</Link>{currentYear} {t('home.heroTitle')}. {t('footer.rights')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
