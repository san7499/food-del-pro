import { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopup = ({ setShowLogin }) => {  
    const { url, setToken } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Sign Up");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({ ...prevData, [name]: value }));
    };

    const onLogin = async (event) => {
        event.preventDefault();
        let newUrl = url;

        if (currState === "Login") {
            newUrl += "/api/user/login";
        } else {
            newUrl += "/api/user/register";
        }

        // Ensure the URL starts with http:// or https://
        if (!newUrl.startsWith('http://') && !newUrl.startsWith('https://')) {
            newUrl = 'http://' + newUrl.replace(/^httpl?:\/\//i, '');
        }

        try {
            console.log("Sending request to:", newUrl);
            console.log("Data being sent:", data);

            const response = await axios.post(newUrl, data);

            console.log("Response received:", response);

            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                setShowLogin(false);
            } else {
                alert(response.data.message);
            }
        } catch (error) {
            console.error("Error during login/signup:", error);
            alert("An error occurred. Please try again.");
        }
    };

    return (
        <div className="login-popup">
            <form onSubmit={onLogin} className="login-popup-container">
                {/* Title and Close Button */}
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img 
                        onClick={() => setShowLogin(false)}  
                        src={assets.cross_icon} 
                        alt="Close" 
                    />
                </div>

                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input 
                            name="name" 
                            onChange={onChangeHandler} 
                            value={data.name} 
                            type="text" 
                            placeholder="Your name" 
                            required 
                        />
                    )}
                    <input 
                        name="email" 
                        onChange={onChangeHandler} 
                        value={data.email} 
                        type="email" 
                        placeholder="Your email" 
                        required 
                    />
                    <input 
                        name="password" 
                        onChange={onChangeHandler} 
                        value={data.password} 
                        type="password" 
                        placeholder="Password" 
                        required 
                    />
                </div>

                <button type="submit">
                    {currState === "Sign Up" ? "Create Account" : "Login"}
                </button>

                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the Terms of Use & Privacy Policy.</p>
                </div>

                {currState === "Login" ? (
                    <p>
                        Create a new account? 
                        <span onClick={() => setCurrState("Sign Up")} style={{ cursor: "pointer" }}>
                            Click here
                        </span>
                    </p>
                ) : (
                    <p>
                        Already have an account? 
                        <span onClick={() => setCurrState("Login")} style={{ cursor: "pointer" }}>
                            Login here
                        </span>
                    </p>
                )}
            </form>
        </div>
    );
};

export default LoginPopup;
