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
  return (
    <div className="product-card">
      <Link to={`/product/${product.id}`} className="product-card-link">
        <div className="product-image-container">
          <img
            src={product.images[0] || "/images/placeholder.jpg"}
            alt={getTextByLanguage(product.title, language)}
            className="product-image"
            loading="lazy"
          />
          {!product.inStock && (
            <div className="out-of-stock-overlay">
              <span>
                {language === "en" ? "Out of Stock" : "نفذ من المخزون"}
              </span>
            </div>
          )}
          {product.featured && (
            <div className="featured-badge">
              <span>{language === "en" ? "Featured" : "مميز"}</span>
            </div>
          )}
        </div>
        <div className="product-info">
          <h3 className="product-title">
            {getTextByLanguage(product.title, language)}
          </h3>
          <div className="product-meta">
            <span className="product-category">
              {getCategoryName(product.category, language)}
            </span>
            <span className="product-price">
              {formatCurrency(product.price, product.currency, language)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
