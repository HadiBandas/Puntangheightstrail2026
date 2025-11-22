
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/sections/Header';
import HeroSection from './components/sections/HeroSection';
import TrustBar from './components/sections/TrustBar';
import ValuePropositionSection from './components/sections/ValuePropositionSection';
import CourseSection from './components/sections/CourseSection';
import CategoriesSection from './components/sections/CategoriesSection';
import RaceKitSection from './components/sections/RaceKitSection';
import TimelineSection from './components/sections/TimelineSection';
import WhyPuntangSection from './components/sections/WhyPuntangSection';
import GallerySection from './components/sections/GallerySection';
import FAQSection from './components/sections/FAQSection';
import SponsorsSection from './components/sections/SponsorsSection';
import FinalCTASection from './components/sections/FinalCTASection';
import Footer from './components/sections/Footer';
import useScrollProgress from './hooks/useScrollProgress';
import { ArrowRight } from './constants/icons';
import { useTranslation } from './hooks/useTranslation';
import RegistrationModal from './components/ui/RegistrationModal';
import BackToTop from './components/ui/BackToTop';
import ToastContainer from './components/ui/Toast';
import { useUI } from './contexts/UIContext';

const App: React.FC = () => {
  const scrollProgress = useScrollProgress();
  const { t } = useTranslation();
  const { openRegister } = useUI();
  const [showMobileCTA, setShowMobileCTA] = useState(false);

  // Console Signature (Backend Tag)
  useEffect(() => {
      console.log(
          "%c PUNTANG HEIGHT TRAIL 2026 \n%c Created by & Project Manager: Mahasin Hadiyatulloh", 
          "font-size: 24px; font-weight: bold; color: #f97316; font-family: 'Bebas Neue', sans-serif;", 
          "font-size: 14px; color: #888; font-family: 'Montserrat', sans-serif; margin-top: 5px;"
      );
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 200px
      if (window.scrollY > 200) {
        setShowMobileCTA(true);
      } else {
        setShowMobileCTA(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-white">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-trail-orange z-[100]"
        style={{ scaleX: scrollProgress, transformOrigin: '0%' }}
      />
      
      <Header />
      
      <main>
        {/* 1. HERO: The Hook */}
        <HeroSection />
        
        {/* 2. TRUST: Credibility */}
        <TrustBar />

        {/* 3. DESTINATION: Why Here? (Emotional Hook) */}
        <WhyPuntangSection />

        {/* 4. VALUE: Concept & Experience */}
        <ValuePropositionSection />

        {/* 5. CHALLENGE: The Course (Technical) */}
        <CourseSection />

        {/* 6. BENEFIT: What do I get? (Race Kit) - BEFORE Price */}
        <RaceKitSection />

        {/* 7. ACTION: Categories & Price (The Ask) */}
        <CategoriesSection />

        {/* 8. PROOF: Gallery (FOMO) */}
        <GallerySection />

        {/* 9. LOGISTICS: Timeline (Secondary Info) */}
        <TimelineSection />

        {/* 10. OBJECTIONS: FAQ */}
        <FAQSection />

        {/* 11. TRUST: Sponsors */}
        <SponsorsSection />

        {/* 12. FINAL PUSH */}
        <FinalCTASection />
      </main>
      
      <Footer />
      
      {/* Global UI Elements */}
      <RegistrationModal />
      <BackToTop />
      <ToastContainer />
      
      {/* Sticky Mobile CTA - Optimized placement, width, and subtle animation */}
      <AnimatePresence>
        {showMobileCTA && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.4, ease: "backOut" }}
            className="fixed bottom-6 left-4 right-4 z-40 lg:hidden pointer-events-none flex justify-center"
          >
            <motion.button 
                onClick={openRegister}
                initial={{ scale: 1 }}
                animate={{ 
                  scale: [1, 1.02, 1],
                  boxShadow: [
                    "0 4px 6px -1px rgba(245, 122, 42, 0.3), 0 2px 4px -1px rgba(245, 122, 42, 0.1)", 
                    "0 10px 15px -3px rgba(245, 122, 42, 0.5), 0 4px 6px -2px rgba(245, 122, 42, 0.3)", 
                    "0 4px 6px -1px rgba(245, 122, 42, 0.3), 0 2px 4px -1px rgba(245, 122, 42, 0.1)"
                  ]
                }}
                transition={{ 
                  duration: 2.5, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                whileTap={{ scale: 0.95 }}
                className="pointer-events-auto group w-full max-w-sm flex items-center justify-center gap-2 px-6 py-3.5 bg-trail-orange text-white font-poppins font-bold text-base rounded-full shadow-xl border-t border-white/20"
            >
              <span className="drop-shadow-sm">{t('mobileCta.register')}</span>
              <ArrowRight className="w-5 h-5 drop-shadow-sm" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
