import "./Exploremenu.css";
import { menu_list } from "../../assets/assets"; // Ensure correct import

const Exploremenu = ({ category, setCategory }) => {
  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Indulge in a culinary journey with our carefully curated menu, offering a fusion of flavors made from the freshest ingredients. 
        Every bite is crafted to delight your taste buds and create a memorable dining experience.
      </p>

      {/* Scrollable container */}
      <div className="explore-menu-list-wrapper">
        <div className="explore-menu-list">
          {menu_list.map((item) => (
            <div 
              key={item.menu_name} 
              className={`explore-menu-list-item ${category === item.menu_name ? "active" : ""}`}
              onClick={() => setCategory(item.menu_name)}
            >
              <img 
                src={item.menu_image} 
                alt={item.menu_name} 
                className={category === item.menu_name ? "active" : ""}
              />
              <p>{item.menu_name}</p>
            </div>
          ))}
        </div>
      </div>
      
      <hr />
    </div>
  );
};

export default Exploremenu;
