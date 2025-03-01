import './FoodItem.css';
import { assets } from '../../assets/assets';  // ✅ Corrected path
import PropTypes from 'prop-types';
import { StoreContext } from '../../context/StoreContext';
import { useContext } from 'react';

const FoodItem = ({ id, name, price, description, image }) => {
    const {cartItems,addToCart, removeFromCart,url} = useContext(StoreContext)
    
    return (
        <div className='food-item'>
            <div className="food-item-image-container">
                <img className='food-item-image' src={url+"/images/"+image} alt={name} />
                { !cartItems[id]
                    ? <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="Add" />
                    : <div className='food-item-counter'>
                        <img onClick={() => removeFromCart(id)} src={assets.remove_icon_red} alt="Remove" />
                        <p>{cartItems[id]}</p>
                        <img onClick={() => addToCart(id)} src={assets.add_icon_green} alt="Add More" />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="Rating Stars" />
                </div>
                <p className="food-item-desc">{description}</p>
                <p className="food-item-price">${price}</p>
            </div>
        </div>
    );
}

// ✅ Ensuring `id` can be a string (MongoDB ObjectId is a string)
FoodItem.propTypes = {
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
};

export default FoodItem;
