export default function CartModal({ isOpen, onClose, cart, updateQuantity, totalPrice, totalItems, onCheckout }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div>
          <div className="modal-header">
            <h3>Votre Panier ({totalItems})</h3>
            <button className="close-btn" onClick={onClose}>✕</button>
          </div>
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '3rem' }}>Votre panier est vide.</p>
          ) : (
            <div className="cart-items-list">
              {cart.map(item => (
                <div key={item.id} className="cart-item">
                  <img src={item.image} alt={item.title} />
                  <div className="cart-item-info">
                    <h4 title={item.title}>{item.title}</h4>
                    <p>{item.price} €</p>
                  </div>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, -1)}>-</button>
                    <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => updateQuantity(item.id, 1)}>+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <div className="total-row">
            <span>Total :</span>
            <span className="total-price">{totalPrice} €</span>
          </div>
          <button className="checkout-btn" disabled={cart.length === 0} onClick={onCheckout}>
            Valider la commande
          </button>
        </div>
      </div>
    </div>
  );
}