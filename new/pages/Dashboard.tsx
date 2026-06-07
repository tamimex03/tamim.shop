import React, { useEffect, useState } from 'react';
import { useStore } from '../store/StoreContext';
import { Navigate, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, Download, Clock, CheckCircle2, PlayCircle,
  Award, Calendar, BookOpen, Receipt, ArrowRight, Video, 
  Bookmark, Compass, HelpCircle, Shield, ExternalLink
} from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Invoice: React.FC<{ order: any, user: any }> = ({ order, user }) => {
  const handleDownload = () => {
    window.print();
  };

  const displayName = order.customerName || user?.name || 'Customer';
  const displayEmail = order.customerEmail || user?.email || '-';

  return (
    <div className="bg-white border text-left border-gray-100 rounded-3xl p-6 sm:p-7 mb-4 shadow-xl overflow-hidden relative max-w-lg mx-auto border-t-4 border-t-red-600">
      {/* Print only styles */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .invoice-container, .invoice-container * { visibility: visible; }
          .invoice-container { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; padding: 10px; }
          .no-print { display: none !important; }
        }
      `}</style>
      
      <div className="invoice-container space-y-4">
        {/* Top Header */}
        <div className="flex justify-between items-start gap-4">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-widest text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md inline-block mb-1.5 font-mono">Invoice Receipt</span>
            <h2 className="text-lg font-black text-gray-950 tracking-tight leading-none">Tamim Iqbal</h2>
            <p className="text-[10px] text-gray-400 mt-1 font-mono tracking-wide">mail.tamimiq@gmail.com</p>
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-55 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full inline-flex items-center gap-1 uppercase tracking-wider">
              Paid ✓
            </span>
            <span className="text-[10px] font-mono font-bold text-gray-500 mt-1.5 bg-gray-50 border border-gray-200/60 px-2 py-0.5 rounded">
              #{order.id?.slice(-8).toUpperCase() || order.id}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100/80"></div>

        {/* Billing Info Table */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Billed To</p>
            <p className="font-bold text-gray-900 leading-tight">{displayName}</p>
            <p className="text-gray-500 break-all">{displayEmail}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Payment details</p>
            <p className="font-semibold text-gray-900">
              <span className="text-pink-605 text-pink-600 font-bold">{order.paymentMethod}</span> ({order.paymentNumber || 'N/A'})
            </p>
            <p className="text-gray-500 font-mono text-[10px] leading-tight">TxID: {order.transactionId || 'N/A'}</p>
            <p className="text-gray-400 text-[10px]">{order.date ? format(new Date(order.date), 'MMM dd, yyyy, h:mm a') : ''}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100/80"></div>

        {/* Purchase summary */}
        <div>
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2">Item Summary</p>
          <div className="bg-gray-50/50 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-3 space-y-3">
              {order.items.map((item: any, idx: number) => (
                <div key={idx} className="flex justify-between items-center text-xs">
                  <div className="space-y-0.5 max-w-[70%]">
                    <p className="font-bold text-gray-900 leading-snug">{item.name}</p>
                    <span className="text-[9px] font-mono tracking-wider uppercase bg-gray-100 border border-gray-205 border-gray-200/55 px-1.5 py-0.5 rounded text-gray-500">
                      {item.type}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-400 text-[10px]">Qty: {item.quantity}</p>
                    <p className="font-black text-gray-900 mt-0.5">৳{Number(item.price || 0).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-100/30 border-t border-gray-100 p-3 flex justify-between items-center">
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Grand Total (BDT)</span>
              <span className="text-base font-black text-gray-900 tracking-tight">৳{Number(order.total || 0).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Support note & signature */}
        <div className="pt-3 border-t border-gray-100/80 flex justify-between items-end gap-4">
          <p className="text-[9.5px] text-gray-400 leading-normal max-w-[60%]">
            Need help? Contact <span className="font-medium text-gray-600">mail.tamimiq@gmail.com</span> anytime for support.
          </p>
          <div className="text-right shrink-0">
            <p className="font-mono italic text-[11px] text-red-600 font-bold leading-tight select-none tracking-wide">Tamim Iqbal</p>
            <p className="text-[8px] uppercase font-bold text-gray-400 tracking-wider">Owner</p>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleDownload}
        className="no-print absolute top-5 right-5 bg-gray-50 hover:bg-gray-100 text-gray-500 p-2 rounded-xl transition-all border border-gray-200 hover:border-gray-350 active:scale-95 shadow-sm inline-flex items-center justify-center cursor-pointer"
        title="Download / Print Invoice"
      >
        <Download className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

const Dashboard = () => {
  const { currentUser, orders, courses } = useStore();
  const [activeTab, setActiveTab] = useState<'orders' | 'classes'>('classes');
  const [viewingInvoiceOrder, setViewingInvoiceOrder] = useState<any | null>(null);
  const [viewingCourse, setViewingCourse] = useState<any | null>(null);
  const [playingVideo, setPlayingVideo] = useState<any | null>(null);
  const [completedVideos, setCompletedVideos] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`completed_vids_${currentUser?.id}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const toggleVideoWatched = (vidId: string) => {
    const updated = { ...completedVideos, [vidId]: !completedVideos[vidId] };
    setCompletedVideos(updated);
    if (currentUser) {
      localStorage.setItem(`completed_vids_${currentUser.id}`, JSON.stringify(updated));
    }
    toast.success(updated[vidId] ? "Session marked as completed" : "Session marked as incomplete");
  };

  if (!currentUser) {
    return <Navigate to="/auth" />;
  }

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

  const userOrders = orders.filter(o => o.userId === currentUser.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const pendingOrders = userOrders.filter(o => o.status === 'pending');
  const approvedOrders = userOrders.filter(o => o.status === 'approved');
  
  // Extract purchased courses
  const purchasedCourseItems = approvedOrders.flatMap(o => o.items).filter(i => i.type === 'course');
  const ownedCourseIds = Array.from(new Set(purchasedCourseItems.map(item => item.id)));
  const ownedCourses = courses.filter(c => ownedCourseIds.includes(c.id));

  // Video progress calculations
  const calculateCourseProgress = (course: any) => {
    if (!course.videos || course.videos.length === 0) return 0;
    const completedCount = course.videos.filter((vid: any) => completedVideos[vid.id]).length;
    return Math.round((completedCount / course.videos.length) * 100);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-8 text-slate-800">
      
      {/* 1. Header Banner: Clean, humble, formal presentation */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome, {currentUser.name}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Access your orders, services, and class catalog below.
          </p>
        </div>
        <div className="text-left md:text-right">
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Today's Date</p>
          <p className="text-sm font-medium">{format(new Date(), 'EEEE, MMM d, yyyy')}</p>
        </div>
      </div>

      {/* 2. Structured Metric Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-slate-100 rounded-xl p-5 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">My Enrolled Classes</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{ownedCourses.length}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-5 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Completed Receipts</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{approvedOrders.length}</p>
        </div>
        <div className="bg-white border border-slate-100 rounded-xl p-5 text-left">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Pending Orders</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{pendingOrders.length}</p>
        </div>
      </div>

      {/* 3. Simplistic Clean Operational Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
         
         {/* Navigation Control Column */}
         <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-slate-100 rounded-2xl p-4 space-y-1">
              <button 
                onClick={() => { setActiveTab('classes'); setViewingCourse(null); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-xs sm:text-sm tracking-tight transition-all cursor-pointer ${
                  activeTab === 'classes' 
                    ? 'bg-slate-100 text-slate-900 font-bold' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" />
                  <span>Classes & Services</span>
                </div>
                {ownedCourses.length > 0 && (
                  <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {ownedCourses.length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => { setActiveTab('orders'); setViewingInvoiceOrder(null); }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg font-medium text-xs sm:text-sm tracking-tight transition-all cursor-pointer ${
                  activeTab === 'orders' 
                    ? 'bg-slate-100 text-slate-900 font-bold' 
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>Order History</span>
                </div>
                {userOrders.length > 0 && (
                  <span className="bg-slate-100 text-slate-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {userOrders.length}
                  </span>
                )}
              </button>
            </div>

            {/* Quiet formal profile block */}
            <div className="bg-slate-50 p-4 rounded-xl text-left text-xs border border-slate-100 space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Account Information</p>
              <div className="text-slate-600 space-y-1">
                <p><span className="text-slate-400">User:</span> {currentUser.name}</p>
                <p className="truncate" title={currentUser.email}><span className="text-slate-400">Email:</span> {currentUser.email}</p>
              </div>
            </div>
         </div>

         {/* Active Frame Workspace Column */}
         <div className="lg:col-span-9">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: My Classes & Services */}
              {activeTab === 'classes' && (
                <motion.div
                  key="classes-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  {viewingCourse ? (
                    <div className="bg-white border border-slate-100 rounded-2xl p-6 text-left">
                      
                      {/* Inner course header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => { setViewingCourse(null); setPlayingVideo(null); }} 
                            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 p-2 rounded-full transition-all flex items-center justify-center cursor-pointer"
                            title="Back"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Interactive Lesson</p>
                            <h3 className="font-bold text-base text-slate-900">{viewingCourse.title}</h3>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-150">
                          <span className="text-[11px] font-semibold text-slate-600">{calculateCourseProgress(viewingCourse)}% Watched</span>
                          <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${calculateCourseProgress(viewingCourse)}%` }}></div>
                          </div>
                        </div>
                      </div>

                      {/* Lesson Player Split Section */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                         
                         {/* Player on the left */}
                         <div className="md:col-span-8 space-y-4">
                            {playingVideo ? (
                              <div className="bg-slate-950 rounded-xl overflow-hidden relative">
                                <div className="aspect-video relative w-full">
                                  <iframe
                                    src={getEmbedUrl(playingVideo.url)}
                                    className="absolute top-0 left-0 w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                  ></iframe>
                                </div>
                                <div className="p-4 bg-slate-900 text-white flex justify-between items-center gap-4">
                                  <div>
                                    <p className="text-xs text-slate-400 uppercase font-semibold">Active Session</p>
                                    <h4 className="font-bold text-sm text-slate-100">{playingVideo.title}</h4>
                                  </div>
                                  <button
                                    onClick={() => toggleVideoWatched(playingVideo.id)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                                      completedVideos[playingVideo.id]
                                      ? 'bg-emerald-600 text-white hover:bg-emerald-750'
                                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-750'
                                    }`}
                                  >
                                    {completedVideos[playingVideo.id] ? 'Completed ✓' : 'Mark Completed'}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="aspect-video bg-slate-950 rounded-xl flex flex-col items-center justify-center p-6 text-center">
                                 <PlayCircle className="w-10 h-10 text-slate-600 mb-2" />
                                 <h4 className="text-slate-155 text-slate-200 text-sm font-bold">Please select a video class lesson</h4>
                                 <p className="text-slate-500 text-xs mt-1 max-w-xs">Pick any video from the lesson checklist panel in the layout.</p>
                                 {(!viewingCourse.videos || viewingCourse.videos.length === 0) && viewingCourse.videoUrl && (
                                   <a 
                                     href={viewingCourse.videoUrl} 
                                     target="_blank" 
                                     rel="noreferrer" 
                                     className="mt-4 inline-flex items-center gap-1 bg-red-650 bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-2 rounded-lg font-medium transition-colors"
                                   >
                                     <span>Access Classroom URL</span>
                                     <ExternalLink className="w-3.5 h-3.5" />
                                   </a>
                                 )}
                              </div>
                            )}

                            {/* Standard lesson description block */}
                            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">Service Details & Description</h4>
                              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{viewingCourse.description}</p>
                              
                              {viewingCourse.benefits && viewingCourse.benefits.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-slate-200/50">
                                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Deliverables:</p>
                                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {viewingCourse.benefits.map((benefit: string, index: number) => (
                                      <li key={index} className="flex items-center gap-1.5 text-xs text-slate-600">
                                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                                        <span>{benefit}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                         </div>

                         {/* Playlist lesson checklist sidebar */}
                         <div className="md:col-span-4">
                            <div className="border border-slate-100 rounded-xl overflow-hidden bg-white">
                              <div className="bg-slate-50 p-3 border-b border-slate-100 flex items-center justify-between">
                                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Lesson Videos</span>
                                <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold">
                                  {viewingCourse.videos?.length || 0} Sessions
                                </span>
                              </div>

                              <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto">
                                {(!viewingCourse.videos || viewingCourse.videos.length === 0) ? (
                                  <div className="p-6 text-center text-xs text-slate-400">
                                    <p>No video steps registered.</p>
                                  </div>
                                ) : (
                                  viewingCourse.videos.map((vid: any, i: number) => {
                                    const isCurrent = playingVideo?.id === vid.id;
                                    const isCompleted = !!completedVideos[vid.id];
                                    return (
                                      <div 
                                        key={vid.id || i}
                                        onClick={() => setPlayingVideo(vid)}
                                        className={`p-3 text-left cursor-pointer transition-all flex gap-2.5 items-start ${
                                          isCurrent ? 'bg-slate-50 text-slate-900 border-l-4 border-slate-900' : 'hover:bg-slate-50/50'
                                        }`}
                                      >
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleVideoWatched(vid.id);
                                          }}
                                          className={`w-4 h-4 rounded border transition-all mt-0.5 shrink-0 flex items-center justify-center font-bold text-[10px] ${
                                            isCompleted 
                                              ? 'bg-emerald-500 border-emerald-500 text-white' 
                                              : 'border-slate-300 hover:border-slate-500 bg-white'
                                          }`}
                                        >
                                          {isCompleted ? '✓' : ''}
                                        </button>
                                        <div className="min-w-0 flex-1">
                                          <p className={`text-xs font-medium tracking-tight truncate ${isCurrent ? 'font-bold' : 'text-slate-700'}`}>
                                            {vid.title}
                                          </p>
                                          <p className="text-[10px] text-slate-400 font-mono">Part {i + 1}</p>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                         </div>

                      </div>
                    </div>
                  ) : (
                    // GRID VIEW OF ENROLLED COURSES
                    <div>
                      <h3 className="font-bold text-slate-900 text-base mb-4 text-left flex items-center gap-2">
                        <PlayCircle className="w-5 h-5 text-slate-700" /> Active Service Portals
                      </h3>
                      
                      {ownedCourses.length === 0 ? (
                        <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center flex flex-col items-center">
                          <Compass className="w-8 h-8 text-slate-300 mb-3" />
                          <h4 className="font-bold text-slate-700 text-sm">No Active Services Bound</h4>
                          <p className="text-slate-500 max-w-sm text-xs mt-1 mb-4">You have not purchased any course lessons. Check out our shop items catalog.</p>
                          <Link to="/store/shop" className="bg-slate-900 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors inline-block">
                            Browse Shop Services
                          </Link>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {ownedCourses.map(course => {
                            const progress = calculateCourseProgress(course);
                            return (
                              <div 
                                key={course.id} 
                                onClick={() => setViewingCourse(course)}
                                className="bg-white border border-slate-100 hover:border-slate-300 rounded-xl overflow-hidden shadow-xs hover:shadow-sm transition-all cursor-pointer flex flex-col group text-left"
                              >
                                <div className="aspect-video relative bg-slate-900">
                                  <img 
                                    src={course.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60'} 
                                    alt={course.title}
                                    className="w-full h-full object-cover opacity-90 group-hover:scale-102 transition-transform duration-350" 
                                    referrerPolicy="no-referrer"
                                  />
                                </div>
                                <div className="p-4 flex-grow flex flex-col justify-between">
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{course.title}</h4>
                                    <p className="text-xs text-slate-500 line-clamp-1 mt-1">{course.description}</p>
                                  </div>
                                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                                    <span>{course.videos?.length || 0} Lessons</span>
                                    <span className="font-semibold text-slate-900">{progress}% Done</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: Order History */}
              {activeTab === 'orders' && (
                <motion.div
                  key="orders-tab"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <h3 className="font-bold text-slate-900 text-base text-left flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-700" /> Billing History
                  </h3>

                  {userOrders.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-xl p-10 text-center">
                       <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                       <h4 className="font-bold text-slate-700 text-sm">No transaction entries found</h4>
                       <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">Bills will appear immediately after submitting order checkout references.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userOrders.map(order => (
                        <div key={order.id} className="bg-white border border-slate-150 p-5 rounded-xl text-left hover:shadow-xs transition-all space-y-4">
                            
                            {/* Card Header */}
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 border-b border-gray-100 pb-3">
                               <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span className="font-mono text-[10px] text-slate-400 px-1.5 py-0.5 bg-slate-50 border border-slate-200/50 rounded">ID: {order.id.slice(0, 12)}</span>
                                    
                                    {order.status === 'approved' && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full inline-flex items-center gap-1">
                                        Approved
                                      </span>
                                    )}
                                    {order.status === 'pending' && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 rounded-full inline-flex items-center gap-1">
                                        Pending Check
                                      </span>
                                    )}
                                    {order.status === 'rejected' && (
                                      <span className="text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-750 border border-rose-100 rounded-full inline-flex items-center gap-1">
                                        Declined
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[11px] text-slate-405 text-slate-450 text-slate-400 mt-1">
                                    Ordered on {format(new Date(order.date), 'MMM dd, yyyy • hh:mm a')}
                                  </p>
                               </div>

                               <div className="flex items-center gap-3 sm:justify-end">
                                  <div className="text-left sm:text-right">
                                    <span className="text-[10px] uppercase text-slate-400 font-semibold tracking-wider">Amount Paid</span>
                                    <p className="font-bold text-sm text-slate-900">৳{Number(order.total || 0).toFixed(2)}</p>
                                  </div>
                                  
                                  {order.status === 'approved' && (
                                    <button 
                                      onClick={() => setViewingInvoiceOrder(order)} 
                                      className="text-xs font-semibold py-1.5 px-3 border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm transition-all inline-flex items-center gap-1 bg-white cursor-pointer"
                                    >
                                      <Receipt className="w-3.5 h-3.5" />
                                      <span>Invoice</span>
                                    </button>
                                  )}
                               </div>
                            </div>

                            {/* Card Content */}
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3 text-xs">
                               <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wider text-slate-400">Order Items</p>
                               <ul className="space-y-1.5">
                                 {order.items.map((item: any) => (
                                   <li key={item.id} className="flex justify-between items-center bg-white border border-slate-100 p-2 rounded-lg">
                                      <div className="flex items-center gap-2">
                                         <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                           {item.type}
                                         </span>
                                         <span className="font-semibold text-slate-800">{item.name}</span>
                                         <span className="text-slate-405 text-slate-400">x{item.quantity}</span>
                                      </div>
                                      <span className="font-bold text-slate-950">৳{(Number(item.price || 0) * Number(item.quantity || 1)).toFixed(2)}</span>
                                   </li>
                                 ))}
                               </ul>
                               
                               <div className="pt-2.5 border-t border-slate-150 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-500 font-medium">
                                 <span>Method: <strong>{order.paymentMethod}</strong></span>
                                 <span>Account: <strong>{order.paymentNumber}</strong></span>
                                 <span>TrxID: <strong className="font-mono text-slate-800">{order.transactionId}</strong></span>
                               </div>
                            </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* INVOICE DIALOG MODAL */}
                  {viewingInvoiceOrder && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
                      <div className="relative my-8 w-full max-w-xl">
                         <button 
                           onClick={() => setViewingInvoiceOrder(null)} 
                           className="absolute -top-10 right-0 text-white hover:text-slate-350 p-2 text-xs transition-all flex items-center justify-center font-bold uppercase tracking-wider cursor-pointer"
                           title="Close"
                         >
                           Close ×
                         </button>
                         <Invoice order={viewingInvoiceOrder} user={currentUser} />
                      </div>
                    </div>
                  )}

                </motion.div>
              )}
            </AnimatePresence>
         </div>

      </div>

    </div>
  );
};

export default Dashboard;
