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
import { ShoppingCart, Heart, Menu, X, ChevronLeft, Star, Send, CheckCircle, XCircle, User, LogOut, ShieldCheck, Mail, Package, Settings, Sun, Leaf, Snowflake, Flower, Edit, Trash2, PlusCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- FIREBASE SETUP ---
import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, updateProfile, updateEmail, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, serverTimestamp, query, orderBy, getDocs, where, deleteDoc, updateDoc } from 'firebase/firestore';

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

// --- HELPER & PAGE COMPONENTS (Styling from Volt Theme) ---

const Modal = ({ title, message, onClose, children }) => ( <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-80"><motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="w-full max-w-md p-6 bg-white rounded-lg shadow-2xl"><h3 className="mb-4 text-2xl font-bold text-gray-800 text-center">{title}</h3>{message && <p className="mb-4 text-gray-600 text-center">{message}</p>}{children}<button onClick={onClose} className="w-full px-4 py-2 mt-4 font-semibold text-white transition-all duration-300 bg-gray-400 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2">Close</button></motion.div></div> );
const ProductCard = ({ product, onViewProduct, onAddToCart }) => ( <motion.div layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="overflow-hidden bg-white rounded-lg shadow-md group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"><div className="relative overflow-hidden cursor-pointer h-60" onClick={() => onViewProduct(product)}><img src={product.image} alt={product.name} className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }}/></div><div className="p-4 flex flex-col flex-grow"><h3 className="text-lg font-semibold text-gray-800">{product.name}</h3><p className="mt-1 text-sm text-gray-500 truncate flex-grow">{product.description}</p><div className="flex items-center justify-between mt-2"><p className="text-xl font-bold text-gray-900">£{product.price ? product.price.toFixed(2) : '0.00'}</p><div className="flex items-center text-sm text-gray-500"><Star className="w-4 h-4 mr-1 text-lime-400 fill-current" /><span>{product.rating} ({product.reviews})</span></div></div><div className="flex items-center justify-between mt-4 space-x-2"><button onClick={() => onViewProduct(product)} className="flex-1 px-4 py-2 text-sm font-semibold text-lime-600 transition-colors duration-200 bg-lime-50 rounded-md hover:bg-lime-100">View Details</button><button onClick={() => onAddToCart(product)} className="p-2 text-white transition-all duration-300 bg-lime-500 rounded-md hover:bg-lime-600 transform group-hover:scale-110" aria-label="Add to cart"><ShoppingCart className="w-5 h-5" /></button></div></div></motion.div> );
const HomePage = ({ setCurrentPage, setSelectedProduct, addToCart, products }) => ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8"><div className="p-8 mb-8 text-center bg-gray-800 rounded-lg shadow-lg"><h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl" style={{ fontFamily: "'Poppins', sans-serif" }}>Welcome to Seven 17!</h2><p className="mt-4 text-xl text-gray-300">The fastest way to get the best products.</p><button onClick={() => setCurrentPage('products')} className="px-8 py-4 mt-8 font-bold text-gray-900 transition-all duration-300 transform bg-gradient-to-r from-lime-400 to-lime-500 rounded-md shadow-lg hover:shadow-lime-500/50 hover:scale-105">Shop Now</button></div><h3 className="mb-6 text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Featured Products</h3><div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{products.slice(0, 4).map((product) => ( <ProductCard key={product.id} product={product} onViewProduct={(p) => { setSelectedProduct(p); setCurrentPage('product'); }} onAddToCart={addToCart} /> ))}</div></motion.div> );

const ProductsPage = ({ setSelectedProduct, setCurrentPage, addToCart, products }) => {
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortOption, setSortOption] = useState('default');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = ['All', 'Spring', 'Summer', 'Autumn', 'Winter'];
    const categoryIcons = { Spring: Flower, Summer: Sun, Autumn: Leaf, Winter: Snowflake };

    const processedProducts = products
        .filter(p => selectedCategory === 'All' || p.category === selectedCategory)
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .sort((a, b) => {
            switch (sortOption) {
                case 'price-asc': return a.price - b.price;
                case 'price-desc': return b.price - a.price;
                case 'rating-desc': return b.rating - a.rating;
                default: return 0;
            }
        });

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8">
            <h2 className="mb-6 text-3xl font-bold text-center text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>All Products</h2>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">{categories.map(category => { const Icon = categoryIcons[category]; return ( <button key={category} onClick={() => setSelectedCategory(category)} className={`flex items-center px-4 py-2 text-sm sm:text-base font-semibold transition-all duration-300 rounded-md transform hover:scale-105 ${selectedCategory === category ? 'bg-lime-500 text-gray-900 shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>{Icon && <Icon className="w-5 h-5 mr-2" />} {category}</button> ); })}</div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8"><input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500"/><select value={sortOption} onChange={e => setSortOption(e.target.value)} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500"><option value="default">Default Sort</option><option value="price-asc">Price: Low to High</option><option value="price-desc">Price: High to Low</option><option value="rating-desc">Rating: High to Low</option></select></div>
            <AnimatePresence><motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{processedProducts.map((product) => ( <ProductCard key={product.id} product={product} onViewProduct={(p) => { setSelectedProduct(p); setCurrentPage('product'); }} onAddToCart={addToCart} /> ))}</motion.div></AnimatePresence>
        </motion.div>
    );
};

const ProductDetailPage = ({ selectedProduct, setCurrentPage, addToCart }) => ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8"><div className="flex flex-col lg:flex-row lg:space-x-8"><div className="w-full lg:w-1/2"><img src={selectedProduct.image} alt={selectedProduct.name} className="object-cover w-full rounded-lg shadow-xl" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }}/></div><div className="w-full mt-8 lg:w-1/2 lg:mt-0"><div className="pb-6 border-b border-gray-200"><h1 className="text-4xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>{selectedProduct.name}</h1><div className="flex items-center mt-2 space-x-2 text-lime-400">{Array.from({ length: 5 }, (_, i) => (<Star key={i} className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-gray-300'}`} />))}<span className="text-lg font-semibold text-gray-600 ml-2">{selectedProduct.rating}</span><span className="text-sm text-gray-500">({selectedProduct.reviews} reviews)</span></div><p className="mt-4 text-3xl font-bold text-gray-900">£{selectedProduct.price.toFixed(2)}</p></div><div className="mt-6"><h2 className="text-xl font-semibold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Product Description</h2><p className="mt-2 text-gray-600">{selectedProduct.description}</p></div><div className="flex items-center mt-8 space-x-4"><button onClick={() => addToCart(selectedProduct)} className="flex-1 px-6 py-3 text-lg font-semibold text-gray-900 transition-all duration-300 bg-lime-500 rounded-md shadow-md hover:bg-lime-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"><span className="flex items-center justify-center space-x-2"><ShoppingCart className="w-5 h-5" /><span>Add to Cart</span></span></button><button className="p-3 text-gray-600 transition-colors duration-200 bg-gray-100 rounded-md hover:bg-gray-200" aria-label="Add to wishlist"><Heart className="w-6 h-6" /></button></div><button onClick={() => setCurrentPage('products')} className="flex items-center mt-8 text-lime-600 transition-colors duration-200 hover:text-lime-800"><ChevronLeft className="w-4 h-4 mr-2" /> Back to Products</button></div></div></motion.div> );
const CheckoutResultPage = ({ success, setCurrentPage }) => ( <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 mx-auto max-w-2xl sm:p-6 lg:p-8 text-center"><div className="p-8 bg-white rounded-lg shadow-lg">{success ? <CheckCircle className="w-16 h-16 mx-auto text-green-500" /> : <XCircle className="w-16 h-16 mx-auto text-red-500" />}<h2 className="mt-4 text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>{success ? 'Payment Successful!' : 'Payment Canceled'}</h2><p className="mt-2 text-gray-600">{success ? "Thank you for your purchase." : "Your order was canceled."}</p><button onClick={() => setCurrentPage('products')} className="px-6 py-3 mt-8 font-semibold text-white transition-transform duration-200 bg-lime-500 rounded-md shadow-lg hover:bg-lime-600 hover:scale-105">Continue Shopping</button></div></motion.div> );
const ContactPage = ({ setModal }) => { const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const handleSubmit = async (e) => { e.preventDefault(); try { await addDoc(collection(db, "messages"), { name: name, email: email, message: message, createdAt: serverTimestamp() }); setModal({ title: 'Message Sent!', message: "Thanks for reaching out. We'll get back to you soon." }); setName(''); setEmail(''); setMessage(''); } catch (error) { setModal({ title: 'Error', message: 'Could not send message. Please try again.' }); console.error("Error adding document: ", error); } }; return ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-2xl sm:p-6 lg:p-8"><div className="p-8 bg-white rounded-lg shadow-lg"><h2 className="mb-2 text-3xl font-bold text-center text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Contact Us</h2><p className="mb-8 text-center text-gray-600">Have a question or feedback? Drop us a line!</p><form onSubmit={handleSubmit} className="space-y-6"><div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm" /></div><div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm" /></div><div><label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4" required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm"></textarea></div><div><button type="submit" className="flex items-center justify-center w-full px-4 py-3 font-semibold text-gray-900 transition-colors duration-200 bg-lime-500 border border-transparent rounded-md shadow-sm hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500"><Send className="w-5 h-5 mr-2" />Send Message</button></div></form></div></motion.div> ); };
const AuthPage = ({ setCurrentPage, setModal }) => { const [isLogin, setIsLogin] = useState(true); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [name, setName] = useState(''); const handleSubmit = async (e) => { e.preventDefault(); try { if (isLogin) { await signInWithEmailAndPassword(auth, email, password); setModal({ title: 'Success!', message: 'You are now logged in.' }); setCurrentPage('home'); } else { const userCredential = await createUserWithEmailAndPassword(auth, email, password); await setDoc(doc(db, "users", userCredential.user.uid), { name: name, email: email, isAdmin: false }); setModal({ title: 'Success!', message: 'Your account has been created.' }); setCurrentPage('home'); } } catch (error) { setModal({ title: 'Authentication Error', message: error.message }); } }; return ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-md sm:p-6 lg:p-8"><div className="p-8 bg-white rounded-lg shadow-lg"><h2 className="mb-6 text-3xl font-bold text-center text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>{isLogin ? 'Welcome Back!' : 'Create an Account'}</h2><form onSubmit={handleSubmit} className="space-y-6">{!isLogin && ( <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm" /></div> )}<div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm" /></div><div><label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500 sm:text-sm" /></div><div><button type="submit" className="flex items-center justify-center w-full px-4 py-3 font-semibold text-gray-900 transition-colors duration-200 bg-lime-500 border border-transparent rounded-md shadow-sm hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500">{isLogin ? 'Log In' : 'Sign Up'}</button></div></form><p className="mt-4 text-sm text-center"><button onClick={() => setIsLogin(!isLogin)} className="font-medium text-lime-600 hover:text-lime-500">{isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}</button></p></div></motion.div> ); };

const AccountPage = ({ user, setModal, setCurrentPage }) => { /* ... Account Page code ... */ };
const AdminPage = ({ user, products, setProducts, setModal }) => { /* ... Admin Page code ... */ };

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
    const [products, setProducts] = useState([]); // Products now live in state

    // Effect to fetch products from Firestore on initial load
    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = collection(db, 'products');
            const productSnapshot = await getDocs(productsCollection);
            const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productList);
        };
        fetchProducts();
    }, []);

    // Effect for handling authentication state
    useEffect(() => { /* ... auth effect ... */ }, []);

    // Effect for handling checkout redirects
    useEffect(() => { /* ... checkout effect ... */ }, [authChecked, user]);

    const addToCart = (product) => { /* ... addToCart logic ... */ };
    const removeFromCart = (productId) => { /* ... removeFromCart logic ... */ };
    const updateQuantity = (productId, newQuantity) => { /* ... updateQuantity logic ... */ };
    const calculateTotal = () => { /* ... calculateTotal logic ... */ };
    const handleCheckout = async () => { /* ... handleCheckout logic ... */ };

    const renderPage = () => {
        const props = { setCurrentPage, setSelectedProduct, addToCart, setModal, selectedProduct, user, products, setProducts };
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
            {/* Header, Main, Modals, Footer etc. */}
        </div>
    );
}

// NOTE: Some page components and logic have been collapsed for brevity.
// The full implementation of the AdminPage and other components would include
// full CRUD (Create, Read, Update, Delete) functionality for products.

