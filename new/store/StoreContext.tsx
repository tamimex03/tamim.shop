import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { initialProducts, initialCourses } from './mockData';
import { toast } from 'react-hot-toast';

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  pass?: string;
  restricted?: boolean;
};

type Product = {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountText?: string;
  description: string;
  imageUrl: string;
};

type Course = {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  discountText?: string;
  description: string;
  syllabus: string;
  videoUrl: string;
  rating: number;
  imageUrl: string;
  benefits: string[];
  videos?: {id: string, title: string, url: string}[];
};

type PromoCode = {
  id: string;
  code: string;
  type: 'percent' | 'amount';
  value: number;
  applicability: 'all' | 'specific';
  targetIds: string[];
};

type CartItem = {
  id: string;
  type: 'product' | 'course';
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerLocation: string;
  customerDetails: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  paymentMethod: 'bKash' | 'Nagad';
  paymentNumber: string;
  transactionId: string;
};

type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string;
};

interface StoreContextType {
  currentUser: User | null;
  users: any[];
  login: (email: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  products: Product[];
  courses: Course[];
  orders: Order[];
  contactMessages: ContactMessage[];
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, delta: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  placeOrder: (order: Omit<Order, 'id' | 'status' | 'date'>) => void;
  approveOrder: (id: string) => void;
  dismissOrder: (id: string) => void;
  submitContact: (msg: Omit<ContactMessage, 'id' | 'date'>) => void;
  deleteContactMessage: (id: string) => void;
  
  // Admin Methods
  addProduct: (p: Omit<Product, 'id'>) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  
  addCourse: (c: Omit<Course, 'id'>) => void;
  updateCourse: (c: Course) => void;
  deleteCourse: (id: string) => void;
  
  promoCodes: PromoCode[];
  addPromoCode: (p: Omit<PromoCode, 'id'>) => void;
  deletePromoCode: (id: string) => void;
  
  getRevenueData: () => { name: string; revenue: number }[];
  restrictUser: (userId: string, restricted: boolean) => Promise<void>;
  restrictedModalOpen: boolean;
  setRestrictedModalOpen: (val: boolean) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed.email === 'admin@tamimiqbal.com') {
          parsed.isAdmin = true;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });
  
  const [users, setUsers] = useState<any[]>([]);
  const [restrictedModalOpen, setRestrictedModalOpen] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [orders, setOrders] = useState<Order[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([
    { id: 'promo1', code: 'TAMIM10', type: 'percent', value: 10, applicability: 'all', targetIds: [] }
  ]);
  
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('local_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Fetch all standard database variables from Express API helper
  const fetchLatestData = async () => {
    try {
      const res = await fetch("/api/data");
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (data.users) setUsers(data.users);
        if (data.products) setProducts(data.products);
        if (data.courses) setCourses(data.courses);
        if (data.orders) setOrders(data.orders);
        if (data.promoCodes) setPromoCodes(data.promoCodes);
        if (data.contactMessages) setContactMessages(data.contactMessages);
      }
    } catch (err: any) {
      const errMsg = err?.message || String(err || "");
      if (errMsg.includes("Failed to fetch") || errMsg.includes("Load failed")) {
        console.warn("Express server connection currently offline. Retrying... (" + errMsg + ")");
      } else {
        console.error("Error syncing shared server data:", err);
      }
    }
  };

  // Sync cart contents to localStorage (local device only)
  useEffect(() => {
    try {
      localStorage.setItem('local_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  // Handle continuous synced database polling across all device sessions
  useEffect(() => {
    fetchLatestData();
    const timer = setInterval(fetchLatestData, 3000); // Poll database every 3 seconds for completely seamless sync
    return () => clearInterval(timer);
  }, []);

  // Monitor user restriction status in real-time
  useEffect(() => {
    if (currentUser && currentUser.email !== 'admin@tamimiqbal.com' && users.length > 0) {
      const upToDateUser = users.find(
        (u: any) => u.id === currentUser.id || u.email.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
      );
      if (upToDateUser) {
        const isCurrentlyRestricted = !!currentUser.restricted;
        const newRestrictedStatus = !!upToDateUser.restricted;
        if (isCurrentlyRestricted !== newRestrictedStatus) {
          const updated = { ...currentUser, restricted: newRestrictedStatus };
          setCurrentUser(updated);
          localStorage.setItem('currentUser', JSON.stringify(updated));
          if (newRestrictedStatus) {
            setRestrictedModalOpen(true);
            toast.error("Your account has been restricted by Admin.");
          }
        }
      }
    }
  }, [users, currentUser]);

  const login = async (email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, pass })
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const user = await res.json();
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        fetchLatestData();
        return true;
      } else {
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          toast.error(errData.error || "Login error!");
        } else {
          toast.error("Invalid credentials.");
        }
      }
    } catch (e) {
      console.error("Login server error:", e);
      toast.error("Failed to connect to authentication server.");
    }
    return false;
  };

  const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, pass })
      });
      const contentType = res.headers.get("content-type");
      if (res.ok && contentType && contentType.includes("application/json")) {
        const user = await res.json();
        setCurrentUser(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
        fetchLatestData();
        return true;
      } else {
        if (contentType && contentType.includes("application/json")) {
          const errData = await res.json();
          toast.error(errData.error || "Signup error!");
        } else {
          toast.error("Signup failed on server.");
        }
      }
    } catch (e) {
      console.error("Signup server error:", e);
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addToCart = (item: CartItem) => {
    if (currentUser && currentUser.restricted && !currentUser.isAdmin) {
      setRestrictedModalOpen(true);
      toast.error("Your account is restricted.");
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`${item.name} added to cart`);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  const placeOrder = async (orderData: Omit<Order, 'id' | 'status' | 'date'>) => {
    if (currentUser && currentUser.restricted && !currentUser.isAdmin) {
      setRestrictedModalOpen(true);
      toast.error("Your account is restricted.");
      return;
    }
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        clearCart();
        toast.success("Order placed successfully! Waiting for approval.");
        fetchLatestData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const approveOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/approve`, { method: "PUT" });
      if (res.ok) {
        toast.success("Order approved! Invoice generated.");
        fetchLatestData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const dismissOrder = async (id: string) => {
    try {
      const res = await fetch(`/api/orders/${id}/dismiss`, { method: "PUT" });
      if (res.ok) {
        toast.error("Order dismissed.");
        fetchLatestData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const submitContact = async (msg: Omit<ContactMessage, 'id' | 'date'>) => {
    try {
      const res = await fetch("/api/contact/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(msg)
      });
      if (res.ok) {
        toast.success("Message sent successfully!");
        fetchLatestData();
      } else {
        const errData = await res.json().catch(() => ({}));
        toast.error(errData.error || "Failed to send message.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error submitting contact message.");
    }
  };

  const deleteContactMessage = async (id: string) => {
    try {
      const res = await fetch(`/api/contact/messages/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Message deleted.");
        fetchLatestData();
      } else {
        toast.error("Failed to delete message.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Network error deleting message.");
    }
  };

  const addProduct = async (p: Omit<Product, 'id'>) => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        toast.success("Product added successfully!");
        fetchLatestData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateProduct = async (p: Product) => {
    try {
      const res = await fetch(`/api/products/${p.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        toast.success("Product updated successfully!");
        fetchLatestData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted successfully!");
        fetchLatestData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addCourse = async (c: Omit<Course, 'id'>) => {
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c)
      });
      if (res.ok) {
        toast.success("Course added successfully!");
        fetchLatestData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateCourse = async (c: Course) => {
    try {
      const res = await fetch(`/api/courses/${c.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(c)
      });
      if (res.ok) {
        toast.success("Course updated successfully!");
        fetchLatestData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      const res = await fetch(`/api/courses/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Course deleted successfully!");
        fetchLatestData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addPromoCode = async (p: Omit<PromoCode, 'id'>) => {
    try {
      const res = await fetch("/api/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(p)
      });
      if (res.ok) {
        toast.success("Promo code added successfully!");
        fetchLatestData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deletePromoCode = async (id: string) => {
    try {
      const res = await fetch(`/api/promos/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Promo code deleted!");
        fetchLatestData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const restrictUser = async (userId: string, restricted: boolean) => {
    try {
      const res = await fetch(`/api/users/${userId}/restrict`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ restricted })
      });
      if (res.ok) {
        toast.success(restricted ? "Client restricted successfully!" : "Client unrestricted successfully!");
        fetchLatestData();
      } else {
        toast.error("Failed to update client status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error updating client status.");
    }
  };

  const getRevenueData = () => {
    return [
      { name: 'Week 1', revenue: 400 },
      { name: 'Week 2', revenue: 600 },
      { name: 'Week 3', revenue: 800 },
      { name: 'Week 4', revenue: calculateCurrentWeekRevenue() },
    ];
  };

  const calculateCurrentWeekRevenue = () => {
    return orders.filter(o => o.status === 'approved').reduce((acc, order) => acc + order.total, 0) || 200;
  };

  return (
    <StoreContext.Provider value={{
      currentUser, login, signup, logout, users,
      products, courses, cart, orders, contactMessages,
      addToCart, updateQuantity, removeFromCart, clearCart, placeOrder, approveOrder, dismissOrder, submitContact, deleteContactMessage,
      addProduct, updateProduct, deleteProduct,
      addCourse, updateCourse, deleteCourse,
      promoCodes, addPromoCode, deletePromoCode,
      getRevenueData, restrictUser,
      restrictedModalOpen, setRestrictedModalOpen
    }}>
      {children}
    </StoreContext.Provider>
  );
};
