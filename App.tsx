
import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './components/sections/Header';
import HeroSection from './components/sections/HeroSection';
import TrustBar from './components/sections/TrustBar';
import useScrollProgress from './hooks/useScrollProgress';
import { ArrowRight, Loader } from './constants/icons';
import { useTranslation } from './hooks/useTranslation';
import RegistrationModal from './components/ui/RegistrationModal';
import BackToTop from './components/ui/BackToTop';
import ToastContainer from './components/ui/Toast';
import { useUI } from './contexts/UIContext';
import { ASSETS } from './constants/assets';

// Lazy Load Heavy Sections
const ValuePropositionSection = React.lazy(() => import('./components/sections/ValuePropositionSection'));
const CourseSection = React.lazy(() => import('./components/sections/CourseSection'));
const CategoriesSection = React.lazy(() => import('./components/sections/CategoriesSection'));
const RaceKitSection = React.lazy(() => import('./components/sections/RaceKitSection'));
const TimelineSection = React.lazy(() => import('./components/sections/TimelineSection'));
const WhyPuntangSection = React.lazy(() => import('./components/sections/WhyPuntangSection'));
const GallerySection = React.lazy(() => import('./components/sections/GallerySection'));
const FAQSection = React.lazy(() => import('./components/sections/FAQSection'));
const SponsorsSection = React.lazy(() => import('./components/sections/SponsorsSection'));
const FinalCTASection = React.lazy(() => import('./components/sections/FinalCTASection'));
const VideoHighlightSection = React.lazy(() => import('./components/sections/VideoHighlightSection'));
const Footer = React.lazy(() => import('./components/sections/Footer'));

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

  // Dynamic Favicon Updater
  useEffect(() => {
    if (ASSETS.favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = ASSETS.favicon;
    }
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
        {/* 1. HERO: The Hook (Eager Loaded) */}
        <HeroSection />
        
        {/* 2. TRUST: Credibility (Eager Loaded) */}
        <TrustBar />

        {/* Lazy Load Remaining Sections */}
        <Suspense fallback={<div className="py-20 flex justify-center items-center"><Loader className="w-8 h-8 text-trail-orange animate-spin" /></div>}>
            {/* 3. DESTINATION: Why Here? (Emotional Hook) */}
            <WhyPuntangSection />

            {/* 4. VISUAL: Experience (Engagement Booster) */}
            <VideoHighlightSection />

            {/* 5. VALUE: Concept & Experience */}
            <ValuePropositionSection />

            {/* 6. CHALLENGE: The Course (Technical) */}
            <CourseSection />

            {/* 7. BENEFIT: What do I get? (Race Kit) - BEFORE Price */}
            <RaceKitSection />

            {/* 8. ACTION: Categories & Price (The Ask) */}
            <CategoriesSection />

            {/* 9. PROOF: Gallery (FOMO) */}
            <GallerySection />

            {/* 10. LOGISTICS: Timeline (Secondary Info) */}
            <TimelineSection />

            {/* 11. OBJECTIONS: FAQ */}
            <FAQSection />

            {/* 12. TRUST: Sponsors */}
            <SponsorsSection />

            {/* 13. FINAL PUSH */}
            <FinalCTASection />
        </Suspense>
      </main>
      
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
      
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
