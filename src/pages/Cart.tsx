import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Language } from "../types";
import {
  getTextByLanguage,
  formatCurrency,
  getUIText,
} from "../utils/language";
import { useCart } from "../context/CartContext";
import ConfirmationDialog from "../components/ui/ConfirmationDialog";
import "./Cart.css";

interface CartProps {
  language: Language;
}

const Cart: React.FC<CartProps> = ({ language }) => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, clearCart } =
    useCart();
  const navigate = useNavigate();
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: string) => {
    removeFromCart(productId);
  };

  const handleClearCart = () => {
    // Open confirmation dialog instead of using browser's confirm
    setIsConfirmDialogOpen(true);
  };

  const confirmClearCart = () => {
    clearCart();
  };

  const handleCheckout = () => {
    // Navigate to checkout page
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="empty-cart-container">
        <h1 className="page-title">{getUIText("yourCart", language)}</h1>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <p>{getUIText("emptyCart", language)}</p>
          <Link to="/search" className="btn btn-primary">
            {getUIText("continueShopping", language)}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="page-title">{getUIText("yourCart", language)}</h1>

      <div className="cart-container">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.productId} className="cart-item">
              <div className="cart-item-image">
                <img
                  src={item.product.images[0] || "/images/placeholder.jpg"}
                  alt={getTextByLanguage(item.product.title, language)}
                />
              </div>

              <div className="cart-item-details">
                <Link
                  to={`/product/${item.productId}`}
                  className="cart-item-title"
                >
                  {getTextByLanguage(item.product.title, language)}
                </Link>

                <div className="cart-item-info">
                  <p className="cart-item-price">
                    {formatCurrency(
                      item.product.price,
                      "JOD", // Default to Jordanian Dinar
                      language
                    )}
                  </p>
                </div>

                <div className="cart-item-actions">
                  <div className="cart-quantity">
                    <button
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity - 1)
                      }
                      className="quantity-btn"
                      aria-label={
                        language === "en" ? "Decrease quantity" : "تقليل الكمية"
                      }
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity + 1)
                      }
                      className="quantity-btn"
                      aria-label={
                        language === "en" ? "Increase quantity" : "زيادة الكمية"
                      }
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemoveItem(item.productId)}
                    className="remove-btn"
                    aria-label={
                      language === "en" ? "Remove item" : "إزالة العنصر"
                    }
                  >
                    {language === "en" ? "Remove" : "إزالة"}
                  </button>
                </div>
              </div>

              <div className="cart-item-subtotal">
                <p className="subtotal-label">
                  {language === "en" ? "Subtotal:" : "المجموع الفرعي:"}
                </p>
                <p className="subtotal-value">
                  {formatCurrency(
                    item.product.price * item.quantity,
                    "JOD", // Default to Jordanian Dinar
                    language
                  )}
                </p>
              </div>
            </div>
          ))}

          <div className="cart-actions">
            <button onClick={handleClearCart} className="clear-cart-btn">
              {language === "en" ? "Clear Cart" : "إفراغ السلة"}
            </button>
            <Link to="/search" className="continue-shopping">
              {getUIText("continueShopping", language)}
            </Link>
          </div>
        </div>

        <div className="cart-summary">
          <h2 className="summary-title">
            {language === "en" ? "Order Summary" : "ملخص الطلب"}
          </h2>

          <div className="summary-row">
            <span>{getUIText("subtotal", language)}</span>
            <span>{formatCurrency(cartTotal, "JOD", language)}</span>
          </div>

          <div className="summary-row">
            <span>{language === "en" ? "Shipping" : "الشحن"}</span>
            <span>
              {language === "en"
                ? "Calculated at checkout"
                : "يتم حسابها عند الدفع"}
            </span>
          </div>

          <div className="summary-divider"></div>

          <div className="summary-row total">
            <span>{language === "en" ? "Total" : "المجموع"}</span>
            <span>{formatCurrency(cartTotal, "JOD", language)}</span>
          </div>

          <button 
            className="btn btn-primary checkout-btn"
            onClick={handleCheckout}
          >
            {getUIText("checkout", language)}
          </button>

          <div className="payment-methods">
            <p>{language === "en" ? "We accept:" : "نحن نقبل:"}</p>
            <div className="payment-icons">
              <span>💳</span>
              <span>💶</span>
              <span>📱</span>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for clearing cart */}
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmClearCart}
        title={language === "en" ? "Clear Shopping Cart" : "إفراغ سلة التسوق"}
        message={
          language === "en"
            ? "Are you sure you want to remove all items from your cart?"
            : "هل أنت متأكد أنك تريد إزالة جميع العناصر من سلة التسوق؟"
        }
        confirmText={language === "en" ? "Clear Cart" : "إفراغ السلة"}
        cancelText={language === "en" ? "Cancel" : "إلغاء"}
        language={language}
      />
    </div>
  );
};

export default Cart;
