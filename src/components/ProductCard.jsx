export default function ProductCard({ product, addToCart }) {
  return (
    <div className="product-card">
      <div>
        <div className="product-img-container">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="product-meta">
          <span className="product-category">{product.category}</span>
          <span className="product-price">{product.price} €</span>
        </div>
        <h3 className="product-title" title={product.title}>{product.title}</h3>
      </div>
      <button className="add-btn" onClick={() => addToCart(product)}>
        Ajouter au panier
      </button>
    </div>
  );
}