import React from 'react';
import { useStore } from '../../store/StoreContext';
import { motion } from 'motion/react';
import { Plus } from 'lucide-react';

const Products = () => {
  const { products, addToCart, promoCodes } = useStore();

  if (products.length === 0) {
    return <div className="text-center py-24 text-gray-500">No products available at the moment.</div>;
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product, idx) => {
        const productPromo = promoCodes.find(p => 
          p.applicability === 'all' || 
          (p.applicability === 'specific' && p.targetIds?.includes(product.id))
        );

        return (
          <motion.div 
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border text-left border-gray-100 rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-red-500/5 transition-all group flex flex-col"
          >
            <div className="aspect-square bg-gray-100 overflow-hidden relative">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {product.discountText && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-gradient-to-r from-red-600 to-orange-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-lg block tracking-wide uppercase">
                    {product.discountText}
                  </span>
                </div>
              )}
              {productPromo && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-600 text-white font-bold text-[10px] sm:text-xs px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    Use code <span className="font-mono bg-white/20 px-1 py-0.5 rounded text-white">{productPromo.code}</span> for {productPromo.type === 'percent' ? `${productPromo.value}%` : `৳${productPromo.value}`} OFF!
                  </span>
                </div>
              )}
            </div>
          
          <div className="p-6 flex-grow flex flex-col">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-6 flex-grow line-clamp-3">{product.description}</p>
            
            <div className="flex items-center justify-between mt-auto">
              <div className="flex flex-col">
                {product.originalPrice && (
                  <span className="text-xs text-gray-400 line-through font-medium">৳{Number(product.originalPrice).toFixed(2)}</span>
                )}
                <div className="text-2xl font-bold text-gray-900">৳{Number(product.price || 0).toFixed(2)}</div>
              </div>
              <button 
                onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, quantity: 1, type: 'product' })}
                className="bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2.5 rounded-full font-medium transition-colors flex items-center gap-2 text-sm"
              >
                Add to Cart <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      );
      })}
    </div>
  );
};

export default Products;
