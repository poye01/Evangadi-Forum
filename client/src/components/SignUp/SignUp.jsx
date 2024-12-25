import { useState } from "react";
import classes from "./signUp.module.css";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../utility/axios.js";
import { ClipLoader } from "react-spinners";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

function Signup({ onSwitch }) {
  const [error, setError] = useState(null); // for error message
  const [success, setSuccess] = useState(null); // for success message
  const [showPassword, setShowPassword] = useState(false); // State for showing/hiding password
  const [loading, setLoading] = useState(false); // Loading state for spinner
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword((prev) => !prev); // Toggle the visibility state
  };

  // Validate user data for names
  function validateUserData(fname, lname, username) {
    const isValidFname = /^[A-Za-z]{2,}$/.test(fname.trim());
    const isValidLname = /^[A-Za-z]{2,}$/.test(lname.trim());
    const isValidUserName = /^[A-Za-z0-9]+$/.test(username.trim());
    const isValidUsernameLength = username.trim().length > 1;

    return (
      isValidFname && isValidLname && isValidUserName && isValidUsernameLength
    );
  }

  function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    /*
      Explanation of regex:
      - ^: Start of string
      - [a-zA-Z0-9._%+-]+: Local part (before @) - letters, numbers, and allowed symbols
      - @[a-zA-Z0-9.-]+: Domain part (after @) - letters, numbers, dots, hyphens
      - \.[a-zA-Z]{2,}$: TLD (Top-Level Domain) - at least 2 letters (e.g., .com, .org)
    */

    return emailRegex.test(email.trim());
  }

  // Validate password strength
  function validatePassword(password) {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;

    /*
      Explanation of regex:
      - (?=.*[a-z]): At least one lowercase letter
      - (?=.*[A-Z]): At least one uppercase letter
      - (?=.*\d): At least one digit
      - (?=.*[!@#$%^&*()_+]): At least one special character
      - {8,}: Minimum 8 characters
    */

    return passwordRegex.test(password);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !validateUserData(
        formData.firstName,
        formData.lastName,
        formData.username
      )
    ) {
      setError(
        "Please enter a valid first, last, and username. Names should contain only letters and include at least two characters."
      );
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate password
    if (!validatePassword(formData.password)) {
      setError(
        "Password must be at least 8 characters, contain an uppercase letter, a lowercase letter, a number, and a special character (!@#$%^&*)."
      );
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axiosInstance.post("/user/register", {
        username: formData.username,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      if (response.status === 201) {
        setSuccess("User registered successfully! Logging in...");

        try {
          const loginResponse = await axiosInstance.post("/user/login", {
            usernameOrEmail: formData.email,
            password: formData.password,
          });

          if (loginResponse.status === 200) {
            localStorage.setItem(
              "EVANGADI_FORUM_2024",
              loginResponse.data.token
            );
            window.location.href = "/";
          } else {
            setError(
              loginResponse?.data?.message || "Login failed. Please try again."
            );
          }
        } catch (error) {
          console.error("Login error:", error);
          setError("An error occurred during login. Please try again.");
        }
      } else {
        setError(
          response?.data?.message ||
            "Error submitting the form. Please try again."
        );
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error submitting the form. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.formcontainer}>
      <h2>Join the network</h2>
      <p className="signin-text">
        Already have an account?{" "}
        <a
          onClick={onSwitch}
          style={{ cursor: "pointer", color: "var(--primary-color)" }}
        >
          Sign in
        </a>
      </p>
      {error && <p className={classes.error}>{error}</p>}
      {success && <p className={classes.success}>{success}</p>}
      <form method="POST" onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <div className={classes.nameinputs}>
          <input
            type="text"
            name="firstName"
            placeholder="First name"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last name"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <input
          type="email"
          name="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <div className={classes.passwordinput}>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            onClick={handleTogglePassword}
            className={classes.togglebtn}
          >
            {showPassword ? <IoMdEye size={15} /> : <IoMdEyeOff size={15} />}
          </button>
          <div style={{ padding: "5px", fontSize: "14px" }}>
            I agree to the <Link to="/privacyPolicy">privacy policy</Link> and{" "}
            <Link to="/terms">terms of service</Link>.
          </div>
        </div>
        <button type="submit" className={classes.submitbtn} disabled={loading}>
          {loading ? <ClipLoader color="#000" size={15} /> : "Agree and Join"}
        </button>
        <p className={classes.signintext}>
          <a
            onClick={onSwitch}
            style={{ cursor: "pointer", color: "var(--primary-color)" }}
          >
            Already have an account?
          </a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
