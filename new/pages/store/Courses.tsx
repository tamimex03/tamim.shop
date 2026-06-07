import React from 'react';
import { useStore } from '../../store/StoreContext';
import { motion } from 'motion/react';
import { Star, PlayCircle, Plus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Courses = () => {
  const { courses, promoCodes } = useStore();

  if (courses.length === 0) {
    return <div className="text-center py-24 text-gray-500">No services available at the moment.</div>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course, idx) => {
        const coursePromo = promoCodes.find(p => 
          p.applicability === 'all' || 
          (p.applicability === 'specific' && p.targetIds?.includes(course.id))
        );

        return (
          <Link to={`/store/shop/${course.id}`} key={course.id}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white border text-left border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-red-500/5 transition-all group flex flex-col h-full"
            >
              <div 
                className="aspect-video bg-gray-900 relative flex items-center justify-center p-6 bg-cover bg-center"
                style={{ backgroundImage: `url(${course.imageUrl})` }}
              >
                <div className="absolute inset-0 bg-gray-900/40 group-hover:bg-gray-900/20 transition-all duration-500"></div>
                {course.discountText && (
                  <div className="absolute top-4 right-4 z-20">
                    <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg block tracking-wide uppercase">
                      {course.discountText}
                    </span>
                  </div>
                )}
                {coursePromo && (
                  <div className="absolute top-4 left-4 z-20">
                    <span className="bg-red-600 text-white font-bold text-[10px] sm:text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                      Use code <span className="font-mono bg-white/20 px-1 py-0.5 rounded text-white">{coursePromo.code}</span> for {coursePromo.type === 'percent' ? `${coursePromo.value}%` : `৳${coursePromo.value}`} OFF!
                    </span>
                  </div>
                )}
                <PlayCircle className="w-16 h-16 text-white/90 drop-shadow-lg group-hover:text-red-500 group-hover:scale-110 transition-all relative z-10" />
                <div className="absolute bottom-4 right-4 z-10 bg-gray-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold font-mono">
                  ★ {Number(course.rating || 0).toFixed(1)}
                </div>
              </div>
            
            <div className="p-6 flex-grow flex flex-col">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
              <p className="text-gray-600 text-sm mb-4 flex-grow line-clamp-3">{course.description}</p>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-6 text-xs text-gray-600">
                <span className="font-semibold text-gray-900 mb-1 block">Syllabus Highlights:</span>
                <p className="line-clamp-2">{course.syllabus}</p>
              </div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex flex-col text-left">
                  {course.originalPrice && (
                    <span className="text-xs text-gray-400 line-through font-medium">৳{Number(course.originalPrice).toFixed(2)}</span>
                  )}
                  <div className="text-2xl font-bold text-gray-900">৳{Number(course.price || 0).toFixed(2)}</div>
                </div>
                <div className="bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white px-4 py-2 rounded-full font-medium transition-colors flex items-center gap-2 text-sm">
                  View Details
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      );
      })}
    </div>
  );
};

export default Courses;
