import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { motion, AnimatePresence } from 'motion/react';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { 
    cart, 
    currentUser, 
    promoCodes, 
    logout, 
    restrictedModalOpen, 
    setRestrictedModalOpen 
  } = useStore();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: "Tamim's Shop", path: '/store/shop' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] text-gray-900 selection:bg-red-500 selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform shadow-lg shadow-red-500/20">
                  <img src="https://drive.google.com/uc?export=view&id=1Crm4IYSlDt8384EYGligQsIRXZ4wFdNQ" alt="Tamim Iqbal" className="w-full h-full object-cover" />
                </div>
                <span className="font-display font-bold text-xl tracking-tight hidden sm:block">
                  Tamim Iqbal
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-red-600 ${
                    location.pathname === link.path || (location.pathname.startsWith('/store') && link.path.startsWith('/store')) ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                <Link to="/cart" className="relative group p-2 hover:bg-gray-50 rounded-full transition-colors">
                  <ShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-red-600 transition-colors" />
                  {cart.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                      {cart.reduce((acc, item) => acc + item.quantity, 0)}
                    </span>
                  )}
                </Link>
                
                {currentUser ? (
                  <div className="flex items-center gap-2">
                    {(currentUser.isAdmin || currentUser.email === 'admin@tamimiqbal.com') && (
                      <Link to="/admin" className="hidden md:flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-colors text-sm font-bold border border-red-100">
                        <User className="w-4 h-4" />
                        <span>Admin</span>
                      </Link>
                    )}
                    <Link to="/dashboard" className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 px-3 py-1.5 rounded-full transition-colors text-sm font-medium border border-gray-200">
                      <User className="w-4 h-4" />
                      <span>{(currentUser.isAdmin || currentUser.email === 'admin@tamimiqbal.com') ? 'My Dashboard' : 'Dashboard'}</span>
                    </Link>
                    <button onClick={logout} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Log out">
                      <LogOut className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <Link to="/auth" className="text-sm font-medium text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition-colors shadow-sm shadow-red-500/20">
                    Login
                  </Link>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 pr-0"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 flex flex-col space-y-4 shadow-xl">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-base font-medium text-gray-800 hover:text-red-600 py-2 border-b border-gray-50"
                  >
                    {link.name}
                  </Link>
                ))}
                
                <div className="pt-4 flex flex-col gap-4">
                  <Link 
                    to="/cart" 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex justify-between items-center bg-gray-50 p-3 rounded-xl text-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5" />
                      <span className="font-medium">Cart</span>
                    </div>
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold">
                      {cart.reduce((acc, item) => acc + item.quantity, 0)} items
                    </span>
                  </Link>
                                    {currentUser ? (
                     <div className="flex flex-col gap-2">
                       {(currentUser.isAdmin || currentUser.email === 'admin@tamimiqbal.com') && (
                         <Link 
                           to="/admin"
                           onClick={() => setIsMobileMenuOpen(false)}
                           className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-bold w-full"
                         >
                           <User className="w-5 h-5" />
                           Admin Panel
                         </Link>
                       )}
                       <Link 
                         to="/dashboard"
                         onClick={() => setIsMobileMenuOpen(false)}
                         className="flex items-center justify-center gap-2 bg-gray-50 text-gray-800 px-4 py-3 rounded-xl font-medium w-full"
                       >
                         <User className="w-5 h-5" />
                         {(currentUser.isAdmin || currentUser.email === 'admin@tamimiqbal.com') ? 'My Dashboard' : 'Dashboard'}
                       </Link>
                       <button 
                         onClick={() => {
                           logout();
                           setIsMobileMenuOpen(false);
                         }}
                         className="flex items-center justify-center gap-2 text-red-600 bg-white border border-red-100 hover:bg-red-50 px-4 py-3 rounded-xl font-medium w-full transition-colors"
                       >
                         <LogOut className="w-5 h-5" />
                         Logout
                       </button>
                     </div>
                  ) : (
                    <Link 
                      to="/auth" 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-red-600 text-white text-center px-4 py-3 rounded-xl font-medium w-full"
                    >
                      Login / Sign up
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Main Content */}
      <main className="flex-grow flex flex-col pt-4 md:pt-8 bg-[#fafafa]">
        {currentUser && currentUser.restricted && !currentUser.isAdmin && currentUser.email !== 'admin@tamimiqbal.com' && (location.pathname === '/dashboard' || location.pathname === '/cart') ? (
          <div className="flex-grow flex items-center justify-center p-6 bg-gray-50/50">
            <div id="account-restricted-card" className="max-w-md w-full bg-white rounded-3xl border border-rose-100 shadow-xl shadow-rose-500/5 p-8 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-600" />
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6 text-rose-600 border border-rose-100/50">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-3 tracking-tight font-display">Account Restricted</h2>
              <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                Your account is restricted. <br />
                Please contact our support for more information or to appeal this status.
              </p>
              <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100/30 mb-6">
                <span className="block text-[10px] uppercase font-mono font-bold tracking-wider text-rose-400 mb-1">Contact Email</span>
                <a href="mailto:mail.tamimiq@gmail.com" className="text-rose-600 font-semibold hover:underline text-sm font-mono block">
                  mail.tamimiq@gmail.com
                </a>
              </div>
              <Link to="/store/shop" className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-xl border border-gray-200 transition-colors cursor-pointer">
                Return to Shop
              </Link>
            </div>
          </div>
        ) : (
          children
        )}
      </main>

      {/* Footer */}
      <footer className="py-5 bg-[#fafafa] border-t border-gray-100/30">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-1">
          <p className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">
            © 2026 Tamim Iqbal. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* Global Restriction Popup Modal */}
      <AnimatePresence>
        {restrictedModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full border border-rose-100 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-rose-600" />
              <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-rose-600 border border-rose-100/50">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 font-display">Account Restricted</h3>
              <p className="text-xs text-gray-600 mb-6 leading-relaxed font-medium">
                Your account is restricted. <br />
                Please contact support to resolve this issue.
              </p>
              <div className="bg-rose-50/50 rounded-2xl p-3.5 border border-rose-100/40 mb-6 font-mono">
                <span className="block text-[9px] uppercase font-bold tracking-wider text-rose-400 mb-0.5">Contact Email</span>
                <a href="mailto:mail.tamimiq@gmail.com" className="text-rose-600 font-bold hover:underline text-xs">
                  mail.tamimiq@gmail.com
                </a>
              </div>
              <button 
                onClick={() => setRestrictedModalOpen(false)}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-xl text-sm transition-colors cursor-pointer shadow-lg shadow-rose-600/10"
              >
                Understood
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;
