import React from 'react';
import { FaShoppingCart } from 'react-icons/fa'; // Cart icon
import { useCart } from '../context/CartContext'; // Cart context hook
import './CartIcon.css'; // Styling import

const CartIcon = ({ onCartClick }) => {
  const { totalItemsInCart } = useCart();

  // Handles click to open the cart modal
  const handleCartClick = () => {
    if (onCartClick) {
      onCartClick();
    }
  };

  return (
    // Cart icon UI
    <>
      <div className="cart-icon-container" onClick={handleCartClick}>
        <FaShoppingCart className="cart-icon" />
        {totalItemsInCart > 0 && (
          <span className="cart-badge">{totalItemsInCart}</span>
        )}
      </div>
    </>
  );
};

export default CartIcon;
