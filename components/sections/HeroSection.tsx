
import React from 'react';
import { motion, Variants, useScroll, useTransform } from 'framer-motion';
import Button from '../ui/Button';
import { Calendar, MapPin, Users, ArrowRight, ChevronDown } from '../../constants/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { ASSETS } from '../../constants/assets';
import { useUI } from '../../contexts/UIContext';

const HeroSection: React.FC = () => {
  const { t } = useTranslation();
  const { scrollY } = useScroll();
  
  // Parallax for video only - kept subtle
  const yVideo = useTransform(scrollY, [0, 1000], [0, 300]); 
  // Parallax for text - Reduced range for stability
  const yText = useTransform(scrollY, [0, 500], [0, 100]);

  const { openRegister } = useUI();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.8, ease: "easeOut" } 
    },
  };

  const scrollToSection = (e: React.MouseEvent | undefined, id: string) => {
    if (e) e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
        const headerOffset = 85;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-mountain-slate" aria-label="Hero Section">
      
      {/* Background Video */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <motion.div style={{ y: yVideo }} className="w-full h-full">
            <motion.video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={ASSETS.hero.poster}
            >
            <source src={ASSETS.hero.video} type="video/mp4" />
            </motion.video>
        </motion.div>
        
        {/* High Contrast Overlays - Solves "Tidak Jelas" */}
        <div className="absolute inset-0 bg-black/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-mountain-slate/95" />
      </div>

      {/* Main Content */}
      <motion.div 
        className="relative z-10 text-center px-4 pb-24 md:pb-0 max-w-7xl mx-auto w-full flex flex-col items-center pt-24 md:pt-0"
        style={{ y: yText }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badges - Solid & Stable - Increased margin to prevent collision */}
        <motion.div 
            className="flex flex-wrap justify-center items-center gap-x-3 gap-y-4 md:gap-6 mb-10 md:mb-16" 
            variants={itemVariants}
        >
          <div className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-mountain-slate/90 border border-white/20 text-white shadow-lg backdrop-blur-sm">
             <Calendar className="w-3 h-3 md:w-4 md:h-4 text-trail-orange" aria-hidden="true" />
             <span className="font-poppins font-medium text-xs md:text-sm">{t('hero.date')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-mountain-slate/90 border border-white/20 text-white shadow-lg backdrop-blur-sm">
             <MapPin className="w-3 h-3 md:w-4 md:h-4 text-trail-orange" aria-hidden="true" />
             <span className="font-poppins font-medium text-xs md:text-sm">{t('hero.location')}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 rounded-full bg-trail-orange text-white shadow-lg shadow-trail-orange/20">
             <Users className="w-3 h-3 md:w-4 md:h-4" aria-hidden="true" />
             <span className="font-poppins font-bold text-xs md:text-sm uppercase tracking-wide">{t('hero.slots')}</span>
          </div>
        </motion.div>

        {/* Typography - Thick & Professional (Solves "Tipis") */}
        <motion.div variants={itemVariants} className="mb-8 md:mb-10 relative z-10">
            <h1 className="font-bebas text-5xl sm:text-7xl md:text-9xl text-white leading-[0.9] tracking-wide drop-shadow-2xl mt-2">
                {t('hero.title1')} <br/>
                <span className="text-white">{t('hero.title2')}</span>
            </h1>
        </motion.div>

        <motion.div variants={itemVariants} className="max-w-3xl mx-auto mb-8 md:mb-12 px-4">
             <p className="font-montserrat text-xl md:text-3xl text-white font-bold mb-5 drop-shadow-lg">
                {t('hero.eventName')}
             </p>
             <div className="flex items-center justify-center gap-4" aria-hidden="true">
                <div className="h-[2px] md:h-[3px] w-8 md:w-12 bg-trail-orange rounded-full"></div>
                <p className="font-poppins font-semibold text-gray-100 tracking-widest uppercase text-xs md:text-base drop-shadow-md text-center">
                    {t('hero.tagline')}
                </p>
                <div className="h-[2px] md:h-[3px] w-8 md:w-12 bg-trail-orange rounded-full"></div>
            </div>
            {/* Screen reader only text for tagline to ensure it's read even if aria-hidden div is ignored */}
            <span className="sr-only">{t('hero.tagline')}</span>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center w-full px-4 sm:px-0"
          variants={itemVariants}
        >
          <Button 
            onClick={openRegister} 
            variant="primary" 
            size="md"
            icon={<ArrowRight className="w-5 h-5" aria-hidden="true" />} 
            className="w-full sm:w-auto min-w-[200px] shadow-xl shadow-orange-900/40 border-2 border-trail-orange font-bold !py-3 !text-base md:!py-4 md:!text-lg lg:!py-5 lg:!text-xl"
          >
            {t('hero.ctaRegister')}
          </Button>
          
          <Button 
            as="a" 
            href="#course" 
            onClick={(e) => scrollToSection(e, 'course')}
            variant="outline" 
            size="md"
            className="w-full sm:w-auto min-w-[200px] border-2 bg-black/30 backdrop-blur-sm hover:bg-white hover:text-mountain-slate border-white font-bold !py-3 !text-base md:!py-4 md:!text-lg lg:!py-5 lg:!text-xl cursor-pointer"
          >
            {t('hero.ctaExplore')}
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - Static & Clear */}
      <motion.button
        className="absolute bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center text-white/80 cursor-pointer hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-trail-orange rounded-lg p-2 hidden md:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        onClick={(e) => scrollToSection(e, 'about')}
        aria-label="Scroll down to next section"
      >
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase mb-2" aria-hidden="true">Scroll Down</span>
        <ChevronDown className="w-6 h-6 animate-bounce" aria-hidden="true" />
      </motion.button>
    </section>
  );
};

export default HeroSection;
