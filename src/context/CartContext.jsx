import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

// Create Cart Context
const CartContext = createContext();

// Custom hook to access Cart Context
export const useCart = () => {
  return useContext(CartContext);
};

// Cart context provider component
export const CartProvider = ({ children }) => {
  // Initialize cart items from localStorage or as an empty array
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localCart = localStorage.getItem('restaurantCart');
      const parsedCart = localCart ? JSON.parse(localCart) : [];
      return parsedCart.map(item => ({
        ...item,
        dishName: item.dishName || item.name // Ensure dishName is present
      }));
    } catch (error) {
      return []; // Return empty array on parse error
    }
  });

  // Effect to save cart items to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('restaurantCart', JSON.stringify(cartItems));
    } catch (error) {
      // Handle potential localStorage errors (e.g., quota exceeded)
    }
  }, [cartItems]);

  // Adds an item to the cart or updates its quantity if it already exists
  const addToCart = (item, quantityToAdd = 1) => {
    setCartItems(prevItems => {
      if (!item.name || !item.price) {
        toast.error("Cannot add item to cart: missing name or price.");
        return prevItems; 
      }

      const existingItemIndex = prevItems.findIndex(cartItem => cartItem.id === item.id);

      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = prevItems.map((cartItem, index) =>
          index === existingItemIndex
            ? { ...cartItem, quantity: cartItem.quantity + quantityToAdd }
            : cartItem
        );
        toast.success(`${quantityToAdd} x ${item.name} added to cart!`); 
        return updatedItems;
      } else {
        // Add new item to cart
        toast.success(`${quantityToAdd} x ${item.name} added to cart!`); 
        return [...prevItems, {
          id: item.id,
          name: item.name, 
          dishName: item.name, 
          price: item.price,
          quantity: quantityToAdd
        }];
      }
    });
  };

  // Removes an item from the cart
  const removeFromCart = (id) => {
    setCartItems(prevItems => {
      const updatedItems = prevItems.filter(item => item.id !== id);
      toast.error("Item removed from cart.");
      return updatedItems;
    });
  };

  // Updates the quantity of an item in the cart
  const updateQuantity = (id, newQuantity) => {
    setCartItems(prevItems => {
      if (newQuantity <= 0) {
        return prevItems.filter(item => item.id !== id); // Remove if quantity is zero or less
      }
      return prevItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      );
    });
  };

  // Calculates total number of items in cart
  const totalItemsInCart = cartItems.length;

  // Calculates the subtotal of all items in the cart
  const cartSubtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  // Define delivery fee
  const deliveryFee = cartItems.length > 0 ? 50.00 : 0; 
  const taxRate = 0.05; // 5% tax rate

  // Calculates tax based on subtotal
  const calculatedTax = cartSubtotal * taxRate;

  // Calculates the total cart amount including subtotal, delivery, and tax
  const cartTotal = cartSubtotal + deliveryFee + calculatedTax;

  // Context value provided to consumers
  const contextValue = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    totalItemsInCart,
    cartSubtotal,
    deliveryFee,
    calculatedTax,
    cartTotal,
    clearCart: () => {
      setCartItems([]);
      toast.success("Cart cleared!");
    },
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
