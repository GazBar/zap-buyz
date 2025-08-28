// -----------------------------------------------------------------------------
// !! NEW INSTRUCTIONS TO FIX THE ERROR !!
// To make Stripe work, you MUST add its script to your main HTML file.
//
// 1. Open the `public` folder in your project.
// 2. Open the `index.html` file.
// 3. Add the following line right before the closing </head> tag:
//
// <script src="https://js.stripe.com/v3/"></script>
//
// This change removes the need to install any extra Stripe packages with npm.
// -----------------------------------------------------------------------------

import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Menu, X, ChevronLeft, Star, Send, CheckCircle, XCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

// --- MOCK DATA ---
const productsData = [
  {
    id: 1,
    name: 'Elegant Gold Necklace',
    description: 'A beautiful gold-plated necklace with a delicate pendant. Perfect for any occasion.',
    price: 39.99,
    image: 'https://placehold.co/600x400/999999/ffffff?text=Product+1',
    rating: 4.8,
    reviews: 120,
    category: 'Jewelry',
  },
  {
    id: 2,
    name: 'Minimalist Leather Wallet',
    description: 'Slim and stylish genuine leather wallet with multiple card slots and a cash pocket.',
    price: 24.50,
    image: 'https://placehold.co/600x400/aaaaaa/ffffff?text=Product+2',
    rating: 4.5,
    reviews: 85,
    category: 'Accessories',
  },
  {
    id: 3,
    name: 'Smart Watch Pro',
    description: 'Feature-rich smart watch with a vibrant display, fitness tracking, and long battery life.',
    price: 199.00,
    image: 'https://placehold.co/600x400/bbbbbb/ffffff?text=Product+3',
    rating: 4.9,
    reviews: 250,
    category: 'Electronics',
  },
  {
    id: 4,
    name: 'Ceramic Coffee Mug Set',
    description: 'A set of four handcrafted ceramic mugs. Dishwasher and microwave safe.',
    price: 29.99,
    image: 'https://placehold.co/600x400/cccccc/ffffff?text=Product+4',
    rating: 4.7,
    reviews: 95,
    category: 'Home Goods',
  },
];

// --- HELPER COMPONENTS ---

const Modal = ({ title, message, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-800 bg-opacity-75">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="w-full max-w-sm p-6 bg-white rounded-xl shadow-2xl text-center"
    >
      <h3 className="mb-2 text-2xl font-bold">{title}</h3>
      <p className="mb-4 text-gray-600">{message}</p>
      <button
        onClick={onClose}
        className="w-full px-4 py-2 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        OK
      </button>
    </motion.div>
  </div>
);

const ProductCard = ({ product, onViewProduct, onAddToCart }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="overflow-hidden transition-all duration-300 bg-white rounded-xl shadow-lg hover:shadow-2xl flex flex-col"
    >
      <div className="relative overflow-hidden cursor-pointer h-60" onClick={() => onViewProduct(product)}>
        <img src={product.image} alt={product.name} className="object-cover w-full h-full transition-transform duration-300 hover:scale-110" />
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity duration-300" />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="mt-1 text-sm text-gray-600 truncate flex-grow">{product.description}</p>
        <div className="flex items-center justify-between mt-2">
          <p className="text-xl font-bold text-gray-900">£{product.price.toFixed(2)}</p>
          <div className="flex items-center text-sm text-gray-500">
            <Star className="w-4 h-4 mr-1 text-yellow-400 fill-current" />
            <span>{product.rating} ({product.reviews})</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4 space-x-2">
          <button onClick={() => onViewProduct(product)} className="flex-1 px-4 py-2 text-sm font-semibold text-blue-600 transition-colors duration-200 bg-blue-50 rounded-lg hover:bg-blue-100">
            View Details
          </button>
          <button onClick={() => onAddToCart(product)} className="p-2 text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700" aria-label="Add to cart">
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
);


// --- PAGE COMPONENTS ---

const HomePage = ({ setCurrentPage, setSelectedProduct, addToCart }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8">
      <div className="p-8 mb-8 text-center bg-blue-50 rounded-2xl">
        <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">Welcome to Seven 17!</h2>
        <p className="mt-4 text-xl text-gray-600">Discover amazing products with a simple and modern shopping experience.</p>
        <button onClick={() => setCurrentPage('products')} className="px-6 py-3 mt-8 font-semibold text-white transition-transform duration-200 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105">
          Shop Now
        </button>
      </div>
      <h3 className="mb-6 text-3xl font-bold text-gray-900">Featured Products</h3>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {productsData.slice(0, 4).map((product) => (
          <ProductCard key={product.id} product={product} onViewProduct={(p) => { setSelectedProduct(p); setCurrentPage('product'); }} onAddToCart={addToCart} />
        ))}
      </div>
    </motion.div>
);

const ProductsPage = ({ setSelectedProduct, setCurrentPage, addToCart }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8">
        <h2 className="mb-6 text-3xl font-bold text-gray-900">All Products</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productsData.map((product) => (
                <ProductCard key={product.id} product={product} onViewProduct={(p) => { setSelectedProduct(p); setCurrentPage('product'); }} onAddToCart={addToCart} />
            ))}
        </div>
    </motion.div>
);

const ProductDetailPage = ({ selectedProduct, setCurrentPage, addToCart }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-7xl sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:space-x-8">
            <div className="w-full lg:w-1-2">
                <img src={selectedProduct.image} alt={selectedProduct.name} className="object-cover w-full rounded-2xl shadow-xl" />
            </div>
            <div className="w-full mt-8 lg:w-1/2 lg:mt-0">
                <div className="pb-6 border-b border-gray-200">
                    <h1 className="text-4xl font-bold text-gray-900">{selectedProduct.name}</h1>
                    <div className="flex items-center mt-2 space-x-2 text-yellow-400">
                        {Array.from({ length: 5 }, (_, i) => (<Star key={i} className={`w-5 h-5 ${i < Math.floor(selectedProduct.rating) ? 'fill-current' : 'text-gray-300'}`} />))}
                        <span className="text-lg font-semibold text-gray-600 ml-2">{selectedProduct.rating}</span>
                        <span className="text-sm text-gray-500">({selectedProduct.reviews} reviews)</span>
                    </div>
                    <p className="mt-4 text-3xl font-bold text-gray-900">£{selectedProduct.price.toFixed(2)}</p>
                </div>
                <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-900">Product Description</h2>
                    <p className="mt-2 text-gray-600">{selectedProduct.description}</p>
                </div>
                <div className="flex items-center mt-8 space-x-4">
                    <button onClick={() => addToCart(selectedProduct)} className="flex-1 px-6 py-3 text-lg font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                        <span className="flex items-center justify-center space-x-2"><ShoppingCart className="w-5 h-5" /><span>Add to Cart</span></span>
                    </button>
                    <button className="p-3 text-gray-600 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200" aria-label="Add to wishlist"><Heart className="w-6 h-6" /></button>
                </div>
                <button onClick={() => setCurrentPage('products')} className="flex items-center mt-8 text-blue-600 transition-colors duration-200 hover:text-blue-800">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back to Products
                </button>
            </div>
        </div>
    </motion.div>
);

const ContactPage = ({ setModal }) => {
    const handleSubmit = (e) => { e.preventDefault(); setModal({ title: 'Message Sent!', message: "Thanks for reaching out. We'll get back to you soon." }); e.target.reset(); };
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 mx-auto max-w-2xl sm:p-6 lg:p-8">
        <div className="p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="mb-2 text-3xl font-bold text-center text-gray-900">Contact Us</h2>
          <p className="mb-8 text-center text-gray-600">Have a question or feedback? Drop us a line!</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Simplified form for brevity */}
            <div><label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label><input type="text" id="name" name="name" required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
            <div><label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label><input type="email" id="email" name="email" required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" /></div>
            <div><label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label><textarea id="message" name="message" rows="4" required className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"></textarea></div>
            <div><button type="submit" className="flex items-center justify-center w-full px-4 py-3 font-semibold text-white transition-colors duration-200 bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"><Send className="w-5 h-5 mr-2" />Send Message</button></div>
          </form>
        </div>
      </motion.div>
    );
};

const CheckoutResultPage = ({ success, setCurrentPage }) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-4 mx-auto max-w-2xl sm:p-6 lg:p-8 text-center">
        <div className="p-8 bg-white rounded-2xl shadow-lg">
            {success ? <CheckCircle className="w-16 h-16 mx-auto text-green-500" /> : <XCircle className="w-16 h-16 mx-auto text-red-500" />}
            <h2 className="mt-4 text-3xl font-bold text-gray-900">{success ? 'Payment Successful!' : 'Payment Canceled'}</h2>
            <p className="mt-2 text-gray-600">{success ? "Thank you for your purchase. We've received your order and will process it shortly." : "Your order was canceled. You have not been charged."}</p>
            <button onClick={() => setCurrentPage('products')} className="px-6 py-3 mt-8 font-semibold text-white transition-transform duration-200 bg-blue-600 rounded-full shadow-lg hover:bg-blue-700 hover:scale-105">Continue Shopping</button>
        </div>
    </motion.div>
);


// --- MAIN APP COMPONENT ---

export default function App() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cart, setCart] = useState([]);
    const [currentPage, setCurrentPage] = useState('home');
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [modal, setModal] = useState(null);

    useEffect(() => {
        const query = new URLSearchParams(window.location.search);
        if (query.get("success")) {
            setCurrentPage("success");
            setCart([]);
        }
        if (query.get("canceled")) {
            setCurrentPage("cancel");
        }
    }, []);

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
        if (!window.Stripe) {
            setModal({ title: 'Error', message: 'Stripe is not loaded. Please check your internet connection or HTML setup.' });
            return;
        }
        // IMPORTANT: Replace with your publishable key.
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
        }
    };

    const renderPage = () => {
        const props = { setCurrentPage, setSelectedProduct, addToCart, setModal, selectedProduct };
        switch (currentPage) {
            case 'home': return <HomePage {...props} />;
            case 'products': return <ProductsPage {...props} />;
            case 'product': return <ProductDetailPage {...props} />;
            case 'contact': return <ContactPage {...props} />;
            case 'success': return <CheckoutResultPage success {...props} />;
            case 'cancel': return <CheckoutResultPage {...props} />;
            default: return <HomePage {...props} />;
        }
    };

    return (
        <div className="min-h-screen font-sans bg-gray-50">
            <header className="sticky top-0 z-30 p-4 bg-white shadow-sm sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mx-auto max-w-7xl">
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 transition-colors duration-200 rounded-full lg:hidden hover:bg-gray-100" aria-label="Toggle mobile menu">
                            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('home')}} className="text-2xl font-bold text-gray-900">Seven 17</a>
                    </div>
                    <nav className="hidden lg:flex lg:space-x-8">
                        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('home')}} className="text-lg font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600">Home</a>
                        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('products')}} className="text-lg font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600">Products</a>
                        <a href="#" onClick={(e) => {e.preventDefault(); setCurrentPage('contact')}} className="text-lg font-medium text-gray-700 transition-colors duration-200 hover:text-blue-600">Contact</a>
                    </nav>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => setIsCartOpen(true)} className="relative p-2 transition-colors duration-200 rounded-full hover:bg-gray-100" aria-label="Open shopping cart">
                            <ShoppingCart className="w-6 h-6 text-gray-700" />
                            {cart.length > 0 && (<span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>)}
                        </button>
                    </div>
                </div>
            </header>
            
            <main className="py-8">
                <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
            </main>

            <AnimatePresence>
                {isCartOpen && (
                    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed inset-y-0 right-0 z-40 flex flex-col w-full max-w-sm bg-white shadow-xl">
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-xl font-bold">Shopping Cart</h2>
                            <button onClick={() => setIsCartOpen(false)} className="p-2 transition-colors duration-200 rounded-full hover:bg-gray-100" aria-label="Close cart"><X className="w-6 h-6" /></button>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                            {cart.length === 0 ? <p className="text-gray-500">Your cart is empty.</p> : cart.map((item) => (
                                <div key={item.id} className="flex items-center pb-4 mb-4 border-b border-gray-100">
                                    <img src={item.image} alt={item.name} className="object-cover w-16 h-16 mr-4 rounded-md" />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                        <p className="text-sm text-gray-600">£{item.price.toFixed(2)} x {item.quantity}</p>
                                        <div className="flex items-center mt-2">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-2 py-1 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200" aria-label="Decrease quantity">-</button>
                                            <span className="w-8 mx-2 text-center">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-2 py-1 text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200" aria-label="Increase quantity">+</button>
                                        </div>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-500 rounded-full hover:bg-red-50" aria-label="Remove item"><X className="w-5 h-5" /></button>
                                </div>
                            ))}
                        </div>
                        {cart.length > 0 && (
                            <div className="p-4 bg-gray-50">
                                <div className="flex justify-between text-lg font-bold"><span>Total:</span><span>£{calculateTotal()}</span></div>
                                <button onClick={handleCheckout} className="w-full py-3 mt-4 font-semibold text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700">Checkout</button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {modal && <Modal title={modal.title} message={modal.message} onClose={() => setModal(null)} />}
            </AnimatePresence>

            <footer className="p-6 text-center text-white bg-gray-800">
                <p>© 2025 Seven 17. All rights reserved.</p>
            </footer>
        </div>
    );
}
