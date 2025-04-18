import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Language, Product, Artist } from "../types";
import {
  getTextByLanguage,
  formatCurrency,
  getCategoryName,
  getMediumName,
  getUIText,
} from "../utils/language";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/products/ProductCard";
import { getProductById } from "../firebase/products";
import { getArtistById } from "../firebase/artists";
import { searchProducts } from "../firebase/search";
import "./ProductPage.css";

interface ProductPageProps {
  language: Language;
}

const ProductPage: React.FC<ProductPageProps> = ({ language }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [mainImage, setMainImage] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    // Fetch product from Firebase
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(false);
      
      try {
        // Get product from Firebase
        const foundProduct = await getProductById(id);

        if (!foundProduct) {
          console.error(`Product with ID ${id} not found`);
          setError(true);
          setLoading(false);
          return;
        }

        console.log("Product loaded successfully:", foundProduct);
        setProduct(foundProduct);
        
        // Set main image if available
        if (foundProduct.images && foundProduct.images.length > 0) {
          setMainImage(foundProduct.images[0]);
        }
        
        // Fetch artist information
        try {
          const artistData = await getArtistById(foundProduct.artistId);
          if (artistData) {
            setArtist(artistData);
          }
        } catch (artistError) {
          console.error("Error fetching artist:", artistError);
          // Don't set error state, just log it
        }

        // Get related products (same category)
        try {
          const { products: relatedProductsResult } = await searchProducts(
            undefined,
            [foundProduct.category],
            undefined,
            undefined,
            undefined,
            4
          );
          
          // Filter out the current product
          const filteredRelated = relatedProductsResult.filter(p => p.id !== id);
          setRelatedProducts(filteredRelated);
        } catch (relatedError) {
          console.error("Error fetching related products:", relatedError);
          // Don't set error state, just log it
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(true);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const [addingToCart, setAddingToCart] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ show: boolean; message: string }>({ 
    show: false, 
    message: ""
  });

  const handleAddToCart = async () => {
    if (product) {
      setAddingToCart(true);
      try {
        await addToCart(product.id, quantity);
        // Show a confirmation notification
        setNotification({
          show: true,
          message: language === "en" 
            ? `${quantity} item(s) added to cart` 
            : `تمت إضافة ${quantity} عنصر إلى سلة التسوق`
        });
        
        // Hide notification after 3 seconds
        setTimeout(() => {
          setNotification({ show: false, message: "" });
        }, 3000);
      } catch (error) {
        console.error("Error adding to cart:", error);
        setNotification({
          show: true,
          message: language === "en" 
            ? "Error adding to cart" 
            : "خطأ في إضافة المنتج إلى سلة التسوق"
        });
      } finally {
        setAddingToCart(false);
      }
    }
  };

  const handleBuyNow = async () => {
    if (product) {
      setAddingToCart(true);
      try {
        await addToCart(product.id, quantity);
        navigate("/cart");
      } catch (error) {
        console.error("Error adding to cart:", error);
        setNotification({
          show: true,
          message: language === "en" 
            ? "Error adding to cart" 
            : "خطأ في إضافة المنتج إلى سلة التسوق"
        });
        setAddingToCart(false);
      }
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

  // Artist is now fetched from Firebase in the useEffect

  return (
    <div className="product-page">
      {/* Notification */}
      {notification.show && (
        <div className="notification">
          <div className="notification-content">
            <span>{notification.message}</span>
            <button 
              className="notification-close" 
              onClick={() => setNotification({ show: false, message: "" })}
            >
              ×
            </button>
          </div>
        </div>
      )}
      
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

          <div className="artist-info">
            {artist ? (
              <Link to={`/artist/${artist.id}`} className="artist-link">
                <div className="artist-avatar">
                  <img
                    src={artist.profilePicture || "/images/default-avatar.png"}
                    alt={getTextByLanguage(artist.name, language)}
                  />
                </div>
                <div className="artist-name">
                  {getTextByLanguage(artist.name, language)}
                </div>
              </Link>
            ) : (
              <div className="artist-loading">Loading artist information...</div>
            )}
          </div>

          <div className="product-price">
            {formatCurrency(product.price, "JOD", language)}
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
                <button 
                  onClick={handleAddToCart} 
                  className="btn btn-outline"
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <span className="loading-spinner-small"></span>
                  ) : (
                    getUIText("addToCart", language)
                  )}
                </button>
                <button 
                  onClick={handleBuyNow} 
                  className="btn btn-primary"
                  disabled={addingToCart}
                >
                  {addingToCart ? (
                    <span className="loading-spinner-small"></span>
                  ) : (
                    getUIText("buyNow", language)
                  )}
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
