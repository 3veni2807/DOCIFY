import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";
import signUpRightIMG from "../../assets/signUpRight.jpg";

const Signup = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const validateInputs = async () => {
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!phoneRegex.test(user.phone)) {
      return "Invalid phone number.";
    }
    if (!emailRegex.test(user.email)) {
      return "Invalid email format.";
    }
    if (user.password.length < 5) {
      return "Password must be at least 5 characters long.";
    }

    try {
      const checkResponse = await fetch(`http://localhost:5000/api/users/signup?email=${user.email}`);
      const checkData = await checkResponse.json();
      if (!checkResponse.ok) {
        throw new Error(checkData.message || "Failed to validate user.");
      }
      if (checkData.exists) {
        return "Email already taken.";
      }
    } catch (error) {
      console.error("Validation error:", error);
      return "Error during validation. Please try again later.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = await validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        setError(data.message || "Signup failed! Try again.");
        return;
      }

      setShowModal(true);
    } catch (error) {
      console.error("Error during signup:", error);
      setError("❌ Something went wrong! Try again later.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <div className="signup-left">
        <form className="signup-form" onSubmit={handleSubmit}>
          {Object.entries(user).map(([key, value]) => (
            <div className="form-group" key={key}>
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                type={key === "password" ? "password" : "text"}
                id={key}
                name={key}
                placeholder={`Enter your ${key}`}
                value={value}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="signup-button">Sign Up</button>
          <p className="login-link" onClick={() => navigate("/login")}>
            Already have an account? <span>Login</span>
          </p>
        </form>
      </div>
      <div className="signup-right">
        <img src={signUpRightIMG} alt="Sign Up Illustration" />
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>✅ Registration Successful!</h2>
            <p>You have signed up successfully. Redirecting to login...</p>
            <button onClick={closeModal}>OK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;