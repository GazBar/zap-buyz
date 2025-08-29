// -----------------------------------------------------------------------------
// !! FIREBASE & FONT INSTRUCTIONS !!
//
// 1. ADD FIREBASE LIBRARIES:
//    Run this command in your main project terminal:
//    npm install firebase
//
// 2. ADD FIREBASE CONFIG:
//    Replace the placeholder firebaseConfig object below with the one from your
//    Firebase project console.
//
// 3. ADD FONT (If not already added):
//    Add the "Poppins" font to your `public/index.html` file.
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Menu, X, ChevronLeft, Star, Send, CheckCircle, XCircle, User, LogOut, ShieldCheck, Mail, Package, Settings } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- FIREBASE SETUP ---
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, updateEmail, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, getDocs, where } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAP78sdxQnP6ygJCDxK-CSjpUyqC2M0W2w",
  authDomain: "project-874572623708435649.firebaseapp.com",
  projectId: "project-874572623708435649",
  storageBucket: "project-874572623708435649.appspot.com",
  messagingSenderId: "958867677764",
  appId: "1:958867677764:web:8355dfe824e9818bd211",
  measurementId: "G-T3QE64GYQH"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


// --- MOCK DATA ---
const productsData = [
  { id: 1, name: 'Elegant Gold Necklace', description: 'A beautiful gold-plated necklace.', price: 39.99, image: 'https://placehold.co/600x400/171717/ffffff?text=Product+1', rating: 4.8, reviews: 120 },
  { id: 2, name: 'Minimalist Leather Wallet', description: 'Slim and stylish genuine leather wallet.', price: 24.50, image: 'https://placehold.co/600x400/262626/ffffff?text=Product+2', rating: 4.5, reviews: 85 },
  { id: 3, name: 'Smart Watch Pro', description: 'Feature-rich smart watch with a vibrant display.', price: 199.00, image: 'https://placehold.co/600x400/404040/ffffff?text=Product+3', rating: 4.9, reviews: 250 },
  { id: 4, name: 'Ceramic Coffee Mug Set', description: 'A set of four handcrafted ceramic mugs.', price: 29.99, image: 'https://placehold.co/600x400/525252/ffffff?text=Product+4', rating: 4.7, reviews: 95 },
];

// --- HELPER & PAGE COMPONENTS (Styling from Volt Theme) ---

const Modal = ({ title, message, onClose }) => ( <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-80"><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-sm p-6 bg-white rounded-lg shadow-2xl text-center"><h3 className="mb-2 text-2xl font-bold text-gray-800">{title}</h3><p className="mb-4 text-gray-600">{message}</p><button onClick={onClose} className="w-full px-4 py-2 font-semibold text-white transition-all duration-300 bg-lime-500 rounded-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2">OK</button></motion.div></div> );
const ProductCard = ({ product, onViewProduct, onAddToCart }) => ( <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="overflow-hidden bg-white rounded-lg shadow-md group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"><div className="relative overflow-hidden cursor-pointer h-60" onClick={() => onViewProduct(product)}><img src={product.image} alt={product.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" /></div><div className="p-4 flex flex-col flex-grow"><h3 className="text-lg font-semibold text-gray-800">{product.name}</h3><p className="mt-1 text-sm text-gray-500 truncate flex-grow">{product.description}</p><div className="flex items-center justify-between mt-2"><p className="text-xl font-bold text-gray-900">£{product.price.toFixed(2)}</p><div className="flex items-center text-sm text-gray-500"><Star className="w-4 h-4 mr-1 text-lime-400 fill-current" /><span>{product.rating} ({product.reviews})</span></div></div><div className="flex items-center justify-between mt-4 space-x-2"><button onClick={() => onViewProduct(product)} className="flex-1 px-4 py-2 text-sm font-semibold text-lime-600 transition-colors duration-200 bg-lime-50 rounded-md hover:bg-lime-100">View Details</button><button onClick={() => onAddToCart(product)} className="p-2 text-white transition-all duration-300 bg-lime-500 rounded-md hover:bg-lime-600 transform group-hover:scale-110" aria-label="Add to cart"><ShoppingCart className="w-5 h-5" /></button></div></div></motion.div> );
const HomePage = ({ setCurrentPage, setSelectedProduct, addToCart }) => ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8"><div className="p-8 mb-8 text-center bg-gray-800 rounded-lg shadow-lg"><h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl" style={{ fontFamily: "'Poppins', sans-serif" }}>Welcome to Seven 17!</h2><p className="mt-4 text-xl text-gray-300">The fastest way to get the best products.</p><button onClick={() => setCurrentPage('products')} className="px-8 py-4 mt-8 font-bold text-gray-900 transition-all duration-300 transform bg-gradient-to-r from-lime-400 to-lime-500 rounded-md shadow-lg hover:shadow-lime-500/50 hover:scale-105">Shop Now</button></div><h3 className="mb-6 text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Featured Products</h3><div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{productsData.slice(0, 4).map((product) => ( <ProductCard key={product.id} product={product} onViewProduct={(p) => { setSelectedProduct(p); setCurrentPage('product'); }} onAddToCart={addToCart} /> ))}</div></motion.div> );
const ProductsPage = ({ setSelectedProduct, setCurrentPage, addToCart }) => ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8"><h2 className="mb-6 text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>All Products</h2><div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{productsData.map((product) => ( <ProductCard key={product.id} product={product} onViewProduct={(p) => { setSelectedProduct(p); setCurrentPage('product'); }} onAddToCart={addToCart} /> ))}</div></motion.div> );
const ProductDetailPage = ({ selectedProduct, setCurrentPage, addToCart }) => ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8"><div className="flex flex-col lg:flex-row lg:space-x-8"><div className="w-full lg:w-1/2"><img src={selectedProduct.image} alt={selectedProduct.name} className="object-cover w-full rounded-lg shadow-xl" /></div><div className="w-full mt-8 lg:w-1/2 lg:mt-0"><div className="pb-6 border-b border-gray-200"><h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>{selectedProduct.name}</h1><div className="flex items-center mt-2 space-x-2 text-lime-400">{Array.from({ length: 5 }, (_, i) => (<Star key={i} className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-gray-300'}`} />))}<span className="text-lg font-semibold text-gray-600 ml-2">{selectedProduct.rating}</span><span className="text-sm text-gray-500">({selectedProduct.reviews} reviews)</span></div><p className="mt-4 text-3xl font-bold text-gray-900">£{selectedProduct.price.toFixed(2)}</p></div><div className="mt-6"><h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Product Description</h2><p className="mt-2 text-gray-600">{selectedProduct.description}</p></div><div className="flex items-center mt-8 space-x-4"><button onClick={() => addToCart(selectedProduct)} className="flex-1 px-6 py-3 text-lg font-semibold text-gray-900 transition-all duration-300 bg-lime-500 rounded-md shadow-md hover:bg-lime-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"><span className="flex items-center justify-center space-x-2"><ShoppingCart className="w-5 h-5" /><span>Add to Cart</span></span></button><button className="p-3 text-gray-600 transition-colors duration-200 bg-gray-100 rounded-md hover:bg-gray-200" aria-label="Add to wishlist"><Heart className="w-6 h-6" /></button></div><button onClick={() => setCurrentPage('products')} className="flex items-center mt-8 text-lime-600 transition-colors duration-200 hover:text-lime-800"><ChevronLeft className="w-4 h-4 mr-2" /> Back to Products</button></div></div></motion.div> );
const CheckoutResultPage = ({ success, setCurrentPage }) => ( <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 mx-auto max-w-2xl sm:p-6 lg:p-8 text-center"><div className="p-8 bg-white rounded-lg shadow-lg">{success ? <CheckCircle className="w-16 h-16 mx-auto text-green-500" /> : <XCircle className="w-16 h-16 mx-auto text-red-500" />}<h2 className="mt-4 text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>{success ? 'Payment Successful!' : 'Payment Canceled'}</h2><p className="mt-2 text-gray-600">{success ? "Thank you for your purchase." : "Your order was canceled."}</p><button onClick={() => setCurrentPage('products')} className="px-6 py-3 mt-8 font-semibold text-white transition-transform duration-200 bg-lime-500 rounded-md shadow-lg hover:bg-lime-600 hover:scale-105">Continue Shopping</button></div></motion.div> );
const ContactPage = ({ setModal }) => { const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const handleSubmit = async (e) => { e.preventDefault(); try { await addDoc(collection(db, "messages"), { name: name, email: email, message: message, createdAt: serverTimestamp() }); setModal({ title: 'Message Sent!', message: "Thanks for reaching out. We'll get back to you soon." }); setName(''); setEmail(''); setMessage(''); } catch (error) { setModal({ title: 'Error', message: 'Could not send message. Please try again.' }); console.error("Error adding document: ", error); } }; return ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-2xl sm:p-6 lg:p-8"><div className="p-8 bg-white rounded-lg shadow-lg"><h2 className="mb-2 text-3xl font-bold text-center text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Contact Us</h2><p className="mb-8 text-center text-gray-600">Have a question or feedback? Drop us a line!</p><form onSubmit={handleSubmit} className="space-y-6"><div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm" /></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm" /></div><div><label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4" required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm"></textarea></div><div><button type="submit" className="flex items-center justify-center w-full px-4 py-3 font-semibold text-gray-900 transition-colors duration-200 bg-lime-500 border border-transparent rounded-md shadow-sm hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"><Send className="w-5 h-5 mr-2" />Send Message</button></div></form></div></motion.div> ); };
const AuthPage = ({ setCurrentPage, setModal }) => { const [isLogin, setIsLogin] = useState(true); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [name, setName] = useState(''); const handleSubmit = async (e) => { e.preventDefault(); try { if (isLogin) { await signInWithEmailAndPassword(auth, email, password); setModal({ title: 'Success!', message: 'You are now logged in.' }); setCurrentPage('home'); } else { const userCredential = await createUserWithEmailAndPassword(auth, email, password); await setDoc(doc(db, "users", userCredential.user.uid), { name: name, email: email, isAdmin: false }); setModal({ title: 'Success!', message: 'Your account has been created.' }); setCurrentPage('home'); } } catch (error) { setModal({ title: 'Authentication Error', message: error.message }); } }; return ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-md sm:p-6 lg:p-8"><div className="p-8 bg-white rounded-lg shadow-lg"><h2 className="mb-6 text-3xl font-bold text-center text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>{isLogin ? 'Welcome Back!' : 'Create an Account'}</h2><form onSubmit={handleSubmit} className="space-y-6">{!isLogin && ( <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm" /></div> )}<div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm" /></div><div><label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm" /></div><div><button type="submit" className="flex items-center justify-center w-full px-4 py-3 font-semibold text-gray-900 transition-colors duration-200 bg-lime-500 border border-transparent rounded-md shadow-sm hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500">{isLogin ? 'Log In' : 'Sign Up'}</button></div></form><p className="mt-4 text-sm text-center"><button onClick={() => setIsLogin(!isLogin)} className="font-medium text-lime-600 hover:text-lime-500">{isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}</button></p></div></motion.div> ); };
const AdminPage = ({ user }) => { const [messages, setMessages] = useState([]); const [loading, setLoading] = useState(true); useEffect(() => { const fetchMessages = async () => { try { const messagesQuery = query(collection(db, "messages"), orderBy("createdAt", "desc")); const querySnapshot = await getDocs(messagesQuery); const messagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); setMessages(messagesData); } catch (error) { console.error("Error fetching messages: ", error); } finally { setLoading(false); } }; fetchMessages(); }, []); if (loading) { return <div className="text-center p-10">Loading messages...</div>; } return ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-4xl sm:p-6 lg:p-8"><div className="p-8 bg-white rounded-lg shadow-lg"><h2 className="mb-6 text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Admin Panel: Messages</h2><div className="space-y-4">{messages.length > 0 ? ( messages.map(msg => ( <div key={msg.id} className="p-4 border rounded-md bg-gray-50"><div className="flex justify-between items-start"><div><p className="font-semibold">{msg.name} <span className="font-normal text-gray-500">- {msg.email}</span></p><p className="mt-2 text-gray-700">{msg.message}</p></div><a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}&su=Re: Your message to Seven 17`} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-1 text-sm font-semibold text-white bg-lime-500 rounded-md hover:bg-lime-600 transition-colors"><Mail className="w-4 h-4 mr-2"/> Reply</a></div><p className="mt-2 text-xs text-gray-400">Received: {msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleString() : 'No date'}</p></div> )) ) : ( <p>No messages yet.</p> )}</div></div></motion.div> ); };

const AccountPage = ({ user, setModal, setCurrentPage }) => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [name, setName] = useState(user.displayName || '');
    const [email, setEmail] = useState(user.email || '');

    useEffect(() => {
        const fetchOrders = async () => {
            if (user) {
                try {
                    const ordersQuery = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc"));
                    const querySnapshot = await getDocs(ordersQuery);
                    const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                    setOrders(ordersData);
                } catch (error) {
                    console.error("Error fetching orders: ", error);
                } finally {
                    setLoadingOrders(false);
                }
            }
        };
        if (activeTab === 'orders') {
            fetchOrders();
        }
    }, [user, activeTab]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            if (auth.currentUser.displayName !== name) {
                await updateProfile(auth.currentUser, { displayName: name });
            }
            if (auth.currentUser.email !== email) {
                await updateEmail(auth.currentUser, email);
            }
            await setDoc(doc(db, "users", user.uid), { name, email }, { merge: true });
            setModal({ title: 'Success', message: 'Your profile has been updated.' });
        } catch (error) {
            setModal({ title: 'Error', message: `Could not update profile: ${error.message}` });
        }
    };
    
    const handlePasswordReset = async () => {
        try {
            await sendPasswordResetEmail(auth, user.email);
            setModal({ title: 'Password Reset', message: 'A password reset link has been sent to your email.' });
        } catch (error) {
            setModal({ title: 'Error', message: error.message });
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        setCurrentPage('home');
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-4xl sm:p-6 lg:p-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-8">
                    <h2 className="text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>My Account</h2>
                    <p className="mt-2 text-gray-600">Manage your orders and account details.</p>
                </div>
                <div className="border-b border-gray-200">
                    <nav className="-mb-px flex px-8" aria-label="Tabs">
                        <button onClick={() => setActiveTab('orders')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-lime-500 text-lime-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><Package className="inline-block w-5 h-5 mr-2"/>Order History</button>
                        <button onClick={() => setActiveTab('settings')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-lime-500 text-lime-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}><Settings className="inline-block w-5 h-5 mr-2"/>Account Settings</button>
                    </nav>
                </div>
                <div className="p-8">
                    {activeTab === 'orders' && (
                        <div>
                            {loadingOrders ? <p>Loading orders...</p> : orders.length > 0 ? (
                                <div className="space-y-4">
                                    {orders.map(order => (
                                        <div key={order.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                                <p className="font-semibold">Order #{order.id.substring(0, 8)}</p>
                                                <p className="text-sm text-gray-500">{new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</p>
                                            </div>
                                            <div className="mt-4">
                                                {order.items.map(item => (
                                                    <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                                                        <p>{item.name} (x{item.quantity})</p>
                                                        <p>£{(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <p className="text-right font-bold mt-2">Total: £{order.total.toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : <p>You have no past orders.</p>}
                        </div>
                    )}
                    {activeTab === 'settings' && (
                        <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg mx-auto">
                            <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm" /></div>
                            <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm" /></div>
                            <div><button type="submit" className="w-full px-4 py-2 font-semibold text-gray-900 bg-lime-500 rounded-md hover:bg-lime-600">Update Profile</button></div>
                            <div className="text-center">
                                <button type="button" onClick={handlePasswordReset} className="text-sm text-lime-600 hover:underline">Send Password Reset Email</button>
                            </div>
                            <div className="border-t pt-6">
                                <button type="button" onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 font-semibold text-white bg-gray-700 rounded-md hover:bg-gray-800"><LogOut className="w-5 h-5 mr-2" /> Log Out</button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </motion.div>
    );
};


// --- MAIN APP COMPONENT ---

export default function App() {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [modal, setModal] = useState(null);

    // Effect for handling authentication state
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                setIsAdmin(userDoc.exists() && userDoc.data().isAdmin);
            } else {
                setIsAdmin(false);
            }
            setAuthChecked(true); // Mark that the initial check is complete
        });
        return () => unsubscribe();
    }, []);

    // Effect for handling checkout redirects
    useEffect(() => {
        const processCheckout = async () => {
            const query = new URLSearchParams(window.location.search);

            if (query.get("success") && user) {
                const storedCart = localStorage.getItem('cartForCheckout');
                if (storedCart) {
                    const cartItems = JSON.parse(storedCart);
                    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    try {
                        await addDoc(collection(db, "orders"), {
                            userId: user.uid,
                            items: cartItems,
                            total: total,
                            createdAt: serverTimestamp()
                        });
                        localStorage.removeItem('cartForCheckout');
                    } catch (error) {
                        console.error("Failed to save order:", error);
                    }
                }
                setCurrentPage("success");
                setCart([]);
                window.history.replaceState(null, '', window.location.pathname);
            }
            
            if (query.get("canceled")) {
                setCurrentPage("cancel");
                localStorage.removeItem('cartForCheckout');
                window.history.replaceState(null, '', window.location.pathname);
            }
        };

        if (authChecked) { // Only run this logic AFTER the initial auth check
            processCheckout();
        }
    }, [authChecked, user]);


    const addToCart = (product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) { return prevCart.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item); }
            return [...prevCart, { ...product, quantity: 1 }];
        });
        setModal({ title: 'Success!', message: `${product.name} has been added to your cart.` });
    };

    const removeFromCart = (productId) => setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity <= 0) { removeFromCart(productId); } 
        else { setCart((prevCart) => prevCart.map((item) => item.id === productId ? { ...item, quantity: newQuantity } : item)); }
    };
    const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);

    const handleCheckout = async () => {
        if (!window.Stripe) { setModal({ title: 'Error', message: 'Stripe is not loaded.' }); return; }
        
        if (user) {
             localStorage.setItem('cartForCheckout', JSON.stringify(cart));
        }

        const stripe = window.Stripe('pk_test_51RxSCvGpKT3UikNEDttkWgGAxCouVQ9iuGARl8Q9Z8P19KZipNITS7DqgPdchrDzaVDc7SWqeedhxATDvXGZYJgI00ZNNtHGa3');
        
        const response = await fetch('http://localhost:4242/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cart }),
        });

        if (!response.ok) { 
            setModal({ title: 'Server Error', message: 'Could not connect to the server. Is it running?' });
            return; 
        }

        const session = await response.json();
        const result = await stripe.redirectToCheckout({ sessionId: session.id });
        if (result.error) { 
            setModal({ title: 'Checkout Error', message: result.error.message });
            localStorage.removeItem('cartForCheckout');
        }
    };

    const renderPage = () => {
        const props = { setCurrentPage, setSelectedProduct, addToCart, setModal, selectedProduct, user };
        switch (currentPage) {
            case 'home': return <HomePage {...props} />;
            case 'products': return <ProductsPage {...props} />;
            case 'product': return <ProductDetailPage {...props} />;
            case 'login': return <AuthPage {...props} />;
            case 'account': return user ? <AccountPage {...props} /> : <AuthPage {...props} />;
            case 'contact': return <ContactPage {...props} />;
            case 'admin': return isAdmin ? <AdminPage {...props} /> : <HomePage {...props} />;
            case 'success': return <CheckoutResultPage success {...props} />;
            case 'cancel': return <CheckoutResultPage {...props} />;
            default: return <HomePage {...props} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
            <header className="sticky top-0 z-30 p-4 bg-white/90 backdrop-blur-md shadow-sm sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mx-auto max-w-7xl">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 transition-colors duration-200 rounded-full lg:hidden hover:bg-gray-100" aria-label="Toggle mobile menu">
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('home')}} className="flex items-center space-x-2 text-2xl font-extrabold text-gray-900">
                           <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M4 12L12 4L20 12L12 20L4 12Z" stroke="#A3E635" strokeWidth="2" strokeLinejoin="round"/>
                                <path d="M12 4L20 12L12 20" stroke="#4D7C0F" strokeWidth="2" strokeLinejoin="round"/>
                           </svg>
                           <span>Seven 17</span>
                        </a>
                    </div>
                    <nav className="hidden lg:flex lg:space-x-8">
                        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('home')}} className="text-lg font-medium text-gray-700 transition-colors duration-200 hover:text-lime-500">Home</a>
                        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('products')}} className="text-lg font-medium text-gray-700 transition-colors duration-200 hover:text-lime-500">Products</a>
                        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('contact')}} className="text-lg font-medium text-gray-700 transition-colors duration-200 hover:text-lime-500">Contact</a>
                        {isAdmin && (
                            <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('admin')}} className="flex items-center text-lg font-medium text-lime-600 transition-colors duration-200 hover:text-lime-500">
                                <ShieldCheck className="w-5 h-5 mr-1" /> Admin
                            </a>
                        )}
                    </nav>
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <button onClick={() => setCurrentPage('account')} className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100" aria-label="My Account">
                                <User className="w-6 h-6 text-gray-700" />
                            </button>
                        ) : (
                            <button onClick={() => setCurrentPage('login')} className="px-4 py-2 text-sm font-semibold text-gray-800 transition-colors duration-200 bg-gray-200 rounded-md hover:bg-gray-300">
                                Login
                            </button>
                        )}
                        <button onClick={() => setIsCartOpen(true)} className="relative p-2 transition-colors duration-200 rounded-full hover:bg-gray-100" aria-label="Open shopping cart">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            {cart.length > 0 && (<span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-gray-900 bg-lime-400 rounded-full">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>)}
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="py-8">
                <AnimatePresence mode="wait">
                    {renderPage()}
                </AnimatePresence>
            </main>

            <AnimatePresence>
                {isCartOpen && (
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed inset-y-0 right-0 z-40 flex flex-col w-full max-w-sm bg-white shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200"><h2 className="text-xl font-bold">Shopping Cart</h2><button onClick={() => setIsCartOpen(false)} className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100" aria-label="Close cart"><X className="w-6 h-6" /></button></div>
                        <div className="flex-1 p-4 overflow-y-auto">{cart.length === 0 ? <p className="text-gray-500">Your cart is empty.</p> : cart.map((item) => ( <div key={item.id} className="flex items-center pb-4 mb-4 border-b border-gray-100"><img src={item.image} alt={item.name} className="object-cover w-16 h-16 mr-4 rounded-md" /><div className="flex-1"><h3 className="font-semibold text-gray-900">{item.name}</h3><p className="text-sm text-gray-600">£{item.price.toFixed(2)} x {item.quantity}</p><div className="flex items-center mt-2"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">-</button><span className="w-8 mx-2 text-center">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">+</button></div></div><button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 rounded-full hover:bg-red-50"><X className="w-5 h-5" /></button></div> ))}</div>
                        {cart.length > 0 && (<div className="p-4 bg-gray-50"><div className="flex justify-between text-lg font-bold"><span>Total:</span><span>£{calculateTotal()}</span></div><button onClick={handleCheckout} className="w-full py-3 mt-4 font-semibold text-gray-900 transition-colors duration-200 bg-lime-500 rounded-md hover:bg-lime-600">Checkout</button></div>)}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>{modal && <Modal title={modal.title} message={modal.message} onClose={() => setModal(null)} />}</AnimatePresence>

            <footer className="p-6 text-center text-white bg-gray-900"><p>© 2025 Seven 17. All rights reserved.</p></footer>
        </div>
    );
}

