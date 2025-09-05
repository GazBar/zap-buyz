// App.js - Top of the file
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
// ... other imports

// --- UPDATE YOUR PAGE COMPONENTS ---
// Page components now get router props automatically, not from App.js.
// Example for ProductDetailPage: it needs to get the product ID from the URL.

// REPLACE your existing ProductDetailPage with this new structure:
const ProductDetailPage = ({ products, addToCart, user, isAdmin, setModal, favorites, handleToggleFavorite }) => {
    const { productId } = useParams(); // Gets 'productId' from the URL, e.g., /product/xyz
    const navigate = useNavigate(); // Hook to navigate programmatically

    // Find the selected product from the main products list using the ID from the URL
    const selectedProduct = products.find(p => p.id === productId);

    // If the product isn't found (e.g., bad URL), show a message or redirect
    if (!selectedProduct) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold">Product not found</h2>
                <button onClick={() => navigate('/products')} className="mt-4 px-4 py-2 bg-lime-500 text-white rounded">Back to Products</button>
            </div>
        );
    }

    // The rest of your ProductDetailPage component logic goes here.
    // Make sure to remove the old 'setCurrentPage' and 'selectedProduct' props
    // and replace any `setCurrentPage('products')` call with `Maps('/products')`.
    // For example, the "Back to Products" button becomes:
    // <button onClick={() => navigate('/products')} ...>Back to Products</button>

    // ... (rest of the component's JSX)
};

// ... other page components

// --- MAIN APP COMPONENT ---
export default function App() {
    // ... (keep all your existing state: user, cart, modal, etc.)
    // DELETE this line: const [currentPage, setCurrentPage] = useState('home');
    // DELETE this line: const [selectedProduct, setSelectedProduct] = useState(null);

    // ... (keep all your existing functions: addToCart, handleCheckout, etc.)

    // DELETE the entire `renderPage` function. We don't need it anymore.

    // The `onViewProduct` function in ProductCard also needs to change.
    // Instead of `onViewProduct={(p) => { setSelectedProduct(p); setCurrentPage('product'); }}`,
    // it will now navigate. You'll need to use the <Link> component inside ProductCard.

    return (
        // Wrap everything in <BrowserRouter>
        <BrowserRouter>
            <div className="min-h-screen bg-gray-100" style={{ fontFamily: "'Poppins', sans-serif" }}>
                {/* --- HEADER --- */}
                <header>
                    {/* ... your header structure ... */}
                    {/* Replace <a> tags with <Link> components */}
                    <Link to="/" className="... your styles ...">Seven 17</Link>

                    <nav className="hidden lg:flex lg:space-x-8">
                        <Link to="/" className="...">Home</Link>
                        <Link to="/products" className="...">Products</Link>
                        <Link to="/contact" className="...">Contact</Link>
                        {isAdmin && <Link to="/admin" className="...">Admin</Link>}
                    </nav>

                    <div className="flex items-center space-x-4">
                        {user ? (
                            <Link to="/account" aria-label="My Account"><User className="..." /></Link>
                        ) : (
                            <Link to="/login" className="...">Login</Link>
                        )}
                        {/* ... cart button ... */}
                    </div>
                </header>

                {/* --- MOBILE MENU --- */}
                {/* Also replace <a> tags in the mobile menu with <Link> components */}

                {/* --- MAIN CONTENT AREA --- */}
                <main className="py-8">
                    <AnimatePresence mode="wait">
                        <Routes>
                            {/* Define a route for each "page" */}
                            <Route path="/" element={<HomePage products={products} addToCart={addToCart} />} />
                            <Route path="/products" element={<ProductsPage products={products} addToCart={addToCart} />} />

                            {/* This is a dynamic route for product details */}
                            <Route path="/product/:productId" element={
                                <ProductDetailPage 
                                    products={products}
                                    addToCart={addToCart}
                                    user={user}
                                    isAdmin={isAdmin}
                                    setModal={setModal}
                                    favorites={favorites}
                                    handleToggleFavorite={handleToggleFavorite}
                                />
                            } />

                            <Route path="/login" element={<AuthPage setModal={setModal} />} />
                            <Route path="/account" element={user ? <AccountPage user={user} setModal={setModal} favorites={favorites} products={products} addToCart={addToCart} /> : <AuthPage setModal={setModal} />} />
                            <Route path="/contact" element={<ContactPage setModal={setModal} />} />
                            <Route path="/admin" element={isAdmin ? <AdminPage user={user} products={products} setProducts={setProducts} setModal={setModal} /> : <HomePage products={products} />} />

                            {/* Routes for checkout results */}
                            <Route path="/success" element={<CheckoutResultPage success />} />
                            <Route path="/cancel" element={<CheckoutResultPage />} />
                        </Routes>
                    </AnimatePresence>
                </main>

                {/* ... (Your Cart Sidebar and Footer) ... */}
            </div>
        </BrowserRouter>
    );
}