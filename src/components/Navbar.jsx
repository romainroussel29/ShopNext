export default function Navbar({ cartCount, setIsCartOpen }) {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <a href="#" className="logo">ShopNext.</a>
        <div className="nav-links">
          <a href="#shop">Boutique</a>
          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            🛒 Panier
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}