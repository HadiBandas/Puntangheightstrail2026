
import React, { useState } from 'react';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { useTranslation } from '../../hooks/useTranslation';
import { ASSETS } from '../../constants/assets';
import { X } from '../../constants/icons';

const GallerySection: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation();
  const { t } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  const handleKeyDown = (e: React.KeyboardEvent, src: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setSelectedImage(src);
    }
  };

  return (
    <section ref={ref} className="py-24 bg-light-gray" aria-labelledby="gallery-title">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={isVisible ? { opacity: 1, y: 0 } : {}} 
          transition={{ duration: 0.5 }} 
          className="text-center mb-16"
        >
          <h2 id="gallery-title" className="font-montserrat font-extrabold text-4xl md:text-5xl text-mountain-slate mb-4">
            {t('gallery.title')}
          </h2>
          <p className="font-poppins text-lg text-gray-600 max-w-3xl mx-auto">
            {t('gallery.subtitle')}
          </p>
        </motion.div>
        
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[250px]"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? 'visible' : 'hidden'}
        >
          {ASSETS.gallery.map((image, index) => (
            <motion.div
              key={index}
              className={`group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer focus:outline-none focus:ring-4 focus:ring-trail-orange ${image.span || 'col-span-1 row-span-1'}`}
              variants={itemVariants}
              onClick={() => setSelectedImage(image.src)}
              onKeyDown={(e) => handleKeyDown(e, image.src)}
              whileHover={{ zIndex: 10 }}
              role="button"
              tabIndex={0}
              aria-label={`View enlarged image of ${t(image.altKey)}`}
            >
              <img 
                src={image.src} 
                alt={t(image.altKey)} 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <p className="text-white font-poppins text-sm">{t(image.altKey)}</p>
              </div>
              {/* Zoom Icon overlay */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true">
                   <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" y1="3" x2="14" y2="10"></line><line x1="3" y1="21" x2="10" y2="14"></line></svg>
                   </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* LIGHTBOX */}
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
                aria-label="Image gallery view"
            >
                <motion.button 
                    className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-trail-orange transition-colors focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1"
                    onClick={() => setSelectedImage(null)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Close gallery"
                >
                    <X className="w-8 h-8 md:w-12 md:h-12" aria-hidden="true" />
                </motion.button>

                <motion.div 
                    className="relative max-w-6xl w-full max-h-[90vh] flex items-center justify-center"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                >
                     <img 
                        src={selectedImage} 
                        alt="Gallery Preview" 
                        className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border-2 border-white/10" 
                     />
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
