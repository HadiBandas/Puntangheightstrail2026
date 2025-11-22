
import { useState, useEffect } from 'react';
import { useSpring } from 'framer-motion';

const useScrollProgress = () => {
  const [readingProgress, setReadingProgress] = useState(0);
  const scrollProgress = useSpring(readingProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    const updateScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if(scrollableHeight > 0) {
        setReadingProgress(window.scrollY / scrollableHeight);
      } else {
        setReadingProgress(0);
      }
    };
    
    window.addEventListener("scroll", updateScroll);
    
    return () => {
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);
  
  return scrollProgress;
};

export default useScrollProgress;
