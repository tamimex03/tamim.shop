import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, Instagram, Send } from 'lucide-react';
import { useStore } from '../store/StoreContext';

const Contact = () => {
  const { submitContact } = useStore();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.name && formData.email && formData.message) {
      submitContact(formData);
      setFormData({ name: '', email: '', message: '' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 md:py-24">
      <div className="grid md:grid-cols-2 gap-16">
        
        {/* Contact Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gray-900 mb-6">Let's Connect</h1>
            <p className="text-xl text-gray-600">Have a project in mind, or just want to say hi? I'd love to hear from you.</p>
          </div>
          
          <div className="space-y-6 pt-4">
             <a href="mailto:mail.tamimiq@gmail.com" className="flex items-center gap-4 group p-4 bg-white border border-gray-100 rounded-2xl hover:border-red-600 hover:shadow-lg transition-all">
               <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                 <Mail className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Email</p>
                 <p className="text-lg font-bold text-gray-900">mail.tamimiq@gmail.com</p>
               </div>
             </a>
             
             <a href="https://wa.me/8801734595704" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group p-4 bg-white border border-gray-100 rounded-2xl hover:border-red-600 hover:shadow-lg transition-all">
               <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                 <Phone className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">WhatsApp</p>
                 <p className="text-lg font-bold text-gray-900">01734595704</p>
               </div>
             </a>

             <a href="https://instagram.com/tamimiq_" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group p-4 bg-white border border-gray-100 rounded-2xl hover:border-red-600 hover:shadow-lg transition-all">
               <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors">
                 <Instagram className="w-6 h-6" />
               </div>
               <div>
                 <p className="text-sm text-gray-500 font-medium uppercase tracking-wider mb-1">Instagram</p>
                 <p className="text-lg font-bold text-gray-900">@tamimiq_</p>
               </div>
             </a>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border border-gray-100 p-8 md:p-10 rounded-[2.5rem] shadow-xl shadow-gray-200/50"
        >
          <h2 className="text-2xl font-bold mb-8">Send a Message</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-colors"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-colors"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
              <textarea 
                required
                rows={5}
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-colors resize-none"
                placeholder="How can we collaborate?"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-red-600 text-white font-medium px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-colors hover:shadow-lg hover:shadow-red-500/20"
            >
              Send Message <Send className="w-4 h-4" />
            </button>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Contact;
