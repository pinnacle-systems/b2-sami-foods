import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ShoppingBag, ArrowRight } from "lucide-react";
import { useLoginMutation } from "../redux/services/authApi";
import { setCredentials } from "../redux/features/authSlice";
import { useAppDispatch } from "../redux/Dispatch/useAppDispatch";

export default function LoginPage({ isModal = false, onClose, onSwitchToRegister }) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading }] = useLoginMutation();

  const [showPassword, setShowPassword] = useState(false);
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

    try {
      const result = await loginUser({ email: form.email, password: form.password }).unwrap();
      dispatch(setCredentials({ user: result.user, token: result.token }));
      if (isModal) onClose();
      else navigate("/");
    } catch (err) {
      const msg = err?.data?.message || "Invalid email or password";
      setErrors({ apiError: msg });
    }
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const cardContent = (
    <div className="auth-card">
      <div className="auth-brand">
        <div className="auth-brand-icon"><ShoppingBag size={26} /></div>
        <span className="auth-brand-name">B2 Sami Foods</span>
      </div>

      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your account to continue shopping</p>

      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        {errors.apiError && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium text-center">
            {errors.apiError}
          </div>
        )}

        <div className="auth-field">
          <label htmlFor="login-email" className="auth-label">Email address</label>
          <div className={`auth-input-wrap ${errors.email ? "auth-input-error" : ""}`}>
            <Mail size={17} className="auth-input-icon" />
            <input
              id="login-email" name="email" type="email" autoComplete="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange}
              className="auth-input"
            />
          </div>
          {errors.email && <span className="auth-error-msg">{errors.email}</span>}
        </div>

        <div className="auth-field">
          <div className="auth-label-row">
            <label htmlFor="login-password" className="auth-label">Password</label>
            <Link to="#" className="auth-forgot">Forgot password?</Link>
          </div>
          <div className={`auth-input-wrap ${errors.password ? "auth-input-error" : ""}`}>
            <Lock size={17} className="auth-input-icon" />
            <input
              id="login-password" name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password" placeholder="••••••••"
              value={form.password} onChange={handleChange} className="auth-input"
            />
            <button type="button" className="auth-eye-btn"
              onClick={() => setShowPassword((v) => !v)} aria-label="Toggle password visibility">
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.password && <span className="auth-error-msg">{errors.password}</span>}
        </div>

        <button type="submit" className="auth-submit-btn" disabled={isLoading}>
          {isLoading ? <span className="auth-spinner" /> : <> Sign in <ArrowRight size={17} className="auth-btn-icon" /></>}
        </button>
      </form>

      <p className="auth-switch">
        Don't have an account?{" "}
        {isModal ? (
          <button type="button" onClick={onSwitchToRegister}
            className="auth-switch-link bg-transparent border-none p-0 cursor-pointer font-bold hover:underline">
            Create one
          </button>
        ) : (
          <Link to="/register" className="auth-switch-link">Create one</Link>
        )}
      </p>
    </div>
  );

  if (isModal) return cardContent;

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center px-4 py-20">
      <div className="auth-blob auth-blob-1" />
      <div className="auth-blob auth-blob-2" />
      {cardContent}
    </div>
  );
}
