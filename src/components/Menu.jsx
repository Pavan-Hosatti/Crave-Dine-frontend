import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import './Menu.css';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import '../pages/Dashboard.css';

// --- START OF HUGE INDIAN MENU DATA ---
// Prices adjusted to be more practical for an Indian restaurant in Rupees.
const menuData = [
  {
    category: 'Soups & Salads',
    id: 'soups-salads', // Consistent and unique category ID
    dishes: [ // Corrected from 'disheName'
      { id: 'tomato-soup-001', name: 'Cream of Tomato Soup', description: 'Classic creamy tomato soup with a hint of Indian spices.', price: 60.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Tomato+Soup' },
      { id: 'lentil-soup-002', name: 'Dal Soup', description: 'Light and nutritious yellow lentil soup, mildly spiced.', price: 50.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Dal+Soup' },
      { id: 'cucumber-salad-003', name: 'Cucumber Salad', description: 'Finely chopped cucumber, tomato, onion, and cilantro with lemon dressing.', price: 90.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Kachumber+Salad' },
      { id: 'tandoori-chicken-salad-004', name: 'Tandoori Chicken Salad', description: 'Shredded tandoori chicken, fresh greens, and a special house dressing.', price: 220.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Chicken+Salad' },
    ],
  },
  {
    category: 'Appetizers (Vegetarian)',
    id: 'veg-appetizers',
    dishes: [ // Corrected from 'disheName'
      { id: 'samosa-005', name: 'Vegetable Samosa (2 pcs)', description: 'Crispy triangular pastry filled with spiced potatoes, peas, and cashews.', price: 60.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Samosa' },
      { id: 'paneer-tikka-006', name: 'Paneer Tikka', description: 'Marinated cubes of Indian cheese, bell peppers, and onions grilled in a tandoor.', price: 380.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Paneer+Tik' },
      { id: 'aloo-chaat-007', name: 'Aloo Chaat', description: 'Crispy fried potato pieces mixed with chickpeas, chutneys, and spices.', price: 220.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Aloo+Cha' },
      { id: 'onion-bhaji-008', name: 'Onion Bhaji (Pakora)', description: 'Deep-fried crispy onion fritters made with gram flour and spices.', price: 180.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Onion+Bh' },
      { id: 'veg-pakora-009', name: 'Mixed Vegetable Pakora', description: 'Assorted seasonal vegetables dipped in spiced gram flour batter and fried.', price: 280.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Veg+Pak' },
      { id: 'gobhi-manchurian-010', name: 'Gobi Manchurian (Dry)', description: 'Crispy cauliflower florets tossed in a spicy, tangy Indo-Chinese sauce.', price: 390.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Gobi+Man' },
      { id: 'hara-bhara-kebab-011', name: 'Hara Bhara Kebab (4 pcs)', description: 'Patties made from spinach, green peas, and potatoes, lightly spiced.', price: 320.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Hara+K' },
    ],
  },
  {
    category: 'Appetizers (Non-Vegetarian)',
    id: 'non-veg-appetizers',
    dishes: [ // Corrected from 'disheName'
      { id: 'chicken-tikka-012', name: 'Chicken Tikka', description: 'Boneless chicken marinated in yogurt and aromatic spices, cooked in a tandoor.', price: 450.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Chicken+Tik' },
      { id: 'seekh-kebab-013', name: 'Lamb Seekh Kebab', description: 'Minced lamb mixed with herbs and spices, skewered and grilled.', price: 520.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Seekh+Keb' },
      { id: 'fish-pakora-014', name: 'Fish Pakora', description: 'Crispy fried fish fillets marinated in Amritsari spices.', price: 490.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Fish+Pak' },
      { id: 'chicken-65-015', name: 'Chicken 65 (Dry)', description: 'Spicy, deep-fried chicken pieces, a popular South Indian bar snack.', price: 420.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Chicken+65' },
      { id: 'tandoori-prawns-016', name: 'Tandoori Prawns', description: 'Jumbo prawns marinated in yogurt and spices, grilled in a tandoor.', price: 750.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Tandoori+Prawns' },
    ],
  },
  {
    category: 'Main Courses (Chicken)',
    id: 'chicken-main-courses',
    dishes: [ // Corrected from 'disheName'
      { id: 'butter-chicken-017', name: 'Butter Chicken (Murgh Makhani)', description: 'Classic tender chicken pieces in a rich, creamy tomato and butter gravy.', price: 650.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Butter+Chicken' },
      { id: 'chicken-tikka-masala-018', name: 'Chicken Tikka Masala', description: 'Grilled chicken tikka pieces simmered in a spiced tomato-onion gravy.', price: 620.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Chicken+Masala' },
      { id: 'chicken-korma-019', name: 'Chicken Korma', description: 'Chicken cooked in a mild, rich, and aromatic cashew-nut and cream sauce.', price: 590.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Chicken+Korma' },
      { id: 'chicken-vindaloo-020', name: 'Chicken Vindaloo (Spicy)', description: 'Goan-style spicy chicken curry with potatoes and a tangy vinegar base.', price: 680.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Chicken+Vindaloo' },
      { id: 'kadai-chicken-021', name: 'Kadai Chicken', description: 'Chicken pieces cooked with bell peppers, onions, and traditional kadai spices.', price: 640.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Kadai+Chicken' },
      { id: 'chicken-saag-022', name: 'Chicken Saag (Palak Chicken)', description: 'Chicken cooked with fresh spinach puree and aromatic spices.', price: 610.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Chicken+Saag' },
    ],
  },
  {
    category: 'Main Courses (Lamb & Goat)',
    id: 'lamb-goat-main-courses',
    dishes: [ // Corrected from 'disheName'
      { id: 'lamb-rogan-josh-023', name: 'Lamb Rogan Josh', description: 'Tender lamb pieces cooked in a rich, aromatic Kashmiri-style gravy.', price: 780.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Lamb+Rogan' },
      { id: 'lamb-vindaloo-024', name: 'Lamb Vindaloo (Spicy)', description: 'Spicy Goan curry with tender lamb and potatoes in a tangy sauce.', price: 810.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Lamb+Vind' },
      { id: 'goat-curry-025', name: 'Goat Curry', description: 'Traditional homestyle goat curry with bone-in pieces, slow-cooked to perfection.', price: 850.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Goat+Curry' },
      { id: 'keema-matar-026', name: 'Keema Matar', description: 'Minced lamb cooked with green peas in a rich, spicy gravy.', price: 720.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Keema+Matar' },
    ],
  },
  {
    category: 'Main Courses (Seafood)',
    id: 'seafood-main-courses',
    dishes: [ // Corrected from 'disheName'
      { id: 'prawn-masala-027', name: 'Prawn Masala', description: 'Shrimp cooked in a tangy and spicy onion-tomato gravy with Indian spices.', price: 890.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Prawn+Masala' },
      { id: 'goan-fish-curry-028', name: 'Goan Fish Curry', description: 'Tangy and spicy fish curry made with coconut milk and unique Goan spices.', price: 790.00, image: 'https://placehold.co/150x100/FF6347/FFFFFF?text=Goan+Fish' },
    ],
  },
  {
    category: 'Main Courses (Vegetarian)',
    id: 'veg-main-courses',
    dishes: [ // Corrected from 'disheName'
      { id: 'paneer-butter-masala-029', name: 'Paneer Butter Masala', description: 'Cubes of fresh Indian cheese in a rich, creamy, and mildly spiced tomato gravy.', price: 580.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Paneer+Masala' },
      { id: 'dal-makhani-030', name: 'Dal Makhani', description: 'Slow-cooked black lentils simmered with butter, cream, and aromatic spices.', price: 520.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Dal+Makhani' },
      { id: 'chana-masala-031', name: 'Chana Masala', description: 'Chickpeas cooked in a flavorful blend of onions, tomatoes, and robust spices.', price: 490.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Chana+Masala' },
      { id: 'palak-paneer-032', name: 'Palak Paneer', description: 'Fresh spinach puree cooked with cubes of Indian cheese and a touch of cream.', price: 550.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Palak+Paneer' },
      { id: 'malai-kofta-033', name: 'Malai Kofta', description: 'Soft vegetable and paneer dumplings in a rich, creamy cashew-nut gravy.', price: 620.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Malai+Kofta' },
      { id: 'aloo-gobhi-034', name: 'Aloo Gobhi Adraki', description: 'Potatoes and cauliflower florets sautéed with ginger, turmeric, and cumin.', price: 450.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Aloo+Gobhi' },
      { id: 'baingan-bharta-035', name: 'Baingan Bharta', description: 'Smoked and mashed eggplant cooked with onions, tomatoes, and spices.', price: 480.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Baingan+Bha' },
      { id: 'mix-veg-036', name: 'Mixed Vegetable Curry', description: 'Assortment of fresh seasonal vegetables cooked in a spicy Indian gravy.', price: 530.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Mixed+Veg' },
      { id: 'dal-tadka-037', name: 'Dal Tadka (Yellow Dal)', description: 'Yellow lentils tempered with ghee, cumin seeds, garlic, and red chilies.', price: 420.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Dal+Tadka' },
      { id: 'mushroom-masala-038', name: 'Mushroom Masala', description: 'Fresh mushrooms cooked in a rich, flavorful onion-tomato gravy.', price: 560.00, image: 'https://placehold.co/150x100/4CAF50/FFFFFF?text=Mushroom+Masala' },
    ],
  },
  {
    category: 'Tandoori Breads',
    id: 'tandoori-breads',
    dishes: [ // Corrected from 'disheName'
      { id: 'naan-039', name: 'Plain Naan', description: 'Soft, leavened flatbread baked in a tandoor.', price: 60.00, image: 'https://placehold.co/150x100/8B4513/FFFFFF?text=Plain+Naan' },
      { id: 'garlic-naan-040', name: 'Garlic Naan', description: 'Naan bread brushed with fresh garlic and cilantro.', price: 80.00, image: 'https://placehold.co/150x100/8B4513/FFFFFF?text=Garlic+Naan' },
      { id: 'butter-naan-041', name: 'Butter Naan', description: 'Soft naan bread generously buttered.', price: 70.00, image: 'https://placehold.co/150x100/8B4513/FFFFFF?text=Butter+Naan' },
      { id: 'cheese-naan-042', name: 'Cheese Naan', description: 'Naan bread stuffed with mozzarella cheese.', price: 120.00, image: 'https://placehold.co/150x100/8B4513/FFFFFF?text=Cheese+Naan' },
      { id: 'roti-043', name: 'Tandoori Roti', description: 'Whole wheat unleavened bread baked in a tandoor.', price: 50.00, image: 'https://placehold.co/150x100/8B4513/FFFFFF?text=Tandoori+Roti' },
      { id: 'laccha-paratha-044', name: 'Laccha Paratha', description: 'Multi-layered whole wheat bread, crispy and flaky.', price: 100.00, image: 'https://placehold.co/150x100/8B4513/FFFFFF?text=Laccha+Paratha' },
      { id: 'aloo-paratha-045', name: 'Aloo Paratha', description: 'Whole wheat bread stuffed with spiced mashed potatoes.', price: 140.00, image: 'https://placehold.co/150x100/8B4513/FFFFFF?text=Aloo+Paratha' },
      { id: 'kashmiri-naan-046', name: 'Kashmiri Naan', description: 'Sweet naan stuffed with nuts, raisins, and cherries.', price: 180.00, image: 'https://placehold.co/150x100/8B4513/FFFFFF?text=Kashmiri+Naan' },
    ],
  },
  {
    category: 'Rice & Biryani',
    id: 'rice-biryani',
    dishes: [ // Corrected from 'disheName'
      { id: 'basmati-rice-047', name: 'Plain Basmati Rice', description: 'Aromatic long-grain basmati rice, perfectly steamed.', price: 100.00, image: 'https://placehold.co/150x100/F0E68C/555555?text=Basmati+Rice' },
      { id: 'jeera-rice-048', name: 'Jeera Rice', description: 'Basmati rice tempered with roasted cumin seeds.', price: 130.00, image: 'https://placehold.co/150x100/F0E68C/555555?text=Jeera+Rice' },
      { id: 'veg-biryani-049', name: 'Vegetable Biryani', description: 'Basmati rice cooked with assorted fresh vegetables and aromatic spices.', price: 550.00, image: 'https://placehold.co/150x100/F0E68C/555555?text=Veg+Biryani' },
      { id: 'chicken-biryani-050', name: 'Chicken Biryani', description: 'Fragrant basmati rice cooked with marinated chicken pieces and traditional spices.', price: 650.00, image: 'https://placehold.co/150x100/F0E68C/555555?text=Chicken+Biryani' },
      { id: 'lamb-biryani-051', name: 'Lamb Biryani', description: 'Slow-cooked lamb with basmati rice and a blend of rich spices.', price: 750.00, image: 'https://placehold.co/150x100/F0E68C/555555?text=Lamb+Biryani' },
      { id: 'prawn-biryani-052', name: 'Prawn Biryani', description: 'Delicate prawns cooked with spiced basmati rice.', price: 820.00, image: 'https://placehold.co/150x100/F0E68C/555555?text=Prawn+Biryani' },
      { id: 'peas-pulao-053', name: 'Peas Pulao', description: 'Basmati rice cooked with green peas and mild spices.', price: 200.00, image: 'https://placehold.co/150x100/F0E68C/555555?text=Peas+Pulao' },
    ],
  },
  {
    category: 'Desserts',
    id: 'desserts',
    dishes: [ // Corrected from 'dishName'
      { id: 'gulab-jamun-054', name: 'Gulab Jamun (2 pcs)', description: 'Deep-fried milk solids dumplings, soaked in warm rose-flavored sugar syrup.', price: 150.00, image: 'https://placehold.co/150x100/FFD700/8B4513?text=Gulab+Jamun' },
      { id: 'rasgulla-055', name: 'Rasgulla (2 pcs)', description: 'Soft, spongy cottage cheese dumplings, soaked in light sugar syrup.', price: 150.00, image: 'https://placehold.co/150x100/FFD700/8B4513?text=Rasgulla' },
      { id: 'kheer-056', name: 'Rice Kheer', description: 'Traditional Indian rice pudding, slow-cooked with milk, sugar, and nuts.', price: 180.00, image: 'https://placehold.co/150x100/FFD700/8B4513?text=Kheer' },
      { id: 'gajar-ka-halwa-057', name: 'Gajar ka Halwa', description: 'Sweet carrot pudding cooked with ghee, milk, sugar, and dry fruits.', price: 220.00, image: 'https://placehold.co/150x100/FFD700/8B4513?text=Gajar+Halwa' },
      { id: 'kulfi-058', name: 'Pistachio Kulfi', description: 'Traditional Indian frozen dessert, rich and creamy, flavored with pistachios.', price: 120.00, image: 'https://placehold.co/150x100/FFD700/8B4513?text=Kulfi' },
    ],
  },
  {
    category: 'Beverages',
    id: 'beverages',
    dishes: [ // Corrected from 'dishName'
      { id: 'mango-lassi-059', name: 'Mango Lassi', description: 'Refreshing yogurt drink blended with sweet mango pulp.', price: 120.00, image: 'https://placehold.co/150x100/ADD8E6/000000?text=Mango+Lassi' },
      { id: 'sweet-lassi-060', name: 'Sweet Lassi', description: 'Traditional sweetened yogurt drink, chilled and refreshing.', price: 100.00, image: 'https://placehold.co/150x100/ADD8E6/000000?text=Sweet+Lassi' },
      { id: 'salted-lassi-061', name: 'Salted Lassi', description: 'Savory yogurt drink with a hint of salt and roasted cumin powder.', price: 100.00, image: 'https://placehold.co/150x100/ADD8E6/000000?text=Salted+Lassi' },
      { id: 'masala-chai-062', name: 'Masala Chai', description: 'Traditional Indian tea brewed with aromatic spices and milk.', price: 80.00, image: 'https://placehold.co/150x100/ADD8E6/000000?text=Masala+Chai' },
      { id: 'soda-063', name: 'Soft Drinks (Coke, Sprite, Pepsi)', description: 'Assorted canned soft drinks.', price: 60.00, image: 'https://placehold.co/150x100/ADD8E6/000000?text=Soda' },
      { id: 'bottled-water-064', name: 'Bottled Water', description: 'Still bottled water.', price: 30.00, image: 'https://placehold.co/150x100/ADD8E6/000000?text=Water' },
    ],
  },
  {
    category: 'Accompaniments',
    id: 'accompaniments',
    dishes: [ // Corrected from 'dishName'
      { id: 'raita-065', name: 'Cucumber Raita', description: 'Cool yogurt dip with grated cucumber and mild spices.', price: 100.00, image: 'https://placehold.co/150x100/90EE90/000000?text=Raita' },
      { id: 'papadum-066', name: 'Papadum (2 pcs)', description: 'Crispy lentil wafers, often served with chutneys.', price: 50.00, image: 'https://placehold.co/150x100/90EE90/000000?text=Papadum' },
      { id: 'pickle-067', name: 'Mixed Pickle', description: 'Spicy and tangy mixed vegetable pickle.', price: 40.00, image: 'https://placehold.co/150x100/90EE90/000000?text=Pickle' },
      { id: 'chutney-platter-068', name: 'Chutney Platter', description: 'Assortment of mint, tamarind, and onion chutneys.', price: 120.00, image: 'https://placehold.co/150x100/90EE90/000000?text=Chutney' },
    ],
  },
];
// --- END OF HUGE INDIAN MENU DATA ---

const Menu = () => {
  const [quantities, setQuantities] = useState({});
  const location = useLocation();
  const dishRefs = useRef({}); // To store references to each dish for scrolling
  const categoryRefs = useRef({}); // NEW: To store references to each category section
  const [activeCategory, setActiveCategory] = useState(menuData[0]?.id); // NEW: State for active category

  const { addToCart } = useCart();

  const useQuery = () => {
    return new URLSearchParams(location.search);
  };
  const query = useQuery();
  const highlightDishId = query.get('highlight');

  // Effect to scroll to and highlight a dish if a highlight ID is present in the URL
  useEffect(() => {
    if (highlightDishId && dishRefs.current[highlightDishId]) {
      setTimeout(() => {
        dishRefs.current[highlightDishId].scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        dishRefs.current[highlightDishId].classList.add('highlight-dish');
        setTimeout(() => {
          dishRefs.current[highlightDishId].classList.remove('highlight-dish');
        }, 3000);
      }, 100);
    }
  }, [highlightDishId]);

  // NEW: Intersection Observer for active category highlighting
  useEffect(() => {
    const observerOptions = {
      root: null, // Use the viewport as the container
      rootMargin: '0px 0px -50% 0px', // Trigger when section is 50% in view
      threshold: 0, // As soon as any part of the target is visible
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Set active category to the ID of the intersecting category
          setActiveCategory(entry.target.id);
        }
      });
    }, observerOptions);

    // Observe each category section
    menuData.forEach(category => {
      const ref = categoryRefs.current[category.id];
      if (ref) {
        observer.observe(ref);
      }
    });

    // Clean up observer on component unmount
    return () => {
      menuData.forEach(category => {
        const ref = categoryRefs.current[category.id];
        if (ref) {
          observer.unobserve(ref);
        }
      });
    };
  }, []); // Run once on mount

  // NEW: Handle click on category link in sidebar
  const handleCategoryClick = (categoryId) => {
    const categoryElement = categoryRefs.current[categoryId];
    if (categoryElement) {
      // Assuming a fixed navbar height of 70px. Adjust if your navbar height is different.
      const navbarHeight = 70;
      const elementPosition = categoryElement.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - navbarHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveCategory(categoryId); // Update active category immediately on click
    }
  };

  const handleQuantityChange = (dishId, amount) => {
    setQuantities(prevQuantities => {
      const currentQuantity = prevQuantities[dishId] || 0;
      const newQuantity = Math.max(0, currentQuantity + amount);
      return { ...prevQuantities, [dishId]: newQuantity };
    });
  };

  const handleAddToCart = (dish) => {
    const quantity = quantities[dish.id] || 0;
    if (quantity > 0) {
      // DEBUG: Log the dish object being passed to addToCart
  

  
      // CartContext will handle the mapping of 'name' to 'dishName'.
      addToCart(dish, quantity);
      setQuantities(prevQuantities => ({ ...prevQuantities, [dish.id]: 0 }));
    } else {
      toast.error('Please select a quantity greater than 0 to add to cart.');
    }
  };

  return (
    <>
      <section className="menu-section" id="menu">
        <div className="container">
          <div className="menu-header">
            <h1>Our Extensive Indian Menu</h1>
            <p>Explore a culinary journey through the rich and diverse flavors of India, crafted with passion and tradition. From savory curries to aromatic biryanis and delightful desserts, there's a dish for every palate.</p>
          </div>

          {/* Top Category Navigation (for larger screens) */}
          <div className="menu-categories">
            {menuData.map(category => (
              <a
                href={`#${category.id}`}
                key={category.id}
                className="category-link"
                onClick={(e) => {
                  e.preventDefault(); // Prevent default jump
                  handleCategoryClick(category.id);
                }}
              >
                {category.category}
              </a>
            ))}
          </div>

          <div className="menu-items-and-sidebar"> {/* NEW: Wrapper for main content and sidebar */}
            {/* Scrollable Category Sidebar (for mobile)/
            */}
            {/* <div className="menu-categories-sidebar">
              {menuData.map(category => (
                <a
                  href={`#${category.id}`}
                  key={category.id}
                  className={`category-link ${activeCategory === category.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault(); // Prevent default jump
                    handleCategoryClick(category.id);
                  }}
                >
                  {category.category}
                </a>
              ))}
            </div> */}

            <div className="menu-items-content"> {/* NEW: Wrapper for the actual menu items */}
              {menuData.map(category => (
                <div
                  className="menu-category"
                  id={category.id}
                  key={category.id}
                  ref={el => (categoryRefs.current[category.id] = el)} // Set ref for Intersection Observer
                >
                  <h2>{category.category}</h2>
                  <div className="dishes-grid">
                    {category.dishes.map(dish => ( // Corrected from 'category.disheName'
                      <div
                        className={`menu-card ${highlightDishId === dish.id ? 'highlight' : ''}`}
                        key={dish.id}
                        ref={el => (dishRefs.current[dish.id] = el)}
                      >
                        <div className="menu-card-image">
                          {dish.image && <img src={dish.image} alt={dish.name} onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x100/E0E0E0/888888?text=No+Image'; }} />}
                        </div>
                        <div className="menu-card-content">
                          <h3>{dish.name}</h3>
                          <p className="dish-description">{dish.description}</p>
                          <p className="dish-price">₹{dish.price.toFixed(2)}</p>
                          <div className="quantity-control">
                            <button onClick={() => handleQuantityChange(dish.id, -1)} disabled={(quantities[dish.id] || 0) <= 0}>-</button>
                            <span>{quantities[dish.id] || 0}</span>
                            <button onClick={() => handleQuantityChange(dish.id, 1)}>+</button>
                          </div>
                          <button className="add-to-cart-btn" onClick={() => handleAddToCart(dish)}>
                            Add to Cart
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div> {/* End of menu-items-content */}
          </div> {/* End of menu-items-and-sidebar */}
        </div>
      </section>

    </>
  );
};

export default Menu;
