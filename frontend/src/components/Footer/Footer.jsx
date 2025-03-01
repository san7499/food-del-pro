import { assets } from '../../assets/assets'
import './Footer.css'
const Footer = () => {
  return (
    <div className='footer' id='footer'>
      <div className="footer-content">
        <div className="footer-content-left">
            <img className='footer-logo' src={assets.logo} alt="" />
            <p>Crafted with passion to serve you the best. Experience delicious flavors and quality service every day. Your satisfaction is our priority. Visit us for more exciting offers and updates. Thank you for being a valued part of our journey!</p>
            <div className="footer-social-icon">
                <img src={assets.facebook_icon} alt="" />
                <img src={assets.twitter_icon} alt="" />
                <img src={assets.linkedin_icon} alt="" />
            </div>
        </div>
        <div className="footer-content-center">
            <h2>Company</h2>
            <li>Home</li>
            <li>About us</li>
            <li>Delivery</li>
            <li>Privacy policy</li>
        </div>
        <div className="footer-content-right">
            <h2>GET IN TOUCH</h2>
            <ul>
                <li>+91-7282762742</li>
                <li>contact@swaadmantra.com</li>
            </ul>
        </div>
        
      </div>
      <hr />
      <p className='footer-copyright'>Copyrights 2025 © SwaadMantra.com All right Reserved</p>
    </div>
  )
}

export default Footer
