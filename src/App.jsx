import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductCard from './components/ProductCard';
import CartModal from './components/CartModal';
import Footer from './components/Footer';

export default function App() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('shopnext_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // États pour le tunnel de commande (Checkout)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const [formData, setFormData] = useState({ name: '', address: '', city: '', payment: 'card' });

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur chargement:", err);
        setLoading(false);
      });

    fetch('https://fakestoreapi.com/products/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Erreur catégories:", err));
  }, []);

  useEffect(() => {
    localStorage.setItem('shopnext_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    let result = products;
    if (selectedCategory !== 'all') {
      result = result.filter(item => item.category === selectedCategory);
    }
    if (searchTerm.trim() !== '') {
      result = result.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

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

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    const orderId = 'SN-' + Math.floor(100000 + Math.random() * 900000);
    setOrderSuccess({ id: orderId, ...formData, total: totalPrice });
    setCart([]);
    setIsCheckoutOpen(false);
  };

  return (
    <div>
      <Navbar cartCount={totalItems} setIsCartOpen={setIsCartOpen} />
      
      <Hero />

      {/* SECTION BOUTIQUE */}
      <main id="shop" className="shop-container">
        {orderSuccess && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem', textAlign: 'center' }}>
            <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>🎉 Commande validée avec succès !</h3>
            <p style={{ color: '#15803d', fontSize: '0.9rem' }}>Numéro de commande : <strong>{orderSuccess.id}</strong></p>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '0.5rem' }}>Merci {orderSuccess.name}, votre colis sera envoyé à {orderSuccess.city}.</p>
          </div>
        )}

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

      {/* MODAL PANIER */}
      <CartModal 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        cart={cart} 
        updateQuantity={updateQuantity} 
        totalPrice={totalPrice} 
        totalItems={totalItems} 
        onCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
      />

      {/* MODAL CHECKOUT / PAIEMENT */}
      {isCheckoutOpen && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <div className="modal-header">
              <h3>Finaliser la commande</h3>
              <button className="close-btn" onClick={() => setIsCheckoutOpen(false)}>✕</button>
            </div>
            
            <form onSubmit={handleCheckoutSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1, overflowY: 'auto' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Nom complet</label>
                <input 
                  type="text" required placeholder="Jean Dupont"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Adresse de livraison</label>
                <input 
                  type="text" required placeholder="123 rue de la République"
                  value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Ville</label>
                <input 
                  type="text" required placeholder="Paris"
                  value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 'bold', display: 'block', marginBottom: '0.3rem' }}>Moyen de paiement</label>
                <select 
                  value={formData.payment} onChange={e => setFormData({...formData, payment: e.target.value})}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', outline: 'none', background: 'white' }}
                >
                  <option value="card">Carte bancaire (Simulée)</option>
                  <option value="paypal">PayPal</option>
                  <option value="apple">Apple Pay</option>
                </select>
              </div>

              <div className="total-row" style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <span>Montant total :</span>
                <span className="total-price">{totalPrice} €</span>
              </div>

              <button type="submit" className="checkout-btn">
                Payer {totalPrice} €
              </button>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}