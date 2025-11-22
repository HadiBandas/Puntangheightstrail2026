
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useUI } from '../../contexts/UIContext';
import { X, Ticket, ArrowRight, Loader, CheckCircle, Phone, Mail, MapPin, Users, Star, Gift, ShieldCheck, AlertTriangle, Plus, Trash } from '../../constants/icons';
import { useTranslation } from '../../hooks/useTranslation';
import { useToast } from '../../contexts/ToastContext';
import Button from './Button';

// Helper interface for Child Data
interface ChildData {
    id: number;
    firstName: string;
    lastName: string;
    age: string;
    gender: string;
    bloodType: string;
    size: string;
}

const RegistrationModal: React.FC = () => {
  const { isRegisterOpen, closeRegister } = useUI();
  const { t } = useTranslation();
  const { addToast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Family Logic - Dynamic List
  const [children, setChildren] = useState<ChildData[]>([]);

  const [selectedCategory, setSelectedCategory] = useState('21K');
  const [isCommunityMember, setIsCommunityMember] = useState('no');
  const [agreedToWaiver, setAgreedToWaiver] = useState(false);
  const [showTerms, setShowTerms] = useState(false); 

  // Form States (Adult)
  const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      age: '',
      gender: '',
      bloodType: '',
      size: '',
      domicile: '',
      communityName: '',
      emergencyName: '',
      emergencyPhone: '',
  });

  // Reset state when modal opens
  useEffect(() => {
    if (isRegisterOpen) {
        setSuccess(false);
        setLoading(false);
        setChildren([]); // Reset children list
        setSelectedCategory('21K'); 
        setIsCommunityMember('no');
        setAgreedToWaiver(false);
        setShowTerms(false);
        setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            age: '',
            gender: '',
            bloodType: '',
            size: '',
            domicile: '',
            communityName: '',
            emergencyName: '',
            emergencyPhone: '',
        });
    }
  }, [isRegisterOpen]);

  // Logic: If children exist, force 5K.
  useEffect(() => {
      if (children.length > 0 && selectedCategory !== '5K') {
          setSelectedCategory('5K');
          addToast(t('modal.childRestrictionNotice'), 'info');
      }
  }, [children.length, selectedCategory, t, addToast]);

  // Handlers for Children List
  const addChild = () => {
      setChildren(prev => [
          ...prev, 
          { 
              id: Date.now(), 
              firstName: '', 
              lastName: '', 
              age: '', 
              gender: '', 
              bloodType: '', 
              size: '' 
          }
      ]);
  };

  const removeChild = (id: number) => {
      setChildren(prev => prev.filter(child => child.id !== id));
  };

  const updateChild = (id: number, field: keyof ChildData, value: string) => {
      setChildren(prev => prev.map(child => 
          child.id === id ? { ...child, [field]: value } : child
      ));
  };

  // Logic: Prevent changing category if children exist
  const handleCategorySelect = (cat: string) => {
      if (children.length > 0 && cat !== '5K') {
          addToast(t('modal.childRestrictionNotice'), 'error');
          return;
      }
      setSelectedCategory(cat);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Pricing Logic
  const getPriceNumeric = (cat: string) => {
     switch(cat) {
         case '5K': return 150000;
         case '10K': return 250000;
         case '21K': return 450000;
         default: return 0;
     }
  }

  const getTotalPrice = () => {
      // Force 5K calculation instantly if children are present to avoid flicker before effect runs
      const effectiveCategory = children.length > 0 ? '5K' : selectedCategory;
      const adultPrice = getPriceNumeric(effectiveCategory);
      const childrenPrice = children.length * 150000; // Child price fixed at 150k
      return adultPrice + childrenPrice;
  }

  const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }

  const generateWhatsAppLink = () => {
      const adminPhone = "6281224178271";
      const totalPrice = formatCurrency(getTotalPrice());
      const effectiveCategory = children.length > 0 ? '5K' : selectedCategory;
      
      let childrenDetails = '';
      if (children.length > 0) {
          childrenDetails = '\n*CHILDREN REGISTRATION (5K Fun Trail)*\n';
          children.forEach((child, index) => {
              childrenDetails += `
*Child ${index + 1}:*
- Name: ${child.firstName} ${child.lastName}
- Age: ${child.age}
- Gender: ${child.gender}
- Blood: ${child.bloodType}
- Size: ${child.size}
              `;
          });
      }

      const text = `
*Puntang Height Trail 2026 - Registration*
*Type:* ${children.length > 0 ? `FAMILY (1 Adult + ${children.length} Children)` : 'INDIVIDUAL'}

*Category:* ${effectiveCategory}
*Total Transfer:* ${totalPrice}

*Runner 1 (Adult):*
- Name: ${formData.firstName} ${formData.lastName}
- Gender: ${formData.gender}
- Age: ${formData.age}
- Phone: ${formData.phone}
- Email: ${formData.email}
- Blood: ${formData.bloodType}
- Size: ${formData.size}
${childrenDetails}

*Additional Info:*
- Domicile: ${formData.domicile}
- Community: ${isCommunityMember === 'yes' ? formData.communityName : '-'}

*Emergency Contact:*
- Name: ${formData.emergencyName}
- Phone: ${formData.emergencyPhone}

---------------------------
*Halo Admin, saya sudah transfer sebesar ${totalPrice}. Berikut lampiran bukti transfer saya (Foto).*
`.trim();

      return `https://wa.me/${adminPhone}?text=${encodeURIComponent(text)}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Manual validation for children
    if (children.length > 0) {
        for (const child of children) {
            if (!child.firstName || !child.lastName || !child.age || !child.gender || !child.bloodType || !child.size) {
                addToast('Please fill in all fields for your children.', 'error');
                return;
            }
        }
    }

    if (!agreedToWaiver) {
        addToast('Please agree to the Terms & Conditions', 'error');
        return;
    }

    setLoading(true);

    // Simulate processing time
    setTimeout(() => {
        setLoading(false);
        setSuccess(true);
        addToast(t('toast.regSuccess'), 'success');
    }, 1500);
  };

  const openWhatsApp = () => {
      window.open(generateWhatsAppLink(), '_blank');
      closeRegister();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', damping: 25, stiffness: 300 } },
    exit: { opacity: 0, y: 50, scale: 0.95 },
  };

  return (
    <AnimatePresence>
      {isRegisterOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeRegister}
            aria-hidden="true"
          />
          
          <motion.div
            className="relative w-full max-w-5xl bg-white md:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[100dvh] md:h-auto md:max-h-[95vh]"
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button 
                onClick={closeRegister}
                className="absolute top-4 right-4 z-30 p-2 bg-black/20 md:bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-trail-orange transition-all focus:outline-none focus:ring-2 focus:ring-trail-orange"
                aria-label="Close registration modal"
            >
                <X className="w-6 h-6" aria-hidden="true" />
            </button>

            {/* Left Panel (Desktop Visual & Summary) */}
            <div className="hidden md:flex w-1/3 bg-mountain-slate relative flex-col justify-between p-8 text-white">
                <div className="absolute inset-0 opacity-20 topographic" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-b from-trail-orange/20 to-transparent" aria-hidden="true" />
                
                <div className="relative z-10">
                    <div className="font-bebas text-5xl mb-2 drop-shadow-lg" aria-hidden="true">JOIN THE LEGEND</div>
                    <p className="font-poppins text-sm text-white/80 leading-relaxed">Finish registration to secure your slot for the 2026 Puntang Heights Trail.</p>
                </div>

                <div className="relative z-10 flex flex-col gap-8">
                    {/* Price Box */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/10 shadow-lg transform transition-transform hover:scale-[1.02]">
                        <div className="font-montserrat font-bold text-lg mb-1 text-white/90 uppercase tracking-wider">{selectedCategory} Category</div>
                        <div className="font-bebas text-5xl text-trail-orange drop-shadow-md">{formatCurrency(getTotalPrice())}</div>
                        
                        {children.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                                <div className="flex justify-between text-xs text-white/70">
                                    <span>{t('modal.adultPrice')}</span>
                                    <span>{formatCurrency(getPriceNumeric('5K'))}</span>
                                </div>
                                <div className="flex justify-between text-xs text-white/70">
                                    <span>{t('modal.childrenPrice', { n: children.length })}</span>
                                    <span>{formatCurrency(children.length * 150000)}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Benefits List */}
                    <div className="space-y-4">
                        <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-2 pl-1">Registration Includes</p>
                        <div className="space-y-4 text-sm text-white/90 font-poppins">
                            <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    <Ticket className="w-4 h-4 text-summit-gold" aria-hidden="true" />
                                </div>
                                <span>Race Entry & Bib</span>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    <Gift className="w-4 h-4 text-summit-gold" aria-hidden="true" />
                                </div>
                                <span>Exclusive Jersey</span>
                            </div>

                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    <Star className="w-4 h-4 text-summit-gold" aria-hidden="true" />
                                </div>
                                <span>Finisher Medal</span>
                            </div>

                            <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-4 h-4 text-summit-gold" aria-hidden="true" />
                                </div>
                                <span>Medical Cover</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Panel (Form) */}
            <div className="w-full md:w-2/3 bg-white flex flex-col relative h-full md:h-auto">
                
                {/* Mobile-Only Header Summary */}
                <div className="md:hidden bg-mountain-slate text-white p-6 pb-8 rounded-b-[2rem] relative z-10 shadow-lg shrink-0">
                    <div className="absolute inset-0 opacity-20 topographic pointer-events-none" />
                    <div className="relative z-10 pr-8">
                        <div className="font-bebas text-3xl mb-1">JOIN THE LEGEND</div>
                        <div className="flex justify-between items-end">
                            <div>
                                <div className="text-xs text-white/60 font-bold uppercase tracking-wider mb-1">Selected Category</div>
                                <div className="font-montserrat font-bold text-xl">{selectedCategory}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-xs text-white/60 font-bold uppercase tracking-wider mb-1">Total</div>
                                <div className="font-bebas text-3xl text-trail-orange">{formatCurrency(getTotalPrice())}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-4 md:p-8 min-h-0">
                    <AnimatePresence mode="wait">
                        {!success ? (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <h3 id="modal-title" className="font-montserrat font-extrabold text-xl md:text-2xl text-mountain-slate mb-4">{t('modal.formTitle')}</h3>
                                
                                <form className="space-y-6 md:space-y-8 pb-8" onSubmit={handleSubmit}>
                                    
                                    {/* 1. Category Selection */}
                                    <div className="space-y-3" role="group" aria-labelledby="category-label">
                                        <span id="category-label" className="text-xs font-bold text-gray-500 uppercase tracking-wider">{t('modal.category')}</span>
                                        <div className="grid grid-cols-3 gap-2 md:gap-3">
                                            {['5K', '10K', '21K'].map((cat) => {
                                                const isDisabled = children.length > 0 && cat !== '5K';
                                                return (
                                                    <label 
                                                        key={cat} 
                                                        className={`relative ${isDisabled ? 'cursor-not-allowed opacity-40 grayscale' : 'cursor-pointer'}`} 
                                                        onClick={() => !isDisabled && handleCategorySelect(cat)}
                                                    >
                                                        <input 
                                                            type="radio" 
                                                            name="category" 
                                                            className="peer sr-only" 
                                                            checked={selectedCategory === cat}
                                                            onChange={() => {}}
                                                            disabled={isDisabled}
                                                        />
                                                        <div className="text-center py-2 md:py-3 rounded-xl border-2 border-gray-200 peer-checked:border-trail-orange peer-checked:bg-trail-orange/5 hover:border-gray-300 transition-all">
                                                            <span className="font-bebas text-lg md:text-xl text-mountain-slate">{cat}</span>
                                                        </div>
                                                        {isDisabled && (
                                                             <div className="absolute inset-0 flex items-center justify-center">
                                                                 <div className="bg-gray-100 rounded-full p-1"><X className="w-4 h-4 text-gray-500"/></div>
                                                             </div>
                                                        )}
                                                    </label>
                                                );
                                            })}
                                        </div>
                                        {children.length > 0 && (
                                            <div className="flex items-start gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded-lg border border-orange-100">
                                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                                <span>{t('modal.childRestrictionNotice')}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* 2. Adult Personal Information */}
                                    <div className="space-y-4">
                                        <h4 className="font-montserrat font-bold text-base md:text-lg text-mountain-slate flex items-center gap-2 pb-2 border-b border-gray-100">
                                            {t('modal.personalInfo')}
                                        </h4>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">{t('modal.firstName')}</label>
                                                <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trail-orange transition-all text-sm" placeholder="John" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">{t('modal.lastName')}</label>
                                                <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trail-orange transition-all text-sm" placeholder="Doe" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">{t('modal.email')}</label>
                                                <div className="relative">
                                                    <Mail className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                    <input required name="email" value={formData.email} onChange={handleInputChange} type="email" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trail-orange transition-all text-sm" placeholder="john@example.com" />
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">{t('modal.phone')}</label>
                                                <div className="relative">
                                                    <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                    <input required name="phone" value={formData.phone} onChange={handleInputChange} type="tel" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trail-orange transition-all text-sm" placeholder="+62 812..." />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                            <div className="space-y-1 col-span-2 md:col-span-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">{t('modal.age')}</label>
                                                <input required name="age" value={formData.age} onChange={handleInputChange} type="number" min="17" max="99" className="w-full px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trail-orange text-sm" placeholder="25" />
                                            </div>
                                            <div className="space-y-1 col-span-2 md:col-span-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">{t('modal.gender')}</label>
                                                <select required name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trail-orange text-sm">
                                                    <option value="">Select</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1 col-span-2 md:col-span-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">{t('modal.bloodType')}</label>
                                                <select required name="bloodType" value={formData.bloodType} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trail-orange text-sm">
                                                    <option value="">Select</option>
                                                    <option value="A">A</option>
                                                    <option value="B">B</option>
                                                    <option value="AB">AB</option>
                                                    <option value="O">O</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1 col-span-2 md:col-span-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">Size</label>
                                                <select required name="size" value={formData.size} onChange={handleInputChange} className="w-full px-3 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trail-orange text-sm">
                                                    <option value="">Size</option>
                                                    <option value="XS">XS</option>
                                                    <option value="S">S</option>
                                                    <option value="M">M</option>
                                                    <option value="L">L</option>
                                                    <option value="XL">XL</option>
                                                    <option value="XXL">XXL</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase">{t('modal.domicile')}</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                <input required name="domicile" value={formData.domicile} onChange={handleInputChange} type="text" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trail-orange transition-all text-sm" placeholder="e.g. Bandung, Jakarta" />
                                            </div>
                                        </div>

                                        {/* Community Selection */}
                                        <div className="bg-gray-50 p-3 md:p-4 rounded-lg border border-gray-100">
                                            <div className="space-y-2 mb-3">
                                                <label className="text-xs font-bold text-gray-500 uppercase">{t('modal.communityQuestion')}</label>
                                                <div className="flex gap-6">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input 
                                                            type="radio" 
                                                            name="isCommunity" 
                                                            value="yes" 
                                                            checked={isCommunityMember === 'yes'} 
                                                            onChange={(e) => setIsCommunityMember(e.target.value)}
                                                            className="w-4 h-4 text-trail-orange focus:ring-trail-orange border-gray-300"
                                                        />
                                                        <span className="text-sm font-poppins">{t('modal.yes')}</span>
                                                    </label>
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input 
                                                            type="radio" 
                                                            name="isCommunity" 
                                                            value="no" 
                                                            checked={isCommunityMember === 'no'} 
                                                            onChange={(e) => setIsCommunityMember(e.target.value)}
                                                            className="w-4 h-4 text-trail-orange focus:ring-trail-orange border-gray-300"
                                                        />
                                                        <span className="text-sm font-poppins">{t('modal.no')}</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <AnimatePresence>
                                                {isCommunityMember === 'yes' && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: 'auto', opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="space-y-1 pt-2">
                                                            <label className="text-xs font-bold text-gray-500 uppercase">{t('modal.communityName')}</label>
                                                            <div className="relative">
                                                                <Users className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                                                <input name="communityName" value={formData.communityName} onChange={handleInputChange} type="text" className="w-full pl-10 pr-4 py-2.5 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trail-orange transition-all text-sm" placeholder="e.g. Bandung Trail Runners" />
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* 3. FAMILY REGISTRATION SECTION (Dynamic Children) */}
                                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                                            <div>
                                                <h4 className="font-montserrat font-bold text-sm md:text-base text-mountain-slate">{t('modal.familyRegistration')}</h4>
                                                <p className="text-xs text-gray-500 mt-1">{t('modal.familyDesc')}</p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={addChild}
                                                className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-200 text-blue-700 rounded-full text-xs font-bold uppercase hover:bg-blue-50 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                                            >
                                                <Plus className="w-3 h-3" />
                                                {t('modal.addChildBtn')}
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            <AnimatePresence>
                                                {children.map((child, index) => (
                                                    <motion.div
                                                        key={child.id}
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        className="overflow-hidden"
                                                    >
                                                        <div className="bg-white rounded-lg p-4 border border-blue-100 shadow-sm relative group">
                                                             {/* Header & Remove Btn */}
                                                            <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100">
                                                                <h5 className="font-bold text-xs text-blue-800 uppercase tracking-wider">
                                                                    {t('modal.childTitle', { n: index + 1 })}
                                                                </h5>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeChild(child.id)}
                                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 focus:outline-none"
                                                                    aria-label={`Remove child ${index + 1}`}
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </button>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                <div className="space-y-1">
                                                                    <input 
                                                                        placeholder="First Name" 
                                                                        value={child.firstName}
                                                                        onChange={(e) => updateChild(child.id, 'firstName', e.target.value)}
                                                                        className="w-full px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-xs focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                                                                    />
                                                                </div>
                                                                <div className="space-y-1">
                                                                    <input 
                                                                        placeholder="Last Name" 
                                                                        value={child.lastName}
                                                                        onChange={(e) => updateChild(child.id, 'lastName', e.target.value)}
                                                                        className="w-full px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-xs focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                                                                    />
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                                                                 <input 
                                                                    type="number" min="4" max="12" placeholder="Age"
                                                                    value={child.age}
                                                                    onChange={(e) => updateChild(child.id, 'age', e.target.value)}
                                                                    className="w-full px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-xs focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                                                                />
                                                                <select 
                                                                    value={child.gender}
                                                                    onChange={(e) => updateChild(child.id, 'gender', e.target.value)}
                                                                    className="w-full px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-xs focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                                                                >
                                                                    <option value="">Gender</option>
                                                                    <option value="Male">Male</option>
                                                                    <option value="Female">Female</option>
                                                                </select>
                                                                <select 
                                                                    value={child.bloodType}
                                                                    onChange={(e) => updateChild(child.id, 'bloodType', e.target.value)}
                                                                    className="w-full px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-xs focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                                                                >
                                                                    <option value="">Blood</option>
                                                                    <option value="A">A</option>
                                                                    <option value="B">B</option>
                                                                    <option value="AB">AB</option>
                                                                    <option value="O">O</option>
                                                                </select>
                                                                <select 
                                                                    value={child.size}
                                                                    onChange={(e) => updateChild(child.id, 'size', e.target.value)}
                                                                    className="w-full px-3 py-2 bg-gray-50 rounded-md border border-gray-200 text-xs focus:ring-1 focus:ring-blue-400 focus:border-blue-400 focus:outline-none"
                                                                >
                                                                    <option value="">Size</option>
                                                                    <option value="XS">XS</option>
                                                                    <option value="S">S</option>
                                                                    <option value="M">M</option>
                                                                    <option value="L">L</option>
                                                                    <option value="XL">XL</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>
                                        
                                            {children.length > 0 && (
                                                 <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-100 mt-2">
                                                    <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                                                    <p className="text-xs text-yellow-800 font-medium">{t('modal.childSupervisionClause')}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 4. Emergency Contact */}
                                    <div className="space-y-4">
                                        <h4 className="font-montserrat font-bold text-base md:text-lg text-mountain-slate flex items-center gap-2 pb-2 border-b border-gray-100">
                                            {t('modal.emergencyContact')}
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">{t('modal.emergencyName')}</label>
                                                <input required name="emergencyName" value={formData.emergencyName} onChange={handleInputChange} type="text" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trail-orange transition-all text-sm" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-gray-500 uppercase">{t('modal.emergencyPhone')}</label>
                                                <input required name="emergencyPhone" value={formData.emergencyPhone} onChange={handleInputChange} type="tel" className="w-full px-4 py-2.5 bg-gray-50 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-trail-orange transition-all text-sm" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* 5. Payment Information */}
                                    <div className="space-y-4">
                                        <h4 className="font-montserrat font-bold text-base md:text-lg text-mountain-slate flex items-center gap-2 pb-2 border-b border-gray-100">
                                            {t('modal.paymentInfo')}
                                        </h4>
                                        
                                        <div className="bg-summit-gold/10 border border-summit-gold/30 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4">
                                            <div className="bg-white p-2 rounded-lg shrink-0 hidden md:block">
                                                <Ticket className="w-8 h-8 text-summit-gold" />
                                            </div>
                                            <div className="flex-grow">
                                                <p className="text-xs text-mountain-slate font-semibold mb-1">{t('modal.paymentDesc')}</p>
                                                <div className="font-bold text-lg text-mountain-slate">{t('modal.bankName')}</div>
                                                <div className="flex items-center gap-2">
                                                    <div className="font-bebas text-xl tracking-wide">{t('modal.accountNo')}</div>
                                                    <div className="text-xs bg-mountain-slate text-white px-2 py-0.5 rounded">{t('modal.accountHolder')}</div>
                                                </div>
                                            </div>
                                            <div className="shrink-0 text-right">
                                                <div className="text-[10px] font-bold text-gray-500 uppercase">{t('modal.totalPrice')}</div>
                                                <div className="font-bebas text-2xl text-trail-orange">{formatCurrency(getTotalPrice())}</div>
                                                
                                                {children.length > 0 && (
                                                    <div className="flex flex-col gap-0.5 mt-1 border-t border-summit-gold/20 pt-1">
                                                        <div className="text-[10px] text-mountain-slate/70 flex justify-end gap-2">
                                                            <span>{t('modal.adultPrice')}:</span>
                                                            <span className="font-semibold">{formatCurrency(getPriceNumeric(children.length > 0 ? '5K' : selectedCategory))}</span>
                                                        </div>
                                                        <div className="text-[10px] text-mountain-slate/70 flex justify-end gap-2">
                                                            <span>{t('modal.childrenPrice', { n: children.length })}:</span>
                                                            <span className="font-semibold">{formatCurrency(children.length * 150000)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-4 text-center border border-gray-200">
                                             <p className="text-sm text-gray-600">
                                                 {t('modal.uploadDesc')}
                                             </p>
                                        </div>

                                        {/* Waiver Checkbox with Link */}
                                        <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors relative z-10">
                                            <input 
                                                type="checkbox" 
                                                checked={agreedToWaiver}
                                                onChange={(e) => setAgreedToWaiver(e.target.checked)}
                                                className="w-5 h-5 mt-0.5 text-trail-orange border-gray-300 rounded focus:ring-trail-orange shrink-0" 
                                            />
                                            <div className="text-sm text-gray-600">
                                                {t('modal.waiver')}{' '}
                                                <button 
                                                    type="button" 
                                                    onClick={(e) => { e.preventDefault(); setShowTerms(true); }}
                                                    className="text-trail-orange hover:underline font-semibold focus:outline-none focus:ring-2 focus:ring-trail-orange rounded px-1"
                                                >
                                                    ({t('modal.readTerms')})
                                                </button>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="pt-4">
                                        <Button 
                                            className="w-full" 
                                            size="lg" 
                                            icon={!loading && <ArrowRight className="w-5 h-5" aria-hidden="true" />} 
                                            onClick={() => {}} 
                                        >
                                            {loading ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="animate-spin"><Loader className="w-5 h-5" aria-hidden="true" /></div>
                                                    {t('modal.submitting')}
                                                </div>
                                            ) : (
                                                t('modal.btnPay')
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="h-full flex flex-col items-center justify-center text-center py-10"
                            >
                                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
                                    <CheckCircle className="w-12 h-12 text-forest-green" aria-hidden="true" />
                                </div>
                                <h3 id="modal-title" className="font-montserrat font-extrabold text-3xl text-mountain-slate mb-2">
                                    {t('modal.successTitle')}
                                </h3>
                                <p className="font-poppins text-gray-600 max-w-md mb-8">
                                    {t('modal.successDesc')}
                                </p>
                                
                                <Button 
                                    onClick={openWhatsApp}
                                    className="bg-green-500 hover:bg-green-600 text-white w-full max-w-sm mb-4 shadow-lg shadow-green-500/30 border-0"
                                    icon={<Phone className="w-5 h-5" />}
                                >
                                    {t('modal.btnFinalWA')}
                                </Button>

                                <button onClick={closeRegister} className="text-sm text-gray-400 hover:text-mountain-slate underline">
                                    {t('modal.btnClose')}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* T&C Overlay Modal (Nested) */}
            <AnimatePresence>
                {showTerms && (
                    <motion.div
                        className="absolute inset-0 z-[120] bg-white/95 backdrop-blur-xl flex flex-col"
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        {/* Header */}
                        <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white shrink-0">
                            <h3 className="font-montserrat font-bold text-xl text-mountain-slate">{t('modal.termsTitle')}</h3>
                            <button 
                                onClick={() => setShowTerms(false)}
                                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-grow overflow-y-auto p-6 md:p-10 bg-gray-50">
                            <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                                <pre className="font-poppins text-sm text-gray-700 whitespace-pre-line leading-relaxed font-sans">
                                    {t('modal.termsBody')}
                                </pre>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="p-6 border-t border-gray-200 bg-white shrink-0 flex justify-end">
                            <Button 
                                onClick={() => { setAgreedToWaiver(true); setShowTerms(false); }}
                                size="sm"
                                className="shadow-lg"
                            >
                                I Agree & Close
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default RegistrationModal;
