import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ShoppingBag,
  ArrowRight,
  Check,
} from "lucide-react";

import { useRegisterMutation } from "../redux/services/authApi";
import { setCredentials } from "../redux/features/authSlice";
import { useAppDispatch } from "../redux/Dispatch/useAppDispatch";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
];

export default function RegisterPage({
  isModal = false,
  onClose,
  onSwitchToLogin,
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});

  const [addData, { isLoading }] = useRegisterMutation();

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required";
    if (!form.mobile) {
      errs.mobile = "Mobile number is required";
    } else if (!/^\d{10}$/.test(form.mobile)) {
      errs.mobile = "Enter a valid 10-digit mobile number";
    }
    if (!form.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      errs.email = "Enter a valid email";
    if (!form.password) errs.password = "Password is required";
    else if (form.password.length < 8) errs.password = "At least 8 characters";
    if (!form.confirm) errs.confirm = "Please confirm your password";
    else if (form.confirm !== form.password)
      errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});

    try {
      const result = await addData({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        password: form.password,
      }).unwrap();

      dispatch(setCredentials({ user: result.user, token: result.token }));
      if (isModal) onClose();
      else navigate("/");
    } catch (err) {
      const errMsg = err?.data?.message || err?.message || "Registration failed. Please try again.";
      setErrors({ apiError: errMsg });
    }
  };

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setErrors((p) => ({ ...p, [e.target.name]: "" }));
  };

  const cardContent = (
    <div className="auth-card auth-card-wide">
      {/* Brand */}
      <div className="auth-brand">
        <div className="auth-brand-icon">
          <ShoppingBag size={26} />
        </div>
        <span className="auth-brand-name">B2 Sami Foods</span>
      </div>

      <h1 className="auth-title">Create your account</h1>
      <p className="auth-subtitle">Join thousands of happy customers today</p>

      <form
        onSubmit={handleSubmit}
        className="auth-form auth-form-grid"
        noValidate
      >
        {/* API Error Display */}
        {errors.apiError && (
          <div className="sm:col-span-2 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm font-medium text-center">
            {errors.apiError}
          </div>
        )}

        {/* Full Name */}
        <div className="auth-field sm:col-span-2">
          <label htmlFor="reg-name" className="auth-label">
            Full name
          </label>
          <div
            className={`auth-input-wrap ${errors.name ? "auth-input-error" : ""}`}
          >
            <User size={17} className="auth-input-icon" />
            <input
              id="reg-name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
          {errors.name && <span className="auth-error-msg">{errors.name}</span>}
        </div>

        {/* Email */}
        <div className="auth-field">
          <label htmlFor="reg-email" className="auth-label">
            Email address
          </label>
          <div
            className={`auth-input-wrap ${errors.email ? "auth-input-error" : ""}`}
          >
            <Mail size={17} className="auth-input-icon" />
            <input
              id="reg-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
          {errors.email && (
            <span className="auth-error-msg">{errors.email}</span>
          )}
        </div>

        {/* Mobile */}
        <div className="auth-field">
          <label htmlFor="reg-mobile" className="auth-label">
            Mobile number
          </label>
          <div
            className={`auth-input-wrap ${errors.mobile ? "auth-input-error" : ""}`}
          >
            <Phone size={17} className="auth-input-icon" />
            <input
              id="reg-mobile"
              name="mobile"
              type="tel"
              autoComplete="tel"
              placeholder="9876543210"
              value={form.mobile}
              onChange={handleChange}
              className="auth-input"
            />
          </div>
          {errors.mobile && (
            <span className="auth-error-msg">{errors.mobile}</span>
          )}
        </div>

        {/* Password */}
        <div className="auth-field">
          <label htmlFor="reg-password" className="auth-label">
            Password
          </label>
          <div
            className={`auth-input-wrap ${errors.password ? "auth-input-error" : ""}`}
          >
            <Lock size={17} className="auth-input-icon" />
            <input
              id="reg-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
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
          {errors.password && (
            <span className="auth-error-msg">{errors.password}</span>
          )}

          {/* Password strength hints */}
          {form.password && (
            <ul className="auth-pwd-rules">
              {PASSWORD_RULES.map((r) => (
                <li
                  key={r.label}
                  className={`auth-pwd-rule ${r.test(form.password) ? "auth-pwd-rule-ok" : ""}`}
                >
                  <span className="auth-pwd-dot">
                    {r.test(form.password) ? (
                      <Check size={11} />
                    ) : (
                      <span className="auth-pwd-circle" />
                    )}
                  </span>
                  {r.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Confirm Password */}
        <div className="auth-field">
          <label htmlFor="reg-confirm" className="auth-label">
            Confirm password
          </label>
          <div
            className={`auth-input-wrap ${errors.confirm ? "auth-input-error" : ""}`}
          >
            <Lock size={17} className="auth-input-icon" />
            <input
              id="reg-confirm"
              name="confirm"
              type={showConfirm ? "text" : "password"}
              autoComplete="new-password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={handleChange}
              className="auth-input"
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowConfirm((v) => !v)}
              aria-label="Toggle confirm password visibility"
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {errors.confirm && (
            <span className="auth-error-msg">{errors.confirm}</span>
          )}
        </div>

        <button
          type="submit"
          className="auth-submit-btn sm:col-span-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="auth-spinner" />
          ) : (
            <>
              Create account <ArrowRight size={17} className="auth-btn-icon" />
            </>
          )}
        </button>
      </form>

      <p className="auth-switch">
        Already have an account?{" "}
        {isModal ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="auth-switch-link bg-transparent border-none p-0 cursor-pointer font-bold hover:underline"
          >
            Login
          </button>
        ) : (
          <Link to="/login" className="auth-switch-link">
            Login
          </Link>
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
