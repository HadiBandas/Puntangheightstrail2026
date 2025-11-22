
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../contexts/ToastContext';
import { X, CheckCircle, AlertTriangle } from '../../constants/icons';

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-[110] flex flex-col gap-2 items-end pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="pointer-events-auto min-w-[300px]"
          >
            <div className={`relative overflow-hidden rounded-xl shadow-lg border p-4 pr-10 backdrop-blur-sm
              ${toast.type === 'success' ? 'bg-white border-green-100' : 
                toast.type === 'error' ? 'bg-white border-red-100' : 'bg-white border-blue-100'}`
            }>
                {/* Color Accent */}
                <div className={`absolute left-0 top-0 bottom-0 w-1.5 
                  ${toast.type === 'success' ? 'bg-forest-green' : 
                    toast.type === 'error' ? 'bg-red-500' : 'bg-sky-blue'}`} 
                />

                <div className="flex items-center gap-3">
                    {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-forest-green" />}
                    {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                    {toast.type === 'info' && <div className="w-5 h-5 rounded-full bg-sky-blue" />}
                    
                    <div>
                        <h4 className={`font-bold text-sm 
                           ${toast.type === 'success' ? 'text-forest-green' : 
                             toast.type === 'error' ? 'text-red-600' : 'text-sky-blue'}`}>
                            {toast.type === 'success' ? 'Success' : toast.type === 'error' ? 'Error' : 'Info'}
                        </h4>
                        <p className="text-xs text-gray-600 font-poppins mt-0.5">{toast.message}</p>
                    </div>
                </div>

                <button 
                  onClick={() => removeToast(toast.id)}
                  className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
