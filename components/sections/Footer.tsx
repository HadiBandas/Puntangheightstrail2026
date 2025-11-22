
import React, { useState } from 'react';
import { LogoIcon, MapPin, Phone, Mail, Twitter, Instagram, Facebook, Loader } from '../../constants/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { useToast } from '../../contexts/ToastContext';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
        setIsLoading(false);
        addToast(t('footer.subscribeSuccess'), 'success');
        setEmail('');
    }, 1500);
  };

  return (
    <footer className="bg-mountain-slate text-mist-gray/80 pt-20 pb-28 lg:pb-8" role="contentinfo">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <a href="#" className="flex items-center gap-3 mb-4" aria-label="Back to top">
              <LogoIcon className="w-16 h-16 -ml-2" aria-hidden="true" />
              <div className="flex flex-col -space-y-1">
                  <span className="font-bebas text-3xl text-white tracking-wider">PUNTANG</span>
                  <span className="font-montserrat text-[9px] font-bold text-white tracking-widest">HEIGHTS TRAIL</span>
                  <div className="flex items-center gap-1.5" aria-hidden="true">
                      <div className="h-0.5 w-6 bg-trail-orange"></div>
                      <span className="font-montserrat text-[9px] font-bold text-white">2026</span>
                      <div className="h-0.5 w-6 bg-trail-orange"></div>
                  </div>
              </div>
            </a>
            <p className="font-poppins text-sm mb-6">
              {t('footer.description')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-trail-orange transition-colors focus:outline-none focus:ring-2 focus:ring-trail-orange" aria-label="Follow us on Twitter">
                  <Twitter className="w-5 h-5" aria-hidden="true"/>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-trail-orange transition-colors focus:outline-none focus:ring-2 focus:ring-trail-orange" aria-label="Follow us on Instagram">
                  <Instagram className="w-5 h-5" aria-hidden="true"/>
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-trail-orange transition-colors focus:outline-none focus:ring-2 focus:ring-trail-orange" aria-label="Follow us on Facebook">
                  <Facebook className="w-5 h-5" aria-hidden="true"/>
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-montserrat font-bold text-lg text-white mb-6">{t('footer.quickLinks')}</h4>
            <ul className="space-y-3 font-poppins text-sm">
              <li><a href="#about" className="hover:text-trail-orange transition-colors focus:outline-none focus:underline">{t('nav.about')}</a></li>
              <li><a href="#categories" className="hover:text-trail-orange transition-colors focus:outline-none focus:underline">{t('nav.categories')}</a></li>
              <li><a href="#timeline" className="hover:text-trail-orange transition-colors focus:outline-none focus:underline">{t('nav.timeline')}</a></li>
              <li><a href="#faq" className="hover:text-trail-orange transition-colors focus:outline-none focus:underline">{t('nav.faq')}</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-montserrat font-bold text-lg text-white mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4 font-poppins text-sm">
              <li className="flex gap-3 items-start">
                <MapPin className="w-5 h-5 text-trail-orange mt-1 shrink-0" aria-hidden="true"/>
                <span>{t('footer.address')}</span>
              </li>
              <li className="flex gap-3 items-center">
                <Phone className="w-5 h-5 text-trail-orange shrink-0" aria-hidden="true"/>
                <span>+62 812-2417-8271</span>
              </li>
              <li className="flex gap-3 items-center">
                <Mail className="w-5 h-5 text-trail-orange shrink-0" aria-hidden="true"/>
                <span>hello@puntangtrail.com</span>
              </li>
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h4 className="font-montserrat font-bold text-lg text-white mb-6">{t('footer.newsletterTitle')}</h4>
            <p className="font-poppins text-sm mb-4">{t('footer.newsletterDesc')}</p>
            <form className="flex" onSubmit={handleSubscribe}>
              <label htmlFor="newsletter-email" className="sr-only">{t('footer.emailPlaceholder')}</label>
              <input 
                id="newsletter-email"
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('footer.emailPlaceholder')} 
                className="w-full bg-white/10 px-4 py-3 rounded-l-lg text-white placeholder-mist-gray/50 focus:outline-none focus:ring-2 focus:ring-trail-orange disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="bg-trail-orange px-4 py-3 rounded-r-lg text-white font-semibold hover:bg-trail-orange/90 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-mountain-slate focus:ring-trail-orange disabled:opacity-70 disabled:cursor-not-allowed min-w-[80px] flex items-center justify-center"
              >
                {isLoading ? <Loader className="w-5 h-5 animate-spin" /> : t('footer.subscribeButton')}
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col items-center text-center text-sm font-poppins">
          <p>&copy; {new Date().getFullYear()} Puntang Height Trail. {t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
