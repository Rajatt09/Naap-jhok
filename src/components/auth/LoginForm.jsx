import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./AuthForms.css";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setLoginError("");

      const { user } = await login(data);

      // Navigate here, since login was successful
      if (user.role === "tailor") {
        navigate("/tailor-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setLoginError(error.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <h2>Log In to Your Account</h2>

        {loginError && <div className="form-error">{loginError}</div>}

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
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="form-control"
            placeholder="Enter your password"
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

        <div className="form-group form-checkbox">
          <input id="remember" type="checkbox" {...register("remember")} />
          <label htmlFor="remember">Remember me</label>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot password?</Link>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </div>
      </form>

      <div className="auth-tips">
        <h3>Demo Accounts</h3>
        <p>
          User: <code>user@example.com</code> / <code>password123</code>
        </p>
        <p>
          Tailor: <code>tailor@example.com</code> / <code>password123</code>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
