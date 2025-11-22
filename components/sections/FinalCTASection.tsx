
import React from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import CountdownTimer from '../CountdownTimer';
import Button from '../ui/Button';
import { ArrowRight } from '../../constants/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { useUI } from '../../contexts/UIContext';

const FinalCTASection: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation();
  const { t } = useTranslation();
  const { openRegister } = useUI();
  const eventDate = "2026-04-04T06:00:00";

  return (
    <section id="register" ref={ref} className="py-16 md:py-24 bg-gradient-to-br from-trail-orange to-summit-gold text-white">
      <div className="container mx-auto px-6 text-center">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
        >
            <h2 className="font-montserrat font-extrabold text-3xl md:text-6xl mb-4">
                {t('finalCta.title')}
            </h2>
            <p className="font-poppins text-base md:text-lg text-white/90 max-w-3xl mx-auto mb-8 md:mb-12">
                {t('finalCta.subtitle')}
            </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 md:mb-16"
        >
          <CountdownTimer targetDate={eventDate} />
        </motion.div>

        {/* Progress Bar Removed for easier maintenance */}

        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: 'spring', stiffness: 100, delay: 0.4 }}
        >
            <Button 
                onClick={openRegister}
                className="bg-white text-mountain-slate shadow-2xl w-full sm:w-auto" 
                size="lg" 
                icon={<ArrowRight className="w-6 h-6"/>}
            >
                {t('finalCta.button')}
            </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FinalCTASection;
