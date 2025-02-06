import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Registration/LoginScreen.css";
import { getPreviousRoute } from "../Context/RouteHistory";
import { apiUrl } from "../API";

const Popup = ({ message, onClose }) => (
  <div className="popup-container">
    <div className="popup">
      <p>{message}</p>
      <button onClick={onClose}>إغلاق</button>
    </div>
  </div>
);

const ForgotPasswordPopup = ({ onClose, onSend }) => {
  const [email, setEmail] = useState("");

  const handleSend = () => {
    if (email.trim()) {
      onSend(email); // Trigger the forgot password API
    }
  };

  return (
    <div className="popup-container">
      <div className="popup">
        <h3>نسيت كلمة المرور؟</h3>
        <input
          type="email"
          placeholder="أدخل بريدك الإلكتروني"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="popup-buttons">
          <button className="cancel-button" onClick={onClose}>
            إلغاء
          </button>
          <button className="send-button" onClick={handleSend}>
            إرسال
          </button>
        </div>
      </div>
    </div>
  );
};

function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false); // New state for popup
  const navigate = useNavigate();
  const previousRoute = getPreviousRoute();

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const loginData = { email, password };

    try {
      const response = await axios.post(
        "https://platform.acadima.tech/auth/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Response:", response);


      if (response.data.success === false) {
        setError("Wrong Email or Password");
        return;
      }

    } catch (err) {
      setError("حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/forget-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "1234",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      if (!response.ok || data.success === false) {
        setError(data.message || "Failed to send password reset email.");
      } else {
        setShowForgotPasswordPopup(false); // Close popup on success
        setError("تم إرسال بريد إلكتروني لاستعادة كلمة المرور");
      }
    } catch (err) {
      setError("An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

    
  return (
    <div className="mainContainer">
      <div className="formContainer">
        <div className="form-one">
          <a className="login-logo-container" href="https://acadima.tech">
            <img  src="/Images/AcadimaLogo.png" alt="anasAcadlogo" className="anasAcadlogo" />
          </a>
        </div>
        <div className="form-two">
          <span className="form-title">Login</span>
        </div>

        <form className="form-three" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              value={email}
              type="email"
              placeholder="Email"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <img src="/Images/Registration/Mail.svg" alt="mail" className="icon" />
          </div>

          <div className="input-group">
            <img src="/Images/Registration/Lock.svg" alt="lock" className="icon" />
            
            <span className="icon2" onClick={togglePasswordVisibility}>
              {isPasswordVisible ? (
                <img src="/Images/Registration/Hide.svg" alt="hide" className="icon2" />
              ) : (
                <img src="/Images/Registration/Show.svg" alt="show" className="icon2" />
              )}
            </span>
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <a className="forgot-password" onClick={() => setShowForgotPasswordPopup(true)} style={{cursor: "pointer" }}>
            Forgot Password?
          </a>

          <div className="buttons-container">
            <button className="login-button" type="submit" disabled={loading} style={{cursor: "pointer" }}>
              <span className="login-button-text">Login</span>
            </button>
          </div>
        </form>

        {/* Social Login */}
        <div className="social-login">
          <p className="register-link">
            <span style={{ color: "white"}}>Don't have an account?</span>{" "}
            <a onClick={() => navigate("/react/register")} style={{cursor: "pointer" }}>
              Register 
            </a>
          </p>
        </div>
      </div>

      {error && <Popup message={error} onClose={() => setError(null)} />}

      {showForgotPasswordPopup && (
        <ForgotPasswordPopup
          onClose={() => setShowForgotPasswordPopup(false)}
          onSend={handleForgotPassword}
        />
      )}
    </div>
  );
}

export default LoginScreen;