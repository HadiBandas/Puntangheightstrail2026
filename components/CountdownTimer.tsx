
import React from 'react';
import { motion } from 'framer-motion';
import useCountdown from '../hooks/useCountdown';
import { useTranslation } from '../hooks/useTranslation';

interface CountdownTimerProps {
  targetDate: string;
}

const TimeBox: React.FC<{ value: number; label: string }> = ({ value, label }) => (
    <motion.div
        className="flex flex-col items-center w-full"
        whileHover={{ scale: 1.05 }}
    >
        <div className="relative w-full">
            <div className="bg-white/10 backdrop-blur-md p-3 sm:p-6 rounded-2xl shadow-lg w-full sm:w-32 aspect-square flex items-center justify-center">
                <div className="font-bebas text-4xl sm:text-7xl text-white text-center leading-none">
                    {String(value).padStart(2, '0')}
                </div>
            </div>
            <div className="absolute inset-0 bg-white/10 rounded-2xl blur-lg opacity-50 -z-10" />
        </div>
        <span className="font-poppins text-xs sm:text-sm text-white/80 mt-2 sm:mt-3 uppercase tracking-wider">
            {label}
        </span>
    </motion.div>
);


const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const timeLeft = useCountdown(targetDate);
  const { t } = useTranslation();

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-8 justify-center w-full max-w-4xl mx-auto">
      <TimeBox value={timeLeft.days} label={t('countdown.days')} />
      <TimeBox value={timeLeft.hours} label={t('countdown.hours')} />
      <TimeBox value={timeLeft.minutes} label={t('countdown.minutes')} />
      <TimeBox value={timeLeft.seconds} label={t('countdown.seconds')} />
    </div>
  );
};

export default CountdownTimer;
