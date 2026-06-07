import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/StoreContext';
import { useNavigate } from 'react-router-dom';
import { CreditCard, Trash2, ShieldCheck, Ticket } from 'lucide-react';
import toast from 'react-hot-toast';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, placeOrder, currentUser, promoCodes } = useStore();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad' | null>(null);
  const [phone, setPhone] = useState('+880');
  const [txnId, setTxnId] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [errors, setErrors] = useState<string[]>([]);
  
  // order form
  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [customerLocation, setCustomerLocation] = useState('');
  const [customerDetails, setCustomerDetails] = useState('');

  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const finalTotal = Math.max(0, total - discount);

  const handleApplyPromo = () => {
    const promo = promoCodes.find(p => p.code.toUpperCase() === promoCode.toUpperCase());
    if (promo) {
      let eligibleTotal = total;
      if (promo.applicability === 'specific' && promo.targetIds?.length > 0) {
        const eligibleItems = cart.filter(item => promo.targetIds.includes(item.id));
        if (eligibleItems.length === 0) {
          toast.error('This promo code is not applicable to any items in your cart');
          return;
        }
        eligibleTotal = eligibleItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
      }

      if (promo.type === 'percent') {
        const calcDiscount = eligibleTotal * (promo.value / 100);
        setDiscount(calcDiscount);
        toast.success(`Promo code applied: ${promo.value}% discount on eligible items!`);
      } else {
        const calcDiscount = Math.min(promo.value, eligibleTotal);
        setDiscount(calcDiscount);
        toast.success(`Promo code applied: ৳${promo.value} discount on eligible items!`);
      }
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: string[] = [];

    if (!currentUser) {
      toast.error("Please login to place an order");
      navigate('/auth');
      return;
    }
    if (!paymentMethod) {
      toast.error("Please select a payment method");
      return;
    }
    if (!customerName) newErrors.push('customerName');
    if (!customerEmail) newErrors.push('customerEmail');
    if (!customerLocation) newErrors.push('customerLocation');
    
    const cleanPhone = phone.replace(/[\s-]/g, '');
    const isValidPhone = /^(?:\+?88)?01[3-9]\d{8}$/.test(cleanPhone);
    if (!isValidPhone) {
      newErrors.push('phone');
    }
    if (!txnId) newErrors.push('txnId');

    if (newErrors.length > 0) {
      setErrors(newErrors);
      if (newErrors.some(err => err !== 'phone')) {
        toast.error("Please fill in all highlighted fields correctly.");
      } else {
        toast.error("Please check the phone number and try again.");
      }
      return;
    }
    
    setErrors([]);
    
    placeOrder({
      userId: currentUser.id,
      customerName,
      customerEmail,
      customerLocation,
      customerDetails,
      items: cart,
      total: finalTotal,
      paymentMethod,
      paymentNumber: phone,
      transactionId: txnId
    });
    
    navigate('/dashboard');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 w-full py-24 text-center">
        <h2 className="text-3xl font-display font-bold mb-4">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <button onClick={() => navigate('/store/shop')} className="bg-red-600 text-white px-8 py-3 rounded-full font-medium hover:bg-red-700 transition-colors">
          Browse Store
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-24">
      <h1 className="text-4xl font-display font-black tracking-tight text-gray-900 mb-12">Checkout</h1>
      
      <div className="grid lg:grid-cols-3 gap-12 text-left">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8">
             <h2 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4">Order Items</h2>
             
             <div className="space-y-6">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-center group">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold uppercase text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">{item.type}</span>
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      </div>
                      <p className="text-gray-500 text-sm">৳{Number(item.price || 0).toFixed(2)} each</p>
                    </div>
                    <div className="flex items-center gap-4 sm:gap-6">
                       <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-3 py-1 text-sm font-medium">
                         <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-black w-4 flex justify-center">-</button>
                         <span className="w-4 text-center">{item.quantity}</span>
                         <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 hover:text-black w-4 flex justify-center">+</button>
                       </div>
                       <span className="font-bold text-gray-900 w-20 text-right hidden sm:inline-block">৳{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</span>
                       <button onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-600 transition-colors bg-white p-1 rounded-full">
                         <Trash2 className="w-5 h-5" />
                       </button>
                    </div>
                  </div>
                ))}
             </div>
           </div>

           <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8">
             <h2 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
               <Ticket className="w-5 h-5 text-blue-500" /> Details & Billing Info
             </h2>
             
             <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" value={customerName} onChange={e => { setCustomerName(e.target.value); setErrors(errors.filter(err => err !== 'customerName')) }}
                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900 ${errors.includes('customerName') ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" value={customerEmail} onChange={e => { setCustomerEmail(e.target.value); setErrors(errors.filter(err => err !== 'customerEmail')) }}
                    className={`w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900 ${errors.includes('customerEmail') ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
                  />
                </div>
             </div>
             <div className="mb-6">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Location / Address</label>
                <input 
                  type="text" value={customerLocation} onChange={e => { setCustomerLocation(e.target.value); setErrors(errors.filter(err => err !== 'customerLocation')) }}
                  placeholder="Dhaka, Bangladesh"
                  className={`w-full bg-gray-50 border rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900 ${errors.includes('customerLocation') ? 'border-red-500 bg-red-50' : 'border-gray-200'}`} 
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Additional Notes / Order Details</label>
                <textarea 
                  rows={2} value={customerDetails} onChange={e => setCustomerDetails(e.target.value)}
                  placeholder="Any specific requests or instructions..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900 resize-none" 
                ></textarea>
             </div>
           </div>

           {/* Payment Methods */}
           <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8">
             <h2 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-green-500" /> Secure Payment
             </h2>
             
             <div className="grid grid-cols-2 gap-4 mb-8">
               <button 
                 type="button"
                 onClick={() => { setPaymentMethod('bKash'); setPhone(''); }}
                 className={`p-4 border-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                   paymentMethod === 'bKash' ? 'border-pink-500 bg-pink-50' : 'border-gray-100 hover:border-gray-200 bg-white'
                 }`}
               >
                 <img src="https://static.vecteezy.com/system/resources/previews/039/340/798/non_2x/bkash-logo-free-vector.jpg" alt="bKash" className="w-20 h-10 object-contain rounded" referrerPolicy="no-referrer" />
                 <span className={`font-semibold ${paymentMethod === 'bKash' ? 'text-pink-600' : 'text-gray-600'}`}>bKash</span>
               </button>
               
               <button 
                 type="button"
                 onClick={() => { setPaymentMethod('Nagad'); setPhone(''); }}
                 className={`p-4 border-2 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                   paymentMethod === 'Nagad' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200 bg-white'
                 }`}
               >
                 <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLjql9YpLgqF8uB2zbxoauU9JdXuwH52svFA&s" alt="Nagad" className="w-24 h-10 object-contain rounded" referrerPolicy="no-referrer" />
                 <span className={`font-semibold ${paymentMethod === 'Nagad' ? 'text-orange-600' : 'text-gray-600'}`}>Nagad</span>
               </button>
             </div>
             
             <AnimatePresence>
               {paymentMethod && (
                 <motion.div
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="overflow-hidden"
                 >
                   <form id="checkout-form" onSubmit={handleCheckout} className="bg-gray-50 border border-gray-100 p-6 rounded-2xl space-y-4">
                     <p className="text-sm text-gray-600 mb-4 font-medium">Please send <strong className="text-gray-900">৳{Number(finalTotal || 0).toFixed(2)}</strong> to <strong>01734595704</strong> via {paymentMethod} and enter details below.</p>
                     
                     <div>
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">{paymentMethod} Number used</label>
                       <input 
                         type="tel"
                         value={phone}
                         onChange={e => {
                           const val = e.target.value;
                           if (val !== undefined) {
                             setPhone(val);
                             setErrors(errors.filter(err => err !== 'phone'));
                           }
                         }}
                         placeholder="01XXXXXXXXX"
                         className={`w-full bg-white border rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900 ${errors.includes('phone') ? 'border-red-500 bg-red-50 text-red-900 border-2' : 'border-gray-200'}`}
                       />
                     </div>
                     <div>
                       {errors.includes('phone') && (
                         <div className="text-red-600 text-xs font-bold mb-3 bg-red-50 p-3 rounded-xl border border-red-100 flex items-center gap-1.5 leading-relaxed">
                           ⚠️ Please enter a valid 11-digit Bangladesh mobile number starting with 01 (e.g. 01XXXXXXXXX).
                         </div>
                       )}
                       <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Transaction ID (TrxID)</label>
                       <input 
                         type="text"
                         value={txnId}
                         onChange={e => { setTxnId(e.target.value); setErrors(errors.filter(err => err !== 'txnId')) }}
                         placeholder="e.g. 8ABCDEF1234"
                         className={`w-full bg-white border rounded-xl px-4 py-3 focus:outline-none focus:border-gray-900 font-mono uppercase ${errors.includes('txnId') ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                       />
                     </div>
                   </form>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border text-left border-gray-100 rounded-3xl p-6 md:p-8 sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-8">
               <div className="flex justify-between text-gray-600">
                 <span>Subtotal</span>
                 <span>৳{Number(total || 0).toFixed(2)}</span>
               </div>
               
               {discount > 0 && (
                 <div className="flex justify-between text-green-600 font-medium">
                   <span>Discount</span>
                   <span>-৳{Number(discount || 0).toFixed(2)}</span>
                 </div>
               )}
               
               <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                 <span className="font-bold text-gray-900">Total</span>
                 <span className="text-2xl font-black text-gray-900">৳{Number(finalTotal || 0).toFixed(2)}</span>
               </div>
            </div>

            <div className="mb-8">
               <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Promo Code</label>
               <div className="flex gap-2">
                 <input 
                   type="text"
                   value={promoCode}
                   onChange={e => setPromoCode(e.target.value)}
                   className="flex-grow bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none uppercase"
                   placeholder="Enter code"
                 />
                 <button 
                   onClick={handleApplyPromo}
                   className="bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800"
                 >
                   Apply
                 </button>
               </div>
            </div>

            <button 
              form="checkout-form"
              onClick={(e) => {
                if(!paymentMethod) { e.preventDefault(); toast.error('Select a payment method first!');}
              }}
              className="w-full bg-red-600 text-white font-bold text-lg px-6 py-4 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
