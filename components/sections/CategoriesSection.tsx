
import React from 'react';
import { motion, Variants } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { TrendingUp, Clock, Footprints, Zap, Star, ChevronRight } from '../../constants/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { useUI } from '../../contexts/UIContext';

// --- Sub-components & Styles ---

// Topographic Pattern SVG (Base64 optimized)
const topoPattern = `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath stroke='%23FFFFFF' stroke-opacity='0.05' stroke-width='1' d='M10 10c10 10 20 0 30 0s20 20 30 20 20-20 30-20M0 30c20 0 40 20 60 20s40-20 60-20M-10 50c20 10 40 0 60 0s40 20 60 20M10 80c20-10 30 0 40 0s20 20 40 20'/%3E%3C/svg%3E")`;

interface CategoryCardProps {
  distance: string;
  title: string;
  description: string;
  features: string[];
  elevation: string;
  estimatedTime: string;
  color: string; // Tailwnd class for text color e.g. 'text-emerald-400'
  glowColor: string; // Hex color for shadow/glow
  gradientFrom: string; // Tailwind class e.g. 'from-emerald-500'
  icon: React.ReactNode;
  onRegister: () => void;
  delay: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ 
    distance, title, description, features, elevation, estimatedTime, 
    color, glowColor, gradientFrom, icon, onRegister, delay 
}) => {
    const { t } = useTranslation();

    return (
        <motion.div
            className="relative group h-full"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            onClick={onRegister}
        >
            {/* 1. DYNAMIC GLOW (Behind the card) */}
            <div 
                className="absolute -inset-0.5 rounded-[2rem] opacity-30 group-hover:opacity-100 blur-lg transition-opacity duration-500"
                style={{ background: `linear-gradient(to bottom, ${glowColor}, transparent)` }} 
            />

            {/* 2. CARD BODY */}
            <div className="relative h-full bg-[#0a0f14] rounded-[1.9rem] overflow-hidden border border-white/10 group-hover:border-white/30 transition-colors duration-500 flex flex-col">
                
                {/* Ambient Top Light (The "Cinematic Spotlight") */}
                <div className={`absolute top-0 inset-x-0 h-32 bg-gradient-to-b ${gradientFrom} to-transparent opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Topographic Texture Overlay */}
                <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay" style={{ backgroundImage: topoPattern }} />

                {/* Watermark Number (The "Energy") */}
                <div className="absolute -right-6 top-10 font-bebas text-[10rem] leading-none text-white/[0.02] group-hover:text-white/[0.05] transition-colors duration-500 select-none pointer-events-none italic">
                    {distance}
                </div>

                {/* CONTENT CONTAINER */}
                <div className="relative z-10 p-8 flex flex-col h-full">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-white shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:scale-110 group-hover:shadow-[0_0_20px_${glowColor}40] transition-all duration-500 ${color}`}>
                            {icon}
                        </div>
                        <div className={`px-4 py-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm`}>
                            <span className={`font-bebas text-lg tracking-widest ${color} drop-shadow-[0_0_8px_${glowColor}]`}>{distance}</span>
                        </div>
                    </div>

                    {/* Title & Desc */}
                    <div className="mb-8">
                        <h3 className="font-montserrat font-black text-3xl text-white mb-3 uppercase italic tracking-tight leading-none group-hover:translate-x-1 transition-transform duration-300">
                            {title}
                        </h3>
                        <p className="font-poppins text-sm text-gray-400 leading-relaxed border-l-2 border-white/10 pl-4">
                            {description}
                        </p>
                    </div>

                    {/* Stats Grid (Cinematic Tech Look) */}
                    <div className="grid grid-cols-2 gap-px bg-white/10 rounded-xl overflow-hidden mb-8 border border-white/10">
                        <div className="bg-[#0f161b] p-4 group-hover:bg-[#161e24] transition-colors">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <TrendingUp className="w-3 h-3" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">{t('categories.elevation')}</span>
                            </div>
                            <div className="font-bebas text-2xl text-white">{elevation}</div>
                        </div>
                        <div className="bg-[#0f161b] p-4 group-hover:bg-[#161e24] transition-colors">
                            <div className="flex items-center gap-2 text-gray-500 mb-1">
                                <Clock className="w-3 h-3" />
                                <span className="text-[9px] font-bold uppercase tracking-widest">{t('categories.estTime')}</span>
                            </div>
                            <div className="font-bebas text-2xl text-white">{estimatedTime}</div>
                        </div>
                    </div>

                    {/* Features (Checklist) */}
                    <ul className="space-y-3 mb-8 flex-grow">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3 group/item">
                                <div className={`mt-1.5 w-1 h-1 rounded-full ${color} shadow-[0_0_5px_${glowColor}] group-hover/item:scale-150 transition-transform`}></div>
                                <span className="font-poppins text-sm text-gray-300 group-hover/item:text-white transition-colors">{feature}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Action Button (The "Trigger") */}
                    <button className="group/btn relative w-full py-4 bg-white text-black font-montserrat font-black uppercase tracking-widest text-sm overflow-hidden rounded-xl hover:text-white transition-colors duration-300 mt-auto">
                         <div className={`absolute inset-0 translate-y-full group-hover/btn:translate-y-0 bg-gradient-to-r ${gradientFrom} to-black transition-transform duration-300 ease-out`} />
                         <span className="relative z-10 flex items-center justify-center gap-2">
                            {t('categories.registerButton', { distance })}
                            <ChevronRight className="w-4 h-4" />
                         </span>
                    </button>

                </div>
            </div>
        </motion.div>
    );
};

const CategoriesSection: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation();
  const { t } = useTranslation();
  const { openRegister } = useUI();

  const categories = [
    {
      distance: '5K',
      title: t('categories.cat1Title'),
      description: t('categories.cat1Desc'),
      features: [t('categories.cat1Feat1'), t('categories.cat1Feat2'), t('categories.cat1Feat3')],
      elevation: '+250m',
      estimatedTime: t('categories.cat1Time'),
      color: 'text-emerald-400',
      glowColor: '#34d399',
      gradientFrom: 'from-emerald-500',
      icon: <Footprints className="w-6 h-6" />,
    },
    {
      distance: '10K',
      title: t('categories.cat2Title'),
      description: t('categories.cat2Desc'),
      features: [t('categories.cat2Feat1'), t('categories.cat2Feat2'), t('categories.cat2Feat3')],
      elevation: '+650m',
      estimatedTime: t('categories.cat2Time'),
      color: 'text-cyan-400',
      glowColor: '#22d3ee',
      gradientFrom: 'from-cyan-500',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      distance: '21K',
      title: t('categories.cat3Title'),
      description: t('categories.cat3Desc'),
      features: [t('categories.cat3Feat1'), t('categories.cat3Feat2'), t('categories.cat3Feat3')],
      elevation: '+1417m',
      estimatedTime: t('categories.cat3Time'),
      color: 'text-orange-500',
      glowColor: '#f97316',
      gradientFrom: 'from-orange-500',
      icon: <Star className="w-6 h-6" />,
    },
  ];

  return (
    <section id="categories" ref={ref} className="py-24 md:py-32 bg-[#050a0d] relative overflow-hidden" aria-labelledby="categories-title">
      
      {/* Ambient Atmosphere (Dark & Moody) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-trail-orange/5 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />
      
      <div className="container mx-auto px-6 relative z-10">
        
        {/* Header */}
        <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={isVisible ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 0.8 }} 
            className="text-center mb-20"
        >
          <div className="inline-block mb-4 px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
             <span className="text-xs font-bold tracking-[0.3em] text-trail-orange uppercase">Race Categories</span>
          </div>
          <h2 id="categories-title" className="font-montserrat font-black text-5xl md:text-7xl text-white mb-6 tracking-tight uppercase italic">
            Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">Distance</span>
          </h2>
          <p className="font-poppins text-base md:text-lg text-gray-400 max-w-2xl mx-auto">
            {t('categories.subtitle')}
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 max-w-7xl mx-auto">
          {categories.map((category, index) => (
            <CategoryCard 
                key={category.distance} 
                {...category} 
                onRegister={openRegister} 
                delay={index * 0.15}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
