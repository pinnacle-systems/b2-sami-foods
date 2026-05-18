import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ShoppingBag, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 6) errs.password = "At least 6 characters";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    // TODO: connect to API /auth/login
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1200);
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4 py-20">
      {/* Decorative blobs */}
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />

      <div className="auth-card">
        {/* Brand */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <ShoppingBag size={26} />
          </div>
          <span className="auth-brand-name">B2 Sami Foods</span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">Sign in to your account to continue shopping</p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Email */}
          <div className="auth-field">
            <label htmlFor="login-email" className="auth-label">Email address</label>
            <div className={`auth-input-wrap ${errors.email ? "auth-input-error" : ""}`}>
              <Mail size={17} className="auth-input-icon" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                className="auth-input"
              />
            </div>
            {errors.email && <span className="auth-error-msg">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="auth-field">
            <div className="auth-label-row">
              <label htmlFor="login-password" className="auth-label">Password</label>
              <Link to="#" className="auth-forgot">Forgot password?</Link>
            </div>
            <div className={`auth-input-wrap ${errors.password ? "auth-input-error" : ""}`}>
              <Lock size={17} className="auth-input-icon" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="auth-input"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword((v) => !v)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && <span className="auth-error-msg">{errors.password}</span>}
          </div>

          {/* Remember me */}
          <div className="auth-remember">
            <label className="auth-checkbox-label">
              <input type="checkbox" className="auth-checkbox" />
              <span>Remember me for 30 days</span>
            </label>
          </div>

          {/* Submit */}
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? (
              <span className="auth-spinner" />
            ) : (
              <>Sign in <ArrowRight size={17} className="auth-btn-icon" /></>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="auth-divider"><span>or continue with</span></div>

        {/* Social */}
        <div className="auth-social">
          <button className="auth-social-btn" type="button" aria-label="Sign in with Google">
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/><path fill="none" d="M0 0h48v48H0z"/></svg>
            Google
          </button>
          <button className="auth-social-btn" type="button" aria-label="Sign in with Facebook">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.413c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>
            Facebook
          </button>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register" className="auth-switch-link">Create one</Link>
        </p>
      </div>
    </div>
  );
}
