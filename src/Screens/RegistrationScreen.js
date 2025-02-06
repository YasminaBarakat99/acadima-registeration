import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import "../Styles/Registration/RegistartionScreen.css";
import "../Styles/Registration/LoginScreen.css";
// import { UserContext } from "../Context/UserContext";
import { getPreviousRoute } from "../Context/RouteHistory";

import { apiUrl, apiUrl2 } from "../API";

// import anasAcadlogo from "../../public/Images/AcadimaLogo.png";
// import user from "../../public/Images/Registration/User_01.svg";
// import lock2 from "../../public/Images/Registration/Lock.svg";
// import mail from "../../public/Images/Registration/Mail.svg";
// import hide from "../../public/Images/Registration/Hide.svg";
// import show from "../../public/Images/Registration/Show.svg";
// import phone from "../../public/Images/Registration/Mobile.svg";

// import appleLogo from "../Images/Registration/apple.svg";
// import googleLogo from "../Images/Registration/google.svg";
// import facebookLogo from "../Images/Registration/fb.svg";

// Popup Component
const Popup = ({ message, onClose }) => (
  <div className="popup-container">
    <div className="popup">
      <p>{message}</p>
      <button onClick={onClose}>إغلاق</button>
    </div>
  </div>
);

function RegistrationScreen() {
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [countryPrefix, setCountryPrefix] = useState("+1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countryOptions, setCountryOptions] = useState([]);

  const [type] = useState("programs");
  const [webinarId] = useState("programs");
  const [bundleId] = useState("courses");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const bundle_id = queryParams.get('bundle_id');
  const webinar_id = queryParams.get('webinar_id');
  const main_category_id = queryParams.get('main_category_id');
  const sub_category_id = queryParams.get('sub_category_id');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCountryOptions = async () => {
      try {
        const response = await fetch(`${apiUrl2}/country_code`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": "1234",
            "ngrok-skip-browser-warning": true,
          },
        });

        const data = await response.json();
        const formattedOptions = Object.entries(data).map(([name, code]) => ({
          name,
          code,
        }));

        setCountryOptions(formattedOptions);
      } catch (error) {
        console.error("Error fetching country options:", error);
        setError("Unable to fetch country options. Please try again later.");
      }
    };

    fetchCountryOptions();
  }, []);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Validate name (English letters only)
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (!/^[A-Za-z\s]*$/.test(value)) {
      setError("Please enter your name in English only.");
      return;
    }
    setError(null);
    setName(value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const registrationData = {
      full_name,
      email,
      email_confirmation: email,
      password,
      password_confirmation: password,
      mobile: `${countryPrefix}${mobile}`,
      country_code: countryPrefix,
      type,
      webinar_id: webinar_id,
      bundle_id: bundle_id,
      main_category_id: main_category_id,
      sub_category_id: sub_category_id,
    };

    // console.log(registrationData);    
    let response;
    try {
      response = await axios.post(
        `https://platform.acadima.tech/auth/register?main_category_id=${main_category_id}&sub_category_id=${sub_category_id}&webinar_id=${webinar_id}&bundle_id=${bundle_id}`,
        // `http://127.0.0.1:8000/auth/register?main_category_id=${main_category_id}&sub_category_id=${sub_category_id}&webinar_id=${webinar_id}&bundle_id=${bundle_id}`,
        registrationData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // console.log("Response:", response.data);
      
      if (response.data.success === false) {
        if (response.data.data.errors) {
          const errorMessages = [];
          if (response.data.data.errors.email) 
            errorMessages.push(`${response.data.data.errors.email[0]}`);
          if (response.data.data.errors.mobile)
            errorMessages.push(`${response.data.data.errors.mobile[0]}`);
          if (response.data.data.errors.password)
            errorMessages.push(`${response.data.data.errors.password[0]}`);
          setError(errorMessages.join(" و "));
        } else {
          setError("Failed to register. Please try again.");
        }
        return;
      }
    } catch (error) {
      console.error("There was an error!", error.response?.data || error.message);
      setError(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      window.location.href = `https://platform.acadima.tech/new-webinars/${webinar_id}/apply/${response.data.data.user.id}`;
      // window.location.href = `http://127.0.0.1:8000/new-webinars/${webinar_id}/apply/${response.data.data.user.id}`;
      setLoading(false);
    }
  };


  return (
    <div className="mainContainer">
      <div className="reg-formContainer">
        <div className="form-one">
          <a className="login-logo-container" href="https://acadima.tech">
            <img
              src="/Images/AcadimaLogo.png"
              alt="anasAcadlogo"
              className="anasAcadlogo"
            />
          </a>
        </div>

        <div className="form-two">
          <span className="form-title">Registeration</span>
        </div>

        <form className="form-three" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={full_name}
              onChange={handleNameChange}
            />
            <img src="/Images/Registration/User_01.svg" alt="user" className="icon" />

          </div>

          <div className="input-group">
            <img src="/Images/Registration/Mail.svg" alt="mail" className="icon" />
            <input
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="reg-2-input-group">
            <div className="phone-input-group">
              <select
                value={countryPrefix}
                onChange={(e) => setCountryPrefix(e.target.value)}
                className="country-select"
              >
                {countryOptions.map((country, index) => (
                  <option key={`${country.code}-${index}`} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>

              <div className="input-container">
                <img src="/Images/Registration/Mobile.svg" alt="phone" className="icon" />
                <input
                  type="tel"
                  required
                  className="phone-input"
                  placeholder="Mobile Phone"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="input-group">
            <img src="/Images/Registration/Lock.svg" alt="lock2" className="icon" />
            <input
              type={isPasswordVisible ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="icon2" onClick={togglePasswordVisibility}>
              {isPasswordVisible ? (
                <img src="/Images/Registration/Hide.svg" alt="hide" className="icon2" />
              ) : (
                <img src="/Images/Registration/Show.svg" alt="show" className="icon2" />
              )}
            </span>
          </div>

          <div className="reg-buttons-container">
            <button
              type="submit"
              className="login-button"
              disabled={loading}
              style={{ cursor: "pointer" }}
            >
              <span className="login-button-text">
                Register
              </span>
            </button>
          </div>
        </form>

        <div className="social-login">
          {/* <div className="social-login-divider">
            <span className="line"></span>
            <span className="text" style={{ color: "white" }}>
              أو أنشئ الحساب عبر
            </span>
            <span className="line"></span>
          </div>

          <div className="social-icons">
            <a href="">
              <img src={appleLogo} alt="Apple Login" />
            </a>
            <a href="">
              <img src={googleLogo} alt="Google Login" />
            </a>
            <a href="">
              <img src={facebookLogo} alt="Facebook Login" />
            </a>
          </div> */}
          <p
            className="register-link"
            style={{ color: "white", cursor: "pointer" }}
          >
              Already have an account?
            {"   "}
            <a href="#" onClick={() => navigate("/login")}>
              Login
            </a>
          </p>
        </div>
      </div>

      {error && (
        <Popup
          message={error}
          onClose={() => setError(null)} // Close the popup
        />
      )}
    </div>
  );
}

export default RegistrationScreen;
