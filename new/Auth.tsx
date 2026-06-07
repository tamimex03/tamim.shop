import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/StoreContext';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

// Custom MacOS styled popup
const MacOSPup = ({ isOpen, type, title, message, onClose }: any) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="bg-[#f5f5f7] border border-white/40 shadow-2xl rounded-2xl w-full max-w-sm overflow-hidden"
            style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.5)' }}
          >
            <div className="p-6 text-center">
              <div className="mx-auto w-12 h-12 mb-4">
                 {type === 'success' ? (
                   <CheckCircle2 className="w-12 h-12 text-blue-500 mx-auto" />
                 ) : (
                   <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
                 )}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-[#1d1d1f]">{title}</h3>
              <p className="text-[#86868b] text-sm leading-relaxed">{message}</p>
            </div>
            <div className="border-t border-[#d2d2d7]">
              <button
                onClick={onClose}
                className="w-full p-4 text-[#0066cc] font-semibold text-lg hover:bg-black/5 transition-colors focus:outline-none"
              >
                OK
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', pass: '' });
  const { login, signup } = useStore();
  const navigate = useNavigate();

  const [popup, setPopup] = useState({ isOpen: false, type: 'success', title: '', message: '', action: () => {} });

  const closePopup = () => {
    setPopup({ ...popup, isOpen: false });
    if(popup.action) popup.action();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      const success = await login(formData.email, formData.pass);
      if (success) {
        setPopup({
          isOpen: true,
          type: 'success',
          title: 'Welcome!',
          message: 'Welcome to Dashboard',
          action: () => navigate('/dashboard')
        });
      } else {
        // Assume if format is valid but login fails, it's either wrong pass or no user
        // Due to mock limits, we just show a generic invalid error.
        setPopup({
          isOpen: true,
          type: 'error',
          title: 'Login Failed',
          message: 'Invalid email or password. Please try again or create an account if you don\'t have one.',
          action: () => {}
        });
      }
    } else {
      const success = await signup(formData.name, formData.email, formData.pass);
      if (success) {
        setPopup({
          isOpen: true,
          type: 'success',
          title: 'Account Created',
          message: 'Your account has been created successfully!',
          action: () => setIsLogin(true) // Switch to login
        });
      } else {
        setPopup({
          isOpen: true,
          type: 'error',
          title: 'Signup Failed',
          message: 'An account with this email already exists.',
          action: () => {}
        });
      }
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <MacOSPup {...popup} onClose={closePopup} />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white border border-gray-100 p-8 sm:p-12 text-left rounded-[2.5rem] shadow-2xl shadow-red-500/10 w-full max-w-md relative overflow-hidden"
      >
        <div className="text-center mb-10">
           <div className="w-16 h-16 bg-red-600 text-white rounded-2xl flex items-center justify-center font-display font-bold text-3xl mx-auto mb-6 shadow-lg shadow-red-500/20">
              T
           </div>
           <h2 className="text-3xl font-bold text-gray-900 mb-2">{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
           <p className="text-gray-500">{isLogin ? 'Enter your credentials to access your dashboard.' : 'Join to manage your purchases and access courses.'}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <AnimatePresence>
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="relative mb-5">
                  <User className="absolute top-3.5 left-4 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    required={!isLogin}
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Full Name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-colors"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="relative">
            <Mail className="absolute top-3.5 left-4 w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="Email Address"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute top-3.5 left-4 w-5 h-5 text-gray-400" />
            <input 
              type="password" 
              required
              value={formData.pass}
              onChange={e => setFormData({...formData, pass: e.target.value})}
              placeholder="Password"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-red-600/20 focus:border-red-600 transition-colors"
            />
          </div>

          {/* Password Strength Indicator for Signup */}
          <AnimatePresence>
            {!isLogin && formData.pass.length > 0 && (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 exit={{ opacity: 0, height: 0 }}
                 className="pt-1 px-1 overflow-hidden"
               >
                  {(() => {
                    let score = 0;
                    if (formData.pass.length >= 6) score += 1;
                    if (formData.pass.length >= 10) score += 1;
                    if (/[A-Z]/.test(formData.pass)) score += 1;
                    if (/[0-9]/.test(formData.pass)) score += 1;
                    if (/[^A-Za-z0-9]/.test(formData.pass)) score += 1;
                    
                    const levels = [
                      { w: '0%', text: '', col: 'bg-gray-200' },
                      { w: '20%', text: 'Very Weak', col: 'bg-red-500' },
                      { w: '40%', text: 'Weak', col: 'bg-orange-500' },
                      { w: '60%', text: 'Fair', col: 'bg-yellow-500' },
                      { w: '80%', text: 'Good', col: 'bg-blue-500' },
                      { w: '100%', text: 'Strong', col: 'bg-green-500' }
                    ];
                    
                    const currentLvl = levels[Math.min(score, 5)];
                    
                    return (
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1 font-medium">
                          <span className="text-gray-500">Password Strength</span>
                          <span className={`${currentLvl.col.replace('bg-', 'text-')}`}>{currentLvl.text}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden flex gap-0.5">
                          {[1,2,3,4,5].map((i) => (
                             <div key={i} className={`h-full flex-1 transition-colors duration-300 ${i <= score ? currentLvl.col : 'bg-transparent'}`}></div>
                          ))}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1.5">Use numbers, symbols, and uppercase for a stronger password.</p>
                      </div>
                    );
                  })()}
               </motion.div>
            )}
          </AnimatePresence>

          <button 
            type="submit"
            className="w-full bg-red-600 text-white font-bold px-6 py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 mt-4"
          >
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <button 
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-600 hover:text-red-600 transition-colors font-medium"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
