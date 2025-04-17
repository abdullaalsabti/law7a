import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { CartItem, Product } from "../types";
import { mockProducts } from "../utils/mockData";

interface CartContextType {
  cartItems: CartItem[];
  cart: CartItem[];
  addToCart: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  total: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [cartCount, setCartCount] = useState<number>(0);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Update localStorage and recalculate total whenever cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    }

    let total = 0;
    let count = 0;

    cartItems.forEach((item) => {
      total += item.product.price * item.quantity;
      count += item.quantity;
    });

    setCartTotal(total);
    setCartCount(count);
  }, [cartItems]);

  const findProductById = (productId: string): Product | undefined => {
    return mockProducts.find((product) => product.id === productId);
  };

  const addToCart = (productId: string, quantity: number) => {
    const product = findProductById(productId);

    if (!product) {
      console.error("Product not found");
      return;
    }

    // Check if item already exists in cart
    const existingItemIndex = cartItems.findIndex(
      (item) => item.productId === productId
    );

    if (existingItemIndex !== -1) {
      // Update quantity of existing item
      const updatedItems = [...cartItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedItems);
    } else {
      // Add new item to cart
      setCartItems([
        ...cartItems,
        {
          productId,
          quantity,
          product,
        },
      ]);
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedItems = cartItems.filter(
      (item) => item.productId !== productId
    );
    setCartItems(updatedItems);

    if (updatedItems.length === 0) {
      // Clear localStorage if cart is empty
      localStorage.removeItem("cart");
    }
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedItems = cartItems.map((item) => {
      if (item.productId === productId) {
        return { ...item, quantity };
      }
      return item;
    });

    setCartItems(updatedItems);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cart: cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        total: cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
