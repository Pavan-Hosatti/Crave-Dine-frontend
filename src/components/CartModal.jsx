// src/components/CartModal.jsx
import React from 'react';
import { IoClose } from 'react-icons/io5';
import { FaTrashAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import './CartModal.css';
import toast from 'react-hot-toast';
import axios from 'axios';

const CartModal = ({ isOpen, onClose, items, totalAmount, address, user }) => {
  const { cartItems, updateQuantity, removeFromCart, cartSubtotal, deliveryFee, calculatedTax, cartTotal, clearCart } = useCart();

  // Environment variables for Razorpay Key ID and Backend API URL
  const VITE_RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
  const VITE_API_URL = import.meta.env.VITE_API_URL;

  if (!isOpen) return null;

  // Handles payment initiation and order creation
  const handlePaymentAndOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (!user) {
      toast.error("Please log in to proceed with payment.");
      return;
    }

    if (!VITE_RAZORPAY_KEY_ID) {
      toast.error('Razorpay Key not loaded. Check frontend .env configuration.');
      return;
    }
    if (!VITE_API_URL) {
      toast.error('Backend API URL not configured. Cannot proceed with payment.');
      return;
    }

    try {
      // Step 1: Create order on backend
      const orderResponse = await axios.post(`${VITE_API_URL}/payment/order`, {
        amount: cartTotal,
      }, {
        withCredentials: true
      });

      const orderData = orderResponse.data;
      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create order on backend.");
      }

      const options = {
        key: VITE_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'Crave & Dine',
        description: 'Food Order Payment',
        order_id: orderData.order.id,
        handler: async function (response) {
          try {
            // Step 2: Verify payment on backend after successful Razorpay transaction
            const verifyResponse = await axios.post(`${VITE_API_URL}/payment/verify`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              items: cartItems,
              totalAmount: cartTotal,
              address: user.address,
              userId: user._id,
            }, {
              withCredentials: true
            });

            const verifyData = verifyResponse.data;
            if (verifyData.success) {
              toast.success('Payment Successful! Order placed.');
              clearCart(); // Clear cart on successful order
              onClose(); // Close modal
            } else {
              toast.error(verifyData.message || 'Payment verification failed.');
            }
          } catch (verifyError) {
            toast.error('Payment verification failed due to an error.');
          }
        },
        prefill: {
          name: user.username || 'Guest',
          email: user.email || 'guest@example.com',
          contact: user.contact || '9999999999',
        },
        notes: {
          address: JSON.stringify(user.address),
        },
        theme: {
          color: '#F37254',
        },
        modal: {
          ondismiss: () => {
            toast.error('Payment Cancelled');
          },
        },
      };

      // Load Razorpay script if not already loaded
      if (typeof window.Razorpay === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          const rzp = new window.Razorpay(options);
          rzp.open();
        };
        script.onerror = (e) => {
          toast.error("Failed to load payment gateway. Please try again.");
        };
        document.body.appendChild(script);
      } else {
        const rzp = new window.Razorpay(options);
        rzp.open();
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Error communicating with backend for payment.');
      } else {
        toast.error('Something went wrong during payment initiation.');
      }
    }
  };

  return (
    // Cart modal UI structure
    <div className="cart-modal-overlay">
      <div className="cart-modal">
        <div className="cart-modal-header">
          <h2>Your Order Summary</h2>
          <button className="close-btn" onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="cart-modal-body">
          {cartItems.length === 0 ? (
            <p className="empty-cart-message">Your cart is empty. Start adding some delicious food!</p>
          ) : (
            <div className="cart-items-list">
              {cartItems.map(item => (
                <div className="cart-item" key={item.id}>
                  <div className="item-details">
                    <div className="item-info">
                      <h3>{item.name}</h3>
                      <p className="item-price">₹{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="item-controls">
                    <div className="quantity-control-modal">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
                    </div>
                    <button className="remove-item-btn" onClick={() => removeFromCart(item.id)}>
                      <FaTrashAlt />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-modal-footer">
            <div className="cart-summary-line">
              <span>Subtotal:</span>
              <span>₹{cartSubtotal.toFixed(2)}</span>
            </div>
            <div className="cart-summary-line">
              <span>Delivery Fee:</span>
              <span>₹{deliveryFee.toFixed(2)}</span>
            </div>
            <div className="cart-summary-line">
              <span>Tax ({(calculatedTax / cartSubtotal * 100 || 0).toFixed(0)}%):</span>
              <span>₹{calculatedTax.toFixed(2)}</span>
            </div>
            <div className="cart-total">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <button className="place-order-btn" onClick={handlePaymentAndOrder}>
              Proceed to Pay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;
