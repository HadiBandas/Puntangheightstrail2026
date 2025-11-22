
import React, { useState, useEffect } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { LogoIcon, Menu, X } from '../../constants/icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useUI } from '../../contexts/UIContext';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { language, setLanguage } = useLanguage();
  const { t } = useTranslation();
  const { openRegister } = useUI();

  const navLinks = [
    { name: t('nav.about'), href: '#about' },
    { name: t('nav.course'), href: '#course' },
    { name: t('nav.categories'), href: '#categories' },
    { name: t('nav.timeline'), href: '#timeline' },
    { name: t('nav.faq'), href: '#faq' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    document.documentElement.lang = language;
    return () => window.removeEventListener('scroll', handleScroll);
  }, [language]);

  const navVariants: Variants = {
    hidden: { y: -100, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeInOut' } },
  };

  const mobileMenuVariants: Variants = {
    closed: { 
      opacity: 0, 
      y: -20,
      transition: { 
        duration: 0.2,
        ease: 'easeInOut'
      }
    },
    open: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.3, 
        ease: 'easeOut' 
      }
    },
  };

  const backdropVariants: Variants = {
    closed: { opacity: 0 },
    open: { opacity: 1, transition: { duration: 0.3 } },
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    
    if (element) {
      const headerOffset = 85; // Height of fixed header + padding
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      
      setIsMenuOpen(false);
    }
  };

  const LanguageSwitcher = () => (
    <div className="flex items-center bg-white/10 rounded-full p-1 border border-white/20" role="group" aria-label="Language switcher">
      <button 
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${language === 'en' ? 'bg-white text-mountain-slate' : 'text-white'}`}
        aria-label="Switch to English"
        aria-pressed={language === 'en'}
      >
        EN
      </button>
      <button 
        onClick={() => setLanguage('id')}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-colors ${language === 'id' ? 'bg-white text-mountain-slate' : 'text-white'}`}
        aria-label="Switch to Indonesian"
        aria-pressed={language === 'id'}
      >
        ID
      </button>
    </div>
  );

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isMenuOpen ? 'bg-mountain-slate/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      variants={navVariants}
      initial="hidden"
      animate="visible"
      role="banner"
    >
      <div className="container mx-auto px-6 py-4 flex justify-between items-center relative z-50">
        <a 
          href="#" 
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-1" 
          aria-label="Puntang Heights Trail Home"
        >
          <LogoIcon className="w-12 h-12" aria-hidden="true" />
          <div className="flex flex-col -space-y-1">
            <span className="font-bebas text-2xl text-white tracking-wider">PUNTANG</span>
            <span className="font-montserrat text-[7px] font-bold text-white tracking-widest">HEIGHTS TRAIL</span>
          </div>
        </a>


        <nav className="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="font-poppins text-white hover:text-trail-orange transition-colors duration-300 relative group cursor-pointer"
            >
              {link.name}
              <span className="absolute bottom-[-4px] left-0 w-0 h-0.5 bg-trail-orange group-hover:w-full transition-all duration-300"></span>
            </a>
          ))}
          <button
            onClick={openRegister}
            className="ml-4 px-6 py-2 bg-trail-orange text-white font-poppins font-semibold text-sm rounded-full hover:bg-trail-orange/90 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-mountain-slate"
          >
            {t('nav.register')}
          </button>
          <LanguageSwitcher />
        </nav>

        <div className="lg:hidden flex items-center gap-4">
          <LanguageSwitcher />
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-white p-1 focus:outline-none focus:ring-2 focus:ring-trail-orange rounded-md"
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <Menu className="w-6 h-6" aria-hidden="true" />}
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              style={{ top: '100%' }} // Starts right below the header
              variants={backdropVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onClick={() => setIsMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Menu */}
            <motion.div
              id="mobile-menu"
              className="lg:hidden bg-mountain-slate/95 border-t border-white/10 backdrop-blur-lg absolute top-full left-0 right-0 z-50 shadow-2xl"
              variants={mobileMenuVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <nav className="flex flex-col items-center gap-6 py-8" aria-label="Mobile Navigation">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="font-poppins text-lg text-white hover:text-trail-orange transition-colors duration-300 cursor-pointer"
                  >
                    {link.name}
                  </a>
                ))}
                <button
                  onClick={() => {
                      setIsMenuOpen(false);
                      openRegister();
                  }}
                  className="mt-4 px-8 py-3 bg-trail-orange text-white font-poppins font-semibold rounded-full hover:bg-trail-orange/90 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white"
                >
                  {t('nav.registerNow')}
                </button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
