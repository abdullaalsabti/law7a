import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Language, Product } from "../types";
import {
  getTextByLanguage,
  formatCurrency,
  getCategoryName,
  getMediumName,
  getUIText,
} from "../utils/language";
import { mockProducts, mockArtists } from "../utils/mockData";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/products/ProductCard";
import "./ProductPage.css";

interface ProductPageProps {
  language: Language;
}

const ProductPage: React.FC<ProductPageProps> = ({ language }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchProduct = () => {
      setLoading(true);
      try {
        // Simulate API delay
        setTimeout(() => {
          const foundProduct = mockProducts.find((p) => p.id === id);

          if (!foundProduct) {
            setError(true);
            return;
          }

          setProduct(foundProduct);
          setMainImage(foundProduct.images[0] || "");

          // Get related products (same category or artist)
          const related = mockProducts
            .filter(
              (p) =>
                p.id !== foundProduct.id &&
                (p.category === foundProduct.category ||
                  p.artistId === foundProduct.artistId)
            )
            .slice(0, 4);

          setRelatedProducts(related);
          setLoading(false);
        }, 300);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product.id, quantity);
      // Show a confirmation or notification here
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product.id, quantity);
      navigate("/cart");
    }
  };

  const changeMainImage = (image: string) => {
    setMainImage(image);
  };

  const incrementQuantity = () => {
    if (product?.quantity && quantity < product.quantity) {
      setQuantity(quantity + 1);
    } else if (!product?.quantity) {
      // If quantity is not tracked, let them add as many as they want
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return <div className="loading">{getUIText("loading", language)}</div>;
  }

  if (error || !product) {
    return (
      <div className="error-container">
        <h2>{getUIText("error", language)}</h2>
        <p>
          {language === "en"
            ? "The product you are looking for could not be found."
            : "لم يتم العثور على المنتج الذي تبحث عنه."}
        </p>
        <Link to="/" className="btn btn-primary">
          {getUIText("home", language)}
        </Link>
      </div>
    );
  }

  const artist = mockArtists.find((a) => a.id === product.artistId);

  return (
    <div className="product-page">
      <div className="product-container">
        <div className="product-gallery">
          <div className="main-image-container">
            <img
              src={mainImage}
              alt={getTextByLanguage(product.title, language)}
              className="main-image"
            />
          </div>
          {product.images.length > 1 && (
            <div className="image-thumbnails">
              {product.images.map((image, index) => (
                <div
                  key={index}
                  className={`thumbnail-container ${
                    mainImage === image ? "active" : ""
                  }`}
                  onClick={() => changeMainImage(image)}
                >
                  <img
                    src={image}
                    alt={`${getTextByLanguage(product.title, language)} - ${
                      index + 1
                    }`}
                    className="thumbnail"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="product-details">
          <h1 className="product-title">
            {getTextByLanguage(product.title, language)}
          </h1>

          {artist && (
            <Link to={`/artist/${artist.id}`} className="product-artist">
              {getUIText("artist", language)}:{" "}
              {getTextByLanguage(artist.name, language)}
            </Link>
          )}

          <div className="product-price">
            {formatCurrency(product.price, product.currency, language)}
          </div>

          <div className="product-meta">
            <div className="meta-item">
              <span className="meta-label">
                {getUIText("category", language)}:
              </span>
              <span className="meta-value">
                {getCategoryName(product.category, language)}
              </span>
            </div>
            <div className="meta-item">
              <span className="meta-label">
                {getUIText("medium", language)}:
              </span>
              <span className="meta-value">
                {getMediumName(product.medium, language)}
              </span>
            </div>
            {product.dimensions && (
              <div className="meta-item">
                <span className="meta-label">
                  {getUIText("dimensions", language)}:
                </span>
                <span className="meta-value">
                  {`${product.dimensions.width} × ${product.dimensions.height}${
                    product.dimensions.depth
                      ? ` × ${product.dimensions.depth}`
                      : ""
                  } ${product.dimensions.unit}`}
                </span>
              </div>
            )}
            {product.weight && (
              <div className="meta-item">
                <span className="meta-label">
                  {getUIText("weight", language)}:
                </span>
                <span className="meta-value">
                  {`${product.weight.value} ${product.weight.unit}`}
                </span>
              </div>
            )}
          </div>

          <div className="product-description">
            <h3>{getUIText("description", language)}</h3>
            <p>{getTextByLanguage(product.description, language)}</p>
          </div>

          {product.inStock ? (
            <div className="product-actions">
              <div className="quantity-selector">
                <button onClick={decrementQuantity} className="quantity-btn">
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button onClick={incrementQuantity} className="quantity-btn">
                  +
                </button>
              </div>
              <div className="action-buttons">
                <button onClick={handleAddToCart} className="btn btn-outline">
                  {getUIText("addToCart", language)}
                </button>
                <button onClick={handleBuyNow} className="btn btn-primary">
                  {getUIText("buyNow", language)}
                </button>
              </div>
            </div>
          ) : (
            <div className="out-of-stock-notice">
              {getUIText("outOfStock", language)}
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products section">
          <h2 className="section-title">
            {language === "en" ? "You May Also Like" : "قد يعجبك أيضًا"}
          </h2>
          <div className="product-grid">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="product-item">
                <ProductCard product={relatedProduct} language={language} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
