import React, { useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Navigate, Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Check, X, Mail, Edit, Trash2, Plus, LayoutDashboard, ShoppingBag, BookOpen, MessageSquare, Ticket, Save, Users, MapPin, Upload, PlayCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Invoice } from './Dashboard';
import { toast } from 'react-hot-toast';

const fileToDataUrl = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

const Admin = () => {
  const { 
    currentUser, orders, approveOrder, dismissOrder, 
    courses, products, addCourse, updateCourse, deleteCourse, addProduct, updateProduct, deleteProduct,
    promoCodes, addPromoCode, deletePromoCode,
    contactMessages, getRevenueData, users, restrictUser, deleteContactMessage
  } = useStore();
  const [activeTab, setActiveTab] = useState('overview');

  // Editing state for courses
  const [editingCourse, setEditingCourse] = useState<any>(null);
  
  // Editing state for products
  const [editingProduct, setEditingProduct] = useState<any>(null);
  
  // New promo code state
  const [newPromo, setNewPromo] = useState<{
    code: string;
    type: 'percent' | 'amount';
    value: number;
    applicability: 'all' | 'specific';
    targetIds: string[];
  }>({ code: '', type: 'percent', value: 10, applicability: 'all', targetIds: [] });

  // Invoice view state
  const [viewingInvoice, setViewingInvoice] = useState<{ order: any, user: any } | null>(null);

  // Managing videos state
  const [managingVideosFor, setManagingVideosFor] = useState<any>(null);
  const [playingAdminVideo, setPlayingAdminVideo] = useState<string | null>(null);

  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1`;
    }
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }
    return url;
  };

  if (currentUser?.email !== 'admin@tamimiqbal.com') {
    return <Navigate to="/" />;
  }

  const revenueData = getRevenueData();
  const pendingOrders = orders.filter(o => o.status === 'pending');
  const approvedOrders = orders.filter(o => o.status === 'approved');

  const handleApprove = (id: string) => approveOrder(id);
  const handleReject = (id: string) => dismissOrder(id);

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCourse.id) {
       updateCourse(editingCourse);
    } else {
       addCourse({ ...editingCourse, id: undefined });
    }
    setEditingCourse(null);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct.id) {
       updateProduct(editingProduct);
    } else {
       addProduct({ ...editingProduct, id: undefined });
    }
    setEditingProduct(null);
  };

  const handleCreatePromo = (e: React.FormEvent) => {
    e.preventDefault();
    if(newPromo.code) {
       addPromoCode({ ...newPromo });
       setNewPromo({ code: '', type: 'percent', value: 10, applicability: 'all', targetIds: [] });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 flex flex-col md:flex-row gap-8 text-left relative">
      
      {/* Invoice Modal */}
      {viewingInvoice && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <div className="relative my-8 w-full max-w-lg">
               <button onClick={() => setViewingInvoice(null)} className="absolute -top-12 right-0 text-white hover:text-gray-200 p-2">
                 <X className="w-8 h-8" />
               </button>
               <Invoice order={viewingInvoice.order} user={viewingInvoice.user || { name: viewingInvoice.order.customerName || 'Unknown', email: viewingInvoice.order.customerEmail }} />
            </div>
         </div>
      )}

      {/* Course Edit Modal */}
      {editingCourse && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-2xl my-8">
               <h3 className="text-2xl font-bold mb-6">{editingCourse.id ? 'Edit Service' : 'Add New Service'}</h3>
               <form onSubmit={handleSaveCourse} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Title</label>
                      <input type="text" required value={editingCourse.title || ''} onChange={e => setEditingCourse({...editingCourse, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (৳)</label>
                      <input type="number" required value={editingCourse.price || 0} onChange={e => setEditingCourse({...editingCourse, price: parseFloat(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Original Price (৳ - Optional)</label>
                      <input type="number" value={editingCourse.originalPrice || ''} onChange={e => setEditingCourse({...editingCourse, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" placeholder="e.g. 5000" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount Announcement (Optional)</label>
                      <input type="text" value={editingCourse.discountText || ''} onChange={e => setEditingCourse({...editingCourse, discountText: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" placeholder="e.g. 40% OFF or Save ৳2000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                    <textarea required rows={3} value={editingCourse.description || ''} onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Syllabus / Roadmap (comma separated)</label>
                    <textarea required rows={2} value={editingCourse.syllabus || ''} onChange={e => setEditingCourse({...editingCourse, syllabus: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Benefits (what you will get, comma separated)</label>
                    <textarea required rows={2} value={editingCourse.benefits ? editingCourse.benefits.join(', ') : ''} onChange={e => setEditingCourse({...editingCourse, benefits: e.target.value.split(',').map((s: string) => s.trim())})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 resize-none" placeholder="Lifetime access, Mentorship..."></textarea>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Upload Thumbnail Image</label>
                      <label className="w-full bg-gray-50 border border-gray-200 border-dashed rounded-xl px-4 py-2 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                        <Upload className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-sm font-medium text-gray-600">Choose Image</span>
                        <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                          if(e.target.files && e.target.files[0]) {
                            const url = await fileToDataUrl(e.target.files[0]);
                            setEditingCourse({...editingCourse, imageUrl: url});
                          }
                        }} />
                      </label>
                      {editingCourse.imageUrl && (
                        <div className="mt-2 text-xs text-green-600 font-medium overflow-hidden text-ellipsis whitespace-nowrap">Image attached</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                     <button type="button" onClick={() => setEditingCourse(null)} className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                     <button type="submit" className="px-6 py-3 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 flex items-center gap-2"><Save className="w-4 h-4" /> Save</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Product Edit Modal */}
      {editingProduct && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-xl my-8">
               <h3 className="text-2xl font-bold mb-6">{editingProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
               <form onSubmit={handleSaveProduct} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                      <input type="text" required value={editingProduct.name || ''} onChange={e => setEditingProduct({...editingProduct, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (৳)</label>
                      <input type="number" required value={editingProduct.price || 0} onChange={e => setEditingProduct({...editingProduct, price: parseFloat(e.target.value)})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Original Price (৳ - Optional)</label>
                      <input type="number" value={editingProduct.originalPrice || ''} onChange={e => setEditingProduct({...editingProduct, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" placeholder="e.g. 500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Discount Announcement (Optional)</label>
                      <input type="text" value={editingProduct.discountText || ''} onChange={e => setEditingProduct({...editingProduct, discountText: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2" placeholder="e.g. 20% OFF or Sale" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Description</label>
                    <textarea required rows={3} value={editingProduct.description || ''} onChange={e => setEditingProduct({...editingProduct, description: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 resize-none"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Upload Product Image</label>
                    <label className="w-full bg-gray-50 border border-gray-200 border-dashed rounded-xl px-4 py-3 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
                      <Upload className="w-5 h-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-600">Choose Image File</span>
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        if(e.target.files && e.target.files[0]) {
                          const url = await fileToDataUrl(e.target.files[0]);
                          setEditingProduct({...editingProduct, imageUrl: url});
                        }
                      }} />
                    </label>
                    {editingProduct.imageUrl && (
                      <div className="mt-2 text-xs text-green-600 font-medium">Image attached successfully</div>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 mt-6">
                     <button type="button" onClick={() => setEditingProduct(null)} className="px-6 py-3 rounded-xl font-medium text-gray-600 bg-gray-100 hover:bg-gray-200">Cancel</button>
                     <button type="submit" className="px-6 py-3 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 flex items-center gap-2"><Save className="w-4 h-4" /> Save</button>
                  </div>
               </form>
            </div>
         </div>
      )}

      {/* Sidebar */}
      <div className="md:w-64 flex-shrink-0">
        <h2 className="text-2xl font-display font-black tracking-tight text-gray-900 mb-8 px-4">Admin Panel</h2>
        <nav className="space-y-1">
          {[
            { id: 'overview', icon: <LayoutDashboard className="w-5 h-5"/>, label: 'Overview' },
            { id: 'orders', icon: <ShoppingBag className="w-5 h-5"/>, label: `Orders (${pendingOrders.length})` },
            { id: 'users', icon: <Users className="w-5 h-5"/>, label: 'Customers' },
            { id: 'courses', icon: <BookOpen className="w-5 h-5"/>, label: 'Services' },
            { id: 'products', icon: <ShoppingBag className="w-5 h-5"/>, label: 'Products' },
            { id: 'promos', icon: <Ticket className="w-5 h-5"/>, label: 'Promo Codes' },
            { id: 'messages', icon: <MessageSquare className="w-5 h-5"/>, label: `Messages (${contactMessages.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                activeTab === tab.id ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
          <div className="pt-8 border-t border-gray-100 mt-8">
            <Link to="/dashboard" className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-medium text-gray-900 bg-gray-100 hover:bg-gray-200 transition-colors">
               <span>User Dashboard</span>
               <LayoutDashboard className="w-4 h-4 text-gray-500" />
            </Link>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-grow">
        
        {/* Quick Shortcut Row */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-4 mb-8 flex flex-col sm:flex-row gap-3 items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600 text-white animate-pulse">
              Shortcuts
            </span>
            <p className="text-xs font-semibold text-gray-700">Quick 1-Click Sandbox Helpers:</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {pendingOrders.length > 0 && (
              <button
                onClick={() => {
                  pendingOrders.forEach(o => approveOrder(o.id));
                  toast.success(`Successfully approved ${pendingOrders.length} pending orders!`);
                }}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm"
              >
                <Check className="w-3.5 h-3.5" /> Approve All Pending ({pendingOrders.length})
              </button>
            )}
            <button
              onClick={() => {
                const sampleName = ["UI/UX Mentorship", "React & Next.js Premium Mentoring", "Complete Fullstack Engineering"][Math.floor(Math.random() * 3)];
                const prices = [3000, 5000, 7500];
                addCourse({
                  title: sampleName + " Presets Demo",
                  description: "Full active cohort mentorship with code reviews, weekly 1-on-1s, and interactive live guidance.",
                  price: prices[Math.floor(Math.random() * prices.length)],
                  syllabus: "Design Fundamentals, Next.js Routing, Database Synchronization, State Managers",
                  benefits: ["Live Sessions", "Source Code", "Direct 1-on-1 Support"],
                  imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=80",
                  videos: []
                });
                toast.success("Added simple mock service preset!");
              }}
              className="bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> +1 Course/Service Preset
            </button>
            <button
              onClick={() => {
                const productsList = ["Developer Custom Keycap Set", "Tamim Iqbal Signature Mug", "Minimalist Tech Organizer"][Math.floor(Math.random() * 3)];
                const prices = [1200, 650, 1500];
                addProduct({
                  name: productsList + " Presets Demo",
                  description: "Premium high-quality material built specifically for tech lovers, creators, and enthusiasts.",
                  price: prices[Math.floor(Math.random() * prices.length)],
                  imageUrl: "https://images.unsplash.com/photo-1527443154391-507e9dc6c5cc?w=500&auto=format&fit=crop&q=80"
                });
                toast.success("Added simple mock product preset!");
              }}
              className="bg-white hover:bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> +1 Product Preset
            </button>
          </div>
        </div>
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold border-b border-gray-100 pb-4">Revenue Overview</h3>
            <div className="bg-white border text-left border-gray-100 rounded-2xl p-6 h-80">
               <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f1f1" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} dx={-10} tickFormatter={val => `৳${val}`} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [`৳${value}`, 'Revenue']}
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={3} dot={{r: 4, fill: '#dc2626', strokeWidth: 2, stroke: '#fff'}} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Orders</p>
                <p className="text-3xl font-black text-gray-900">{orders.length}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Pending</p>
                <p className="text-3xl font-black text-yellow-600">{pendingOrders.length}</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl p-6">
                 <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Total Revenue</p>
                <p className="text-3xl font-black text-green-600">৳{approvedOrders.reduce((acc, o) => acc + Number(o.total || 0), 0).toFixed(2)}</p>
              </div>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold border-b border-gray-100 pb-4">Customer Directory</h3>
            <div>
              {(() => {
                const uniqueCustomers = new Map();
                // Add all non-admin users
                users.filter(u => !u.isAdmin).forEach(u => uniqueCustomers.set(u.id, { id: u.id, name: u.name, email: u.email, restricted: u.restricted, isRegistered: true }));
                // Add all customers from orders
                orders.forEach(o => {
                  if (!uniqueCustomers.has(o.userId)) {
                    const dbUser = users.find(u => u.id === o.userId);
                    uniqueCustomers.set(o.userId, { 
                      id: o.userId, 
                      name: o.customerName, 
                      email: o.customerEmail, 
                      restricted: dbUser ? dbUser.restricted : false, 
                      isRegistered: !!dbUser 
                    });
                  }
                });
                
                const customerList = Array.from(uniqueCustomers.values());
                
                if (customerList.length === 0) {
                  return <p className="text-gray-500">No customers found.</p>;
                }

                const renderUserCard = (user: any) => {
                  const userOrders = orders.filter(o => o.userId === user.id);
                  const latestOrder = userOrders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                  // Use order's customer info if available, otherwise fallback
                  const displayLoc = latestOrder?.customerLocation || 'Not provided';
                  
                  return (
                    <div key={user.id} className="bg-white border text-left border-gray-100 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-bold text-xl uppercase shadow-inner">
                              {user.name ? user.name.charAt(0) : '?'}
                            </div>
                            <div>
                               <h4 className="font-bold text-gray-900 text-lg leading-tight flex items-center gap-2">
                                  {user.name}
                                  {user.restricted && (
                                    <span className="inline-block bg-rose-100 text-rose-700 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider animate-pulse border border-rose-200">
                                      Account Restricted
                                    </span>
                                  )}
                               </h4>
                               <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                 <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {user.email}</span>
                                 <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {displayLoc}</span>
                               </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-3">
                             {user.isRegistered ? (
                               <button
                                 onClick={() => restrictUser(user.id, !user.restricted)}
                                 className={`px-4 py-2 text-xs font-bold rounded-xl transition-all border cursor-pointer flex items-center gap-1.5 shadow-sm active:scale-95 ${
                                   user.restricted 
                                   ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300' 
                                   : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 hover:border-rose-300'
                                 }`}
                               >
                                 {user.restricted ? '🟢 Unrestrict Account' : '🔴 Restrict Account'}
                               </button>
                             ) : (
                               <span className="text-[10px] font-mono font-bold tracking-wider text-gray-400 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200/50 uppercase">
                                 Guest Buyer
                               </span>
                             )}
                             
                             <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100/80">
                               <p className="text-[9px] uppercase font-bold text-gray-400">Spent</p>
                               <p className="font-bold text-gray-950 text-xs">৳{userOrders.reduce((sum, o) => o.status === 'approved' ? sum + Number(o.total || 0) : sum, 0).toFixed(2)}</p>
                             </div>
                             <div className="bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100/80">
                               <p className="text-[9px] uppercase font-bold text-gray-400">Orders</p>
                               <p className="font-bold text-gray-955 text-xs">{userOrders.length}</p>
                             </div>
                          </div>
                       </div>
                       
                       {/* User Invoices Summary */}
                       {userOrders.length > 0 && (
                         <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                            <h5 className="text-xs font-bold text-gray-600 uppercase mb-3 flex items-center gap-2"><ShoppingBag className="w-4 h-4"/> Purchase Registry & Invoices</h5>
                            <div className="space-y-3">
                              {userOrders.map(order => (
                                <div key={order.id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                                   <div>
                                     <p className="font-mono text-xs font-bold text-gray-900">#{order.id.slice(-6).toUpperCase()}</p>
                                     <p className="text-xs text-gray-400">{format(new Date(order.date), 'MMM dd, yyyy')}</p>
                                   </div>
                                   <div className="text-xs text-gray-500 truncate max-w-[200px] hidden sm:block font-medium">
                                     {order.items.map(i => i.name).join(', ')}
                                   </div>
                                   <div className="flex items-center gap-3">
                                       <span className="font-bold text-xs text-gray-900">৳{Number(order.total || 0).toFixed(2)}</span>
                                       <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${order.status === 'approved' ? 'bg-green-50 text-green-700 border border-green-100' : order.status === 'rejected' ? 'bg-red-50 text-red-700 shadow-sm' : 'bg-yellow-50 text-yellow-700 border border-yellow-100'}`}>
                                         {order.status}
                                       </span>
                                       <button onClick={() => setViewingInvoice({ order, user })} className="text-[10px] uppercase font-bold py-1 px-3 border border-gray-200 rounded-lg hover:bg-gray-50 shadow-sm ml-2 font-mono transition-colors cursor-pointer">Invoice</button>
                                   </div>
                                </div>
                              ))}
                            </div>
                         </div>
                       )}
                    </div>
                  );
                };

                const restrictedList = customerList.filter(u => u.restricted && u.isRegistered);
                const activeList = customerList.filter(u => !u.restricted && u.isRegistered);
                const guestList = customerList.filter(u => !u.isRegistered);

                return (
                  <div className="space-y-12">
                    {/* RESTRICTED SECTION SECTION */}
                    {restrictedList.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-rose-100 pb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Restricted Accounts ({restrictedList.length})
                          </h4>
                        </div>
                        <div className="grid gap-6">
                          {restrictedList.map(renderUserCard)}
                        </div>
                      </div>
                    )}

                    {/* ACTIVE MEMBERS SECTION */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                          Active Registered Users ({activeList.length})
                        </h4>
                      </div>
                      {activeList.length === 0 ? (
                        <p className="text-sm text-gray-500 italic pl-2">No active members found.</p>
                      ) : (
                        <div className="grid gap-6">
                          {activeList.map(renderUserCard)}
                        </div>
                      )}
                    </div>

                    {/* GUEST BUYERS SECTION */}
                    {guestList.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-gray-400"></span>
                          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                            Guest Checkouts ({guestList.length})
                          </h4>
                        </div>
                        <div className="grid gap-6">
                          {guestList.map(renderUserCard)}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}
        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-8">
            <h3 className="text-xl font-bold border-b border-gray-100 pb-4">Pending Orders</h3>
            {pendingOrders.length === 0 ? (
               <p className="text-gray-500">No pending orders.</p>
            ) : (
              pendingOrders.map(order => (
                <div key={order.id} className="bg-white border border-yellow-200 bg-yellow-50/30 rounded-2xl p-6 flex flex-col md:flex-row gap-6">
                  <div className="flex-grow">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-bold text-gray-500">{order.id}</span>
                      <span className="text-xs font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">Pending Approval</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">Date: {format(new Date(order.date), 'PPpp')}</p>
                    
                    <div className="grid md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-yellow-100">
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">User ID / Email Search</p>
                        <p className="font-medium text-gray-900">{order.userId}</p>
                        <a href={`mailto:user@example.com`} className="text-blue-500 text-sm hover:underline flex items-center gap-1 mt-1">
                          <Mail className="w-3 h-3"/> Contact User
                        </a>
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Payment: {order.paymentMethod}</p>
                        <p className="text-sm">Acc: <span className="font-bold">{order.paymentNumber}</span></p>
                        <p className="text-sm">TrxID: <span className="font-mono font-bold text-red-600">{order.transactionId}</span></p>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Items</p>
                      <ul className="text-sm space-y-1">
                        {order.items.map(i => (
                           <li key={i.id} className="flex justify-between">
                             <span>{i.name} (x{i.quantity})</span>
                             <span className="font-medium">৳{(Number(i.price || 0) * Number(i.quantity || 1)).toFixed(2)}</span>
                           </li>
                        ))}
                      </ul>
                      <div className="mt-2 flex justify-between items-center border-t border-gray-100 pt-2 font-bold text-lg">
                        <button onClick={() => setViewingInvoice({ order, user: users.find(u => u.id === order.userId) })} className="text-[11px] font-bold uppercase tracking-wide border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-white transition-colors bg-gray-50 text-gray-700">View Invoice</button>
                        <span>Total: ৳{Number(order.total || 0).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex md:flex-col gap-3 justify-center md:border-l md:border-yellow-200 md:pl-6">
                     <button onClick={() => handleApprove(order.id)} className="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                       <Check className="w-5 h-5"/> Approve
                     </button>
                     <button onClick={() => handleReject(order.id)} className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors">
                       <X className="w-5 h-5"/> Dismiss
                     </button>
                  </div>
                </div>
              ))
            )}
            
            <h3 className="text-xl font-bold border-b border-gray-100 pb-4 mt-12">Approved / Invoices</h3>
            {approvedOrders.length === 0 ? (
               <p className="text-gray-500">No approved orders.</p>
            ) : (
               <div className="space-y-4">
                 {approvedOrders.map(order => (
                    <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                       <div>
                         <p className="font-medium">{order.id} - <span className="text-green-600 font-bold">৳{Number(order.total || 0).toFixed(2)}</span></p>
                         <p className="text-xs text-gray-500">{format(new Date(order.date), 'PP')} | USER: {order.userId}</p>
                       </div>
                       <span className="bg-green-100 text-green-700 font-bold uppercase text-xs px-3 py-1 rounded-full">Invoice Generated</span>
                    </div>
                 ))}
               </div>
            )}
          </div>
        )}

        {/* COURSES TAB */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {managingVideosFor ? (
              <div className="bg-white border text-left border-gray-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <button onClick={() => { setManagingVideosFor(null); setPlayingAdminVideo(null); }} className="text-sm font-bold text-gray-500 hover:text-gray-900 mb-2 flex items-center gap-1">← Back to Services</button>
                    <h3 className="text-2xl font-bold">Videos for {managingVideosFor.title}</h3>
                  </div>
                  <button 
                    onClick={() => {
                      const newVid = { id: Date.now().toString(), title: '', url: '' };
                      const updatedCourse = {...managingVideosFor, videos: [...(managingVideosFor.videos || []), newVid]};
                      setManagingVideosFor(updatedCourse);
                    }}
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800"
                  >
                    <Plus className="w-4 h-4"/> Add Video
                  </button>
                </div>

                {(!managingVideosFor.videos || managingVideosFor.videos.length === 0) ? (
                  <div className="text-center py-12 text-gray-400 font-medium bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    No videos available for this service.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {managingVideosFor.videos.map((vid: any, index: number) => (
                      <div key={vid.id || index} className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col md:flex-row gap-4 items-start md:items-center">
                        {playingAdminVideo === (vid.id || vid.url) ? (
                           <div className="w-full md:w-48 aspect-video bg-black rounded-lg overflow-hidden shrink-0 relative shadow-inner">
                              <button type="button" onClick={() => setPlayingAdminVideo(null)} className="absolute top-1 right-1 bg-white/50 hover:bg-white text-black p-1 rounded-full z-10 shadow-sm transition-colors"><X className="w-4 h-4" /></button>
                              <iframe src={getEmbedUrl(vid.url)} className="w-full h-full" allowFullScreen></iframe>
                           </div>
                        ) : (
                           <div 
                             className="w-full md:w-48 aspect-video bg-gray-900 rounded-lg flex items-center justify-center shrink-0 shadow-inner cursor-pointer hover:bg-gray-800 transition-colors group relative"
                             onClick={() => { if(vid.url) setPlayingAdminVideo(vid.id || vid.url); }}
                             title="Click to preview video"
                           >
                              <PlayCircle className="w-8 h-8 text-white/50 group-hover:text-white group-hover:scale-110 transition-all" />
                           </div>
                        )}
                        <div className="flex-1 w-full space-y-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Video Title</label>
                            <input type="text" placeholder="e.g. Chapter 1: Introduction" value={vid.title} onChange={e => {
                               const newVids = [...managingVideosFor.videos];
                               newVids[index].title = e.target.value;
                               setManagingVideosFor({...managingVideosFor, videos: newVids});
                            }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Video URL (Google Drive, YouTube, etc.)</label>
                            <input type="url" placeholder="https://..." value={vid.url} onChange={e => {
                               const newVids = [...managingVideosFor.videos];
                               newVids[index].url = e.target.value;
                               setManagingVideosFor({...managingVideosFor, videos: newVids});
                            }} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-gray-900 focus:outline-none" />
                          </div>
                        </div>
                        <div className="flex md:flex-col gap-2 w-full md:w-auto self-stretch md:self-auto justify-end">
                          <button type="button" onClick={() => { if(vid.url) setPlayingAdminVideo(vid.id || vid.url); }} className="px-4 py-3 md:py-2 md:px-0 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center text-sm gap-1 md:w-12">
                             <PlayCircle className="w-4 h-4 md:hidden" />
                             <span className="md:hidden">Preview</span>
                             <PlayCircle className="w-5 h-5 hidden md:block" />
                          </button>
                          <button type="button" onClick={() => {
                            const newVids = managingVideosFor.videos.filter((_: any, i: number) => i !== index);
                            setManagingVideosFor({...managingVideosFor, videos: newVids});
                          }} className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center md:flex-1">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end gap-3 flex-wrap">
                  <button onClick={() => setManagingVideosFor(null)} className="px-6 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">Discard Changes</button>
                  <button 
                    onClick={() => {
                      updateCourse(managingVideosFor);
                      setManagingVideosFor(null);
                    }} 
                    className="px-6 py-3 rounded-xl font-bold bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <Save className="w-5 h-5" /> Save Videos
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                  <h3 className="text-xl font-bold">Manage Services</h3>
                  <button 
                    onClick={() => setEditingCourse({ title: '', price: 0, description: '', syllabus: '', benefits: [], imageUrl: '', rating: 5.0, videos: [] })} 
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4"/> Add Service
                  </button>
                </div>
                
                <div className="grid gap-4">
                  {courses.map(course => (
                     <div key={course.id} className="bg-white border border-gray-100 p-4 rounded-xl flex flex-col md:flex-row justify-between md:items-center gap-4 group shadow-sm hover:shadow-md transition-shadow">
                       <div>
                         <h4 className="font-bold text-gray-900 text-lg leading-tight">{course.title}</h4>
                         <p className="text-sm font-medium text-gray-500 mt-1">৳{Number(course.price || 0).toFixed(2)} • Rating: {Number(course.rating || 0).toFixed(1)}</p>
                       </div>
                       <div className="flex gap-2">
                         <button onClick={() => setManagingVideosFor(course)} className="p-2 text-xs bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg hover:bg-indigo-100 font-bold px-4 flex items-center gap-2 transition-colors">
                           <PlayCircle className="w-4 h-4" /> Manage Videos ({course.videos?.length || 0})
                         </button>
                         <button onClick={() => setEditingCourse(course)} className="p-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-200 hover:text-gray-900 transition-colors">
                           <Edit className="w-4 h-4" />
                         </button>
                         <button onClick={() => deleteCourse(course.id)} className="p-2 bg-red-50 border border-red-100 text-red-600 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors">
                           <Trash2 className="w-4 h-4" />
                         </button>
                       </div>
                     </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        
        {/* PROMO CODES TAB */}
        {activeTab === 'promos' && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold mb-4">Manage Promo Codes</h3>
              <form onSubmit={handleCreatePromo} className="bg-gray-50 p-4 rounded-xl flex flex-col gap-4 border border-gray-200">
                 <div className="flex flex-wrap items-end gap-4">
                   <div className="flex-grow min-w-[150px]">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Code Name</label>
                     <input type="text" required value={newPromo.code} onChange={e => setNewPromo({...newPromo, code: e.target.value.toUpperCase()})} placeholder="e.g. EID50" className="w-full uppercase font-mono px-3 py-2 rounded border border-gray-300 focus:outline-none" />
                   </div>
                   <div className="min-w-[150px]">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Type</label>
                     <select value={newPromo.type} onChange={e => setNewPromo({...newPromo, type: e.target.value as 'percent' | 'amount'})} className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none bg-white">
                        <option value="percent">% Discount</option>
                        <option value="amount">Flat Amount (৳)</option>
                     </select>
                   </div>
                   <div className="min-w-[100px]">
                     <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Value</label>
                     <input type="number" required min="1" value={newPromo.value} onChange={e => setNewPromo({...newPromo, value: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none" />
                   </div>
                   <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded font-bold hover:bg-gray-800 h-10 whitespace-nowrap">Add</button>
                 </div>
                 
                 <div className="w-full">
                   <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Applicability</label>
                   <select value={newPromo.applicability} onChange={e => setNewPromo({...newPromo, applicability: e.target.value as 'all' | 'specific'})} className="w-full px-3 py-2 rounded border border-gray-300 focus:outline-none bg-white mb-3">
                      <option value="all">Global (Apply to all items in cart)</option>
                      <option value="specific">Specific Items Only</option>
                   </select>

                   {newPromo.applicability === 'specific' && (
                     <div className="border border-gray-300 rounded p-3 bg-white max-h-48 overflow-y-auto">
                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Select Applicable Items:</p>
                        {courses.map(c => (
                          <label key={c.id} className="flex items-center gap-2 text-sm mb-1">
                            <input type="checkbox" checked={newPromo.targetIds.includes(c.id)} onChange={e => {
                              if(e.target.checked) setNewPromo({...newPromo, targetIds: [...newPromo.targetIds, c.id]});
                              else setNewPromo({...newPromo, targetIds: newPromo.targetIds.filter(id => id !== c.id)});
                            }} />
                            <span className="bg-blue-100 text-blue-800 text-[10px] px-1.5 rounded uppercase font-bold">Service</span> {c.title}
                          </label>
                        ))}
                        {products.map(p => (
                          <label key={p.id} className="flex items-center gap-2 text-sm mb-1">
                            <input type="checkbox" checked={newPromo.targetIds.includes(p.id)} onChange={e => {
                              if(e.target.checked) setNewPromo({...newPromo, targetIds: [...newPromo.targetIds, p.id]});
                              else setNewPromo({...newPromo, targetIds: newPromo.targetIds.filter(id => id !== p.id)});
                            }} />
                            <span className="bg-green-100 text-green-800 text-[10px] px-1.5 rounded uppercase font-bold">Product</span> {p.name}
                          </label>
                        ))}
                     </div>
                   )}
                 </div>
              </form>
            </div>
            
            <div className="grid gap-4">
              {promoCodes.length === 0 ? <p className="text-gray-500">No promo codes active.</p> : promoCodes.map(promo => (
                 <div key={promo.id} className="bg-white border text-left border-gray-100 p-4 rounded-xl flex justify-between items-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjZjNmNGY2IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] shadow-sm">
                   <div className="flex items-center gap-4">
                     <span className="bg-red-100 text-red-600 font-bold font-mono px-4 py-2 rounded-lg border border-red-200 border-dashed">{promo.code}</span>
                     <div>
                       <p className="font-bold text-gray-900">Discount: {promo.value}{promo.type === 'percent' ? '%' : '৳'}</p>
                       <p className="text-xs text-gray-500 uppercase tracking-wider">Active automatically</p>
                     </div>
                   </div>
                   <button onClick={() => deletePromoCode(promo.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors">
                     <Trash2 className="w-5 h-5" />
                   </button>
                 </div>
              ))}
            </div>
          </div>
        )}
        
        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold">Manage Products</h3>
              <button 
                onClick={() => setEditingProduct({ name: '', price: 0, description: '', imageUrl: '' })}
                className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
              >
                <Plus className="w-4 h-4"/> Add Product
              </button>
            </div>
            
            <div className="grid gap-4">
              {products.map(product => (
                 <div key={product.id} className="bg-white border border-gray-100 p-4 rounded-xl flex justify-between items-center group">
                   <div className="flex items-center gap-4">
                     <img src={product.imageUrl} alt="" className="w-12 h-12 rounded object-cover" />
                     <div>
                       <h4 className="font-bold text-gray-900">{product.name}</h4>
                       <p className="text-sm text-gray-500">৳{Number(product.price || 0).toFixed(2)}</p>
                     </div>
                   </div>
                   <div className="flex gap-2">
                     <button onClick={() => setEditingProduct(product)} className="p-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-200">
                       <Edit className="w-4 h-4" />
                     </button>
                     <button onClick={() => deleteProduct(product.id)} className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100">
                       <Trash2 className="w-4 h-4" />
                     </button>
                   </div>
                 </div>
              ))}
            </div>
          </div>
        )}

        {/* MESSAGES TAB */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
             <h3 className="text-xl font-bold border-b border-gray-100 pb-4">Contact Form Submissions</h3>
             {contactMessages.length === 0 ? (
               <p className="text-gray-500">No messages yet.</p>
             ) : (
               <div className="space-y-4">
                 {contactMessages.map(msg => (
                   <div key={msg.id} className="bg-white border border-gray-100 p-6 rounded-2xl pb-6">
                     <div className="flex justify-between items-start mb-4">
                       <div>
                         <h4 className="font-bold text-lg">{msg.name}</h4>
                         <a href={`mailto:${msg.email}`} className="text-blue-500 text-sm hover:underline">{msg.email}</a>
                       </div>
                       <span className="text-xs text-gray-400">{format(new Date(msg.date), 'PPp')}</span>
                     </div>
                     <div className="bg-gray-50 p-4 rounded-xl text-gray-700 whitespace-pre-wrap text-sm">
                       {msg.message}
                     </div>
                     <div className="mt-4 flex justify-end gap-2">
                       <button 
                         onClick={() => deleteContactMessage(msg.id)}
                         className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3.5 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border border-rose-100 cursor-pointer"
                       >
                         <Trash2 className="w-3.5 h-3.5" /> Delete
                       </button>
                       <a href={`mailto:${msg.email}?subject=Re: Contact from Tamim's Portfolio`} className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800">
                         <Mail className="w-4 h-4" /> Reply via Email
                       </a>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        )}

      </div>
    </div>
  );
};

export default Admin;
