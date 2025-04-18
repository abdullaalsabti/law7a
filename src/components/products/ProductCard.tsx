import React from "react";
import { Link } from "react-router-dom";
import { Product, Language } from "../../types";
import {
  getTextByLanguage,
  formatCurrency,
  getCategoryName,
} from "../../utils/language";
import "./ProductCard.css";

interface ProductCardProps {
  product: Product;
  language: Language;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, language }) => {
  const productTitle = getTextByLanguage(product.title, language);
  const categoryName = getCategoryName(product.category, language);
  const formattedPrice = formatCurrency(
    product.price,
    product.currency,
    language
  );

  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img
            src={product.images?.[0] || "/images/placeholder.jpg"}
            alt={productTitle}
            className="product-image"
            loading="lazy"
          />
          {!product.inStock && (
            <div className="out-of-stock-overlay">
              {language === "en" ? "Out of Stock" : "نفذ من المخزون"}
            </div>
          )}
          {product.featured && (
            <div className="featured-badge">
              {language === "en" ? "Featured" : "مميز"}
            </div>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-title">{productTitle}</h3>
          <div className="product-meta">
            <span className="product-category">{categoryName}</span>
            <span className="product-price">{formattedPrice}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
