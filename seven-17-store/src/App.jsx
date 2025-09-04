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

import React, { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Heart, Menu, X, ChevronLeft, Star, Send, CheckCircle, XCircle, User, LogOut, ShieldCheck, Mail, Package, Settings, Sun, Leaf, Snowflake, Flower, Edit, Trash2, PlusCircle, MessageSquare } from 'lucide-react';
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

// --- HELPER & PAGE COMPONENTS ---

const Modal = ({ title, message, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900 bg-opacity-80">
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md p-6 bg-white rounded-lg shadow-2xl"
        >
            <h3 className="mb-4 text-2xl font-bold text-gray-800 text-center">{title}</h3>
            {message && <p className="mb-4 text-gray-600 text-center">{message}</p>}
            {children}
            {!children && (
                <button
                    onClick={onClose}
                    className="w-full px-4 py-2 mt-4 font-semibold text-white transition-all duration-300 bg-lime-500 rounded-md hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-lime-400 focus:ring-offset-2"
                >
                    OK
                </button>
            )}
            {children && (
                 <button
                    onClick={onClose}
                    className="w-full px-4 py-2 mt-4 font-semibold text-white transition-all duration-300 bg-gray-400 rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
                >
                    Close
                </button>
            )}
        </motion.div>
    </div>
);

const ProductCard = ({ product, onViewProduct, onAddToCart }) => (
    <motion.div
        layout
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="overflow-hidden bg-white rounded-lg shadow-md group transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
    >
        <div className="relative overflow-hidden cursor-pointer h-60" onClick={() => onViewProduct(product)}>
            <img
                src={product.images && product.images[0] ? product.images[0] : 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image'}
                alt={product.name}
                className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }}
            />
        </div>
        <div className="p-4 flex flex-col flex-grow">
            <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
            <p className="mt-1 text-sm text-gray-500 truncate flex-grow">{product.description}</p>
            <div className="flex items-center justify-between mt-2">
                <p className="text-xl font-bold text-gray-900">£{product.price ? product.price.toFixed(2) : '0.00'}</p>
                <div className="flex items-center text-sm text-gray-500">
                    <Star className="w-4 h-4 mr-1 text-lime-400 fill-current" />
                    <span>{product.rating || 0} ({product.reviews || 0})</span>
                </div>
            </div>
            <div className="flex items-center justify-between mt-4 space-x-2">
                <button onClick={() => onViewProduct(product)} className="flex-1 px-4 py-2 text-sm font-semibold text-lime-600 transition-colors duration-200 bg-lime-50 rounded-md hover:bg-lime-100">
                    View Details
                </button>
                <button onClick={() => onAddToCart(product)} className="p-2 text-white transition-all duration-300 bg-lime-500 rounded-md hover:bg-lime-600 transform group-hover:scale-110" aria-label="Add to cart">
                    <ShoppingCart className="w-5 h-5" />
                </button>
            </div>
        </div>
    </motion.div>
);

const HomePage = ({ setCurrentPage, setSelectedProduct, addToCart, products }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8">
        <div className="p-8 mb-8 text-center bg-gray-800 rounded-lg shadow-lg">
            <h2 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl" style={{ fontFamily: "'Poppins', sans-serif" }}>Welcome to Seven 17!</h2>
            <p className="mt-4 text-xl text-gray-300">The fastest way to get the best products.</p>
            <button onClick={() => setCurrentPage('products')} className="px-8 py-4 mt-8 font-bold text-gray-900 transition-all duration-300 transform bg-gradient-to-r from-lime-400 to-lime-500 rounded-md shadow-lg hover:shadow-lime-500/50 hover:scale-105">
                Shop Now
            </button>
        </div>
        <h3 className="mb-6 text-3xl font-bold text-gray-900" style={{ fontFamily: "'Poppins', sans-serif" }}>Featured Products</h3>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} onViewProduct={(p) => { setSelectedProduct(p); setCurrentPage('product'); }} onAddToCart={addToCart} />
            ))}
        </div>
    </motion.div>
);

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
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8">
                {categories.map(category => {
                    const Icon = categoryIcons[category];
                    return (
                        <button key={category} onClick={() => setSelectedCategory(category)} className={`flex items-center px-4 py-2 text-sm sm:text-base font-semibold transition-all duration-300 rounded-md transform hover:scale-105 ${selectedCategory === category ? 'bg-lime-500 text-gray-900 shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
                            {Icon && <Icon className="w-5 h-5 mr-2" />} {category}
                        </button>
                    );
                })}
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
                <input type="text" placeholder="Search products..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500"/>
                <select value={sortOption} onChange={e => setSortOption(e.target.value)} className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-lime-500 focus:border-lime-500">
                    <option value="default">Default Sort</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating-desc">Rating: High to Low</option>
                </select>
            </div>
            <AnimatePresence>
                <motion.div layout className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {processedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} onViewProduct={(p) => { setSelectedProduct(p); setCurrentPage('product'); }} onAddToCart={addToCart} />
                    ))}
                </motion.div>
            </AnimatePresence>
        </motion.div>
    );
};

const StarRatingInput = ({ rating, setRating }) => (
    <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={`w-8 h-8 cursor-pointer transition-colors ${rating >= star ? 'text-lime-400 fill-current' : 'text-gray-300'}`}
                onClick={() => setRating(star)}
            />
        ))}
    </div>
);

const ProductDetailPage = ({ selectedProduct, setCurrentPage, addToCart, user, isAdmin, setModal }) => {
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [newRating, setNewRating] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [selectedImage, setSelectedImage] = useState(selectedProduct.images && selectedProduct.images[0] ? selectedProduct.images[0] : 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image');

    const fetchReviews = useCallback(async () => {
        if (!selectedProduct) return;
        setLoadingReviews(true);
        try {
            const reviewsQuery = query(collection(db, "reviews"), where("productId", "==", selectedProduct.id), orderBy("createdAt", "desc"));
            const querySnapshot = await getDocs(reviewsQuery);
            const reviewsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setReviews(reviewsData);
        } catch (error) { console.error("Error fetching reviews: ", error); } 
        finally { setLoadingReviews(false); }
    }, [selectedProduct]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);
    
    useEffect(() => {
        setSelectedImage(selectedProduct.images && selectedProduct.images[0] ? selectedProduct.images[0] : 'https://placehold.co/600x400/cccccc/ffffff?text=No+Image')
    }, [selectedProduct]);

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (newRating === 0 || !newComment.trim()) { setModal({ title: "Incomplete Review", message: "Please select a star rating and write a comment." }); return; }
        try {
            await addDoc(collection(db, 'reviews'), { productId: selectedProduct.id, userId: user.uid, userName: user.displayName || 'Anonymous', rating: newRating, comment: newComment, createdAt: serverTimestamp() });
            setModal({ title: "Review Submitted", message: "Thank you for your feedback!" });
            setNewRating(0); setNewComment('');
            fetchReviews();
        } catch (error) {
            setModal({ title: "Error", message: "Could not submit your review. Please try again." });
            console.error("Error submitting review: ", error);
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm('Are you sure you want to delete this review?')) {
            try {
                await deleteDoc(doc(db, 'reviews', reviewId));
                setModal({ title: 'Success', message: 'Review deleted.' });
                fetchReviews();
            } catch (error) {
                setModal({ title: 'Error', message: 'Failed to delete review.' });
                console.error("Error deleting review:", error);
            }
        }
    };

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="w-full lg:w-1/2">
                <motion.div key={selectedImage} initial={{opacity:0}} animate={{opacity:1}} className="mb-4">
                  <img src={selectedImage} alt={selectedProduct.name} className="object-contain w-full h-96 rounded-lg shadow-xl" onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }}/>
                </motion.div>
                <div className="flex space-x-2 overflow-x-auto">
                    {selectedProduct.images && selectedProduct.images.map((img, index) => (
                        <img 
                            key={index}
                            src={img}
                            alt={`${selectedProduct.name} thumbnail ${index + 1}`}
                            onClick={() => setSelectedImage(img)}
                            className={`w-20 h-20 object-cover rounded-md cursor-pointer border-2 ${selectedImage === img ? 'border-lime-500' : 'border-transparent'}`}
                        />
                    ))}
                </div>
            </div>
            <div className="w-full mt-8 lg:w-1/2 lg:mt-0">
                <div className="pb-6 border-b border-gray-200"><h1 className="text-4xl font-bold text-gray-900">{selectedProduct.name}</h1><div className="flex items-center mt-2 space-x-2 text-lime-400">{Array.from({ length: 5 }, (_, i) => (<Star key={i} className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-gray-300'}`} />))}<span className="text-lg font-semibold text-gray-600 ml-2">{selectedProduct.rating}</span><span className="text-sm text-gray-500">({selectedProduct.reviews} reviews)</span></div><p className="mt-4 text-3xl font-bold text-gray-900">£{selectedProduct.price.toFixed(2)}</p></div>
                <div className="mt-6"><h2 className="text-xl font-semibold text-gray-900">Product Description</h2><p className="mt-2 text-gray-600">{selectedProduct.description}</p></div>
                <div className="flex items-center mt-8 space-x-4"><button onClick={() => addToCart(selectedProduct)} className="flex-1 px-6 py-3 text-lg font-semibold text-gray-900 transition-all duration-300 bg-lime-500 rounded-md shadow-md hover:bg-lime-600 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-lime-500 focus:ring-offset-2"><span className="flex items-center justify-center space-x-2"><ShoppingCart className="w-5 h-5" /><span>Add to Cart</span></span></button><button className="p-3 text-gray-600 transition-colors duration-200 bg-gray-100 rounded-md hover:bg-gray-200" aria-label="Add to wishlist"><Heart className="w-6 h-6" /></button></div>
                 <button onClick={() => setCurrentPage('products')} className="flex items-center mt-8 text-lime-600 transition-colors duration-200 hover:text-lime-800"><ChevronLeft className="w-4 h-4 mr-2" /> Back to Products</button>
            </div>
        </div>
        
        <div className="mt-12"><h2 className="text-3xl font-bold text-gray-900 mb-6">Customer Reviews</h2>{user ? ( <div className="p-6 mb-8 bg-white rounded-lg shadow-md"><h3 className="text-xl font-semibold mb-4">Leave a Review</h3><form onSubmit={handleReviewSubmit} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label><StarRatingInput rating={newRating} setRating={setNewRating} /></div><div><label htmlFor="comment" className="block text-sm font-medium text-gray-700">Your Comment</label><textarea id="comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} rows="4" required className="w-full mt-1 p-2 border rounded-md focus:ring-lime-500 focus:border-lime-500"></textarea></div><button type="submit" className="px-4 py-2 font-semibold text-gray-900 bg-lime-500 rounded-md hover:bg-lime-600">Submit Review</button></form></div> ) : ( <p className="mb-8 p-4 bg-gray-100 rounded-md text-center">You must be <button onClick={() => setCurrentPage('login')} className="font-bold text-lime-600 hover:underline">logged in</button> to leave a review.</p> )}<div className="space-y-6">{loadingReviews ? <p>Loading reviews...</p> : reviews.length > 0 ? ( reviews.map(review => ( <div key={review.id} className="p-4 bg-white rounded-lg shadow relative"><div className="flex items-center mb-2"><p className="font-bold mr-4">{review.userName}</p><div className="flex items-center">{Array.from({ length: 5 }, (_, i) => <Star key={i} className={`w-5 h-5 ${i < review.rating ? 'text-lime-400 fill-current' : 'text-gray-300'}`} />)}</div></div><p className="text-gray-700 pr-12">{review.comment}</p><p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt.seconds * 1000).toLocaleString()}</p>{isAdmin && ( <button onClick={() => handleDeleteReview(review.id)} className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 className="w-5 h-5" /></button> )}</div> )) ) : <p>No reviews yet. Be the first!</p>}</div></div>
      </motion.div>
    );
};
const CheckoutResultPage = ({ success, setCurrentPage }) => ( <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 mx-auto max-w-2xl sm:p-6 lg:p-8 text-center"><div className="p-8 bg-white rounded-lg shadow-lg">{success ? <CheckCircle className="w-16 h-16 mx-auto text-green-500" /> : <XCircle className="w-16 h-16 mx-auto text-red-500" />}<h2 className="mt-4 text-3xl font-bold text-gray-900">{success ? 'Payment Successful!' : 'Payment Canceled'}</h2><p className="mt-2 text-gray-600">{success ? "Thank you for your purchase." : "Your order was canceled."}</p><button onClick={() => setCurrentPage('products')} className="px-6 py-3 mt-8 font-semibold text-white transition-transform duration-200 bg-lime-500 rounded-md shadow-lg hover:bg-lime-600 hover:scale-105">Continue Shopping</button></div></motion.div> );
const ContactPage = ({ setModal }) => { const [name, setName] = useState(''); const [email, setEmail] = useState(''); const [message, setMessage] = useState(''); const handleSubmit = async (e) => { e.preventDefault(); try { await addDoc(collection(db, "messages"), { name, email, message, createdAt: serverTimestamp() }); setModal({ title: 'Message Sent!', message: "Thanks for reaching out." }); setName(''); setEmail(''); setMessage(''); } catch (error) { setModal({ title: 'Error', message: 'Could not send message.' }); console.error(error); } }; return ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-2xl sm:p-6 lg:p-8"><div className="p-8 bg-white rounded-lg shadow-lg"><h2 className="mb-2 text-3xl font-bold text-center text-gray-900">Contact Us</h2><p className="mb-8 text-center text-gray-600">Have a question? Drop us a line!</p><form onSubmit={handleSubmit} className="space-y-6"><div><label htmlFor="name">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full px-3 py-2 mt-1 border rounded-md"/></div><div><label htmlFor="email">Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-3 py-2 mt-1 border rounded-md"/></div><div><label htmlFor="message">Message</label><textarea value={message} onChange={(e) => setMessage(e.target.value)} rows="4" required className="block w-full px-3 py-2 mt-1 border rounded-md"></textarea></div><div><button type="submit" className="flex items-center justify-center w-full px-4 py-3 font-semibold text-gray-900 bg-lime-500 rounded-md"><Send className="w-5 h-5 mr-2" />Send Message</button></div></form></div></motion.div> ); };
const AuthPage = ({ setCurrentPage, setModal }) => { const [isLogin, setIsLogin] = useState(true); const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [name, setName] = useState(''); const handleSubmit = async (e) => { e.preventDefault(); try { if (isLogin) { await signInWithEmailAndPassword(auth, email, password); setModal({ title: 'Success!', message: 'You are now logged in.' }); setCurrentPage('home'); } else { const cred = await createUserWithEmailAndPassword(auth, email, password); await updateProfile(cred.user, { displayName: name }); await setDoc(doc(db, "users", cred.user.uid), { name, email, isAdmin: false }); setModal({ title: 'Success!', message: 'Account created.' }); setCurrentPage('home'); } } catch (error) { setModal({ title: 'Auth Error', message: error.message }); } }; return ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-md sm:p-6 lg:p-8"><div className="p-8 bg-white rounded-lg shadow-lg"><h2 className="mb-6 text-3xl font-bold text-center text-gray-900">{isLogin ? 'Welcome Back!' : 'Create an Account'}</h2><form onSubmit={handleSubmit} className="space-y-6">{!isLogin && ( <div><label htmlFor="name">Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="block w-full px-3 py-2 mt-1 border rounded-md" /></div> )}<div><label htmlFor="email">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="block w-full px-3 py-2 mt-1 border rounded-md" /></div><div><label htmlFor="password">Password</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="block w-full px-3 py-2 mt-1 border rounded-md" /></div><div><button type="submit" className="w-full px-4 py-3 font-semibold text-gray-900 bg-lime-500 rounded-md">{isLogin ? 'Log In' : 'Sign Up'}</button></div></form><p className="mt-4 text-sm text-center"><button onClick={() => setIsLogin(!isLogin)} className="font-medium text-lime-600 hover:text-lime-500">{isLogin ? 'Need an account? Sign up' : 'Have an account? Log in'}</button></p></div></motion.div> ); };

const AccountPage = ({ user, setModal, setCurrentPage }) => {
    const [activeTab, setActiveTab] = useState('orders');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [name, setName] = useState(user.displayName || '');
    const [email, setEmail] = useState(user.email || '');

    useEffect(() => {
        const fetchOrders = async () => { if (user) { try { const q = query(collection(db, "orders"), where("userId", "==", user.uid), orderBy("createdAt", "desc")); const snap = await getDocs(q); setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() }))); } catch (e) { console.error(e); } finally { setLoadingOrders(false); } } };
        if (activeTab === 'orders') { fetchOrders(); }
    }, [user, activeTab]);

    const handleUpdateProfile = async (e) => { e.preventDefault(); try { if (auth.currentUser.displayName !== name) { await updateProfile(auth.currentUser, { displayName: name }); } if (auth.currentUser.email !== email) { await updateEmail(auth.currentUser, email); } await setDoc(doc(db, "users", user.uid), { name, email }, { merge: true }); setModal({ title: 'Success', message: 'Profile updated.' }); } catch (e) { setModal({ title: 'Error', message: e.message }); } };
    const handlePasswordReset = async () => { try { await sendPasswordResetEmail(auth, user.email); setModal({ title: 'Password Reset', message: 'Reset link sent to your email.' }); } catch (e) { setModal({ title: 'Error', message: e.message }); } };
    const handleLogout = async () => { await signOut(auth); setCurrentPage('home'); };

    return ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-4xl sm:p-6 lg:p-8"><div className="bg-white rounded-lg shadow-lg overflow-hidden"><div className="p-8"><h2 className="text-3xl font-bold">My Account</h2><p className="mt-2 text-gray-600">Manage orders and details.</p></div><div className="border-b"><nav className="-mb-px flex px-8"><button onClick={() => setActiveTab('orders')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-lime-500 text-lime-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}><Package className="inline-block w-5 h-5 mr-2"/>Order History</button><button onClick={() => setActiveTab('settings')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'settings' ? 'border-lime-500 text-lime-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}><Settings className="inline-block w-5 h-5 mr-2"/>Account Settings</button></nav></div><div className="p-8">{activeTab === 'orders' && ( <div>{loadingOrders ? <p>Loading...</p> : orders.length > 0 ? ( <div className="space-y-4">{orders.map(o => ( <div key={o.id} className="border rounded-lg p-4"><div className="flex justify-between items-center"><p className="font-semibold">Order #{o.id.substring(0, 8)}</p><p className="text-sm text-gray-500">{new Date(o.createdAt.seconds * 1000).toLocaleDateString()}</p></div><div className="mt-4">{o.items.map(i => ( <div key={i.id} className="flex items-center justify-between py-2 border-b"><p>{i.name} (x{i.quantity})</p><p>£{(i.price * i.quantity).toFixed(2)}</p></div> ))}<p className="text-right font-bold mt-2">Total: £{o.total.toFixed(2)}</p></div></div> ))}</div> ) : <p>No past orders.</p>}</div> )}{activeTab === 'settings' && ( <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg mx-auto"><div><label>Full Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 border rounded-md"/></div><div><label>Email Address</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-2 border rounded-md"/></div><div><button type="submit" className="w-full p-2 font-semibold text-gray-900 bg-lime-500 rounded-md">Update Profile</button></div><div className="text-center"><button type="button" onClick={handlePasswordReset} className="text-sm text-lime-600 hover:underline">Send Password Reset</button></div><div className="border-t pt-6"><button type="button" onClick={handleLogout} className="w-full flex items-center justify-center p-2 font-semibold text-white bg-gray-700 rounded-md"><LogOut className="w-5 h-5 mr-2"/> Log Out</button></div></form> )}</div></div></motion.div> ); };

const AdminPage = ({ user, products, setProducts, setModal }) => {
    const [activeTab, setActiveTab] = useState('messages');
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const refreshProducts = async () => {
        const productSnapshot = await getDocs(collection(db, 'products'));
        setProducts(productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    useEffect(() => {
        const fetchMessages = async () => { setLoading(true); try { const q = query(collection(db, "messages"), orderBy("createdAt", "desc")); const snap = await getDocs(q); setMessages(snap.docs.map(d => ({ id: d.id, ...d.data() }))); } catch (e) { console.error(e); } finally { setLoading(false); } };
        if (activeTab === 'messages') fetchMessages();
    }, [activeTab]);
    
    const ProductForm = ({ product, onClose }) => {
        const [formData, setFormData] = useState(product || { name: '', description: '', price: 0, category: 'Spring', images: [], rating: 0, reviews: 0 });
        const handleChange = (e) => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: (name === 'price' || name === 'rating' || name === 'reviews') ? parseFloat(value) || 0 : value })); };
        const handleImagesChange = (e) => { setFormData(p => ({ ...p, images: e.target.value.split('\n').filter(url => url.trim() !== '') }))};

        const handleFormSubmit = async (e) => { e.preventDefault(); try { if (product && product.id) { await updateDoc(doc(db, 'products', product.id), formData); setModal({ title: 'Success', message: 'Product updated.' }); } else { await addDoc(collection(db, 'products'), formData); setModal({ title: 'Success', message: 'Product added.' }); } refreshProducts(); onClose(); } catch (e) { setModal({ title: 'Error', message: 'Failed to save product.' }); console.error(e); } };

        return (
            <form onSubmit={handleFormSubmit} className="space-y-4">
                 <div><label>Name</label><input name="name" value={formData.name} onChange={handleChange} required className="w-full p-2 border rounded-md"/></div>
                 <div><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} required className="w-full p-2 border rounded-md"></textarea></div>
                 <div><label>Price (£)</label><input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required className="w-full p-2 border rounded-md"/></div>
                 <div><label>Category</label><select name="category" value={formData.category} onChange={handleChange} className="w-full p-2 border rounded-md"><option>Spring</option><option>Summer</option><option>Autumn</option><option>Winter</option></select></div>
                 <div><label>Image URLs (one per line)</label><textarea name="images" value={formData.images.join('\n')} onChange={handleImagesChange} rows="3" required className="w-full p-2 border rounded-md"></textarea></div>
                 <div><label>Rating</label><input name="rating" type="number" step="0.1" value={formData.rating} onChange={handleChange} className="w-full p-2 border rounded-md"/></div>
                 <div><label>Reviews</label><input name="reviews" type="number" value={formData.reviews} onChange={handleChange} className="w-full p-2 border rounded-md"/></div>
                 <button type="submit" className="w-full p-2 font-semibold text-white bg-lime-500 rounded-md">Save Product</button>
            </form>
        );
    };

    const handleDeleteProduct = async (productId) => {
        if (window.confirm('Are you sure?')) {
            try { await deleteDoc(doc(db, 'products', productId)); setModal({ title: 'Success', message: 'Product deleted.' }); refreshProducts(); } catch (e) { setModal({ title: 'Error', message: 'Failed to delete.' }); }
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-8"><h2 className="text-3xl font-bold">Admin Panel</h2></div>
                <div className="border-b"><nav className="-mb-px flex px-8"><button onClick={() => setActiveTab('messages')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'messages' ? 'border-lime-500 text-lime-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}><MessageSquare className="inline-block w-5 h-5 mr-2"/>Messages</button><button onClick={() => setActiveTab('products')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'products' ? 'border-lime-500 text-lime-600' : 'border-transparent text-gray-500 hover:border-gray-300'}`}><Package className="inline-block w-5 h-5 mr-2"/>Manage Products</button></nav></div>
                <div className="p-8">
                    {activeTab === 'messages' && ( <div>{loading ? <p>Loading...</p> : messages.length > 0 ? ( <div className="space-y-4">{messages.map(msg => ( <div key={msg.id} className="p-4 border rounded-md bg-gray-50"><div className="flex justify-between items-start"><div><p className="font-semibold">{msg.name} <span className="font-normal text-gray-500">- {msg.email}</span></p><p className="mt-2 text-gray-700">{msg.message}</p></div><a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${msg.email}&su=Re: Your message to Seven 17`} target="_blank" rel="noopener noreferrer" className="flex items-center px-3 py-1 text-sm font-semibold text-white bg-lime-500 rounded-md hover:bg-lime-600"><Mail className="w-4 h-4 mr-2"/> Reply</a></div><p className="mt-2 text-xs text-gray-400">Received: {msg.createdAt ? new Date(msg.createdAt.seconds * 1000).toLocaleString() : 'No date'}</p></div> ))}</div> ) : <p>No messages yet.</p>}</div> )}
                    {activeTab === 'products' && (
                        <div>
                            <div className="flex justify-end mb-4"><button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="flex items-center px-4 py-2 font-semibold text-white bg-lime-500 rounded-md hover:bg-lime-600"><PlusCircle className="w-5 h-5 mr-2"/>Add Product</button></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{products.map(p => ( <div key={p.id} className="p-4 border rounded-lg bg-gray-50"><img src={p.images && p.images[0]} alt={p.name} className="w-full h-32 object-contain rounded-md mb-4"/><h4 className="font-bold">{p.name}</h4><p className="text-sm text-gray-600">£{p.price.toFixed(2)}</p><div className="flex justify-end space-x-2 mt-4"><button onClick={() => { setEditingProduct(p); setIsProductModalOpen(true); }} className="p-2 text-blue-600 hover:bg-blue-100 rounded-full"><Edit className="w-5 h-5"/></button><button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-red-600 hover:bg-red-100 rounded-full"><Trash2 className="w-5 h-5"/></button></div></div> ))}</div>
                        </div>
                    )}
                </div>
            </div>
            <AnimatePresence>{isProductModalOpen && ( <Modal title={editingProduct ? 'Edit Product' : 'Add New Product'} onClose={() => setIsProductModalOpen(false)}><ProductForm product={editingProduct} onClose={() => setIsProductModalOpen(false)} /></Modal> )}</AnimatePresence>
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
    const [products, setProducts] = useState([]); 

    useEffect(() => {
        const fetchProducts = async () => {
            const productsCollection = collection(db, 'products');
            const productSnapshot = await getDocs(productsCollection);
            const productList = productSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setProducts(productList);
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDocRef = doc(db, "users", currentUser.uid);
                const userDoc = await getDoc(userDocRef);
                setIsAdmin(userDoc.exists() && userDoc.data().isAdmin);
            } else { setIsAdmin(false); }
            setAuthChecked(true);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const processCheckout = async () => {
            const query = new URLSearchParams(window.location.search);
            if (query.get("success") && user) {
                const storedCart = localStorage.getItem('cartForCheckout');
                if (storedCart) {
                    const cartItems = JSON.parse(storedCart);
                    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
                    try {
                        await addDoc(collection(db, "orders"), { userId: user.uid, items: cartItems, total: total, createdAt: serverTimestamp() });
                        localStorage.removeItem('cartForCheckout');
                    } catch (error) { console.error("Failed to save order:", error); }
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
        if (authChecked) { processCheckout(); }
    }, [authChecked, user]);

    const addToCart = (product) => { setCart((prev) => { const exist = prev.find(i => i.id === product.id); if (exist) { return prev.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i); } return [...prev, { ...product, quantity: 1 }]; }); setModal({ title: 'Success!', message: `${product.name} has been added.` }); };
    const removeFromCart = (productId) => setCart((prev) => prev.filter(i => i.id !== productId));
    const updateQuantity = (productId, newQuantity) => { if (newQuantity <= 0) { removeFromCart(productId); } else { setCart((prev) => prev.map(i => i.id === productId ? { ...i, quantity: newQuantity } : i)); } };
    const calculateTotal = () => cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
    const handleCheckout = async () => { if (!window.Stripe) { setModal({ title: 'Error', message: 'Stripe is not loaded.' }); return; } if (user) { localStorage.setItem('cartForCheckout', JSON.stringify(cart)); } const stripe = window.Stripe('pk_test_51RxSCvGpKT3UikNEDttkWgGAxCouVQ9iuGARl8Q9Z8P19KZipNITS7DqgPdchrDzaVDc7SWqeedhxATDvXGZYJgI00ZNNtHGa3'); const response = await fetch('http://localhost:4242/create-checkout-session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cart }), }); if (!response.ok) { setModal({ title: 'Server Error', message: 'Could not connect. Is it running?' }); return; } const session = await response.json(); const result = await stripe.redirectToCheckout({ sessionId: session.id }); if (result.error) { setModal({ title: 'Checkout Error', message: result.error.message }); localStorage.removeItem('cartForCheckout'); } };

    const renderPage = () => {
        const props = { setCurrentPage, setSelectedProduct, addToCart, setModal, selectedProduct, user, isAdmin, products, setProducts };
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
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 transition-colors duration-200 rounded-full lg:hidden hover:bg-gray-100" aria-label="Toggle mobile menu">{isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
                        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('home')}} className="flex items-center space-x-2 text-2xl font-extrabold text-gray-900"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12L12 4L20 12L12 20L4 12Z" stroke="#A3E635" strokeWidth="2" strokeLinejoin="round"/><path d="M12 4L20 12L12 20" stroke="#4D7C0F" strokeWidth="2" strokeLinejoin="round"/></svg><span>Seven 17</span></a>
                    </div>
                    <nav className="hidden lg:flex lg:space-x-8">
                        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('home')}} className="text-lg font-medium text-gray-700 transition-colors duration-200 hover:text-lime-500">Home</a>
                        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('products')}} className="text-lg font-medium text-gray-700 transition-colors duration-200 hover:text-lime-500">Products</a>
                        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('contact')}} className="text-lg font-medium text-gray-700 transition-colors duration-200 hover:text-lime-500">Contact</a>
                        {isAdmin && (<a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('admin')}} className="flex items-center text-lg font-medium text-lime-600 transition-colors duration-200 hover:text-lime-500"><ShieldCheck className="w-5 h-5 mr-1" /> Admin</a>)}
                    </nav>
                    <div className="flex items-center space-x-4">{user ? (<button onClick={() => setCurrentPage('account')} className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100" aria-label="My Account"><User className="w-6 h-6 text-gray-700" /></button>) : (<button onClick={() => setCurrentPage('login')} className="px-4 py-2 text-sm font-semibold text-gray-800 transition-colors duration-200 bg-gray-200 rounded-md hover:bg-gray-300">Login</button>)}<button onClick={() => setIsCartOpen(true)} className="relative p-2 transition-colors duration-200 rounded-full hover:bg-gray-100" aria-label="Open shopping cart"><ShoppingCart className="w-6 h-6 text-gray-700" />{cart.length > 0 && (<span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-gray-900 bg-lime-400 rounded-full">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>)}</button></div>
                </div>
            </header>
            
            <AnimatePresence>{isMobileMenuOpen && ( <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl lg:hidden"><div className="flex items-center justify-between p-4 border-b"><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('home')}} className="flex items-center space-x-2 text-xl font-extrabold text-gray-900"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 12L12 4L20 12L12 20L4 12Z" stroke="#A3E635" strokeWidth="2" strokeLinejoin="round"/><path d="M12 4L20 12L12 20" stroke="#4D7C0F" strokeWidth="2" strokeLinejoin="round"/></svg><span>Seven 17</span></a><button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100"><X className="w-6 h-6" /></button></div><nav className="p-4"><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('home'); setIsMobileMenuOpen(false);}} className="block px-4 py-2 text-lg font-medium text-gray-700 rounded-md hover:bg-gray-100">Home</a><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('products'); setIsMobileMenuOpen(false);}} className="block px-4 py-2 mt-1 text-lg font-medium text-gray-700 rounded-md hover:bg-gray-100">Products</a><a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('contact'); setIsMobileMenuOpen(false);}} className="block px-4 py-2 mt-1 text-lg font-medium text-gray-700 rounded-md hover:bg-gray-100">Contact</a>{isAdmin && (<a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('admin'); setIsMobileMenuOpen(false);}} className="flex items-center px-4 py-2 mt-1 text-lg font-medium text-lime-600 rounded-md hover:bg-gray-100"><ShieldCheck className="w-5 h-5 mr-2" /> Admin</a>)}</nav></motion.div> )}
            </AnimatePresence>

            <main className="py-8"><AnimatePresence mode="wait">{renderPage()}</AnimatePresence></main>

            <AnimatePresence>{isCartOpen && ( <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed inset-y-0 right-0 z-40 flex flex-col w-full max-w-sm bg-white shadow-xl"><div className="flex items-center justify-between p-4 border-b border-gray-200"><h2 className="text-xl font-bold">Shopping Cart</h2><button onClick={() => setIsCartOpen(false)} className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100" aria-label="Close cart"><X className="w-6 h-6" /></button></div><div className="flex-1 p-4 overflow-y-auto">{cart.length === 0 ? <p className="text-gray-500">Your cart is empty.</p> : cart.map((item) => ( <div key={item.id} className="flex items-center pb-4 mb-4 border-b border-gray-100"><img src={item.images && item.images[0]} alt={item.name} className="object-cover w-16 h-16 mr-4 rounded-md" /><div className="flex-1"><h3 className="font-semibold text-gray-900">{item.name}</h3><p className="text-sm text-gray-600">£{item.price.toFixed(2)} x {item.quantity}</p><div className="flex items-center mt-2"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">-</button><span className="w-8 mx-2 text-center">{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200">+</button></div></div><button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 rounded-full hover:bg-red-50"><X className="w-5 h-5" /></button></div> ))}</div>{cart.length > 0 && (<div className="p-4 bg-gray-50"><div className="flex justify-between text-lg font-bold"><span>Total:</span><span>£{calculateTotal()}</span></div><button onClick={handleCheckout} className="w-full py-3 mt-4 font-semibold text-gray-900 transition-colors duration-200 bg-lime-500 rounded-md hover:bg-lime-600">Checkout</button></div>)}</motion.div> )}
            </AnimatePresence>

            <AnimatePresence>{modal && <Modal title={modal.title} message={modal.message} onClose={() => setModal(null)} />}</AnimatePresence>

            <footer className="p-6 text-center text-white bg-gray-900"><p>© 2025 Seven 17. All rights reserved.</p></footer>
        </div>
    );
}

