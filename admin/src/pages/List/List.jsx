import './List.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const List = ({ url }) => {
  const [list, setList] = useState([]);

  useEffect(() => {
    if (url) fetchList();
  }); // Fetch data when `url` changes

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching data");
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
      toast.error("Failed to load food items");
    }
  };

  const removeFood = async (foodId) => {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id: foodId });
      if (response.data.success) {
        toast.success("Food item removed successfully");
        setList((prevList) => prevList.filter((item) => item._id !== foodId)); // Remove from UI instantly
      } else {
        toast.error("Failed to remove item");
      }
    } catch (error) {
      console.error("Error removing food item:", error);
      toast.error("Error deleting food item");
    }
  };

  return (
    <div className="list add flex-col">
      <p>All Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.length > 0 ? (
          list.map((item) => (
            <div key={item._id} className="list-table-format">
              <img src={`${url}/images/${item.image}`} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>${item.price}</p>
              <button className="delete-btn" onClick={() => removeFood(item._id)}>X</button>
            </div>
          ))
        ) : (
          <p className="no-data">No food items found</p>
        )}
      </div>
    </div>
  );
};

export default List;
