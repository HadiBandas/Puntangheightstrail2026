
import React from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { useTranslation } from '../../hooks/useTranslation';
import { ASSETS } from '../../constants/assets';

const SponsorsSection: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation();
  const { t } = useTranslation();

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
        >
          <p className="font-poppins text-lg text-gray-600 max-w-3xl mx-auto">
            {t('sponsors.subtitle')}
          </p>
        </motion.div>

        {/* Powered By Section (Organizer) */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center mb-20"
        >
            <span className="font-montserrat text-sm font-bold text-gray-400 uppercase tracking-[0.2em] mb-8">
                {t('sponsors.poweredBy')}
            </span>
            <div className="w-64 md:w-80 h-auto transition-transform duration-500 hover:scale-105">
                <img 
                    src={ASSETS.organizerLogo} 
                    alt="Taman Wisata Bougenville" 
                    className="w-full h-auto object-contain" 
                />
            </div>
        </motion.div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-16 max-w-4xl mx-auto"></div>

        {/* Official Sponsors Section */}
        <div className="text-center">
             <span className="font-montserrat text-xs font-bold text-gray-400 uppercase tracking-[0.15em] mb-10 block">
                {t('sponsors.title')}
            </span>
            
            <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-12 grayscale hover:grayscale-0 transition-all duration-500">
            {ASSETS.sponsors.map((logo, index) => (
                <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
                className="w-24 md:w-32 flex items-center justify-center"
                >
                <img 
                    src={logo} 
                    alt={`Sponsor ${index + 1}`} 
                    className="max-w-full max-h-12 opacity-60 hover:opacity-100 transition-all duration-300" 
                />
                </motion.div>
            ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorsSection;
