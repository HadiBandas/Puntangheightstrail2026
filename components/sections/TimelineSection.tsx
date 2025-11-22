
import React from 'react';
import { motion, Variants } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { timelineEventsData } from '../../constants/data';
import { TimelineEvent } from '../../types';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';

const TimelineItem: React.FC<{ item: TimelineEvent; index: number; isVisible: boolean }> = ({ item, index, isVisible }) => {
  const isLeft = index % 2 === 0;
  
  // On mobile, everything comes from bottom/fade in, no horizontal fly-in to avoid overflow
  const variants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut', delay: index * 0.15 } },
  };

  const desktopVariants: Variants = {
      hidden: { opacity: 0, x: isLeft ? -50 : 50 },
      visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut', delay: index * 0.2 } }
  }

  // We use a responsive class based approach for layout, but motion variants handle the animation.
  // For simplicity in this fix, we'll use a unified fade-up for mobile and keep the L/R for desktop if possible, 
  // but standardizing on fade up is safer for mobile.

  return (
    <motion.div
      className="relative flex flex-col md:flex-row items-start md:items-center justify-between md:justify-normal md:odd:flex-row-reverse group pl-8 md:pl-0"
      variants={window.innerWidth < 768 ? variants : desktopVariants}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
    >
      {/* Connector Dot */}
      <div className="absolute left-0 md:left-1/2 top-0 md:top-1/2 w-6 h-6 md:w-10 md:h-10 rounded-full border-2 border-trail-orange bg-white shrink-0 md:-translate-x-1/2 md:-translate-y-1/2 z-10 flex items-center justify-center">
        <item.icon className="w-3 h-3 md:w-5 md:h-5 text-trail-orange" />
      </div>

      <div className="w-full md:w-[calc(50%-2.5rem)] bg-gray-50 p-5 md:p-6 rounded-xl shadow-lg border-l-4 border-trail-orange md:border-l-0 border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
          <h4 className="font-montserrat font-bold text-mountain-slate text-base md:text-lg leading-tight">{item.title}</h4>
          <time className="font-bebas text-lg md:text-xl text-trail-orange shrink-0">{item.time}</time>
        </div>
        <p className="font-poppins text-sm text-gray-600 leading-relaxed">{item.description}</p>
      </div>
    </motion.div>
  );
};

const TimelineSection: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const timelineEvents = timelineEventsData[language];

  return (
    <section id="timeline" ref={ref} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={isVisible ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-montserrat font-extrabold text-4xl md:text-5xl text-mountain-slate mb-4">
            {t('timeline.title')}
          </h2>
          <p className="font-poppins text-base md:text-lg text-gray-600 max-w-3xl mx-auto">
            {t('timeline.subtitle')}
          </p>
        </motion.div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Central Line for Desktop */}
          <div className="hidden md:block absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-full bg-trail-orange/30"></div>
          {/* Left Line for Mobile */}
          <div className="md:hidden absolute top-2 left-[11px] w-0.5 h-[calc(100%-20px)] bg-trail-orange/30"></div>
          
          <div className="space-y-8 md:space-y-12">
            {timelineEvents.map((event, index) => (
              <TimelineItem key={index} item={event} index={index} isVisible={isVisible} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TimelineSection;
