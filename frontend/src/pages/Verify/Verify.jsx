import { useContext, useEffect, useState } from 'react';
import './Verify.css';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { StoreContext } from '../../context/StoreContext';

const Verify = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!orderId || success === null) {
        console.error("Invalid order details.");
        navigate("/");
        return;
      }

      try {
        const response = await axios.post(`${url}/api/order/verify`, { success, orderId });
        console.log("Verification response:", response.data);

        if (response.data.success) {
          navigate("/myorders");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Error verifying payment:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [navigate, orderId, success, url]);

  return (
    <div className="verify">
      {loading ? <div className="spinner"></div> : <p>Redirecting...</p>}
    </div>
  );
};

export default Verify;
