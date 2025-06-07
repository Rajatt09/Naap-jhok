import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css";

const SignupForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { signup } = useAuth();
  const [signupError, setSignupError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState("user"); // 'user' or 'tailor'
  const navigate = useNavigate();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setSignupError("");

      // Add role and default location
      const userData = {
        ...data,
        role: userType,
        location: { lat: 12.9716, lng: 77.5946 },
      };

      const { user } = await signup(userData);

      // Navigate only on successful signup
      if (user.role === "tailor") {
        navigate("/tailor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setSignupError(error.message || "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Create Your Account</h2>

        {signupError && <div className="form-error">{signupError}</div>}

        <div className="form-group user-type-selector">
          <button
            type="button"
            className={`user-type-btn ${userType === "user" ? "active" : ""}`}
            onClick={() => setUserType("user")}
          >
            I'm a Customer
          </button>
          <button
            type="button"
            className={`user-type-btn ${userType === "tailor" ? "active" : ""}`}
            onClick={() => setUserType("tailor")}
          >
            I'm a Tailor
          </button>
        </div>

        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Full Name
          </label>
          <input
            id="name"
            type="text"
            className="form-control"
            placeholder="Enter your full name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
            })}
          />
          {errors.name && <p className="input-error">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="form-control"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="input-error">{errors.email.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="phone" className="form-label">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            className="form-control"
            placeholder="Enter your phone number"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^[0-9]{10}$/,
                message: "Please enter a valid 10-digit phone number",
              },
            })}
          />
          {errors.phone && (
            <p className="input-error">{errors.phone.message}</p>
          )}
        </div>

        {userType === "user" ? (
          <div className="form-group">
            <label htmlFor="address" className="form-label">
              Home Address
            </label>
            <input
              id="address"
              type="text"
              className="form-control"
              placeholder="Enter your address"
              {...register("address", {
                required: "Address is required",
              })}
            />
            {errors.address && (
              <p className="input-error">{errors.address.message}</p>
            )}
          </div>
        ) : (
          <div className="form-group">
            <label htmlFor="shopAddress" className="form-label">
              Shop Address
            </label>
            <input
              id="shopAddress"
              type="text"
              className="form-control"
              placeholder="Enter your shop address"
              {...register("shopAddress", {
                required: "Shop address is required",
              })}
            />
            {errors.shopAddress && (
              <p className="input-error">{errors.shopAddress.message}</p>
            )}
          </div>
        )}

        {userType === "tailor" && (
          <div className="form-group">
            <label htmlFor="servicesOffered" className="form-label">
              Services Offered (comma separated)
            </label>
            <input
              id="servicesOffered"
              type="text"
              className="form-control"
              placeholder="e.g., Shirts, Pants, Suits, Alterations"
              {...register("servicesOfferedRaw", {
                required: "Services offered is required",
                setValueAs: (value) => value.split(",").map((s) => s.trim()),
              })}
            />
            {errors.servicesOfferedRaw && (
              <p className="input-error">{errors.servicesOfferedRaw.message}</p>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="Create a password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />
          {errors.password && (
            <p className="input-error">{errors.password.message}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="form-control"
            placeholder="Confirm your password"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p className="input-error">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="form-group form-checkbox">
          <input
            id="agree"
            type="checkbox"
            {...register("agree", { required: "You must agree to the terms" })}
          />
          <label htmlFor="agree">
            I agree to the <Link to="/terms">Terms of Service</Link> and{" "}
            <Link to="/privacy">Privacy Policy</Link>
          </label>
          {errors.agree && (
            <p className="input-error">{errors.agree.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>

        <div className="auth-links">
          <p>
            Already have an account? <Link to="/login">Log In</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;
