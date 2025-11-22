
import React, { useEffect, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { Crown, MapPin, Users, Camera } from '../../constants/icons';
import { useTranslation } from '../../hooks/useTranslation';

const StatCounter: React.FC<{ to: number; isVisible: boolean; delay?: number }> = ({ to, isVisible, delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isVisible && ref.current) {
        const node = ref.current;
        const controls = animate(0, to, {
            duration: 2,
            ease: 'easeOut',
            delay,
            onUpdate(value) {
                node.textContent = value.toFixed(0);
            }
        });
        return () => controls.stop();
    }
  }, [isVisible, to, delay]);

  return <div ref={ref}>0</div>;
};

const WhyPuntangSection: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation();
  const { t } = useTranslation();

  const features = [
    { icon: <Crown className="w-10 h-10 md:w-12 md:h-12" />, title: t('why.card1Title'), stat: '200', label: t('why.card1Label'), description: t('why.card1Desc') },
    { icon: <MapPin className="w-10 h-10 md:w-12 md:h-12" />, title: t('why.card2Title'), stat: '1300', label: t('why.card2Label'), description: t('why.card2Desc') },
    { icon: <Users className="w-10 h-10 md:w-12 md:h-12" />, title: t('why.card3Title'), stat: '10', label: t('why.card3Label'), description: t('why.card3Desc') },
    { icon: <Camera className="w-10 h-10 md:w-12 md:h-12" />, title: t('why.card4Title'), stat: '100', label: t('why.card4Label'), description: t('why.card4Desc') },
  ];

  return (
    <section ref={ref} className="py-16 md:py-24 bg-mountain-slate text-white">
      <div className="container mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={isVisible ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-12 md:mb-16"
        >
          <h2 className="font-montserrat font-extrabold text-4xl md:text-5xl mb-4">
            {t('why.title1')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-summit-gold to-trail-orange">{t('why.title2')}</span>?
          </h2>
          <p className="font-poppins text-base md:text-lg text-mist-gray/80 max-w-3xl mx-auto">
            {t('why.subtitle')}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-white/10 p-6 md:p-8 rounded-2xl text-center backdrop-blur-sm border border-white/20"
              initial={{ opacity: 0, y: 50 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              <div className="text-trail-orange inline-block mb-4">{feature.icon}</div>
              <h3 className="font-montserrat font-bold text-xl md:text-2xl mb-2">{feature.title}</h3>
              <div className="font-bebas text-5xl md:text-6xl text-summit-gold">
                <StatCounter to={parseInt(feature.stat)} isVisible={isVisible} delay={index * 0.2 + 0.5} />
              </div>
              <p className="font-poppins text-sm uppercase tracking-widest text-mist-gray/80 mb-4 break-words">{feature.label.replace('{stat}', feature.stat)}</p>
              <p className="font-poppins text-mist-gray text-sm md:text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyPuntangSection;
