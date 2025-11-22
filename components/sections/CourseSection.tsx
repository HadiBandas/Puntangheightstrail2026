
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useScrollAnimation from '../../hooks/useScrollAnimation';
import { useTranslation } from '../../hooks/useTranslation';
import { Mountain, TrendingUp, MapPin, Clock, Droplet, Footprints, Flag, X, Camera, AlertTriangle } from '../../constants/icons';

// --- Types & Interfaces ---

interface DataPoint {
  km: number;
  ele: number;
}

interface Landmark {
  km: number;
  label: string;
  description?: string;
  align?: 'start' | 'middle' | 'end';
  image?: string;
}

type TerrainType = 'runnable' | 'technical' | 'steep';

interface TerrainSegment {
    startKm: number;
    endKm: number;
    type: TerrainType;
}

interface CourseCategoryData {
    id: '5K' | '10K' | '21K';
    title: string;
    description: string;
    gain: string;
    cot: string;
    ws: number;
    surface: string;
    color: string;
    data: DataPoint[];
    landmarks: Landmark[];
    highlights: string[];
    terrainSegments: TerrainSegment[];
}

// --- Constants ---

const TERRAIN_CONFIG: Record<TerrainType, { color: string; label: string }> = {
    runnable: { color: '#059669', label: 'Runnable' }, // Emerald 600 - High contrast green
    technical: { color: '#D97706', label: 'Technical' }, // Amber 600 - Distinct orange/yellow
    steep: { color: '#DC2626', label: 'Steep/Scree' }   // Red 600 - Sharp warning red
};

// Landmark Images
const LANDMARK_IMAGES = {
    start: "https://images.unsplash.com/photo-1533561052669-d61518fc98a8?q=80&w=800&auto=format&fit=crop",
    ruins: "https://images.unsplash.com/photo-1599940824399-b87987ce0799?q=80&w=800&auto=format&fit=crop", 
    finish: "https://images.unsplash.com/photo-1452626038306-9aaff5e0ac69?q=80&w=800&auto=format&fit=crop",
    pine: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=800&auto=format&fit=crop",
    river: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format&fit=crop",
    peak: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&auto=format&fit=crop",
    waterfall: "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?q=80&w=800&auto=format&fit=crop"
};

// Mock Elevation Data
const COURSE_DATA: Record<string, DataPoint[]> = {
    '5K': [
        { km: 0, ele: 1300 }, { km: 1, ele: 1350 }, { km: 2, ele: 1400 }, 
        { km: 2.5, ele: 1420 }, { km: 3, ele: 1380 }, { km: 4, ele: 1340 }, { km: 5, ele: 1300 }
    ],
    '10K': [
        { km: 0, ele: 1300 }, { km: 2, ele: 1500 }, { km: 4, ele: 1650 }, 
        { km: 5, ele: 1600 }, { km: 7, ele: 1450 }, { km: 8.5, ele: 1400 }, { km: 10, ele: 1300 }
    ],
    '21K': [
        { km: 0, ele: 1300 }, { km: 1, ele: 1350 }, { km: 2, ele: 1450 }, { km: 3, ele: 1600 }, 
        { km: 4, ele: 1750 }, { km: 5, ele: 1800 }, { km: 6, ele: 1900 }, { km: 7, ele: 2100 }, 
        { km: 8, ele: 2223 }, { km: 9, ele: 2100 }, { km: 10, ele: 2000 }, { km: 11, ele: 1850 }, 
        { km: 13, ele: 1700 }, { km: 16, ele: 1500 }, { km: 19, ele: 1400 }, { km: 21, ele: 1300 }
    ]
};

// --- Components ---

const InteractiveElevationChart: React.FC<{ 
  data: DataPoint[]; 
  landmarks: Landmark[]; 
  terrainSegments: TerrainSegment[];
  color: string;
  totalDistance: number;
}> = ({ data, landmarks, terrainSegments, color, totalDistance }) => {
    const [hoverData, setHoverData] = useState<{x: number, km: number, ele: number} | null>(null);
    const [hoveredLandmark, setHoveredLandmark] = useState<Landmark | null>(null);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    
    const chartRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Chart Dimensions & Scales
    const height = 500; 
    const width = 1000; 
    const padding = { top: 80, bottom: 60, left: 0, right: 0 };
    const chartHeight = height - padding.top - padding.bottom;

    const maxElev = Math.max(...data.map(d => d.ele));
    const minElev = Math.min(...data.map(d => d.ele));
    const elevRange = (maxElev - minElev) * 1.2; 
    const baseElev = minElev - (elevRange * 0.1);

    const getX = (km: number) => (km / totalDistance) * width;
    const getY = (ele: number) => height - padding.bottom - ((ele - baseElev) / elevRange) * chartHeight;

    // Calculate full area path for the gradient fill
    const areaD = useMemo(() => {
         if (data.length === 0) return "";
         const sorted = [...data].sort((a, b) => a.km - b.km);
         const points = sorted.map(d => `${getX(d.km).toFixed(1)},${getY(d.ele).toFixed(1)}`).join(" L ");
         const lastX = getX(sorted[sorted.length - 1].km);
         const startX = getX(sorted[0].km);
         return `M ${points} L ${lastX.toFixed(1)},${height} L ${startX.toFixed(1)},${height} Z`;
    }, [data, totalDistance, height, minElev, elevRange]);

    // Helper to get interpolated elevation at any KM
    const getElevationAtKm = (km: number) => {
        const sorted = [...data].sort((a, b) => a.km - b.km);
        if (km <= sorted[0].km) return sorted[0].ele;
        if (km >= sorted[sorted.length - 1].km) return sorted[sorted.length - 1].ele;
    
        let p1 = sorted[0];
        let p2 = sorted[sorted.length - 1];
    
        for (let i = 0; i < sorted.length - 1; i++) {
            if (km >= sorted[i].km && km <= sorted[i+1].km) {
                p1 = sorted[i];
                p2 = sorted[i+1];
                break;
            }
        }
    
        const segmentLength = p2.km - p1.km;
        const ratio = segmentLength === 0 ? 0 : (km - p1.km) / segmentLength;
        return p1.ele + (p2.ele - p1.ele) * ratio;
    };

    // Generate terrain-colored strokes dynamically based on TerrainType
    const terrainPaths = useMemo(() => {
        return terrainSegments.map((segment, index) => {
            const { startKm, endKm, type } = segment;
            
            // Filter points that fall within this segment
            const segmentPoints = data.filter(d => d.km >= startKm && d.km <= endKm);
            
            // Add start boundary point if missing to ensure continuity
            if (!segmentPoints.find(p => Math.abs(p.km - startKm) < 0.01)) {
                segmentPoints.unshift({ km: startKm, ele: getElevationAtKm(startKm) });
            }
            // Add end boundary point if missing
            if (!segmentPoints.find(p => Math.abs(p.km - endKm) < 0.01)) {
                segmentPoints.push({ km: endKm, ele: getElevationAtKm(endKm) });
            }

            // Ensure sorting after insertion
            segmentPoints.sort((a, b) => a.km - b.km);

            const d = segmentPoints.length > 0 
                ? `M ${segmentPoints.map(p => `${getX(p.km).toFixed(1)},${getY(p.ele).toFixed(1)}`).join(" L ")}`
                : "";
            
            return { d, color: TERRAIN_CONFIG[type].color, type };
        });
    }, [data, terrainSegments, totalDistance, minElev, elevRange]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
        if (!chartRef.current || hoveredLandmark) return;
        const rect = chartRef.current.getBoundingClientRect();
        let clientX;
        
        if ('touches' in e) {
             clientX = e.touches[0].clientX;
        } else {
             clientX = e.clientX;
        }

        const x = clientX - rect.left;
        const relativeX = Math.min(Math.max(0, x), rect.width);
        
        const km = (relativeX / rect.width) * totalDistance;
        const ele = getElevationAtKm(km);

        setHoverData({ x: relativeX, km, ele });
    };

    // Interaction Handlers with Delay logic
    const handleMarkerEnter = (lm: Landmark) => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
        setHoveredLandmark(lm);
        setHoverData(null);
    };

    const handleMarkerLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setHoveredLandmark(null);
        }, 300); // 300ms delay to allow moving to popup
    };

    const handlePopupEnter = () => {
        if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    };

    const handlePopupLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setHoveredLandmark(null);
        }, 300);
    };

    // Landmark HTML Overlay Positions
    const getLandmarkStyle = (km: number, align: string = 'middle') => {
        const left = (km / totalDistance) * 100;
        let transform = 'translateX(-50%)';
        if (align === 'start') transform = 'translateX(0%)';
        if (align === 'end') transform = 'translateX(-100%)';
        
        return { left: `${left}%`, transform };
    };

    return (
        <>
        <div 
            className="w-full h-full min-h-[350px] md:min-h-[400px] relative select-none touch-none cursor-crosshair group rounded-3xl overflow-hidden"
            ref={chartRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setHoverData(null)}
            onTouchMove={handleMouseMove}
            onTouchEnd={() => setHoverData(null)}
        >
            {/* Topographic Pattern Background Overlay */}
            <div className="absolute inset-0 opacity-5 pointer-events-none topographic"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50/50 to-gray-100/50 pointer-events-none"></div>

            <svg 
                viewBox={`0 0 ${width} ${height}`} 
                className="w-full h-full relative z-10" 
                preserveAspectRatio="none" 
                role="img"
                aria-label={`Elevation chart for ${totalDistance}km course. Elevation ranges from ${Math.round(minElev)}m to ${Math.round(maxElev)}m.`}
            >
                <title>Course Elevation Profile</title>
                <desc>A chart showing the elevation profile of the race course, including terrain types and landmarks.</desc>
                <defs>
                    <linearGradient id={`fillGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
                        <stop offset="100%" stopColor={color} stopOpacity="0.05"/>
                    </linearGradient>
                    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="rgba(0,0,0,0.15)"/>
                    </filter>
                </defs>

                {/* Grid Lines - Subtle */}
                <line x1="0" y1={height - padding.bottom} x2={width} y2={height - padding.bottom} stroke="#e5e7eb" strokeWidth="1" />
                <line x1="0" y1={height - padding.bottom - chartHeight/2} x2={width} y2={height - padding.bottom - chartHeight/2} stroke="#e5e7eb" strokeWidth="1" strokeDasharray="6 6" />
                
                {/* Area Fill - Uses Main Theme Color */}
                <path d={areaD} fill={`url(#fillGradient-${color})`} />

                {/* Terrain Segments - Color Coded Strokes */}
                {terrainPaths.map((path, i) => (
                    <path 
                        key={i} 
                        d={path.d} 
                        fill="none" 
                        stroke={path.color} 
                        strokeWidth="4" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        filter="url(#shadow)" 
                    />
                ))}

                {/* Hover Crosshair */}
                {hoverData && !hoveredLandmark && (
                    <g>
                        <line 
                            x1={getX(hoverData.km)} y1={padding.top} 
                            x2={getX(hoverData.km)} y2={height - padding.bottom} 
                            stroke={color} strokeWidth="2" 
                        />
                        <circle 
                            cx={getX(hoverData.km)} cy={getY(hoverData.ele)} 
                            r="6" fill="white" stroke={color} strokeWidth="3" 
                        />
                    </g>
                )}
            </svg>

            {/* Terrain Legend - Integrated into Top Right (Desktop) / Bottom Center (Mobile) */}
            <div className="
                absolute z-20 bg-white/90 backdrop-blur-md border border-gray-100 shadow-sm pointer-events-none
                
                /* Mobile Layout: Horizontal pill at bottom */
                bottom-4 left-1/2 -translate-x-1/2 flex flex-row items-center gap-3 px-3 py-1.5 rounded-full w-max max-w-[95%]
                
                /* Desktop Layout: Vertical box at top right */
                md:top-6 md:right-6 md:bottom-auto md:left-auto md:translate-x-0 md:flex-col md:items-start md:gap-2 md:px-3 md:py-3 md:rounded-xl md:w-auto
            ">
                 <div className="hidden md:block text-[9px] uppercase font-bold text-gray-400 tracking-wider mb-1">Terrain Guide</div>
                 {Object.entries(TERRAIN_CONFIG).map(([key, config]) => (
                     <div key={key} className="flex items-center gap-1.5 md:gap-2">
                         <div className="w-2.5 h-2.5 md:w-4 md:h-1 rounded-full md:rounded-sm" style={{ backgroundColor: config.color }}></div>
                         <span className="text-[9px] md:text-[10px] font-poppins text-gray-600 font-medium whitespace-nowrap">{config.label}</span>
                     </div>
                 ))}
            </div>

            {/* HTML Overlay Landmarks */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                 {landmarks.map((lm, i) => (
                    <button 
                        key={i}
                        // Changed to bottom-16 (approx 64px) to ensure label clears the bottom legend
                        className="absolute bottom-16 pointer-events-auto flex flex-col items-center group/marker focus:outline-none"
                        style={getLandmarkStyle(lm.km, lm.align)}
                        onMouseEnter={() => handleMarkerEnter(lm)}
                        onMouseLeave={handleMarkerLeave}
                        onFocus={() => handleMarkerEnter(lm)}
                        onBlur={handleMarkerLeave}
                        aria-label={`Landmark: ${lm.label} at ${lm.km} km`}
                        aria-haspopup="true"
                        aria-expanded={hoveredLandmark === lm}
                        aria-controls={hoveredLandmark === lm ? "landmark-tooltip" : undefined}
                    >
                        {/* Vertical Dashed Line */}
                        <div 
                            className={`w-px border-l border-dashed h-16 md:h-32 mb-2 transition-opacity duration-300 ${hoveredLandmark === lm ? 'opacity-60' : 'opacity-0'}`}
                            style={{ borderColor: color }}
                        ></div>

                        {/* Dot */}
                        <div 
                            className={`w-3 h-3 md:w-4 md:h-4 bg-white rounded-full border-2 transition-all duration-300 shadow-sm ${hoveredLandmark === lm ? 'scale-125 border-4' : 'scale-100'}`}
                            style={{ borderColor: color }}
                        ></div>

                        {/* Label */}
                        <div className={`mt-2 text-[10px] md:text-xs font-bebas tracking-wide text-mountain-slate transition-all duration-300 whitespace-nowrap ${hoveredLandmark === lm ? 'opacity-100 scale-110 font-bold' : 'opacity-60 hidden md:block'}`}>
                            {lm.label}
                        </div>

                        {/* Invisible Hit Area */}
                        <div className="absolute bottom-0 w-8 h-32 md:h-48 bg-transparent"></div>
                    </button>
                 ))}
            </div>


            {/* Hover Floating Tooltip */}
            {hoverData && !hoveredLandmark && (
                <div 
                    className="absolute top-8 bg-white/90 backdrop-blur-md text-mountain-slate px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-lg border border-gray-100 pointer-events-none z-20 flex gap-4 transform -translate-x-1/2"
                    style={{ left: `${(hoverData.km / totalDistance) * 100}%` }}
                    aria-hidden="true"
                >
                     <div className="text-center">
                        <div className="text-[9px] md:text-[10px] uppercase text-gray-400 font-bold tracking-wider">Dist</div>
                        <div className="font-bebas text-lg md:text-xl leading-none">{hoverData.km.toFixed(1)}<span className="text-xs text-gray-500 ml-0.5">km</span></div>
                     </div>
                     <div className="w-[1px] bg-gray-200"></div>
                     <div className="text-center">
                        <div className="text-[9px] md:text-[10px] uppercase text-gray-400 font-bold tracking-wider">Elev</div>
                        <div className="font-bebas text-lg md:text-xl leading-none" style={{ color: color }}>{Math.round(hoverData.ele)}<span className="text-xs text-gray-500 ml-0.5">m</span></div>
                     </div>
                </div>
            )}

            {/* Rich Media Landmark Popup */}
            <AnimatePresence>
                {hoveredLandmark && (
                    <motion.div
                        id="landmark-tooltip"
                        initial={{ opacity: 0, scale: 0.95, y: 10, x: hoveredLandmark.align === 'start' ? '0%' : hoveredLandmark.align === 'end' ? '-100%' : '-50%' }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: hoveredLandmark.align === 'start' ? '0%' : hoveredLandmark.align === 'end' ? '-100%' : '-50%' }}
                        exit={{ opacity: 0, scale: 0.95, y: 10, x: hoveredLandmark.align === 'start' ? '0%' : hoveredLandmark.align === 'end' ? '-100%' : '-50%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                        className="absolute z-30 bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.2)] w-60 md:w-80 pointer-events-auto overflow-hidden ring-1 ring-black/5 group/popup flex flex-col"
                        style={{
                            left: `${(hoveredLandmark.km / totalDistance) * 100}%`,
                            bottom: '60px',
                        }}
                        onMouseEnter={handlePopupEnter}
                        onMouseLeave={handlePopupLeave}
                        role="tooltip"
                    >
                        {/* Image Section */}
                        <button 
                            className="relative h-28 md:h-40 w-full cursor-pointer overflow-hidden group/image focus:outline-none shrink-0"
                            onClick={() => setLightboxImage(hoveredLandmark.image || null)}
                            aria-label={`View image for ${hoveredLandmark.label}`}
                        >
                            <img 
                                src={hoveredLandmark.image || LANDMARK_IMAGES.start} 
                                className="w-full h-full object-cover transition-transform duration-700 group-hover/image:scale-110" 
                                alt="" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                            
                            {/* Hover Overlay with Zoom Icon */}
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                                </div>
                            </div>

                            {/* KM Badge */}
                            <div className="absolute top-3 left-3 pointer-events-none">
                                <div className="bg-black/30 backdrop-blur-md border border-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1">
                                    <MapPin className="w-2.5 h-2.5 text-white" aria-hidden="true" />
                                    KM {hoveredLandmark.km}
                                </div>
                            </div>
                        </button>
                        
                        {/* Content Section */}
                        <div className="p-3 md:p-4 bg-white" role="status" aria-live="polite">
                            <div className="flex justify-between items-start mb-1 md:mb-2">
                                <h4 className="font-montserrat font-bold text-sm md:text-lg text-mountain-slate leading-tight">{hoveredLandmark.label}</h4>
                                <div className="flex flex-col items-end shrink-0 ml-2">
                                    <span className="text-[9px] font-bold uppercase text-gray-400" aria-hidden="true">Elev</span>
                                    <span className="font-bebas text-base md:text-lg text-trail-orange leading-none">{Math.round(getElevationAtKm(hoveredLandmark.km))}m</span>
                                </div>
                            </div>
                            <p className="text-[10px] md:text-xs text-gray-600 font-poppins leading-relaxed line-clamp-3">
                                {hoveredLandmark.description || "A key checkpoint on your journey to the summit."}
                            </p>
                            
                            <div className="mt-2 pt-2 md:mt-3 md:pt-3 border-t border-gray-100 flex items-center gap-1.5 text-[9px] md:text-[10px] text-gray-400 font-semibold uppercase tracking-wider" aria-hidden="true">
                                <Camera className="w-3 h-3" />
                                <span>Click photo to enlarge</span>
                            </div>
                        </div>
                        
                        {/* Arrow */}
                        <div 
                            className={`absolute -bottom-2 w-4 h-4 bg-white transform rotate-45 ${
                                hoveredLandmark.align === 'start' ? 'left-8' : 
                                hoveredLandmark.align === 'end' ? 'right-8' : 
                                'left-1/2 -translate-x-1/2'
                            }`}
                            aria-hidden="true"
                        ></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>

        {/* LIGHTBOX MODAL */}
        <AnimatePresence>
            {lightboxImage && (
                <motion.div 
                    className="fixed inset-0 z-[150] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setLightboxImage(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Landmark image details"
                >
                    <motion.button 
                        className="absolute top-4 right-4 md:top-8 md:right-8 text-white hover:text-trail-orange transition-colors p-2 focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                        onClick={() => setLightboxImage(null)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label="Close image"
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
                            src={lightboxImage} 
                            alt="Landmark Zoom" 
                            className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl border border-white/10" 
                            />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
        </>
    );
};

const CourseSection: React.FC = () => {
  const [ref, isVisible] = useScrollAnimation();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'5K' | '10K' | '21K'>('21K');

  const courseDetails: Record<string, CourseCategoryData> = {
      '5K': {
          id: '5K',
          title: t('categories.cat1Title'),
          description: t('course.desc5k'),
          gain: '250m',
          cot: '2 Hours',
          ws: 2,
          surface: '70% Runnable',
          color: '#24A392', // Forest Green
          data: COURSE_DATA['5K'],
          highlights: [t('categories.cat1Feat1'), t('categories.cat1Feat2'), t('categories.cat1Feat3')],
          landmarks: [
              { km: 0, label: 'Start Bougenville', align: 'start', image: LANDMARK_IMAGES.start, description: t('course.lmStartDesc') },
              { km: 2.5, label: 'Radio Malabar', align: 'middle', image: LANDMARK_IMAGES.ruins, description: t('course.lmRuinsDesc') },
              { km: 5, label: 'Finish Line', align: 'end', image: LANDMARK_IMAGES.finish, description: t('course.lmFinishDesc') }
          ],
          terrainSegments: [
              { startKm: 0, endKm: 5, type: 'runnable' }
          ]
      },
      '10K': {
          id: '10K',
          title: t('categories.cat2Title'),
          description: t('course.desc10k'),
          gain: '650m',
          cot: '4 Hours',
          ws: 4,
          surface: 'Trail & River',
          color: '#3498DB', // Sky Blue
          data: COURSE_DATA['10K'],
          highlights: [t('categories.cat2Feat1'), t('categories.cat2Feat2'), t('categories.cat2Feat3')],
          landmarks: [
              { km: 0, label: 'Start Bougenville', align: 'start', image: LANDMARK_IMAGES.start, description: t('course.lmStartDesc') },
              { km: 4, label: 'Pine Forest', align: 'middle', image: LANDMARK_IMAGES.pine, description: t('course.lmPineDesc') },
              { km: 7, label: 'River Crossing', align: 'middle', image: LANDMARK_IMAGES.river, description: t('course.lmRiverDesc') },
              { km: 10, label: 'Finish Line', align: 'end', image: LANDMARK_IMAGES.finish, description: t('course.lmFinishDesc') }
          ],
          terrainSegments: [
            { startKm: 0, endKm: 4, type: 'runnable' },
            { startKm: 4, endKm: 7, type: 'technical' },
            { startKm: 7, endKm: 10, type: 'runnable' },
          ]
      },
      '21K': {
          id: '21K',
          title: t('categories.cat3Title'),
          description: t('course.desc21k'),
          gain: '1417m',
          cot: '10 Hours',
          ws: 7,
          surface: 'Technical / Scree',
          color: '#F57A2A', // Trail Orange
          data: COURSE_DATA['21K'],
          highlights: [t('categories.cat3Feat1'), t('categories.cat3Feat2'), t('categories.cat3Feat3')],
          landmarks: [
              { km: 0, label: 'Start Bougenville', align: 'start', image: LANDMARK_IMAGES.start, description: t('course.lmStartDesc') },
              { km: 8, label: 'Puncak Mega', align: 'middle', image: LANDMARK_IMAGES.peak, description: t('course.lmPeakDesc') },
              { km: 13, label: 'Curug Siliwangi', align: 'middle', image: LANDMARK_IMAGES.waterfall, description: t('course.lmWaterfallDesc') },
              { km: 21, label: 'Finish Line', align: 'end', image: LANDMARK_IMAGES.finish, description: t('course.lmFinishDesc') }
          ],
          terrainSegments: [
              { startKm: 0, endKm: 6, type: 'runnable' },
              { startKm: 6, endKm: 9, type: 'steep' }, // The summit attack
              { startKm: 9, endKm: 13, type: 'technical' }, // Descent
              { startKm: 13, endKm: 21, type: 'runnable' },
          ]
      }
  };

  const activeData = courseDetails[activeTab];

  return (
    <section id="course" ref={ref} className="py-16 md:py-24 bg-light-gray relative overflow-hidden" aria-labelledby="course-title">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-100 to-transparent opacity-50 pointer-events-none" aria-hidden="true"></div>

      <div className="container mx-auto px-4 md:px-6 relative z-10">
        
        {/* Section Header */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={isVisible ? { opacity: 1, y: 0 } : {}} 
            transition={{ duration: 0.5 }} 
            className="text-center mb-8 md:mb-12"
        >
          <h2 id="course-title" className="font-montserrat font-extrabold text-4xl md:text-5xl text-mountain-slate mb-4">
            {t('course.title')}
          </h2>
          <p className="font-poppins text-base md:text-lg text-gray-500 max-w-3xl mx-auto">
            {t('course.subtitle')}
          </p>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-start md:justify-center mb-8 md:mb-10 overflow-x-auto px-1 py-2 no-scrollbar">
            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full shadow-xl border border-white/50 inline-flex relative z-20 min-w-max" role="tablist" aria-label="Course distances">
                {(['5K', '10K', '21K'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        role="tab"
                        aria-selected={activeTab === tab}
                        aria-controls={`panel-${tab}`}
                        id={`tab-${tab}`}
                        className={`relative px-6 py-2 md:px-8 md:py-3 rounded-full font-bebas text-lg md:text-xl tracking-wide transition-all duration-300 z-10 focus:outline-none focus:ring-2 focus:ring-trail-orange ${
                            activeTab === tab 
                            ? 'text-white shadow-lg' 
                            : 'text-gray-400 hover:text-mountain-slate'
                        }`}
                    >
                        {activeTab === tab && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute inset-0 rounded-full"
                                style={{ backgroundColor: courseDetails[tab].color }}
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        <span className="relative z-10">{tab}</span>
                    </button>
                ))}
            </div>
        </div>

        {/* SPLIT CARDS LAYOUT */}
        <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 max-w-7xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            role="tabpanel"
            id={`panel-${activeTab}`}
            aria-labelledby={`tab-${activeTab}`}
        >
            <AnimatePresence mode="wait">
                 {/* 1. LEFT CARD: CHART (2 Columns wide) */}
                 <motion.div 
                    key={`chart-${activeTab}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="lg:col-span-2 bg-white rounded-[32px] shadow-xl border border-gray-100 overflow-hidden min-h-[350px] md:min-h-[500px] relative"
                 >
                     {/* Header inside Chart Card */}
                     <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20 pointer-events-none">
                        <h3 className="font-montserrat font-bold text-xl md:text-3xl text-mountain-slate mb-1">
                            {activeData.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] md:text-sm font-medium text-gray-500 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 w-fit border border-gray-100 shadow-sm">
                            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeData.color }}></span>
                            Interactive Profile
                        </div>
                     </div>

                     <div className="w-full h-full">
                        <InteractiveElevationChart 
                            data={activeData.data} 
                            landmarks={activeData.landmarks} 
                            terrainSegments={activeData.terrainSegments}
                            color={activeData.color} 
                            totalDistance={activeTab === '5K' ? 5 : activeTab === '10K' ? 10 : 21}
                        />
                     </div>
                 </motion.div>

                 {/* 2. RIGHT CARD: INFO (1 Column wide) */}
                 <motion.div 
                     key={`info-${activeTab}`}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     transition={{ duration: 0.4, delay: 0.1 }}
                     className="lg:col-span-1 bg-white rounded-[32px] shadow-xl border border-gray-100 p-6 md:p-8 flex flex-col h-full"
                 >
                     {/* Description */}
                     <div className="mb-6 md:mb-8">
                        <h4 className="font-bebas text-lg md:text-xl text-gray-300 mb-3 flex items-center gap-2">
                            <Mountain className="w-5 h-5" aria-hidden="true" /> Route Briefing
                        </h4>
                        <p className="font-poppins text-mountain-slate/80 leading-relaxed text-sm">
                            {activeData.description}
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="mb-6 md:mb-8 bg-gray-50/50 rounded-2xl p-4 md:p-5 border border-gray-100">
                        <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                            <div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase mb-1">
                                    <TrendingUp className="w-3 h-3" aria-hidden="true" /> {t('course.gain')}
                                </div>
                                <div className="font-bebas text-xl md:text-2xl text-mountain-slate">{activeData.gain}</div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase mb-1">
                                    <Clock className="w-3 h-3" aria-hidden="true" /> {t('course.cot')}
                                </div>
                                <div className="font-bebas text-xl md:text-2xl text-mountain-slate">{activeData.cot}</div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase mb-1">
                                    <Droplet className="w-3 h-3" aria-hidden="true" /> {t('course.ws')}
                                </div>
                                <div className="font-bebas text-xl md:text-2xl text-mountain-slate">{activeData.ws} Points</div>
                            </div>
                            <div>
                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase mb-1">
                                    <Footprints className="w-3 h-3" aria-hidden="true" /> Surface
                                </div>
                                <div className="font-poppins text-xs font-bold text-mountain-slate">{activeData.surface}</div>
                            </div>
                        </div>
                    </div>

                    {/* Highlights */}
                    <div className="mt-auto">
                         <h4 className="font-bebas text-lg md:text-xl text-gray-300 mb-4 flex items-center gap-2">
                            <Flag className="w-5 h-5" aria-hidden="true" /> Highlights
                        </h4>
                        <ul className="space-y-3 md:space-y-4">
                            {activeData.highlights.map((highlight, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-sm text-gray-600 font-poppins">
                                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: activeData.color }} aria-hidden="true"></div>
                                    {highlight}
                                </li>
                            ))}
                        </ul>
                    </div>
                 </motion.div>
            </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
};

export default CourseSection;
