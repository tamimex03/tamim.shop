import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Code, BrainCircuit, Rocket, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  const projects = [
    { title: "AI Research", desc: "Exploring deep learning architectures, building advanced AI tools, and staying on the bleeding edge of ML development." },
    { title: "Tech Enthusiast", desc: "Constantly learning new frameworks, analyzing hardware trends, and advocating for positive tech evolution." },
    { title: "Event Organizer", desc: "Leading tech fests, hackathons, and community-driven events regardless of the field or domain." }
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mb-24 md:mt-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-600 rounded-full text-xs font-semibold tracking-wide uppercase mb-6 border border-red-100">
               <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
               Welcome to my digital space
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-black tracking-tight text-gray-900 leading-[1.1] mb-6">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400">Tamim Iqbal</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg leading-relaxed">
              Tech Enthusiast, AI Researcher, Entrepreneur, & Organizer. Building the future one line of code at a time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/store/shop" className="bg-red-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-red-700 transition-all hover:scale-105 shadow-xl shadow-red-500/20 flex items-center gap-2">
                Visit My Shop <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/contact" className="bg-white border-2 border-gray-200 text-gray-800 px-8 py-3.5 rounded-full font-medium hover:border-red-600 hover:text-red-600 transition-all flex items-center gap-2">
                Get in touch
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center md:justify-end relative"
          >
            <div className="relative w-72 h-72 md:w-96 md:h-96">
              <div className="absolute inset-0 bg-red-600 rounded-[2rem] rotate-6 opacity-10"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-red-500 to-red-200 rounded-[2rem] -rotate-3 blur-2xl opacity-20"></div>
              <img 
                src="https://drive.google.com/uc?export=view&id=1Crm4IYSlDt8384EYGligQsIRXZ4wFdNQ" 
                alt="Tamim Iqbal" 
                className="relative w-full h-full object-cover rounded-[2rem] shadow-2xl border-4 border-white"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Education & Experience */}
      <section className="bg-white border-y border-gray-100 py-24 mb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-gray-900 tracking-tight">Academic Journey</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 relative max-w-4xl mx-auto">
             <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-200 hidden md:block"></div>
             
             {/* Timeline Item 1 */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="bg-gray-50 border border-gray-100 p-8 rounded-3xl relative md:text-right"
             >
               <div className="md:absolute right-[-41px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-600 border-4 border-white hidden md:block"></div>
               <div className="text-red-600 font-bold tracking-widest text-sm uppercase mb-2 mr-0">SSC - 2025</div>
               <h3 className="text-2xl font-bold text-gray-900">Rajshahi Collegiate School</h3>
             </motion.div>

             {/* Spacer for grid */}
             <div className="hidden md:block"></div>
             <div className="hidden md:block"></div>

             {/* Timeline Item 2 */}
             <motion.div 
               whileHover={{ y: -5 }}
               className="bg-gray-50 border border-gray-100 p-8 rounded-3xl relative"
             >
                <div className="md:absolute left-[-41px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-red-600 border-4 border-white hidden md:block"></div>
               <div className="text-red-600 font-bold tracking-widest text-sm uppercase mb-2">HSC - 2027</div>
               <h3 className="text-2xl font-bold text-gray-900">New Government Degree College</h3>
             </motion.div>
          </div>
        </div>
      </section>

      {/* Roles / Identities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
           {[
             { icon: <Code className="w-8 h-8"/>, title: "Tech Enthusiast" },
             { icon: <BrainCircuit className="w-8 h-8"/>, title: "AI Researcher" },
             { icon: <Rocket className="w-8 h-8"/>, title: "Entrepreneur" },
             { icon: <Calendar className="w-8 h-8"/>, title: "Organizer" },
           ].map((role, idx) => (
             <div key={idx} className="bg-white border border-gray-100 p-6 md:p-8 rounded-3xl text-center hover:shadow-xl hover:shadow-red-500/5 transition-all group">
               <div className="w-16 h-16 mx-auto bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 {role.icon}
               </div>
               <h4 className="font-bold text-gray-900">{role.title}</h4>
             </div>
           ))}
        </div>
      </section>

      {/* Projects */}
      <section className="py-20 mb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
           <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
             <div>
               <h2 className="text-3xl md:text-5xl font-display font-medium text-gray-900 tracking-tight mb-3">Core Focus Areas</h2>
               <p className="text-gray-500 max-w-xl text-base">Key roles and creative fields that define my active work and dedication.</p>
             </div>
             <Link to="/store/shop" className="text-red-600 hover:text-red-700 font-bold text-sm inline-flex items-center gap-1.5 hover:translate-x-1 transition-transform">
               View my courses <ArrowRight className="w-4 h-4"/>
             </Link>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6">
             {projects.map((project, i) => (
               <motion.div 
                 key={i} 
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.1 }}
                 className="bg-gray-50/60 border border-gray-100 hover:border-red-100 p-8 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300"
               >
                 <div className="w-10 h-10 bg-red-50 text-red-600 font-mono font-bold text-sm rounded-xl flex items-center justify-center mb-6">
                   0{i+1}
                 </div>
                 <h3 className="text-lg font-bold text-gray-900 mb-2">{project.title}</h3>
                 <p className="text-gray-600 text-sm leading-relaxed">{project.desc}</p>
               </motion.div>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
