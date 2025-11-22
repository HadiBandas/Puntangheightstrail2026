
import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { useTranslation } from '../../hooks/useTranslation';
import { ASSETS } from '../../constants/assets';
import { Play, Loader } from '../../constants/icons';

const VideoHighlightSection: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation();
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // State to track if video has been triggered to load
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);

  const handlePlayClick = () => {
    setIsVideoLoaded(true);
    setIsPlaying(true);
    // Logic continues in the useEffect or autoPlay prop
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <section ref={ref} className="py-24 bg-[#050a0d] relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-1/4 w-[500px] h-[500px] bg-trail-orange/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-1/4 w-[500px] h-[500px] bg-summit-gold/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={isVisible ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-12"
        >
          <h2 className="font-montserrat font-extrabold text-3xl md:text-5xl text-white mb-4">
            {t('videoHighlight.title')}
          </h2>
          <p className="font-poppins text-gray-400 max-w-2xl mx-auto text-base md:text-lg">
            {t('videoHighlight.subtitle')}
          </p>
        </motion.div>

        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
            className="relative max-w-5xl mx-auto aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10 group bg-black"
        >
            {!isVideoLoaded ? (
                /* --- STATE 1: POSTER IMAGE ONLY (Fast Load) --- */
                <div 
                    className="w-full h-full relative cursor-pointer group/poster"
                    onClick={handlePlayClick}
                >
                    <img 
                        src={ASSETS.hero.poster} 
                        alt="Video Thumbnail" 
                        className="w-full h-full object-cover opacity-80 transition-opacity duration-500 group-hover/poster:opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.3)]"
                        >
                            <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white translate-x-1" />
                        </motion.div>
                    </div>
                    <div className="absolute bottom-6 left-0 right-0 text-center">
                        <span className="text-white/80 text-sm font-poppins tracking-widest uppercase">Click to Watch Trailer</span>
                    </div>
                </div>
            ) : (
                /* --- STATE 2: VIDEO LOADED (After Click) --- */
                <>
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        poster={ASSETS.hero.poster}
                        playsInline
                        loop
                        autoPlay // AutoPlay because user explicitly clicked to watch
                        preload="metadata"
                        onWaiting={() => setIsBuffering(true)}
                        onPlaying={() => setIsBuffering(false)}
                        onClick={togglePlay}
                    >
                        <source src={ASSETS.highlightVideo} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                    
                    {/* Loading Spinner (Buffering) */}
                    {isBuffering && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
                            <Loader className="w-12 h-12 text-white animate-spin" />
                        </div>
                    )}

                    {/* Play/Pause Overlay (Only shows when paused or hovering) */}
                    <div 
                        className={`absolute inset-0 flex items-center justify-center bg-black/40 transition-all duration-300 cursor-pointer ${isPlaying ? 'opacity-0 hover:opacity-100' : 'opacity-100'}`}
                        onClick={togglePlay}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-20 h-20 md:w-24 md:h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_30px_rgba(0,0,0,0.3)] group/btn"
                        >
                            {isPlaying ? (
                                // Pause Icon Custom
                                <div className="flex gap-2">
                                    <div className="w-2 h-8 bg-white rounded-full" />
                                    <div className="w-2 h-8 bg-white rounded-full" />
                                </div>
                            ) : (
                                <Play className="w-8 h-8 md:w-10 md:h-10 text-white fill-white translate-x-1 group-hover/btn:text-trail-orange group-hover/btn:fill-trail-orange transition-colors" />
                            )}
                        </motion.div>
                    </div>
                </>
            )}
        </motion.div>
      </div>
    </section>
  );
};

export default VideoHighlightSection;
