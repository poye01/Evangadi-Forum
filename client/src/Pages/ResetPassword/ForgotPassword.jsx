import { useState, useEffect } from "react";
import { axiosInstance } from "../../utility/axios.js";
import classes from "./ForgotPassword.module.css";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/Loader/Loader";

function ForgotPassword() {
  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify OTP and Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null); // For password validation
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // Countdown in seconds (3 minutes)
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    validatePassword(value);
  };

  const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      setPasswordError("Password must be at least 8 characters long.");
    } else if (!hasUpperCase) {
      setPasswordError("Password must include at least one uppercase letter.");
    } else if (!hasLowerCase) {
      setPasswordError("Password must include at least one lowercase letter.");
    } else if (!hasNumber) {
      setPasswordError("Password must include at least one number.");
    } else if (!hasSpecialChar) {
      setPasswordError("Password must include at least one special character.");
    } else {
      setPasswordError(null); // No errors
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axiosInstance.post("/password/request-reset", {
        email,
      });
      if (response.status === 200) {
        setLoading(false);
        setMessage("OTP has been sent to your email.");
        setError(null);
        setStep(2);
        setTimeLeft(120); // Reset countdown
      } else {
        setError(response.data.msg || "Failed to send OTP.");
        setMessage(null);
      }
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || "Error sending OTP. Please try again."
      );
      setMessage(null);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/password/request-reset", {
        email,
      });
      if (response.status === 200) {
        setLoading(false);
        setMessage("A new OTP has been sent to your email.");
        setError(null);
        setTimeLeft(120); // Reset countdown
      } else {
        setLoading(false);
        setError(response.data.msg || "Failed to resend OTP.");
        setMessage(null);
      }
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message || "Error resending OTP. Please try again."
      );
      setMessage(null);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (passwordError) return; // Prevent submission if password is invalid
    setLoading(true);
    try {
      const response = await axiosInstance.post("/password/reset", {
        email,
        otp,
        newPassword,
      });
      if (response.status === 200) {
        setLoading(false);
        setMessage("Password has been reset successfully.");
        setError(null);
        navigate("/"); // Reset the form after success
      } else {
        setLoading(false);
        setError(response.data.message || "Failed to reset password.");
        setMessage(null);
      }
    } catch (err) {
      setLoading(false);
      setError(
        err.response?.data?.message ||
          "Error resetting password. Please try again."
      );
      setMessage(null);
    }
  };

  useEffect(() => {
    if (step === 2 && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      <div className={classes.formcontainer}>
        <div className={classes.innerContainer}>
          {loading && <Loader />}
          {!loading && step === 1 && (
            <>
              <h2>Reset your password</h2>
              <p>Enter your email to receive an OTP for password reset.</p>
              {message && <p className={classes.success}>{message}</p>}
              {error && <p className={classes.error}>{error}</p>}
              <form onSubmit={handleRequestOtp}>
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <button type="submit" className={classes.submitbtn}>
                  Send OTP
                </button>
              </form>
            </>
          )}

          {!loading && step === 2 && (
            <>
              <h2>Enter OTP and Reset Password</h2>
              <p>
                Please enter the OTP sent to your email and set a new password.
                {timeLeft > 0 && (
                  <span className={classes.timer}>
                    {" "}
                    Time left: {formatTime(timeLeft)}
                  </span>
                )}
              </p>
              {message && <p className={classes.success}>{message}</p>}
              {error && <p className={classes.error}>{error}</p>}
              {!(timeLeft <= 0) && (
                <form onSubmit={handleResetPassword}>
                  <input
                    type="text"
                    name="otp"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    required
                  />
                  <input
                    type="password"
                    name="newPassword"
                    placeholder="New password"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  {passwordError && (
                    <p className={classes.error}>{passwordError}</p>
                  )}
                  <button
                    type="submit"
                    className={classes.submitbtn}
                    disabled={!!passwordError || timeLeft <= 0}
                  >
                    Reset Password
                  </button>
                </form>
              )}
              {timeLeft <= 0 && (
                <>
                  <p className={classes.error}>
                    OTP has expired. Please request a new one.
                  </p>
                  <button
                    onClick={handleResendOtp}
                    className={classes.resendbtn}
                  >
                    Resend OTP
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;
