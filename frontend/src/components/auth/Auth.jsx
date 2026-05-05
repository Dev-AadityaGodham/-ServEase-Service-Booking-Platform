import { useState } from "react";
import API from "../../services/api";
import "./Auth.css";

export default function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const res = await API.post("/auth/login", {
          email: form.email,
          password: form.password
        });

        setUser(res.data);
      } else {
        await API.post("/auth/register", form);
        setIsLogin(true);
        setForm({
          name: "",
          email: "",
          password: "",
          phoneNumber: ""
        });
      }
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="landing-section">
        <div className="brand-badge">Local services made simple</div>

        <h1>ServEase</h1>

        <p className="landing-text">
          Find trusted local professionals, book services, track requests,
          manage extra charges, and share reviews — all in one clean platform.
        </p>

        <div className="feature-list">
          <div>✅ Book local services</div>
          <div>✅ Provider request management</div>
          <div>✅ Extra charge approval flow</div>
          <div>✅ Reviews and ratings</div>
        </div>
      </div>

      <div className="auth-card">
        <h2>{isLogin ? "Welcome Back" : "Create Account"}</h2>
        <p className="auth-subtitle">
          {isLogin
            ? "Login to continue to your dashboard"
            : "Register and start booking or offering services"}
        </p>

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              name="name"
              placeholder="Full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />

            <button
              type="button"
              className="show-password-btn"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {!isLogin && (
            <input
              name="phoneNumber"
              placeholder="Phone number"
              value={form.phoneNumber}
              onChange={handleChange}
              required
            />
          )}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <p className="toggle" onClick={() => setIsLogin(!isLogin)}>
          {isLogin
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </p>
      </div>
    </div>
  );
}