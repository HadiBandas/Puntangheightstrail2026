
import React from 'react';
import { motion } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { Award, Trees, Users, ShieldCheck } from '../../constants/icons';
import { useTranslation } from '../../hooks/useTranslation';

const TrustBar: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation(0.5);
  const { t } = useTranslation();

  const trustItems = [
    { icon: <Award className="w-6 h-6 md:w-8 md:h-8 text-trail-orange" />, text: t('trustBar.item1') },
    { icon: <Trees className="w-6 h-6 md:w-8 md:h-8 text-trail-orange" />, text: t('trustBar.item2') },
    { icon: <Users className="w-6 h-6 md:w-8 md:h-8 text-trail-orange" />, text: t('trustBar.item3') },
    { icon: <ShieldCheck className="w-6 h-6 md:w-8 md:h-8 text-trail-orange" />, text: t('trustBar.item4') },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section ref={ref} className="bg-white py-6 md:py-8 -mt-8 md:-mt-16 relative z-20 rounded-t-3xl shadow-2xl mx-2 md:mx-0">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {trustItems.map((item, index) => (
            <motion.div 
              key={index} 
              className="flex flex-col items-center gap-2"
              variants={itemVariants}
            >
              {item.icon}
              <span className="font-poppins font-semibold text-mountain-slate text-xs md:text-base max-w-[150px]">{item.text}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TrustBar;
