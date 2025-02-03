import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/Registration/LoginScreen.css";
// import { UserContext } from "../Context/UserContext";
import { getPreviousRoute } from "../Context/RouteHistory";
import { apiUrl } from "../API";

import anasAcadlogo from "../Images/AcadimaLogo.png";
import lock from "../Images/Registration/Lock.svg";
import mail from "../Images/Registration/Mail.svg";
import hide from "../Images/Registration/Hide.svg";
import show from "../Images/Registration/Show.svg";

// import appleLogo from "../Images/Registration/apple.svg";
// import googleLogo from "../Images/Registration/google.svg";
// import facebookLogo from "../Images/Registration/fb.svg";

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
  // const { refreshUserData } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false); // New state for popup
  const navigate = useNavigate();

  // Get the previous route from location state
  const previousRoute = getPreviousRoute();
  

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const loginData = { email, password };

    try {
      const response = await fetch(apiUrl + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": "1234",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();
      if (!response.ok || data.success === false) {
        setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
        return;
      }

      const token = data.data.token;
      localStorage.setItem("token", token);

      // Refresh user data
      // await refreshUserData();

      // Navigate based on role or previous route
      if (previousRoute) {        
        navigate(previousRoute);
      } else if (data?.data?.user?.role === "user") {
        navigate("/");
      } else if (data?.data?.user?.user_code) {
        navigate("/finances/program");
      } else {
        navigate("/admission");
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

  // const handleGoogleLogin = async () => {
  //   try {
  //     // Call your backend's endpoint to initiate the Google OAuth process
  //     const response = await fetch(`${apiUrl}/google`, {
  //       method: "GET",
  //       headers: {
  //         "x-api-key": "1234", // Custom header if required
  //         "Content-Type": "application/json",
  //       },
  //     });
  
  //     if (response.ok) {
  //       const data = await response.json();
  //       if (data.redirect_url) {
  //         // Open the Google OAuth URL in a new tab
  //         window.open(data.redirect_url, "_blank");
  //       } else {
  //         setError("Failed to get the Google login redirect URL.");
  //       }
  //     } else {
  //       console.error("Error initiating Google login:", response.statusText);
  //       setError("An error occurred while initiating Google login.");
  //     }
  //   } catch (error) {
  //     console.error("Error during Google login:", error);
  //     setError("An unknown error occurred.");
  //   }
  // };
  

  // const handleGoogleCallback = async (authCode) => {
  //   try {
  //     const response = await fetch(`${apiUrl}/google/callback`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         code: authCode, // Pass the authorization code to the backend
  //       }),
  //     });
  
  //     const data = await response.json();
  
  //     if (response.ok && data.success) {
  //       const token = data?.data?.token;
  //       localStorage.setItem("token", token); // Save token in local storage
  //       // refreshUserData(); // Refresh user data
  //       navigate("/"); // Redirect to the homepage or a specific route
  //     } else {
  //       setError(data.message || "Failed to authenticate using Google.");
  //     }
  //   } catch (error) {
  //     console.error("Error in Google callback:", error);
  //     setError("An unknown error occurred.");
  //   }
  // };
  
  // // Extract the Google auth code from the URL when the component mounts
  // useEffect(() => {
  //   const queryParams = new URLSearchParams(window.location.search);
  //   const authCode = queryParams.get("code");
  
  //   if (authCode) {
  //     handleGoogleCallback(authCode); // Send the code to the backend
  //   }
  // }, []);
  
  
  
  return (
    <div className="mainContainer">
      <div className="formContainer">
        <div className="form-one">
          <a className="login-logo-container" href="https://anasacademy.uk">
            <img src={anasAcadlogo} alt="anasAcadlogo" className="anasAcadlogo" />
          </a>
        </div>
        <div className="form-two">
          <span className="form-title">تسجيل دخول</span>
        </div>

        <form className="form-three" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              value={email}
              type="email"
              placeholder="البريد الإلكتروني"
              required
              onChange={(e) => setEmail(e.target.value)}
            />
            <img src={mail} alt="mail" className="icon" />
          </div>

          <div className="input-group">
            <img src={lock} alt="lock" className="icon" />
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="كلمة المرور"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="icon2" onClick={togglePasswordVisibility}>
              {isPasswordVisible ? (
                <img src={hide} alt="hide" className="icon2" />
              ) : (
                <img src={show} alt="show" className="icon2" />
              )}
            </span>
          </div>

          <a className="forgot-password" onClick={() => setShowForgotPasswordPopup(true)} style={{cursor: "pointer" }}>
            نسيت كلمة المرور؟
          </a>

          <div className="buttons-container">
            <button className="login-button" type="submit" disabled={loading} style={{cursor: "pointer" }}>
              <span className="login-button-text">تسجيل دخول</span>
            </button>
          </div>
        </form>

        {/* Social Login */}
        <div className="social-login">
          {/* <div className="social-login-divider">
            <span className="line"></span>
            <span className="text" style={{ color: "white" }}>
              سجل الدخول عبر
            </span>
            <span className="line"></span>
          </div>
          <div className="social-icons">
            <a href="">
              <img src={appleLogo} alt="Apple Login" />
            </a>
            <a onClick={handleGoogleLogin}>
              <img src={googleLogo} alt="Google Login" />
            </a>
            <a href="">
              <img src={facebookLogo} alt="Facebook Login" />
            </a>
          </div> */}
          <p className="register-link">
            <span style={{ color: "white"}}>ليس لديك حساب؟ </span>{" "}
            <a onClick={() => navigate("/register")} style={{cursor: "pointer" }}>
              إنشاء حساب
            </a>
          </p>
        </div>
      </div>

      {/* Support Links */}
      {/* <div className="post-form">
        <a href="https://anasacademy.uk/certificate/certificate-check.php" className="post-form-text">
          التحقق من الشهادات
        </a>
        <a href="https://support.anasacademy.uk/" className="post-form-text">
          فريق الدعم والتواصل
        </a>
      </div> */}

      {/* Error Popup */}
      {error && <Popup message={error} onClose={() => setError(null)} />}

      {/* Forgot Password Popup */}
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