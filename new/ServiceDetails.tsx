import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/StoreContext';
import { motion } from 'motion/react';
import { Plus, ArrowLeft, PlayCircle, Star, Map, Users, Clock, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ServiceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, addToCart } = useStore();
  
  const course = courses.find(c => c.id === id);
  
  if (!course) {
    return <div className="text-center py-24 text-gray-500">Service not found.</div>;
  }

  const benefits = course.benefits?.length ? course.benefits : [
    "Lifetime access to materials",
    "Direct mentorship support",
    "Real-world project building",
    "Certificate of completion"
  ];

  return (
    <div className="max-w-6xl mx-auto text-left px-4 mb-24">
      <button onClick={() => navigate(-1)} className="text-gray-500 bg-white shadow-sm border border-gray-100 rounded-full px-4 py-2 hover:text-red-600 font-medium inline-flex items-center gap-2 mb-8 transition-all hover:pr-5 group">
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Services
      </button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="aspect-video bg-gray-900 relative flex items-center justify-center rounded-[2.5rem] overflow-hidden shadow-2xl bg-cover bg-center border-4 border-white group" style={{ backgroundImage: `url(${course.imageUrl})` }}>
            <div className="absolute inset-0 bg-gray-900/50 group-hover:bg-gray-900/30 transition-all duration-500"></div>
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-gray-900 to-transparent"></div>
            
            <button className="bg-red-600/90 text-white rounded-full p-4 relative z-10 backdrop-blur-sm group-hover:scale-110 group-hover:bg-red-600 transition-all shadow-[0_0_40px_rgba(220,38,38,0.5)]">
               <PlayCircle className="w-12 h-12" />
            </button>
            <div className="absolute bottom-6 left-8 flex items-center gap-4 text-white z-10">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold font-mono inline-flex items-center gap-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" /> {Number(course.rating || 0).toFixed(1)} / 5.0
              </span>
              <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 hidden sm:inline-flex">
                <Clock className="w-4 h-4" /> 20 Hours Content
              </span>
            </div>
          </div>
          
          <div className="bg-white border border-gray-100 p-8 md:p-10 rounded-[2.5rem] shadow-sm">
             <div className="flex items-center gap-3 mb-4">
                <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border border-red-100">Service Offering</span>
             </div>
             
             <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gray-900 mb-6 leading-tight">
               {course.title}
             </h1>
             
             <div className="prose prose-lg text-gray-600 font-medium leading-relaxed mb-8 max-w-none">
               <p>{course.description}</p>
             </div>
             
             <h3 className="text-2xl font-bold flex items-center gap-3 mb-6 pt-8 border-t border-gray-100">
               <Map className="w-7 h-7 text-red-500" /> Roadmap & Syllabus
             </h3>
             <div className="bg-gray-50 border border-gray-100 p-6 md:p-8 rounded-3xl mb-8">
                <ul className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                  {course.syllabus.split(',').map((item, idx) => (
                    <li key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-red-600 text-white font-bold shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 relative">
                         {idx + 1}
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-gray-900">{item.trim()}</h4>
                      </div>
                    </li>
                  ))}
                </ul>
             </div>
          </div>
        </div>
        
        {/* Sticky Sidebar / Checkout Card */}
        <div className="relative">
          <div className="sticky top-24 bg-white border border-gray-100 rounded-[2.5rem] shadow-xl shadow-gray-200/50 p-6 sm:p-8">
             <div className="text-center mb-6">
                <p className="text-gray-500 font-medium text-sm mb-2">Enrollment Fee</p>
                {course.originalPrice && (
                  <p className="text-sm font-semibold text-gray-400 line-through mb-1">৳{Number(course.originalPrice).toFixed(2)}</p>
                )}
                <p className="text-5xl font-black text-gray-900 tracking-tight">৳{Number(course.price || 0).toFixed(2)}</p>
                {course.discountText && (
                  <span className="inline-block mt-3 bg-gradient-to-r from-red-600 to-orange-500 text-white font-extrabold text-[11px] uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md animate-pulse">
                    🎉 {course.discountText}
                  </span>
                )}
             </div>
             
             <button 
                onClick={() => {
                  addToCart({ id: course.id, name: course.title, price: course.price, quantity: 1, type: 'course' });
                  toast.success("Added to cart!");
                  navigate('/cart');
                }}
                className="w-full bg-red-600 text-white px-6 py-4 rounded-2xl font-bold cursor-pointer hover:bg-red-700 transition-all focus:ring-4 focus:ring-red-600/30 active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 mb-6"
             >
                Enroll Now <Plus className="w-5 h-5" />
             </button>
             
             <div className="space-y-4 border-t border-gray-100 pt-6">
                <h4 className="font-bold text-gray-900 mb-2">What you'll get:</h4>
                {benefits.map((b, i) => (
                  <div key={i} className="flex gap-3 text-gray-600">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                    <span className="text-sm font-medium">{b}</span>
                  </div>
                ))}
             </div>
             
             <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-4 text-sm text-gray-500 justify-center">
               <ShieldCheck className="w-5 h-5 text-gray-400" /> Secure SSL Checkout
             </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ServiceDetails;
