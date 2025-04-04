import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./Login.css";
import logo from "../../assets/logo.png";
import rightIMG from "../../assets/loginRight.png";

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [userInput, setUserInput] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      console.log("✅ User already logged in, redirecting...");
      setUser(storedUser);
      navigate("/viewdocs");
    }
  }, [navigate, setUser]);

  const handleChange = (e) => {
    setUserInput({ ...userInput, [e.target.name]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("https://docify-backend-i5o4.onrender.com/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInput),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response. Please try again.");
      }

      if (!response.ok) {
        setError(data.message || "❌ Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      if (!data.token) {
        throw new Error("❌ No token received from server.");
      }

      const loggedInUser = {
        id: data.id,
        email: data.email,
        name: data.name,
      };

      setUser(loggedInUser);
      localStorage.setItem("user", JSON.stringify(loggedInUser));
      localStorage.setItem("token", data.token);

      console.log("✅ Token received:", data.token);

      setShowModal(true);
      setTimeout(() => {
        navigate("/viewdocs");
      }, 2000);
    } catch (error) {
      console.error("Error during login:", error);
      setError("❌ Login failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal">
            <p>✅ Login Successful!</p>
          </div>
        </div>
      )}
      <div className="left-section">
        <div className="logo">
          <img src={logo} alt="Docify Logo" />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email"><i className="fas fa-envelope"></i></label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              required
              value={userInput.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label htmlFor="password"><i className="fas fa-lock"></i></label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              required
              value={userInput.password}
              onChange={handleChange}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <div className="sign-up-link">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
      <div className="right-section">
        <img src={rightIMG} alt="Login Illustration" />
      </div>
    </div>
  );
};

export default Login;