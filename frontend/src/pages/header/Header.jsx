import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import "./Header.css";
import logo from "../../assets/logo.png"; 

function Header() {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [setUser]);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/login");
    setShowLogoutModal(false);
  };

  return (
    <header className="header">
      <div className="logo-container">
        {!user ? (
          <Link to="/">
            <img src={logo} alt="Docify Logo" />
          </Link>
        ) : (
          <img src={logo} alt="Docify Logo" />
        )}
      </div>

      <div className="nav-container">
        <ul className="nav-links">
          {!user && <li><Link to="/">Home</Link></li>}
          {user ? (
            <>
              <li><Link to="/viewdocs">View Docs</Link></li>
              <li className="wel">Welcome, {user.name}!</li>
              <li>
                <button onClick={() => setShowLogoutModal(true)} className="logout-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/signup">Sign up</Link></li>
              <li><Link to="/login">Login</Link></li>
            </>
          )}
        </ul>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Do you want to logout?</p>
            <div className="modal-buttons">
              <button onClick={() => setShowLogoutModal(false)} className="cancel-button">Cancel</button>
              <button onClick={handleLogout} className="logout-confirm-button">Logout</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;