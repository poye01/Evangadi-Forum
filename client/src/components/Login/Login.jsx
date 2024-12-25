import { useContext, useState } from "react";
import { axiosInstance } from "../../utility/axios.js";
import classes from "./login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { UserState } from "../../App.jsx";
import { ClipLoader } from "react-spinners";
import { IoMdEye } from "react-icons/io";
import { IoMdEyeOff } from "react-icons/io";

function Login({ onSwitch, useLocData }) {
  const userContextData = useContext(UserState);
  const setUser = userContextData?.setUser;

  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
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
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await axiosInstance.post("/user/Login", {
        usernameOrEmail: formData.usernameOrEmail,
        password: formData.password,
      });
      const token = response.data.token;
      localStorage.setItem("EVANGADI_FORUM_2024", token); // Store the token in local storage
      if (token) {
        const userData = await axiosInstance
          .get("/user/check", { headers: { Authorization: "Bearer " + token } })
          .then((response) => response.data);
        setUser(userData); // Store the user data in state so that it can be accessed by others too
        // console.log(userData);
        navigate(useLocData?.state?.redirect || "/");
      }

      if (response.status === 200) {
        setSuccess("Login successful! Redirecting...");
        setError(null);
      } else {
        setError(response.data.message || "Login failed.");
        setSuccess(null);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Error logging in. Please try again."
      );
      setSuccess(null);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className={classes.formcontainer}>
      <div className={classes.innerContainer}>
        <div className={classes.heading}>
          <h2 className={classes.title}>Login to your account</h2>
          <p className={classes.signuptext}>
            Don't have an account?{" "}
            <a
              onClick={onSwitch}
              style={{ cursor: "pointer", color: "var(--primary-color)" }}
            >
              create a new account
            </a>
          </p>
          {error && (
            <p className={classes.error} style={{ marginBottom: "10px" }}>
              {error}
            </p>
          )}{" "}
          {/* Display error message */}
          {success && <p className={classes.success}>{success}</p>}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="usernameOrEmail"
            placeholder="User name or Email"
            value={formData.usernameOrEmail}
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
            <button type="button" onClick={handleTogglePassword} style={{}}>
              {showPassword ? <IoMdEye size={15} /> : <IoMdEyeOff size={15} />}
            </button>
          </div>
          <p className={classes.forgotpasswordtext}>
            <Link to="/forgetPassword">Forgot password?</Link>
          </p>
          <button
            type="submit"
            className={classes.submitbtn}
            disabled={loading} // Disable button during loading
          >
            {loading ? (
              <ClipLoader color="#000" size={15} /> // Loading spinner
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
