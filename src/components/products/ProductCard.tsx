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
  const productDescription = getTextByLanguage(product.description, language);
  const categoryName = getCategoryName(product.category, language);
  // Use JOD as default currency if not specified in the product
  const formattedPrice = formatCurrency(
    product.price,
    "JOD", // Default to Jordanian Dinar
    language
  );

  // Truncate description to 2 lines
  const truncatedDescription = 
    productDescription.length > 80 
      ? `${productDescription.substring(0, 80)}...` 
      : productDescription;

  return (
    <Link to={`/product/${product.id}`} className="product-card">
      <div className="product-image-wrapper">
        <div className="product-image-container">
          <img
            src={product.images?.[0] || "/images/placeholder.jpg"}
            alt={productTitle}
            className="product-image"
            loading="lazy"
          />
        </div>
        
        {/* Status indicators */}
        <div className="product-status">
          {product.featured && (
            <span className="featured-badge">
              {language === "en" ? "Featured" : "مميز"}
            </span>
          )}
          {!product.inStock && (
            <span className="stock-badge out-of-stock">
              {language === "en" ? "Out of Stock" : "نفذ من المخزون"}
            </span>
          )}
        </div>
      </div>
      
      <div className="product-content">
        <div className="product-category">{categoryName}</div>
        <h3 className="product-title">{productTitle}</h3>
        <p className="product-description">{truncatedDescription}</p>
        <div className="product-price">{formattedPrice}</div>
      </div>
    </Link>
  );
};

export default ProductCard;
