
import React from 'react';
import { motion, Variants } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import Card from '../ui/Card';
import { Crown, Mountain, Heart } from '../../constants/icons';
import { useTranslation } from '../../hooks/useTranslation';

const ValuePropositionSection: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation();
  const { t } = useTranslation();

  const propositions = [
    {
      icon: <Crown className="w-12 h-12 md:w-16 md:h-16 text-trail-orange" />,
      title: t('valueProp.card1Title'),
      description: t('valueProp.card1Desc'),
    },
    {
      icon: <Mountain className="w-12 h-12 md:w-16 md:h-16 text-trail-orange" />,
      title: t('valueProp.card2Title'),
      description: t('valueProp.card2Desc'),
    },
    {
      icon: <Heart className="w-12 h-12 md:w-16 md:h-16 text-trail-orange" />,
      title: t('valueProp.card3Title'),
      description: t('valueProp.card3Desc'),
    },
  ];

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  return (
    <section id="about" ref={ref} className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-6 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isVisible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <h2 className="font-montserrat font-extrabold text-3xl md:text-5xl text-mountain-slate mb-4">
            {t('valueProp.title')}
          </h2>
          <p className="font-poppins text-base md:text-lg text-gray-600 max-w-3xl mx-auto mb-12 md:mb-16">
            {t('valueProp.subtitle')}
          </p>
        </motion.div>
        
        <motion.div
          className="grid md:grid-cols-3 gap-6 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {propositions.map((prop, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="text-center h-full p-6 md:p-8 border border-gray-100 shadow-lg" hoverable>
                <div className="mb-4 md:mb-6 inline-block">{prop.icon}</div>
                <h3 className="font-montserrat font-bold text-xl md:text-2xl text-mountain-slate mb-3 md:mb-4">{prop.title}</h3>
                <p className="font-poppins text-sm md:text-base text-gray-600">{prop.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ValuePropositionSection;
