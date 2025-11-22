
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { faqData } from '../../constants/data';
import { FAQItem } from '../../types';
import { ChevronDown } from '../../constants/icons';
import { useLanguage } from '../../contexts/LanguageContext';
import { useTranslation } from '../../hooks/useTranslation';

const AccordionItem: React.FC<{ item: FAQItem; isOpen: boolean; onClick: () => void; index: number }> = ({ item, isOpen, onClick, index }) => {
  const contentId = `faq-content-${index}`;
  const headerId = `faq-header-${index}`;

  return (
    <div className="border-b border-gray-200/50 py-6 bg-white rounded-xl mb-4 px-6 shadow-sm">
      <button
        onClick={onClick}
        className="w-full flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-trail-orange rounded-lg"
        aria-expanded={isOpen}
        aria-controls={contentId}
        id={headerId}
      >
        <h4 className="font-montserrat font-bold text-lg text-mountain-slate pr-8">{item.question}</h4>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          aria-hidden="true"
          className="shrink-0"
        >
          <ChevronDown className="w-6 h-6 text-trail-orange" />
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
            id={contentId}
            role="region"
            aria-labelledby={headerId}
          >
            <p className="font-poppins text-gray-600 pt-4 border-t border-gray-100 mt-4">{item.answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [ref, isVisible] = useScrollAnimation();
  const { language } = useLanguage();
  const { t } = useTranslation();
  const currentFaqData = faqData[language];

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" ref={ref} className="py-24 bg-light-gray" aria-labelledby="faq-title">
      <div className="container mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={isVisible ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-16"
        >
          <h2 id="faq-title" className="font-montserrat font-extrabold text-4xl md:text-5xl text-mountain-slate mb-4">
            {t('faq.title')}
          </h2>
          <p className="font-poppins text-lg text-gray-600 max-w-3xl mx-auto">
            {t('faq.subtitle')}
          </p>
        </motion.div>
        <div className="max-w-4xl mx-auto">
          {currentFaqData.map((item, index) => (
            <AccordionItem
              key={index}
              item={item}
              isOpen={openIndex === index}
              onClick={() => handleToggle(index)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
