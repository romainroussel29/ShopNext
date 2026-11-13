import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import Footer from './components/Footer';
import { translateProduct, translateCategory } from './translations';

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shopnext_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        const translated = data.map(translateProduct);
        setProducts(translated);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement:", err);
        setLoading(false);
      });

    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(data => setCategories(data.map(translateCategory)))
      .catch(err => console.error("Erreur catégories:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem('shopnext_cart', JSON.stringify(cart));
  }, [cart]);

  const search = searchTerm.trim().toLowerCase();
  const filteredProducts = products.filter(item =>
    (selectedCategory === 'all' || item.category === selectedCategory) &&
    item.title.toLowerCase().includes(search)
  );

  const handleAddToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div>
      <Navbar cartCount={totalItems} setIsCartOpen={setIsCartOpen} />
      
      <Hero />

      {/* SECTION BOUTIQUE */}
      <main id="shop" className="shop-container">
        <div className="filters-bar">
          <input 
            type="text"
            placeholder="Rechercher un produit..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <div className="category-buttons">
            <button 
              onClick={() => setSelectedCategory('all')}
              className={`cat-btn ${selectedCategory === 'all' ? 'active' : ''}`}
            >
              Tous
            </button>
            {categories.map((cat, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`cat-btn ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0', color: 'var(--text-muted)' }}>Chargement de la collection...</div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} addToCart={handleAddToCart} />
            ))}
          </div>
        )}
      </main>

      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        updateQuantity={updateQuantity} 
        totalPrice={totalPrice} 
        totalItems={totalItems} 
        onCheckout={() => { alert("Commande validée avec succès ! Merci d'avoir testé ShopNext."); setCart([]); setIsCartOpen(false); }}
      />

      <Footer />
    </div>
  );
}