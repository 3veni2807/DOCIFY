import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import "./Home.css"; 
import HomeIMG from "../../assets/homeimg.webp";

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // ✅ Check if user is already logged in
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      setIsLoggedIn(true);
    }
  }, []);

  // ✅ Redirect based on login status
  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/viewdocs"); // Logged-in users go to ViewDocs
    } else {
      navigate("/signup"); // New users go to Signup
    }
  };

  return (
    <div className="home-page">
      <div className="left-section">
        <div className="text-container">
          <h1 className="welcome-text">Welcome to DOCIFY</h1>
          <p className="app-description">
            Create, edit, and manage your documents seamlessly, with ease.
          </p>
          <p className="app-feature">
            "Simplifying document management for everyone—anytime, anywhere."
          </p>
          <p className="app-space">
            Build your own space where ideas come to life and transform them into stunning documents that stand out.
          </p>
          <button
            className="get-started-btn"
            type="button"
            onClick={handleGetStarted}
          >
            Get Started
          </button>
        </div>
      </div>
      <div className="right-section">
        <img
          src={HomeIMG}
          alt="Business Team Meeting"
          className="home-image"
        />
      </div>
    </div>
  );
};

export default Home;