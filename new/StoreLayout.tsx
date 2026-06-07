import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const StoreLayout = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight text-gray-900 mb-4">Tamim's Shop</h1>
          <p className="text-gray-600 text-lg">Browse through my courses and handpicked products.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-full w-fit">
          <NavLink 
            to="/store/shop" 
            className={({isActive}) => `px-6 py-2.5 rounded-full text-sm font-medium transition-all ${isActive ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Services
          </NavLink>
          <NavLink 
            to="/store/products" 
            className={({isActive}) => `px-6 py-2.5 rounded-full text-sm font-medium transition-all ${isActive ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
          >
            Products
          </NavLink>
        </div>
      </div>
      
      {/* Content for sub-routes */}
      <Outlet />
    </div>
  );
};

export default StoreLayout;
