import React from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Checkout = ({ items, totalAmount, address, user }) => {
  const navigate = useNavigate();

  // Environment variables for API URL and Razorpay Key ID
  const VITE_API_URL = import.meta.env.VITE_API_URL;
  const VITE_RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;

  // Function to load Razorpay and initiate payment
  const loadRazorpay = async () => {
    if (!user) {
      toast.error('Please login to proceed');
      return navigate('/login');
    }

    // Check if Razorpay Key is loaded
    if (!VITE_RAZORPAY_KEY_ID) {
      toast.error('Razorpay Key not loaded. Please check frontend .env configuration.');
      return;
    }

    try {
      // Step 1: Create order on backend
      const { data } = await axios.post(`${VITE_API_URL}/payment/order`, {
        amount: totalAmount,
      });

      const options = {
        key: VITE_RAZORPAY_KEY_ID,
        amount: data.order.amount,
        currency: 'INR',
        name: 'Crave & Dine',
        description: 'Test Transaction',
        order_id: data.order.id,
        handler: async function (response) {
          try {
            // Step 2: Verify payment on backend after successful Razorpay transaction
            const verify = await axios.post(`${VITE_API_URL}/payment/verify`, {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              items,
              totalAmount,
              address,
              userId: user._id,
            });

            if (verify.data.success) {
              toast.success('Payment successful. Order placed!');
              navigate('/orders');
            } else {
              toast.error('Payment verification failed.');
            }
          } catch (verifyError) {
            toast.error('Payment verification failed due to an error.');
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: '9999999999', // Consider making this dynamic from user data
        },
        notes: {
          address: 'Crave & Dine HQ', // Consider making this dynamic from user address
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

      // Ensure Razorpay script is loaded before creating new window.Razorpay
      if (typeof window.Razorpay === 'undefined') {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          const razor = new window.Razorpay(options);
          razor.open();
        };
        script.onerror = (e) => {
          toast.error("Failed to load payment gateway. Please try again.");
        };
        document.body.appendChild(script);
      } else {
        const razor = new window.Razorpay(options);
        razor.open();
      }

    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || 'Error initiating payment with backend.');
      } else {
        toast.error('Error initiating payment.');
      }
    }
  };

  return (
    <div className="text-center my-4">
      <button
        onClick={loadRazorpay}
        className="px-6 py-3 bg-[#F37254] text-white rounded-md shadow-md hover:bg-orange-600 transition-all"
      >
        Pay ₹{totalAmount}
      </button>
    </div>
  );
};

export default Checkout;
