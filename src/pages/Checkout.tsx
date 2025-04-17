import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getTranslations, Language } from "../utils/language";
import { Button } from "../components/Button";
import { formatCurrency } from "../utils/formatCurrency";
import "./Checkout.css";
import { CartItem } from "../types";

interface CheckoutProps {
  language: Language;
}

// Form field interfaces
interface BillingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
}

interface CardInfo {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const Checkout: React.FC<CheckoutProps> = ({ language }) => {
  const { cart, total, clearCart } = useCart();
  const navigate = useNavigate();
  const t = getTranslations(language);

  // States for multi-step checkout
  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [orderComplete, setOrderComplete] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>("");

  // Form states
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
  });

  const [cardInfo, setCardInfo] = useState<CardInfo>({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  // Shipping options
  const [shippingMethod, setShippingMethod] = useState<string>("standard");
  const shippingCost = shippingMethod === "express" ? 15 : 5;

  // Handlers for form input changes
  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBillingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === "cardNumber") {
      const formattedValue = value
        .replace(/\s/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19);

      setCardInfo((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    // Format expiry date
    if (name === "expiryDate") {
      const formattedValue = value
        .replace(/\D/g, "")
        .replace(/(\d{2})(\d)/, "$1/$2")
        .slice(0, 5);

      setCardInfo((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    // Format CVV (numbers only)
    if (name === "cvv") {
      const formattedValue = value.replace(/\D/g, "").slice(0, 3);
      setCardInfo((prev) => ({ ...prev, [name]: formattedValue }));
      return;
    }

    setCardInfo((prev) => ({ ...prev, [name]: value }));
  };

  // Validation functions
  const validateBillingInfo = (): boolean => {
    for (const key in billingInfo) {
      if (billingInfo[key as keyof BillingInfo].trim() === "") {
        setError(t.checkout_all_fields_required);
        return false;
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(billingInfo.email)) {
      setError(t.checkout_invalid_email);
      return false;
    }

    return true;
  };

  const validateCardInfo = (): boolean => {
    for (const key in cardInfo) {
      if (cardInfo[key as keyof CardInfo].trim() === "") {
        setError(t.checkout_all_fields_required);
        return false;
      }
    }

    if (cardInfo.cardNumber.replace(/\s/g, "").length < 16) {
      setError(t.checkout_invalid_card_number);
      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(cardInfo.expiryDate)) {
      setError(t.checkout_invalid_expiry);
      return false;
    }

    if (cardInfo.cvv.length < 3) {
      setError(t.checkout_invalid_cvv);
      return false;
    }

    return true;
  };

  // Step navigation
  const goToNextStep = () => {
    setError("");

    if (step === 1 && !validateBillingInfo()) {
      return;
    }

    setStep((prev) => prev + 1);
  };

  const goToPreviousStep = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  // Final order submission
  const submitOrder = async () => {
    if (!validateCardInfo()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate random order number
      const generatedOrderNumber = Math.floor(
        100000000 + Math.random() * 900000000
      ).toString();
      setOrderNumber(generatedOrderNumber);
      setOrderComplete(true);
      clearCart();
    } catch (err) {
      setError(t.checkout_error);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Redirect to home or continue shopping
  const finishCheckout = () => {
    navigate("/");
  };

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="checkout-page">
        <div className="empty-checkout">
          <h2>{t.checkout_empty_cart}</h2>
          <p>{t.checkout_empty_cart_message}</p>
          <button
            className="primary-button"
            onClick={() => navigate("/products")}
          >
            {t.checkout_browse_products}
          </button>
        </div>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className="checkout-page">
        <div className="order-complete">
          <div className="order-complete-icon">✓</div>
          <h2>{t.checkout_order_complete}</h2>
          <p>
            {t.checkout_order_number}: <strong>{orderNumber}</strong>
          </p>
          <p>{t.checkout_order_confirmation_email}</p>
          <div className="order-actions">
            <button className="primary-button" onClick={finishCheckout}>
              {t.checkout_continue_shopping}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Checkout progress */}
        <div className="checkout-progress">
          <div className={`progress-step ${step >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-name">{t.checkout_shipping}</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-name">{t.checkout_payment}</div>
          </div>
          <div className="progress-line"></div>
          <div className={`progress-step ${step >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-name">{t.checkout_confirmation}</div>
          </div>
        </div>

        {/* Error message */}
        {error && <div className="checkout-error">{error}</div>}

        {/* Checkout steps */}
        <div className="checkout-content">
          {/* Step 1: Shipping & Billing */}
          {step === 1 && (
            <div className="checkout-step">
              <h2>{t.checkout_shipping_info}</h2>

              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="firstName">{t.checkout_first_name}</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={billingInfo.firstName}
                    onChange={handleBillingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="lastName">{t.checkout_last_name}</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={billingInfo.lastName}
                    onChange={handleBillingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">{t.checkout_email}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={billingInfo.email}
                    onChange={handleBillingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t.checkout_phone}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={billingInfo.phone}
                    onChange={handleBillingChange}
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="address">{t.checkout_address}</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={billingInfo.address}
                    onChange={handleBillingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="city">{t.checkout_city}</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={billingInfo.city}
                    onChange={handleBillingChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="country">{t.checkout_country}</label>
                  <select
                    id="country"
                    name="country"
                    value={billingInfo.country}
                    onChange={handleBillingChange}
                    required
                  >
                    <option value="">{t.checkout_select_country}</option>
                    <option value="Egypt">{t.checkout_egypt}</option>
                    <option value="Saudi Arabia">
                      {t.checkout_saudi_arabia}
                    </option>
                    <option value="UAE">{t.checkout_uae}</option>
                    <option value="Kuwait">{t.checkout_kuwait}</option>
                    <option value="Qatar">{t.checkout_qatar}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="postalCode">{t.checkout_postal_code}</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={billingInfo.postalCode}
                    onChange={handleBillingChange}
                    required
                  />
                </div>
              </div>

              <h3>{t.checkout_shipping_method}</h3>
              <div className="shipping-methods">
                <div className="shipping-method">
                  <input
                    type="radio"
                    id="shipping-standard"
                    name="shipping"
                    value="standard"
                    checked={shippingMethod === "standard"}
                    onChange={() => setShippingMethod("standard")}
                  />
                  <label htmlFor="shipping-standard">
                    <div className="shipping-method-name">
                      {t.checkout_standard_shipping}
                    </div>
                    <div className="shipping-method-price">$5.00</div>
                    <div className="shipping-method-time">
                      {t.checkout_standard_shipping_time}
                    </div>
                  </label>
                </div>

                <div className="shipping-method">
                  <input
                    type="radio"
                    id="shipping-express"
                    name="shipping"
                    value="express"
                    checked={shippingMethod === "express"}
                    onChange={() => setShippingMethod("express")}
                  />
                  <label htmlFor="shipping-express">
                    <div className="shipping-method-name">
                      {t.checkout_express_shipping}
                    </div>
                    <div className="shipping-method-price">$15.00</div>
                    <div className="shipping-method-time">
                      {t.checkout_express_shipping_time}
                    </div>
                  </label>
                </div>
              </div>

              <div className="checkout-actions">
                <button className="primary-button" onClick={goToNextStep}>
                  {t.checkout_continue_to_payment}
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Payment Information */}
          {step === 2 && (
            <div className="checkout-step">
              <h2>{t.checkout_payment_info}</h2>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label htmlFor="cardNumber">{t.checkout_card_number}</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={cardInfo.cardNumber}
                    onChange={handleCardChange}
                    placeholder="0000 0000 0000 0000"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="cardName">{t.checkout_name_on_card}</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={cardInfo.cardName}
                    onChange={handleCardChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="expiryDate">{t.checkout_expiry_date}</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={cardInfo.expiryDate}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="cvv">{t.checkout_cvv}</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={cardInfo.cvv}
                    onChange={handleCardChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>

              <div className="checkout-actions">
                <button className="secondary-button" onClick={goToPreviousStep}>
                  {t.checkout_back}
                </button>
                <button className="primary-button" onClick={goToNextStep}>
                  {t.checkout_review_order}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Order Review */}
          {step === 3 && (
            <div className="checkout-step">
              <h2>{t.checkout_review_your_order}</h2>

              <div className="order-summary">
                <h3>{t.checkout_order_items}</h3>
                <div className="checkout-items">
                  {cart.map((item: CartItem) => (
                    <div className="checkout-item" key={item.productId}>
                      <div className="checkout-item-image">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title.en}
                        />
                      </div>
                      <div className="checkout-item-details">
                        <h4>{item.product.title.en}</h4>
                        <p>
                          {formatCurrency(item.product.price)} x {item.quantity}
                        </p>
                      </div>
                      <div className="checkout-item-total">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="checkout-summary">
                  <div className="summary-row">
                    <span>{t.cart_subtotal}</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="summary-row">
                    <span>{t.checkout_shipping}</span>
                    <span>${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="summary-row total">
                    <span>{t.cart_total}</span>
                    <span>${(total + shippingCost).toFixed(2)}</span>
                  </div>
                </div>

                <h3>{t.checkout_shipping_address}</h3>
                <div className="checkout-address">
                  <p>
                    {billingInfo.firstName} {billingInfo.lastName}
                    <br />
                    {billingInfo.address}
                    <br />
                    {billingInfo.city}, {billingInfo.postalCode}
                    <br />
                    {billingInfo.country}
                    <br />
                    {billingInfo.email}
                    <br />
                    {billingInfo.phone}
                  </p>
                </div>

                <h3>{t.checkout_shipping_method}</h3>
                <div className="checkout-shipping-method">
                  <p>
                    {shippingMethod === "standard"
                      ? t.checkout_standard_shipping
                      : t.checkout_express_shipping}
                    {" - "}${shippingCost.toFixed(2)}
                  </p>
                </div>

                <h3>{t.checkout_payment_method}</h3>
                <div className="checkout-payment-method">
                  <p>
                    {t.checkout_credit_card} - {cardInfo.cardNumber.slice(-4)}
                  </p>
                </div>
              </div>

              <div className="checkout-actions">
                <button className="secondary-button" onClick={goToPreviousStep}>
                  {t.checkout_back}
                </button>
                <button
                  className="primary-button"
                  onClick={submitOrder}
                  disabled={loading}
                >
                  {loading ? t.checkout_processing : t.checkout_place_order}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order summary sidebar */}
        <div className="checkout-sidebar">
          <div className="checkout-summary-box">
            <h3>{t.checkout_order_summary}</h3>

            <div className="summary-items">
              {cart.map((item: CartItem) => (
                <div className="summary-item" key={item.productId}>
                  <span>
                    {item.product.title.en} x {item.quantity}
                  </span>
                  <span>
                    {formatCurrency(item.product.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-totals">
              <div className="summary-row">
                <span>{t.cart_subtotal}</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>{t.checkout_shipping}</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="summary-row total">
                <span>{t.cart_total}</span>
                <span>${(total + shippingCost).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
