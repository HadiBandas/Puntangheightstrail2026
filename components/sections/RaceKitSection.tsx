
import React, { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { Ticket, Utensils, Zap, Star, X } from '../../constants/icons'; 
import { useTranslation } from '../../hooks/useTranslation';
import { ASSETS } from '../../constants/assets';
import { useUI } from '../../contexts/UIContext';

const RaceKitSection: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation();
  const { t } = useTranslation();
  const { openRegister } = useUI();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', duration: 0.8 } },
  };

  const handleKeyDown = (e: React.KeyboardEvent, imageSrc: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSelectedImage(imageSrc);
    }
  };

  // Helper component for the "Expand" overlay icon
  const ExpandOverlay = () => (
    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 pointer-events-none">
        <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
        </div>
    </div>
  );

  return (
    <section ref={ref} className="py-16 md:py-24 bg-white relative overflow-hidden" aria-labelledby="racekit-title">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-trail-orange/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-summit-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={isVisible ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-12 md:mb-16"
        >
          <h2 id="racekit-title" className="font-montserrat font-extrabold text-4xl md:text-6xl text-mountain-slate mb-4">
            {t('raceKit.title')}
          </h2>
          <p className="font-poppins text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            {t('raceKit.subtitle')}
          </p>
        </motion.div>
        
        {/* Bento Grid Layout */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          
          {/* 1. HERO ITEM: JERSEY (Large Span with Image) */}
          <motion.div 
            variants={itemVariants} 
            className="md:col-span-2 lg:col-span-2 row-span-2 group cursor-pointer focus:outline-none focus:ring-4 focus:ring-trail-orange rounded-3xl"
            onClick={() => setSelectedImage(ASSETS.raceKit.jersey)}
            onKeyDown={(e) => handleKeyDown(e, ASSETS.raceKit.jersey)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${t('raceKit.item1')}`}
          >
            <div className="h-full min-h-[300px] md:min-h-[350px] bg-mountain-slate rounded-3xl relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-white/10">
               <ExpandOverlay />
               <img 
                  src={ASSETS.raceKit.jersey} 
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
               
               <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
                    <div className="bg-white/20 backdrop-blur-md w-fit px-3 py-1 rounded-full text-[10px] md:text-xs font-bold text-white mb-3 md:mb-4 border border-white/10">
                        HIGH PERFORMANCE
                    </div>
                    <h3 className="font-montserrat font-bold text-2xl md:text-4xl text-white mb-2 leading-tight">
                        {t('raceKit.item1')}
                    </h3>
                    <p className="font-poppins text-white/80 text-xs md:text-sm max-w-md">
                        Lightweight, sweat-wicking material designed for trail endurance. Exclusive 2026 design with topographic patterns.
                    </p>
               </div>
            </div>
          </motion.div>

          {/* 2. SECONDARY HERO: MEDAL (Tall with Image) */}
          <motion.div 
            variants={itemVariants} 
            className="md:col-span-1 lg:col-span-1 row-span-2 group cursor-pointer focus:outline-none focus:ring-4 focus:ring-trail-orange rounded-3xl"
            onClick={() => setSelectedImage(ASSETS.raceKit.medal)}
            onKeyDown={(e) => handleKeyDown(e, ASSETS.raceKit.medal)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${t('raceKit.item2')}`}
          >
             <div className="h-full min-h-[300px] bg-white rounded-3xl relative overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                <ExpandOverlay />
                <img 
                  src={ASSETS.raceKit.medal} 
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
               
               <div className="relative z-10 h-full flex flex-col justify-end p-6 text-center items-center">
                   <div className="bg-summit-gold/90 w-10 h-10 rounded-full flex items-center justify-center mb-auto mt-0 text-white shadow-lg">
                        <Star className="w-5 h-5" aria-hidden="true" />
                    </div>
                    <h3 className="font-montserrat font-bold text-xl md:text-2xl text-white mb-1 leading-tight">
                        {t('raceKit.item2')}
                    </h3>
                    <p className="font-poppins text-white/80 text-xs">
                        Heavy-duty zinc alloy with 3D detailing.
                    </p>
               </div>
             </div>
          </motion.div>

          {/* 3. ESSENTIALS GROUP (Compact Vertical Stack) */}
          <motion.div variants={itemVariants} className="md:col-span-3 lg:col-span-1 row-span-2 flex flex-col gap-4">
             
             {/* Duffel Bag */}
             <div 
                className="flex-1 bg-mountain-slate rounded-2xl relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 min-h-[140px] focus:outline-none focus:ring-4 focus:ring-trail-orange"
                onClick={() => setSelectedImage(ASSETS.raceKit.duffel)}
                onKeyDown={(e) => handleKeyDown(e, ASSETS.raceKit.duffel)}
                role="button"
                tabIndex={0}
                aria-label="View details for Special Duffel"
             >
                <img 
                  src={ASSETS.raceKit.duffel} 
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-500" 
                />
                <ExpandOverlay />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent"></div>
                <div className="relative z-10 p-5 h-full flex flex-col justify-center">
                    <div className="w-8 h-8 rounded-lg bg-trail-orange flex items-center justify-center text-white mb-2 shadow-lg">
                        <Star className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h4 className="font-montserrat font-bold text-white text-lg leading-tight">Special Duffel</h4>
                    <p className="text-[10px] text-gray-300 mt-1">Waterproof 40L.</p>
                </div>
             </div>

             {/* Race BIB - Visual Upgrade */}
             <div 
                className="flex-1 bg-white rounded-2xl relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 min-h-[120px] focus:outline-none focus:ring-4 focus:ring-trail-orange"
                onClick={() => setSelectedImage(ASSETS.raceKit.bib)}
                onKeyDown={(e) => handleKeyDown(e, ASSETS.raceKit.bib)}
                role="button"
                tabIndex={0}
                aria-label={`View details for ${t('raceKit.item3')}`}
             >
                <img 
                   src={ASSETS.raceKit.bib} 
                   alt="" 
                   loading="lazy"
                   decoding="async"
                   className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" 
                />
                <ExpandOverlay />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-transparent"></div>
                
                <div className="relative z-10 p-5 h-full flex flex-col justify-center">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-1">
                        <Ticket className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h4 className="font-montserrat font-bold text-white text-sm leading-tight">{t('raceKit.item3')}</h4>
                    <p className="text-[10px] text-gray-200">Includes Timing Chip.</p>
                </div>
             </div>
             
             {/* Meals - Visual Upgrade */}
             <div 
                className="flex-1 bg-white rounded-2xl relative overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer border border-gray-100 min-h-[120px] focus:outline-none focus:ring-4 focus:ring-trail-orange"
                onClick={() => setSelectedImage(ASSETS.raceKit.meal)}
                onKeyDown={(e) => handleKeyDown(e, ASSETS.raceKit.meal)}
                role="button"
                tabIndex={0}
                aria-label="View details for Recovery Meal"
             >
                <img 
                   src={ASSETS.raceKit.meal} 
                   alt=""
                   loading="lazy"
                   decoding="async"
                   className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:scale-110 transition-transform duration-500" 
                />
                <ExpandOverlay />
                <div className="absolute inset-0 bg-gradient-to-r from-green-900/80 to-transparent"></div>

                <div className="relative z-10 p-5 h-full flex flex-col justify-center">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-white mb-1">
                        <Utensils className="w-4 h-4" aria-hidden="true" />
                    </div>
                    <h4 className="font-montserrat font-bold text-white text-sm leading-tight">Recovery Meal</h4>
                    <p className="text-[10px] text-gray-200">Healthy & Energizing.</p>
                </div>
             </div>
          </motion.div>

          {/* 4. GRAND PRIZE BANNER (Wide with Image) */}
          <motion.div 
            variants={itemVariants} 
            className="md:col-span-3 lg:col-span-4 group cursor-pointer focus:outline-none focus:ring-4 focus:ring-trail-orange rounded-3xl"
            onClick={() => setSelectedImage(ASSETS.raceKit.prizes)}
            onKeyDown={(e) => handleKeyDown(e, ASSETS.raceKit.prizes)}
            role="button"
            tabIndex={0}
            aria-label={`View details for ${t('raceKit.prizeTitle')}`}
          >
             <div className="relative bg-mountain-slate rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden min-h-[220px] md:h-auto flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
                <ExpandOverlay />
                {/* Background Image */}
                <img 
                  src={ASSETS.raceKit.prizes} 
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-trail-orange/90 to-summit-gold/80 mix-blend-multiply"></div>
                
                <div className="relative z-10 text-center md:text-left flex-1 w-full">
                    <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                        <Zap className="w-5 h-5 text-white animate-bounce-slow" aria-hidden="true" />
                        <span className="font-bebas text-white tracking-widest">DOOR PRIZE</span>
                    </div>
                    <h3 className="font-montserrat font-extrabold text-2xl md:text-4xl text-white mb-2 leading-tight">
                        {t('raceKit.prizeTitle')}
                    </h3>
                    <p className="font-poppins text-white/90 text-sm md:text-base max-w-xl break-words">
                        {t('raceKit.prizeDesc')} Smartwatches, Trail Gear, and Luxury Villa Stays!
                    </p>
                </div>
                <div className="relative z-10 mt-4 md:mt-0 shrink-0">
                    {/* FIX: Button now triggers registration instead of doing nothing */}
                    <button 
                        tabIndex={0} 
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent lightbox from opening
                            openRegister();
                        }}
                        className="bg-white text-trail-orange font-bold px-6 py-3 md:px-8 rounded-full shadow-lg hover:bg-gray-50 hover:scale-105 transition-all duration-300 text-sm md:text-base"
                    >
                        Register to Win
                    </button>
                </div>
             </div>
          </motion.div>

        </motion.div>
      </div>

      {/* IMAGE MODAL (LIGHTBOX) */}
      <AnimatePresence>
        {selectedImage && (
            <motion.div 
                className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedImage(null)}
                role="dialog"
                aria-modal="true"
                aria-label="Image details"
            >
                <motion.button 
                    className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-trail-orange transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
                    onClick={() => setSelectedImage(null)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close preview"
                >
                    <X className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />
                </motion.button>

                <motion.div 
                    className="relative max-w-5xl w-full max-h-[90vh] flex items-center justify-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking image
                >
                     <img 
                        src={selectedImage} 
                        alt="Zoomed Preview" 
                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border-2 border-white/10" 
                     />
                     <div className="absolute bottom-[-40px] left-0 right-0 text-center text-white/70 font-poppins text-sm">
                        Tap outside or click X to close
                     </div>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default RaceKitSection;
